import React, { useState, useEffect } from 'react';
import { Card } from '../common';
import { Button } from '../forms';
import {
  AlertTriangle,
  RefreshCw,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { pipelineErrorRecoveryService } from '../../services/PipelineErrorRecoveryService';

export const ErrorRecoveryDashboard: React.FC = () => {
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [errorStats, setErrorStats] = useState<any>(null);
  const [dlqItems, setDlqItems] = useState<any[]>([]);
  const [selectedError, setSelectedError] = useState<any>(null);
  const [retryPolicy, setRetryPolicy] = useState(pipelineErrorRecoveryService.getRetryPolicy());

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStatus(pipelineErrorRecoveryService.getQueueStatus());
      setErrorStats(pipelineErrorRecoveryService.getErrorStatistics());
      setDlqItems(pipelineErrorRecoveryService.getDeadLetterQueue());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const retryAll = () => {
    pipelineErrorRecoveryService.retryDeadLetterQueue();
    setDlqItems([]);
  };

  const removeFromDlq = (dlqId: string) => {
    pipelineErrorRecoveryService.removeFromDeadLetterQueue(dlqId);
    setDlqItems(dlqItems.filter(item => item.id !== dlqId));
  };

  const updateRetryPolicy = (field: string, value: number) => {
    const newPolicy = { ...retryPolicy, [field]: value };
    pipelineErrorRecoveryService.setRetryPolicy(newPolicy);
    setRetryPolicy(newPolicy);
  };

  return (
    <div className="space-y-6">
      {/* Queue Status */}
      <Card title="Error Queue Status" subtitle="Real-time error recovery monitoring">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <div className="text-3xl font-bold text-orange-600">{queueStatus?.totalQueued || 0}</div>
            <div className="text-sm text-gray-600">Total Queued</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{queueStatus?.readyNow || 0}</div>
            <div className="text-sm text-gray-600">Ready to Retry</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{queueStatus?.pendingRetry || 0}</div>
            <div className="text-sm text-gray-600">Pending Retry</div>
          </div>
        </div>
      </Card>

      {/* Error Trends */}
      <Card title="Error Trends" subtitle="Top errors by frequency">
        {errorStats?.errorsByCode && errorStats.errorsByCode.length > 0 ? (
          <div className="space-y-3">
            {errorStats.errorsByCode.slice(0, 5).map((error: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-semibold">{error.code}</div>
                  <div className="text-xs text-gray-500">Last: {new Date(error.lastOccurred).toLocaleTimeString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-red-500 h-full"
                      style={{ width: `${Math.min((error.count / errorStats.totalErrors) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="font-bold w-12 text-right">{error.count}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No errors recorded</p>
        )}
      </Card>

      {/* Dead Letter Queue */}
      <Card title="Dead Letter Queue" subtitle="Items that exhausted retries">
        {dlqItems.length > 0 ? (
          <div>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {dlqItems.map((item: any) => (
                <div
                  key={item.id}
                  className="p-3 bg-red-50 border-l-4 border-red-500 rounded flex justify-between items-start cursor-pointer"
                  onClick={() => setSelectedError(item)}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-red-700">{item.error.code}</div>
                    <div className="text-sm text-gray-600">{item.error.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Record: {item.error.recordId} | Attempts: {item.failureCount}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromDlq(item.id);
                    }}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={retryAll} variant="primary">
                <RefreshCw size={18} /> Retry All ({dlqItems.length})
              </Button>
              <Button onClick={() => pipelineErrorRecoveryService.clearStatistics()} variant="secondary">
                Clear Statistics
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-2 text-green-500" />
            <p>No items in Dead Letter Queue</p>
          </div>
        )}
      </Card>

      {/* Retry Policy Configuration */}
      <Card title="Retry Policy" subtitle="Configure automatic retry behavior">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Max Retries</label>
            <input
              type="number"
              value={retryPolicy.maxRetries}
              onChange={(e) => updateRetryPolicy('maxRetries', parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Initial Delay (ms)</label>
            <input
              type="number"
              value={retryPolicy.initialDelayMs}
              onChange={(e) => updateRetryPolicy('initialDelayMs', parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Backoff Multiplier</label>
            <input
              type="number"
              step="0.5"
              value={retryPolicy.backoffMultiplier}
              onChange={(e) => updateRetryPolicy('backoffMultiplier', parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Delay (ms)</label>
            <input
              type="number"
              value={retryPolicy.maxDelayMs}
              onChange={(e) => updateRetryPolicy('maxDelayMs', parseInt(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <strong>Retry Schedule:</strong> Retries will happen at 1s, 2s, 4s delays (with {retryPolicy.backoffMultiplier}x backoff)
        </div>
      </Card>

      {/* Error Details */}
      {selectedError && (
        <Card title="Error Details" subtitle={selectedError.error.code}>
          <div className="space-y-3">
            <div>
              <strong>Record ID:</strong> {selectedError.error.recordId}
            </div>
            <div>
              <strong>Message:</strong> {selectedError.error.message}
            </div>
            <div>
              <strong>Stage:</strong> {selectedError.error.stage}
            </div>
            <div>
              <strong>Attempts:</strong> {selectedError.failureCount}
            </div>
            <div>
              <strong>First Failure:</strong> {new Date(selectedError.firstFailedAt).toLocaleString()}
            </div>
            <div>
              <strong>Last Failure:</strong> {new Date(selectedError.lastFailedAt).toLocaleString()}
            </div>
            {selectedError.record && (
              <div>
                <strong>Record Data:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(selectedError.record.data, null, 2)}
                </pre>
              </div>
            )}
            <Button onClick={() => setSelectedError(null)} variant="secondary">
              Close
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ErrorRecoveryDashboard;
