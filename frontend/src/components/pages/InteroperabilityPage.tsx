import React, { useState, useEffect } from 'react';
import {
  Card,
} from '../common';
import { Button } from '../forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../common/Tabs';
import {
  ArrowRight,
  CheckCircle,
  Download,
  Eye,
  Zap,
  Database,
} from 'lucide-react';
import { dataSourceService } from '../../services/DataSourceService';
import { transformationService } from '../../services/TransformationService';
import type { TransformationResult } from '../../services/TransformationService';
import type { DataSource } from '../../types/datasources';

export const InteroperabilityPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedStandards, setSelectedStandards] = useState<
    ('ims_global' | 'xapi' | 'caliper')[]
  >(['ims_global']);
  const [transformationResult, setTransformationResult] =
    useState<TransformationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<
    'ims_global' | 'xapi' | 'caliper'
  >('ims_global');
  const [previewFormat, setPreviewFormat] = useState<'json' | 'csv' | 'xml'>(
    'json',
  );

  useEffect(() => {
    const sources = dataSourceService.getAllDataSources();
    setDataSources(sources);
    if (sources.length > 0 && !selectedSourceId) {
      setSelectedSourceId(sources[0].id);
    }
  }, [selectedSourceId]);

  const toggleStandard = (standard: 'ims_global' | 'xapi' | 'caliper') => {
    if (selectedStandards.includes(standard)) {
      setSelectedStandards(selectedStandards.filter((s) => s !== standard));
    } else {
      setSelectedStandards([...selectedStandards, standard]);
    }
  };

  const handleTransform = async () => {
    if (!selectedSourceId || selectedStandards.length === 0) {
      alert('Please select a data source and at least one standard');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate fetching source data
      const mockUsers = [
        {
          id: 'user-1',
          email: 'alice@example.com',
          firstName: 'Alice',
          lastName: 'Johnson',
          fullName: 'Alice Johnson',
        },
        {
          id: 'user-2',
          email: 'bob@example.com',
          firstName: 'Bob',
          lastName: 'Smith',
          fullName: 'Bob Smith',
        },
        {
          id: 'user-3',
          email: 'charlie@example.com',
          firstName: 'Charlie',
          lastName: 'Brown',
          fullName: 'Charlie Brown',
        },
      ];

      const mockCourses = [
        {
          id: 'course-1',
          code: 'CS101',
          name: 'Introduction to Computer Science',
          description: 'Fundamentals of programming and algorithms',
          credits: 3,
        },
        {
          id: 'course-2',
          code: 'MATH201',
          name: 'Calculus II',
          description: 'Advanced calculus concepts',
          credits: 4,
        },
      ];

      const mockEnrollments = [
        {
          id: 'enroll-1',
          userId: 'user-1',
          courseId: 'course-1',
          role: 'student',
          status: 'active',
        },
        {
          id: 'enroll-2',
          userId: 'user-2',
          courseId: 'course-1',
          role: 'instructor',
          status: 'active',
        },
        {
          id: 'enroll-3',
          userId: 'user-1',
          courseId: 'course-2',
          role: 'student',
          status: 'active',
        },
        {
          id: 'enroll-4',
          userId: 'user-3',
          courseId: 'course-2',
          role: 'student',
          status: 'pending',
        },
      ];

      const result = await transformationService.transformData(
        mockUsers,
        mockCourses,
        mockEnrollments,
        {
          dataSourceId: selectedSourceId,
          standards: selectedStandards,
          includeValidation: true,
          exportFormat: 'json',
        },
      );

      setTransformationResult(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Transformation failed:', error);
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'xml') => {
    if (!transformationResult) return;

    const exportData = transformationService.exportData(
      transformationResult,
      selectedStandard,
      format,
    );

    const element = document.createElement('a');
    const file = new Blob([exportData], {
      type:
        format === 'csv'
          ? 'text/csv'
          : format === 'xml'
            ? 'application/xml'
            : 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedStandard}-export.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStandardsIcon = (
    standard: 'ims_global' | 'xapi' | 'caliper',
  ): React.ReactNode => {
    switch (standard) {
      case 'ims_global':
        return <Database className="w-5 h-5" />;
      case 'xapi':
        return <Zap className="w-5 h-5" />;
      case 'caliper':
        return <Eye className="w-5 h-5" />;
    }
  };

  const standardsList = [
    {
      id: 'ims_global',
      name: 'IMS Global',
      description: 'LIS v2 & OneRoster v1.2 standards for roster information',
      category: 'Roster & LIS',
    },
    {
      id: 'xapi',
      name: 'xAPI',
      description: 'Experience API for learning activity streams',
      category: 'Activity Streams',
    },
    {
      id: 'caliper',
      name: 'Caliper',
      description: 'IMS Caliper Analytics Standard for learning events',
      category: 'Learning Analytics',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Interoperability Standards</h1>
        <p className="text-slate-600 mt-2">
          Transform your educational data to industry standards: IMS Global, xAPI, and
          Caliper
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {standardsList.map((standard) => (
          <Card
            key={standard.id}
            onClick={() =>
              toggleStandard(standard.id as 'ims_global' | 'xapi' | 'caliper')
            }
            className={`cursor-pointer transition-all ${
              selectedStandards.includes(
                standard.id as 'ims_global' | 'xapi' | 'caliper',
              )
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:border-blue-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {getStandardsIcon(
                    standard.id as 'ims_global' | 'xapi' | 'caliper',
                  )}
                  {standard.name}
                </h3>
                {selectedStandards.includes(
                  standard.id as 'ims_global' | 'xapi' | 'caliper',
                ) && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="text-xs bg-slate-100 px-2 py-1 rounded w-fit mb-2">
                {standard.category}
              </div>
              <p className="text-sm text-slate-600">{standard.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Source Selection</h2>
          <p className="text-sm text-slate-600 mb-4">
            Choose a data source to transform
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map((source) => (
                <div
                  key={source.id}
                  onClick={() => setSelectedSourceId(source.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSourceId === source.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{source.name}</h4>
                      <p className="text-sm text-slate-600">{source.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Students</div>
                      <div className="font-semibold">
                        {source.recordCounts?.students || 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between text-xs text-slate-500">
                    <span>Status: <span className={source.status === 'connected' ? 'text-green-600' : 'text-red-600'}>
                      {source.status}
                    </span></span>
                    <span>Courses: {source.recordCounts?.courses || 0}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleTransform}
              disabled={!selectedSourceId || selectedStandards.length === 0 || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Transform Data
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {transformationResult && (
        <Card>
          <div>
            <h2 className="text-xl font-semibold mb-2">Transformation Results</h2>
            <p className="text-sm text-slate-600 mb-4">
              Data successfully transformed to selected standards
            </p>

            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-600">Total Records</div>
                  <div className="text-2xl font-bold">
                    {transformationResult.metrics.recordsProcessed}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Processing Time
                  </div>
                  <div className="text-2xl font-bold">
                    {transformationResult.metrics.transformationTime}ms
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-600">Standards</div>
                  <div className="text-2xl font-bold">
                    {Object.keys(transformationResult.standards).length}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-xs text-slate-600">Errors</div>
                  <div className="text-2xl font-bold">
                    {transformationResult.metrics.errorsEncountered}
                  </div>
                </div>
              </div>

              {/* Standards Details */}
              <Tabs value={selectedStandard} onValueChange={(value: string) => setSelectedStandard(value as 'ims_global' | 'xapi' | 'caliper')}>
                <TabsList className="grid w-full grid-cols-3">
                  {selectedStandards.map((standard) => (
                    <TabsTrigger key={standard} value={standard}>
                      <div className="flex items-center gap-2">
                        {getStandardsIcon(standard)}
                        {standard === 'ims_global'
                          ? 'IMS Global'
                          : standard === 'xapi'
                            ? 'xAPI'
                            : 'Caliper'}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {selectedStandards.includes('ims_global') && (
                  <TabsContent value="ims_global" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600">Users</div>
                        <div className="text-3xl font-bold text-blue-900">
                          {transformationResult.standards.imsGlobal?.users.length || 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600">Courses</div>
                        <div className="text-3xl font-bold text-purple-900">
                          {transformationResult.standards.imsGlobal?.courses.length || 0}
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600">Enrollments</div>
                        <div className="text-3xl font-bold text-green-900">
                          {transformationResult.standards.imsGlobal?.enrollments.length || 0}
                        </div>
                      </div>
                    </div>

                    {transformationResult.standards.imsGlobal?.validationReport && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Validation Report
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            ✓ Passed:{' '}
                            {transformationResult.standards.imsGlobal.validationReport
                              .passCount}
                          </div>
                          <div>
                            ✗ Failed:{' '}
                            {transformationResult.standards.imsGlobal.validationReport
                              .failCount}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold">Export Format</h4>
                      <div className="flex gap-2">
                        {['json', 'csv', 'xml'].map((format) => (
                          <Button
                            key={format}
                            variant={previewFormat === format ? 'primary' : 'outline'}
                            onClick={() => setPreviewFormat(format as 'json' | 'csv' | 'xml')}
                            size="sm"
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleExport(previewFormat)}
                        className="w-full mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export as {previewFormat.toUpperCase()}
                      </Button>
                    </div>
                  </TabsContent>
                )}

                {selectedStandards.includes('xapi') && (
                  <TabsContent value="xapi" className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg mt-4">
                      <div className="text-sm text-cyan-600 font-semibold">
                        xAPI Activity Statements
                      </div>
                      <div className="text-3xl font-bold text-cyan-900 mt-2">
                        {transformationResult.standards.xapi?.statements.length || 0}
                      </div>
                    </div>

                    {transformationResult.standards.xapi?.validationReport && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Validation Report
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            Total:{' '}
                            {transformationResult.standards.xapi.validationReport
                              .totalStatements}
                          </div>
                          <div>
                            ✓ Valid:{' '}
                            {transformationResult.standards.xapi.validationReport
                              .validStatements}
                          </div>
                          <div>
                            ✗ Invalid:{' '}
                            {transformationResult.standards.xapi.validationReport
                              .invalidStatements}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold">Export Format</h4>
                      <div className="flex gap-2">
                        {['json', 'csv'].map((format) => (
                          <Button
                            key={format}
                            variant={previewFormat === format ? 'primary' : 'outline'}
                            onClick={() => setPreviewFormat(format as 'json' | 'csv' | 'xml')}
                            size="sm"
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleExport(previewFormat)}
                        className="w-full mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export as {previewFormat.toUpperCase()}
                      </Button>
                    </div>
                  </TabsContent>
                )}

                {selectedStandards.includes('caliper') && (
                  <TabsContent value="caliper" className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg mt-4">
                      <div className="text-sm text-orange-600 font-semibold">
                        Caliper Events
                      </div>
                      <div className="text-3xl font-bold text-orange-900 mt-2">
                        {transformationResult.standards.caliper?.events.length || 0}
                      </div>
                    </div>

                    {transformationResult.standards.caliper?.validationReport && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Validation Report
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            Total:{' '}
                            {transformationResult.standards.caliper.validationReport
                              .totalEvents}
                          </div>
                          <div>
                            ✓ Valid:{' '}
                            {transformationResult.standards.caliper.validationReport
                              .validEvents}
                          </div>
                          <div>
                            ✗ Invalid:{' '}
                            {transformationResult.standards.caliper.validationReport
                              .invalidEvents}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="font-semibold">Export Format</h4>
                      <div className="flex gap-2">
                        {['json', 'csv'].map((format) => (
                          <Button
                            key={format}
                            variant={previewFormat === format ? 'primary' : 'outline'}
                            onClick={() => setPreviewFormat(format as 'json' | 'csv' | 'xml')}
                            size="sm"
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleExport(previewFormat)}
                        className="w-full mt-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export as {previewFormat.toUpperCase()}
                      </Button>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
