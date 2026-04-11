import React from 'react';
import { Card } from '../common';

export const ErrorRecoveryDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-2">Error Recovery Dashboard</h2>
        <p className="text-gray-600">Real-time error monitoring and recovery</p>
      </Card>
    </div>
  );
};

export default ErrorRecoveryDashboard;

          </div>
        </div>
      </Card>

    </div>
  );
};

export default ErrorRecoveryDashboard;

      <Card>
        <div>
          <h2 className="text-2xl font-bold mb-1">Error Trends</h2>
          <p className="text-gray-600 text-sm mb-4">Top errors by frequency</p>
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
        </div>
      </Card>

      <Card>
        <div>
          <h2 className="text-2xl font-bold mb-1">Dead Letter Queue</h2>
          <p className="text-gray-600 text-sm mb-4">Items that exhausted retries</p>
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
        </div>
      </Card>

      <Card>
        <div>
          <h2 className="text-2xl font-bold mb-1">Retry Policy</h2>
          <p className="text-gray-600 text-sm mb-4">Configure automatic retry behavior</p>
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
        </div>
      </Card>

      {selectedError && (
        <Card>
          <div>
            <h2 className="text-2xl font-bold mb-1">Error Details</h2>
            <p className="text-gray-600 text-sm mb-4">{selectedError.error.code}</p>
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
