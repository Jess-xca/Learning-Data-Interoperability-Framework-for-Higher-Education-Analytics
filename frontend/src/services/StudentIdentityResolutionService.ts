/**
 * Student Identity Resolution Service
 * Fuzzy matching and cross-system student identification
 * Resolves duplicate records and unified student profiles
 */

import type { StudentIdentityMatch } from '../types/etl';

export interface StudentIdentity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  studentId?: string;
  systemIds: Map<string, string>; // system → id mapping
}

export interface IdentityMatchResult {
  primaryId: string;
  matches: StudentIdentityMatch[];
  confidenceScore: number;
  recommendedAction: 'merge' | 'flag' | 'ignore';
}

class StudentIdentityResolutionServiceClass {
  private identities: Map<string, StudentIdentity> = new Map();
  private matchCache: Map<string, IdentityMatchResult> = new Map();

  /**
   * Register or update student identity
   */
  registerIdentity(
    systemId: string,
    studentData: any,
  ): StudentIdentity {
    const email = studentData.email || '';
    const firstName = studentData.firstName || '';
    const lastName = studentData.lastName || '';

    // Generate unified ID based on email (primary key)
    const unifiedId = this.generateUnifiedId(email, firstName, lastName);

    let identity = this.identities.get(unifiedId);

    if (!identity) {
      identity = {
        id: unifiedId,
        email,
        firstName,
        lastName,
        dateOfBirth: studentData.dateOfBirth,
        studentId: studentData.studentId,
        systemIds: new Map(),
      };
      this.identities.set(unifiedId, identity);
    }

    // Track system-specific ID
    if (studentData.id) {
      identity.systemIds.set(systemId, studentData.id);
    }

    return identity;
  }

  /**
   * Find matching students across systems
   */
  findMatches(student: any, threshold: number = 0.7): IdentityMatchResult {
    const studentId = student.id || 'unknown';
    const cacheKey = `${student.email}-${studentId}`;

    // Check cache
    if (this.matchCache.has(cacheKey)) {
      return this.matchCache.get(cacheKey)!;
    }

    const matches: StudentIdentityMatch[] = [];
    let bestScore = 0;

    // Search against all registered identities
    this.identities.forEach((identity) => {
      const score = this.calculateMatchScore(student, identity);

      if (score >= threshold) {
        const matchType = this.determineMatchType(score);

        const match: StudentIdentityMatch = {
          matchScore: Math.round(score * 100),
          matchType,
          matchedRecords: Array.from(identity.systemIds.entries()).map(
            ([sysId, id]) => ({
              sourceId: sysId,
              targetId: id,
              confidence: Math.round(score * 100),
            }),
          ),
        };

        if (identity.id !== studentId) {
          match.suggestedMergeCandidate = identity.id;
        }

        matches.push(match);

        if (score > bestScore) {
          bestScore = score;
        }
      }
    });

    const recommendedAction = this.getRecommendedAction(bestScore, matches.length);

    const result: IdentityMatchResult = {
      primaryId: studentId,
      matches,
      confidenceScore: Math.round(bestScore * 100),
      recommendedAction,
    };

    this.matchCache.set(cacheKey, result);
    return result;
  }

  /**
   * Calculate match score between two students (0-1)
   */
  private calculateMatchScore(student1: any, student2: any): number {
    let score = 0;

    // Email matching (highest weight - 0.4)
    if (
      student1.email &&
      student2.email &&
      student1.email.toLowerCase() === student2.email.toLowerCase()
    ) {
      score += 0.4;
    } else if (student1.email && student2.email) {
      // Email similarity (Levenshtein distance)
      const similarity = this.stringSimilarity(
        student1.email.toLowerCase(),
        student2.email.toLowerCase(),
      );
      score += similarity * 0.2;
    }

    // Name matching (0.3)
    const nameScore = this.nameMatchScore(
      student1.firstName,
      student1.lastName,
      student2.firstName,
      student2.lastName,
    );
    score += nameScore * 0.3;

    // DOB matching (0.2)
    if (
      student1.dateOfBirth &&
      student2.dateOfBirth &&
      student1.dateOfBirth === student2.dateOfBirth
    ) {
      score += 0.2;
    }

    // Student ID matching (0.1)
    if (
      student1.studentId &&
      student2.studentId &&
      student1.studentId === student2.studentId
    ) {
      score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Levenshtein distance-based string similarity (0-1)
   */
  private stringSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[len2][len1];
  }

  /**
   * Calculate name match score
   */
  private nameMatchScore(
    firstName1: string = '',
    lastName1: string = '',
    firstName2: string = '',
    lastName2: string = '',
  ): number {
    let score = 0;

    // First name matching
    if (
      firstName1.toLowerCase() === firstName2.toLowerCase()
    ) {
      score += 0.5;
    } else {
      const fNameSim = this.stringSimilarity(
        firstName1.toLowerCase(),
        firstName2.toLowerCase(),
      );
      score += fNameSim * 0.25;
    }

    // Last name matching
    if (
      lastName1.toLowerCase() === lastName2.toLowerCase()
    ) {
      score += 0.5;
    } else {
      const lNameSim = this.stringSimilarity(
        lastName1.toLowerCase(),
        lastName2.toLowerCase(),
      );
      score += lNameSim * 0.25;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Determine match type based on score
   */
  private determineMatchType(
    score: number,
  ): StudentIdentityMatch['matchType'] {
    if (score >= 0.98) return 'exact_email';
    if (score >= 0.95) return 'exact_id';
    if (score >= 0.85) return 'name_dob';
    if (score >= 0.75) return 'fuzzy_name';
    return 'weak_match';
  }

  /**
   * Get recommended action based on match quality
   */
  private getRecommendedAction(
    bestScore: number,
    matchCount: number,
  ): 'merge' | 'flag' | 'ignore' {
    if (bestScore >= 0.95 && matchCount === 1) {
      return 'merge';
    }
    if (bestScore >= 0.75 && matchCount <= 2) {
      return 'flag';
    }
    return 'ignore';
  }

  /**
   * Generate unified ID from student data
   */
  private generateUnifiedId(
    email: string,
    firstName: string,
    lastName: string,
  ): string {
    if (email) {
      return email.toLowerCase();
    }

    // Fallback: use name-based ID
    const namePart = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    return namePart.replace(/\s+/g, '-');
  }

  /**
   * Batch resolve multiple students
   */
  batchResolveIdentities(students: any[]): IdentityMatchResult[] {
    return students.map((student) => this.findMatches(student, 0.7));
  }

  /**
   * Get identity by ID
   */
  getIdentity(identityId: string): StudentIdentity | undefined {
    return this.identities.get(identityId);
  }

  /**
   * Get all registered identities
   */
  getAllIdentities(): StudentIdentity[] {
    return Array.from(this.identities.values());
  }

  /**
   * Merge duplicate identities
   */
  mergeIdentities(primaryId: string, duplicateId: string): StudentIdentity | null {
    const primary = this.identities.get(primaryId);
    const duplicate = this.identities.get(duplicateId);

    if (!primary || !duplicate) return null;

    // Transfer system IDs from duplicate to primary
    duplicate.systemIds.forEach((id, system) => {
      primary.systemIds.set(system, id);
    });

    // Remove duplicate
    this.identities.delete(duplicateId);

    return primary;
  }

  /**
   * Get resolution statistics
   */
  getResolutionStats(): {
    totalIdentities: number;
    systemsRepresented: Set<string>;
    potentialDuplicates: number;
    mergeRecommendations: number;
  } {
    const systemsRepresented = new Set<string>();
    let potentialDuplicates = 0;
    let mergeRecommendations = 0;

    this.identities.forEach((identity) => {
      identity.systemIds.forEach((_, system) => {
        systemsRepresented.add(system);
      });
    });

    // Check for potential duplicates
    const identityArray = Array.from(this.identities.values());
    for (let i = 0; i < identityArray.length; i++) {
      for (let j = i + 1; j < identityArray.length; j++) {
        const score = this.calculateMatchScore(identityArray[i], identityArray[j]);
        if (score >= 0.7) {
          potentialDuplicates++;
          if (score >= 0.95) mergeRecommendations++;
        }
      }
    }

    return {
      totalIdentities: this.identities.size,
      systemsRepresented,
      potentialDuplicates,
      mergeRecommendations,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.matchCache.clear();
  }

  /**
   * Load sample identities for testing
   */
  loadSampleIdentities(): void {
    const sampleStudents = [
      {
        email: 'alex.smith@university.edu',
        firstName: 'Alex',
        lastName: 'Smith',
        dateOfBirth: '1990-05-15',
        studentId: 'SID-00001',
      },
      {
        email: 'jordan.johnson@university.edu',
        firstName: 'Jordan',
        lastName: 'Johnson',
        dateOfBirth: '1991-03-22',
        studentId: 'SID-00002',
      },
      {
        email: 'casey.williams@university.edu',
        firstName: 'Casey',
        lastName: 'Williams',
        dateOfBirth: '1992-07-10',
        studentId: 'SID-00003',
      },
      {
        email: 'riley.brown@university.edu',
        firstName: 'Riley',
        lastName: 'Brown',
        dateOfBirth: '1993-01-28',
        studentId: 'SID-00004',
      },
    ];

    // Register from different systems to test cross-system matching
    sampleStudents.forEach((student) => {
      this.registerIdentity('moodle-001', { ...student, id: `moodle-${student.studentId}` });
      this.registerIdentity('canvas-001', { ...student, id: `canvas-${student.studentId}` });
      this.registerIdentity('sis-001', { ...student, id: `sis-${student.studentId}` });
    });
  }

  /**
   * Export unified student roster
   */
  exportUnifiedRoster(): Array<{
    unifiedId: string;
    email: string;
    firstName: string;
    lastName: string;
    systemIds: Record<string, string>;
  }> {
    return Array.from(this.identities.values()).map((identity) => ({
      unifiedId: identity.id,
      email: identity.email,
      firstName: identity.firstName,
      lastName: identity.lastName,
      systemIds: Object.fromEntries(identity.systemIds),
    }));
  }
}

export const studentIdentityResolutionService = new StudentIdentityResolutionServiceClass();
