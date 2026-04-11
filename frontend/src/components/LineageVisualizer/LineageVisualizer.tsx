import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../common';
import { ArrowRight, Eye, EyeOff, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { dataLineageTracker } from '../../services/DataLineageTracker';

interface LineageNode {
  id: string;
  stage: string;
  timestamp: number;
  data: any;
  transformation?: any;
}

interface LineageVisualizationProps {
  recordId?: string;
  showQuality?: boolean;
}

export const LineageVisualizer: React.FC<LineageVisualizationProps> = ({
  recordId,
  showQuality = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lineageData, setLineageData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showNodeData, setShowNodeData] = useState<{ [key: string]: boolean }>({});
  const [timeline, setTimeline] = useState<LineageNode[]>([]);

  useEffect(() => {
    if (recordId) {
      const history = dataLineageTracker.traceRecordHistory(recordId);
      if (history) {
        setTimeline(history.transformations);
        setLineageData(history);
        drawLineage(history.transformations);
      }
    }
  }, [recordId]);

  const drawLineage = (transformations: LineageNode[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw nodes and connections
    const nodeWidth = 120;
    const nodeHeight = 80;
    const spacing = 160;
    const startY = canvas.height / 2;

    transformations.forEach((node, idx) => {
      const x = 40 + idx * spacing;
      const y = startY;

      // Draw connection line
      if (idx > 0) {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - spacing + nodeWidth, y);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw arrow
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 10, y - 5);
        ctx.lineTo(x - 10, y + 5);
        ctx.fill();
      }

      // Draw node box
      const isSelected = selectedNode?.id === node.id;
      ctx.fillStyle = isSelected ? '#3b82f6' : '#e2e8f0';
      ctx.strokeStyle = isSelected ? '#1e40af' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y - nodeHeight / 2, nodeWidth, nodeHeight);
      ctx.strokeRect(x, y - nodeHeight / 2, nodeWidth, nodeHeight);

      // Draw text
      ctx.fillStyle = isSelected ? '#ffffff' : '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';

      const lines = node.stage.split('_');
      let textY = y - 15;
      lines.forEach((line) => {
        ctx.fillText(line, x + nodeWidth / 2, textY);
        textY += 15;
      });

      // Store node position for click detection
      (node as any).canvasX = x;
      (node as any).canvasY = y - nodeHeight / 2;
      (node as any).canvasWidth = nodeWidth;
      (node as any).canvasHeight = nodeHeight;
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = timeline.find((node) => {
      const nx = (node as any).canvasX;
      const ny = (node as any).canvasY;
      const nw = (node as any).canvasWidth;
      const nh = (node as any).canvasHeight;
      return x >= nx && x <= nx + nw && y >= ny && y <= ny + nh;
    });

    if (clicked) {
      setSelectedNode(clicked);
    }
  };

  const downloadLineage = () => {
    if (!lineageData) return;
    const json = JSON.stringify(lineageData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lineage-${recordId || 'export'}.json`;
    a.click();
  };

  const getQualityTrend = () => {
    if (!lineageData?.stats?.qualityProgression) return null;
    const qualities = lineageData.stats.qualityProgression;
    return qualities[qualities.length - 1];
  };

  return (
    <div className="space-y-6">
      {/* Canvas Visualization */}
      <Card title="Data Lineage Graph" subtitle="Record journey through pipeline stages">
        <div className="bg-gray-50 rounded border overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            onClick={handleCanvasClick}
            className="cursor-pointer"
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="p-2 border rounded hover:bg-gray-100"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))}
            className="p-2 border rounded hover:bg-gray-100"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={downloadLineage}
            className="p-2 border rounded hover:bg-gray-100 flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>
          <div className="ml-auto text-sm text-gray-600 my-auto">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card title="Transformation Timeline" subtitle={`${timeline.length} stages`}>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {timeline.map((node, idx) => (
            <div key={node.id}>
              <div
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedNode?.id === node.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-bold text-blue-600 text-sm">
                      {idx + 1}.
                    </span>
                    <div>
                      <div className="font-semibold">{node.stage}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(node.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNodeData((prev) => ({
                        ...prev,
                        [node.id]: !prev[node.id],
                      }));
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showNodeData[node.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {showNodeData[node.id] && (
                  <div className="mt-2 p-2 bg-white rounded text-xs border">
                    <div>
                      <strong>Input Data:</strong>
                      <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(node.data, null, 2)}
                      </pre>
                    </div>
                    {node.transformation && (
                      <div>
                        <strong>Transformation:</strong>
                        <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                          {JSON.stringify(node.transformation, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {idx < timeline.length - 1 && (
                <div className="flex justify-center text-gray-400 py-1">
                  <ArrowRight size={16} className="transform rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quality Progression */}
      {showQuality && lineageData?.stats?.qualityProgression && (
        <Card title="Quality Progression" subtitle="Quality score evolution through pipeline">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {lineageData.stats.qualityProgression.map((quality: number, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-600 mb-1">Stage {idx + 1}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(quality * 100).toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{ width: `${quality * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {lineageData?.stats && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <strong>Initial:</strong> {lineageData.stats.qualityProgression[0]?.toFixed(3)}
                </div>
                <div>
                  <strong>Final:</strong>{' '}
                  {lineageData.stats.qualityProgression[
                    lineageData.stats.qualityProgression.length - 1
                  ]?.toFixed(3)}
                </div>
                <div>
                  <strong>Improvement:</strong>{' '}
                  {(
                    (lineageData.stats.qualityProgression[lineageData.stats.qualityProgression.length - 1] -
                      lineageData.stats.qualityProgression[0]) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div>
                  <strong>Stages:</strong> {lineageData.stats.qualityProgression.length}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Node Details */}
      {selectedNode && (
        <Card title="Node Details" subtitle={selectedNode.stage}>
          <div className="space-y-3">
            <div>
              <strong>Stage ID:</strong> {selectedNode.id}
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date(selectedNode.timestamp).toLocaleString()}
            </div>
            <div>
              <strong>Data:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                {JSON.stringify(selectedNode.data, null, 2)}
              </pre>
            </div>
            {selectedNode.transformation && (
              <div>
                <strong>Applied Transformation:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                  {JSON.stringify(selectedNode.transformation, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LineageVisualizer;
