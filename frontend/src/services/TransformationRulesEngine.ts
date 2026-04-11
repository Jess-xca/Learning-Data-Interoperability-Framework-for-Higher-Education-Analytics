/**
 * Transformation Rules Engine
 * Advanced field-level transformation with conditional logic
 * Handles concat, split, format, lookup, and custom transformations
 */

import { DataRecord, TransformationRule } from '../types/etl-extended';

interface TransformationContext {
  recordId: string;
  originalData: Record<string, any>;
  transformedData: Record<string, any>;
  appliedRules: Array<{ ruleId: string; ruleName: string; timestamp: Date }>;
  errors: Array<{ rule: string; error: string; severity: 'warn' | 'error' }>;
  executionTimeMs: number;
}

interface RuleChain {
  id: string;
  name: string;
  description?: string;
  rules: TransformationRule[];
  executionOrder: string[];
  createdAt: Date;
}

/**
 * TransformationRulesEngine - Field-level transformation rules processor
 */
class TransformationRulesEngine {
  private rules: Map<string, TransformationRule> = new Map();
  private ruleChains: Map<string, RuleChain> = new Map();
  private customFunctions: Map<string, Function> = new Map();
  private executionHistory: TransformationContext[] = [];

  constructor() {
    this.registerBuiltInFunctions();
  }

  // ============================================================================
  // RULE MANAGEMENT
  // ============================================================================

  /**
   * Register a transformation rule
   */
  registerRule(rule: TransformationRule): void {
    this.rules.set(rule.id, rule);
    console.log(`[RulesEngine] Rule registered: ${rule.name}`);
  }

  /**
   * Register multiple rules at once
   */
  registerRules(rules: TransformationRule[]): void {
    rules.forEach((rule) => this.registerRule(rule));
  }

  /**
   * Get a rule by ID
   */
  getRule(ruleId: string): TransformationRule | undefined {
    return this.rules.get(ruleId);
  }

  /**
   * List all rules
   */
  listRules(filterType?: string): TransformationRule[] {
    const allRules = Array.from(this.rules.values());
    return filterType ? allRules.filter((r) => r.type === filterType) : allRules;
  }

  /**
   * Delete a rule
   */
  deleteRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  // ============================================================================
  // RULE CHAIN MANAGEMENT
  // ============================================================================

  /**
   * Create a named rule chain for reuse
   */
  createChain(
    chainId: string,
    name: string,
    ruleIds: string[],
    description?: string
  ): RuleChain {
    const chain: RuleChain = {
      id: chainId,
      name,
      description,
      rules: ruleIds
        .map((id) => this.rules.get(id))
        .filter((r) => r !== undefined) as TransformationRule[],
      executionOrder: ruleIds,
      createdAt: new Date(),
    };

    this.ruleChains.set(chainId, chain);
    console.log(`[RulesEngine] Chain created: ${name} (${chain.rules.length} rules)`);
    return chain;
  }

  /**
   * Get a chain
   */
  getChain(chainId: string): RuleChain | undefined {
    return this.ruleChains.get(chainId);
  }

  /**
   * List all chains
   */
  listChains(): RuleChain[] {
    return Array.from(this.ruleChains.values());
  }

  // ============================================================================
  // CUSTOM FUNCTION MANAGEMENT
  // ============================================================================

  /**
   * Register custom transformation function
   */
  registerCustomFunction(name: string, fn: Function): void {
    this.customFunctions.set(name, fn);
    console.log(`[RulesEngine] Custom function registered: ${name}`);
  }

  /**
   * Get custom function
   */
  getCustomFunction(name: string): Function | undefined {
    return this.customFunctions.get(name);
  }

  // ============================================================================
  // TRANSFORMATION EXECUTION
  // ============================================================================

  /**
   * Transform a single record with all tracking
   */
  async transformRecord(
    record: DataRecord,
    rules: TransformationRule[]
  ): Promise<{ record: DataRecord; context: TransformationContext }> {
    const startTime = Date.now();
    const context: TransformationContext = {
      recordId: record.id,
      originalData: { ...record.data },
      transformedData: { ...record.data },
      appliedRules: [],
      errors: [],
      executionTimeMs: 0,
    };

    for (const rule of rules) {
      const ruleStartTime = Date.now();
      try {
        context.transformedData = await this.executeRule(
          rule,
          context.transformedData,
          context
        );
        
        context.appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          timestamp: new Date(),
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        context.errors.push({
          rule: rule.name,
          error: errorMsg,
          severity: rule.config?.stopOnError ? 'error' : 'warn',
        });

        if (rule.config?.stopOnError) {
          console.error(`[RulesEngine] Fatal error in rule ${rule.name}, stopping`);
          break;
        }
      }
    }

    context.executionTimeMs = Date.now() - startTime;
    this.executionHistory.push(context);

    const transformedRecord: DataRecord = {
      ...record,
      data: context.transformedData,
      lineage: {
        ...record.lineage,
        transformations: [
          ...record.lineage.transformations,
          ...context.appliedRules.map((a) => a.ruleName),
        ],
      },
    };

    return { record: transformedRecord, context };
  }

  /**
   * Transform multiple records in batch
   */
  async transformBatch(
    records: DataRecord[],
    rules: TransformationRule[] | string
  ): Promise<{
    records: DataRecord[];
    contexts: TransformationContext[];
    summary: {
      total: number;
      successful: number;
      failed: number;
      totalTimeMs: number;
      averageTimeMs: number;
    };
  }> {
    const startTime = Date.now();

    // Resolve chain if string ID provided
    let rulesList = rules as TransformationRule[];
    if (typeof rules === 'string') {
      const chain = this.ruleChains.get(rules);
      if (!chain) throw new Error(`Chain not found: ${rules}`);
      rulesList = chain.rules;
    }

    console.log(
      `[RulesEngine] Transforming ${records.length} records with ${rulesList.length} rules`
    );

    const transformedRecords: DataRecord[] = [];
    const contexts: TransformationContext[] = [];
    let successful = 0;
    let failed = 0;

    for (const record of records) {
      try {
        const { record: transformed, context } = await this.transformRecord(
          record,
          rulesList
        );
        transformedRecords.push(transformed);
        contexts.push(context);
        successful++;
      } catch (error) {
        console.error(`[RulesEngine] Batch transformation failed for record ${record.id}`);
        transformedRecords.push(record);
        failed++;
      }
    }

    const totalTime = Date.now() - startTime;

    return {
      records: transformedRecords,
      contexts,
      summary: {
        total: records.length,
        successful,
        failed,
        totalTimeMs: totalTime,
        averageTimeMs: totalTime / records.length,
      },
    };
  }

  /**
   * Execute a single rule on data
   */
  private async executeRule(
    rule: TransformationRule,
    data: Record<string, any>,
    context: TransformationContext
  ): Promise<Record<string, any>> {
    const result = { ...data };

    switch (rule.type) {
      case 'concat':
        return this.executeConcatenation(rule, result);

      case 'split':
        return this.executeSplit(rule, result);

      case 'format':
        return this.executeFormat(rule, result);

      case 'lookup':
        return this.executeLookup(rule, result);

      case 'custom':
        return this.executeCustom(rule, result);

      default:
        throw new Error(`Unknown rule type: ${rule.type}`);
    }
  }

  // ============================================================================
  // RULE IMPLEMENTATIONS
  // ============================================================================

  private executeConcatenation(
    rule: TransformationRule,
    data: Record<string, any>
  ): Record<string, any> {
    const { sourceFields, targetField, config } = rule;
    const separator = config.separator || ' ';
    const prefix = config.prefix || '';
    const suffix = config.suffix || '';

    const values = sourceFields
      .map((field) => {
        const val = data[field];
        if (val === null || val === undefined) return '';

        let str = String(val);
        if (config.toUpperCase) str = str.toUpperCase();
        if (config.toLowerCase) str = str.toLowerCase();
        if (config.trim) str = str.trim();

        return str;
      })
      .filter((v) => v !== '');

    if (values.length === 0) {
      data[targetField] = config.nullValue || '';
    } else {
      data[targetField] = prefix + values.join(separator) + suffix;
    }

    return data;
  }

  private executeSplit(
    rule: TransformationRule,
    data: Record<string, any>
  ): Record<string, any> {
    const { sourceFields, targetField, config } = rule;
    const sourceValue = data[sourceFields[0]];

    if (!sourceValue || typeof sourceValue !== 'string') {
      if (config.nullValue) {
        data[targetField] = config.nullValue;
      }
      return data;
    }

    const delimiter = config.delimiter || ',';
    const parts = sourceValue.split(delimiter).map((p: string) => p.trim());

    if (config.asArray) {
      data[targetField] = parts;
    } else {
      parts.forEach((part: string, index: number) => {
        const fieldName = config.fieldNames?.[index] || `${targetField}_${index}`;
        data[fieldName] = part;
      });
    }

    return data;
  }

  private executeFormat(
    rule: TransformationRule,
    data: Record<string, any>
  ): Record<string, any> {
    const { sourceFields, targetField, config } = rule;
    let template = config.template || '';

    // Replace field placeholders
    sourceFields.forEach((field) => {
      const value = data[field] || '';
      template = template.replace(`{${field}}`, String(value));
    });

    let result = template;

    // Apply transformations
    if (config.toUpperCase) result = result.toUpperCase();
    if (config.toLowerCase) result = result.toLowerCase();
    if (config.trim) result = result.trim();

    // Apply regex if provided
    if (config.regex) {
      const regex = new RegExp(config.regex, config.regexFlags || 'g');
      result = result.replace(regex, config.regexReplace || '');
    }

    data[targetField] = result;
    return data;
  }

  private executeLookup(
    rule: TransformationRule,
    data: Record<string, any>
  ): Record<string, any> {
    const { sourceFields, targetField, config } = rule;
    const lookupValue = data[sourceFields[0]];
    const lookupTable = config.lookupTable || {};

    let result =
      lookupTable[lookupValue as string] ||
      lookupTable[lookupValue as number] ||
      config.defaultValue;

    // Case-insensitive lookup
    if (result === undefined && config.caseInsensitive && typeof lookupValue === 'string') {
      const lowerValue = lookupValue.toLowerCase();
      const key = Object.keys(lookupTable).find(
        (k) => String(k).toLowerCase() === lowerValue
      );
      result = key ? lookupTable[key] : config.defaultValue;
    }

    data[targetField] = result ?? config.nullValue ?? null;
    return data;
  }

  private executeCustom(
    rule: TransformationRule,
    data: Record<string, any>
  ): Record<string, any> {
    const { sourceFields, targetField, config } = rule;
    const fn = this.customFunctions.get(config.functionName);

    if (!fn) {
      throw new Error(`Custom function not found: ${config.functionName}`);
    }

    const inputs = sourceFields.map((f) => data[f]);

    try {
      data[targetField] = fn(...inputs);
    } catch (error) {
      throw new Error(
        `Custom function error: ${error instanceof Error ? error.message : 'Unknown'}`
      );
    }

    return data;
  }

  // ============================================================================
  // BUILT-IN FUNCTIONS
  // ============================================================================

  private registerBuiltInFunctions(): void {
    // Age calculator
    this.registerCustomFunction('calculateAge', (dob: string | Date) => {
      if (!dob) return null;
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 0 ? age : null;
    });

    // String utilities
    this.registerCustomFunction('toTitleCase', (str: string) => {
      if (!str) return '';
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    });

    this.registerCustomFunction('slugify', (str: string) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .trim()
        .replace(/[\s]+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    });

    // Hash functions (mock - not for production security)
    this.registerCustomFunction('hashValue', (value: string) => {
      if (!value) return '';
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = (hash << 5) - hash + char;
      }
      return Math.abs(hash).toString(16);
    });

    // Date utilities
    this.registerCustomFunction('formatDate', (date: string | Date, format: string = 'YYYY-MM-DD') => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
    });

    // Number utilities
    this.registerCustomFunction('roundToTwo', (num: number) => {
      if (typeof num !== 'number') return 0;
      return Math.round(num * 100) / 100;
    });

    this.registerCustomFunction('percentage', (value: number, total: number) => {
      if (!total || total === 0) return 0;
      return Math.round((value / total) * 100);
    });
  }

  // ============================================================================
  // HISTORY & ANALYTICS
  // ============================================================================

  /**
   * Get execution history
   */
  getHistory(limit: number = 100): TransformationContext[] {
    return this.executionHistory.slice(-limit);
  }

  /**
   * Get statistics
   */
  getStatistics(): any {
    if (this.executionHistory.length === 0) {
      return {
        totalExecutions: 0,
        averageTimeMs: 0,
        errorRate: 0,
      };
    }

    const totalTime = this.executionHistory.reduce((sum, c) => sum + c.executionTimeMs, 0);
    const totalErrors = this.executionHistory.reduce((sum, c) => sum + c.errors.length, 0);

    return {
      totalExecutions: this.executionHistory.length,
      averageTimeMs: totalTime / this.executionHistory.length,
      totalErrorsEncountered: totalErrors,
      errorRate: (totalErrors / this.executionHistory.length) * 100,
      registeredRules: this.rules.size,
      registeredChains: this.ruleChains.size,
      customFunctions: this.customFunctions.size,
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }
}

export const transformationRulesEngine = new TransformationRulesEngine();
export default TransformationRulesEngine;
