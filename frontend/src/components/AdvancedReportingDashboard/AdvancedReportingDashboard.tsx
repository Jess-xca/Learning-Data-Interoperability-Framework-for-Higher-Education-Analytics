import React from 'react';
import { Card } from '../common';

export const AdvancedReportingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-2">Advanced Reporting Dashboard</h2>
        <p className="text-gray-600">Multi-format analytics and reporting for pipeline operations</p>
        <p className="text-sm text-gray-500 mt-4">Report generation with time range filtering and export capabilities...</p>
      </Card>
    </div>
  );
};

export default AdvancedReportingDashboard;

export const AdvancedReportingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [reportType, setReportType] = useState<'overview' | 'quality' | 'performance' | 'errors'>('overview');
  const [qualityData, setQualityData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [errorData, setErrorData] = useState<any>(null);

  useEffect(() => {
    generateReport();
  }, [timeRange, reportType]);

  const generateReport = async () => {
    // Gather metrics from services
    const pipelines = etlService.listExecutions().slice(-100); // Last 100 executions
    const stats = pipelineErrorRecoveryService.getErrorStatistics();

    if (pipelines.length > 0) {
      const totalRecords = pipelines.reduce((sum, p) => sum + (p.recordsProcessed || 0), 0);
      const successfulRecords = pipelines.reduce((sum, p) => sum + (p.recordsSuccessful || 0), 0);
      const failedRecords = totalRecords - successfulRecords;
      const avgTime =
        pipelines.reduce((sum, p) => sum + (p.executionTimeMs || 0), 0) / pipelines.length;

      setMetrics({
        totalRecords,
        successfulRecords,
        failedRecords,
        averageProcessingTimeMs: avgTime,
        qualityScore: successfulRecords / totalRecords,
        transformationsApplied: pipelines.sumOf?.((p) => p.transformations?.length || 0) || 0,
        errorsRecovered: stats?.recoveredErrors || 0,
      });

      // Generate quality data
      const stageBreakdown = pipelines
        .reduce((acc: any, p: any) => {
          p.stages?.forEach((stage: any) => {
            const label = stage.name;
            if (!acc[label]) {
              acc[label] = { name: label, quality: 0, count: 0 };
            }
            acc[label].quality += stage.qualityScore || 0;
            acc[label].count++;
          });
          return acc;
        }, {});

      Object.keys(stageBreakdown).forEach((key) => {
        stageBreakdown[key].quality = stageBreakdown[key].quality / stageBreakdown[key].count;
      });

      setQualityData(Object.values(stageBreakdown));

      // Performance data
      const performanceByDate = new Map<string, any>();
      pipelines.forEach((p) => {
        const date = new Date(p.startedAt).toLocaleDateString();
        if (!performanceByDate.has(date)) {
          performanceByDate.set(date, {
            date,
            avgTime: 0,
            recordsProcessed: 0,
            successRate: 0,
            count: 0,
          });
        }

        const entry = performanceByDate.get(date);
        entry.avgTime += p.executionTimeMs || 0;
        entry.recordsProcessed += p.recordsProcessed || 0;
        entry.successRate += (p.recordsSuccessful || 0) / (p.recordsProcessed || 1);
        entry.count++;
      });

      performanceByDate.forEach((entry) => {
        entry.avgTime = entry.avgTime / entry.count;
        entry.successRate = (entry.successRate / entry.count) * 100;
      });

      setPerformanceData(Array.from(performanceByDate.values()));

      // Error data
      const errorsByCode = stats?.errorsByCode || [];
      const errorsByStage = stats?.errorsByStage || [];

      setErrorData({
        topErrors: errorsByCode.slice(0, 5),
        stageErrors: errorsByStage,
        totalErrors: stats?.totalErrors || 0,
        recoveredErrors: stats?.recoveredErrors || 0,
      });
    }
  };

  const exportReport = (format: 'json' | 'csv' | 'pdf') => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      reportType,
      metrics,
      qualityData,
      performanceData,
      errorData,
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json',
      });
      downloadBlob(blob, `report-${Date.now()}.json`);
    } else if (format === 'csv') {
      const csv = convertToCsv(report);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadBlob(blob, `report-${Date.now()}.csv`);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const convertToCsv = (report: any): string => {
    const lines: string[] = [];
    lines.push('Pipeline Advanced Report');
    lines.push(`Generated: ${report.generatedAt}`);
    lines.push(`Time Range: ${report.timeRange}`);
    lines.push('');

    // Metrics section
    lines.push('METRICS');
    if (report.metrics) {
      Object.entries(report.metrics).forEach(([key, value]) => {
        lines.push(`${key},${value}`);
      });
    }

    return lines.join('\n');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card title="Report Controls">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="overview">Overview</option>
              <option value="quality">Quality Analysis</option>
              <option value="performance">Performance</option>
              <option value="errors">Error Analysis</option>
            </select>
          </div>

          <div className="flex gap-2 md:col-span-2">
            <Button onClick={() => generateReport()} variant="primary">
              Refresh
            </Button>
            <Button onClick={() => exportReport('json')} variant="secondary">
              <Download size={18} /> Export JSON
            </Button>
            <Button onClick={() => exportReport('csv')} variant="secondary">
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Overview Report */}
      {reportType === 'overview' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Processing Summary" subtitle="Record statistics">
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Total Records</span>
                <span className="font-bold">{metrics.totalRecords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>Successful</span>
                <span className="font-bold text-green-600">
                  {metrics.successfulRecords.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>Failed</span>
                <span className="font-bold text-red-600">
                  {metrics.failedRecords.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 bg-blue-50 rounded">
                <span>Success Rate</span>
                <span className="font-bold text-blue-600">
                  {(metrics.qualityScore * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>

          <Card title="Performance Metrics" subtitle="Processing efficiency">
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Avg Processing Time</span>
                <span className="font-bold">{metrics.averageProcessingTimeMs.toFixed(2)} ms</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Transformations</span>
                <span className="font-bold">{metrics.transformationsApplied}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Errors Recovered</span>
                <span className="font-bold text-blue-600">{metrics.errorsRecovered}</span>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">
                <strong>Throughput:</strong> {(1000 / metrics.averageProcessingTimeMs).toFixed(0)}{' '}
                records/sec
              </div>
            </div>
          </Card>

          <Card title="Quality Overview" subtitle="Data quality insights">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {(metrics.qualityScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Overall Quality</div>
                  <div className="text-xs text-gray-500">
                    Based on success rate and stage completion
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${metrics.qualityScore * 100}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quality Analysis */}
      {reportType === 'quality' && qualityData && (
        <Card title="Quality Analysis by Stage" subtitle="Quality scores per pipeline stage">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(qualityData as any[]).map((stage: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{stage.name}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(stage.quality * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${stage.quality * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Analysis */}
      {reportType === 'performance' && performanceData && (
        <Card title="Historical Performance Trends" subtitle="Performance over time">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {performanceData.map((entry: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{entry.date}</span>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <strong>Avg Time:</strong> {entry.avgTime.toFixed(0)} ms
                    </div>
                    <div>
                      <strong>Success:</strong> {entry.successRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${Math.min((entry.successRate / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Analysis */}
      {reportType === 'errors' && errorData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Top Errors" subtitle={`${errorData.totalErrors} total errors`}>
            <div className="space-y-2">
              {errorData.topErrors.map((error: any, idx: number) => (
                <div key={idx} className="p-3 bg-red-50 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">{error.code}</span>
                    <span className="text-red-600 font-bold">{error.count}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Last: {new Date(error.lastOccurred).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Error Recovery" subtitle="Recovery statistics">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-3xl font-bold text-blue-600">
                  {errorData.recoveredErrors}
                </div>
                <div className="text-sm text-gray-600">Errors Successfully Recovered</div>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <div className="text-3xl font-bold text-orange-600">
                  {errorData.totalErrors - errorData.recoveredErrors}
                </div>
                <div className="text-sm text-gray-600">Errors Still Processing</div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedReportingDashboard;
