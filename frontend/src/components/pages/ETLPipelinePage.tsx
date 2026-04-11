import React, { useState, useEffect } from 'react';
import { Card } from '../common';
import { Button } from '../forms';
import {
  Play,
  Pause,
  Trash2,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { etlService, type PipelineExecution } from '../../services/ETLService';
import { dataValidationService } from '../../services/DataValidationService';
import { studentIdentityResolutionService } from '../../services/StudentIdentityResolutionService';
import type { ETLPipeline } from '../../types/etl';

export const ETLPipelinePage: React.FC = () => {
  const [pipelines, setPipelines] = useState<ETLPipeline[]>([]);
  const [executions, setExecutions] = useState<Map<string, PipelineExecution>>(
    new Map(),
  );
  const [selectedPipeline, setSelectedPipeline] = useState<ETLPipeline | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [resolutionStats, setResolutionStats] = useState<any>(null);

  useEffect(() => {
    // Load pipelines with sample data
    const allPipelines = etlService.getAllPipelines();
    if (allPipelines.length === 0) {
      // Load sample pipelines with validation & transformation rules
      const samplePipelines = etlService.createSamplePipelinesWithRules();
      setPipelines(samplePipelines);
    } else {
      setPipelines(allPipelines);
    }

    // Load sample identities for student resolution testing
    studentIdentityResolutionService.loadSampleIdentities();

    // Create sample validation profiles
    dataValidationService.createUserProfile();
    dataValidationService.createCourseProfile();
    dataValidationService.createEnrollmentProfile();
  }, []);

  const handleExecutePipeline = async (pipeline: ETLPipeline) => {
    setIsExecuting(true);

    // Generate comprehensive mock data for pipeline based on type
    const mockRecords = generateMockData(pipeline.dataSourceId);

    try {
      const execution = await etlService.executePipeline(pipeline.id, mockRecords);
      setExecutions(new Map(executions).set(pipeline.id, execution));

      // Also run validation on a sample
      const report = dataValidationService.validateBatch(mockRecords);
      setValidationReport(report);

      // Run identity resolution
      mockRecords.forEach((student) => {
        studentIdentityResolutionService.registerIdentity(pipeline.dataSourceId, student);
      });
      const stats = studentIdentityResolutionService.getResolutionStats();
      setResolutionStats(stats);
    } catch (error) {
      console.error('Pipeline execution failed:', error);
    }

    setIsExecuting(false);
  };

  const generateMockData = (dataSourceId: string) => {
    // Generate realistic mock data based on data source
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Jamie', 'Sam', 'Pat', 'Robin'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const universities = ['university.edu', 'school.edu', 'college.edu', 'edu.org'];

    return Array.from({ length: 50 }, (_, i) => {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      const domain = universities[Math.floor(i / 15) % universities.length];
      
      return {
        id: `student-${dataSourceId}-${i}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domain}`,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        role: i % 10 === 0 ? 'instructor' : i % 15 === 0 ? 'ta' : 'student',
        courseId: `course-${Math.floor(i / 5)}`,
        status: i % 20 === 0 ? 'inactive' : 'active',
        dateOfBirth: `198${Math.floor(Math.random() * 10)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        code: `CS${1000 + Math.floor(i / 5)}`,
        enrolledDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        studentId: `SID-${String(i + 1000).padStart(5, '0')}`,
      };
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      case 'paused':
        return 'text-yellow-600';
      default:
        return 'text-slate-600';
    }
  };

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-50';
      case 'failed':
        return 'bg-red-50';
      case 'running':
        return 'bg-blue-50';
      case 'paused':
        return 'bg-yellow-50';
      default:
        return 'bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">ETL Pipeline Engine</h1>
        <p className="text-slate-600 mt-2">
          Orchestrate, monitor, and manage data processing pipelines
        </p>
      </div>

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Total Pipelines</div>
              <div className="text-3xl font-bold">{pipelines.length}</div>
            </div>
            <Zap className="w-8 h-8 text-slate-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Active Executions</div>
              <div className="text-3xl font-bold">
                {Array.from(executions.values()).filter((e) => e.status === 'running')
                  .length}
              </div>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Success Rate</div>
              <div className="text-3xl font-bold">
                {pipelines.length > 0
                  ? Math.round(
                      (pipelines.filter((p) => p.status === 'completed').length /
                        pipelines.length) *
                        100,
                    )
                  : 0}
                %
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Data Quality</div>
              <div className="text-3xl font-bold">
                {validationReport ? validationReport.qualityScore : '--'}%
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      {/* Pipelines List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Pipelines</h2>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Pipeline
          </Button>
        </div>

        <div className="space-y-3">
          {pipelines.map((pipeline) => {
            const execution = executions.get(pipeline.id);
            return (
              <div
                key={pipeline.id}
                onClick={() => setSelectedPipeline(pipeline)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPipeline?.id === pipeline.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{pipeline.name}</h3>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBgColor(
                      pipeline.status,
                    )} ${getStatusColor(pipeline.status)}`}
                  >
                    {pipeline.status.toUpperCase()}
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-3">
                  {pipeline.description}
                </p>

                {/* Pipeline Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs">
                  <div className="bg-slate-100 p-2 rounded">
                    <div className="text-slate-600">Standards</div>
                    <div className="font-semibold">{pipeline.standards.join(', ')}</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded">
                    <div className="text-slate-600">Stages</div>
                    <div className="font-semibold">{pipeline.stages.length}</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded">
                    <div className="text-slate-600">Schedule</div>
                    <div className="font-semibold">{pipeline.schedule || 'Manual'}</div>
                  </div>
                  <div className="bg-slate-100 p-2 rounded">
                    <div className="text-slate-600">Created</div>
                    <div className="font-semibold">
                      {new Date(pipeline.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Execution Progress */}
                {execution && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{execution.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${execution.progress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                      <div>
                        <span className="text-slate-600">Processed:</span>
                        <span className="font-semibold ml-1">
                          {execution.metrics.recordsProcessed}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Time:</span>
                        <span className="font-semibold ml-1">
                          {execution.metrics.executionTime}ms
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExecutePipeline(pipeline);
                    }}
                    disabled={isExecuting}
                    className="text-xs bg-green-600 hover:bg-green-700"
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Execute
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="text-xs">
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                  <Button variant="outline" className="text-xs">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Validation Report */}
      {validationReport && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Data Quality Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Valid Records</div>
              <div className="text-2xl font-bold text-green-900">
                {validationReport.validRecords}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600">Invalid Records</div>
              <div className="text-2xl font-bold text-red-900">
                {validationReport.invalidRecords}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Quality Score</div>
              <div className="text-2xl font-bold text-blue-900">
                {validationReport.qualityScore}%
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600">Total Records</div>
              <div className="text-2xl font-bold text-slate-900">
                {validationReport.totalRecords}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recommendations
            </h3>
            <ul className="space-y-1 text-sm">
              {validationReport.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="text-slate-700">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Identity Resolution Stats */}
      {resolutionStats && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Student Identity Resolution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Unified Identities</div>
              <div className="text-2xl font-bold text-blue-900">
                {resolutionStats.totalIdentities}
              </div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-sm text-amber-600">Potential Duplicates</div>
              <div className="text-2xl font-bold text-amber-900">
                {resolutionStats.potentialDuplicates}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600">Merge Recommendations</div>
              <div className="text-2xl font-bold text-purple-900">
                {resolutionStats.mergeRecommendations}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
