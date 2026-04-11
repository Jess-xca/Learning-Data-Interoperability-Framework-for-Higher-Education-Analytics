import React from 'react';
import { Card } from '../common';

export const PipelineDesigner: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-2">Pipeline Designer</h2>
        <p className="text-gray-600">Visual rule builder for transformation pipelines</p>
        <p className="text-sm text-gray-500 mt-4">Build transformation rules with 6 different operation types: concat, split, format, lookup, custom, conditional...</p>
      </Card>
    </div>
  );
};

export default PipelineDesigner;

interface RuleConfig {
  type: 'concat' | 'split' | 'format' | 'lookup' | 'custom' | 'conditional';
  sourceFields: string[];
  targetField: string;
  config: Record<string, any>;
}

const RULE_TYPES = [
  { value: 'concat', label: 'Concatenate', icon: '📝', description: 'Join multiple fields' },
  { value: 'split', label: 'Split', icon: '✂️', description: 'Split field into multiple' },
  { value: 'format', label: 'Format', icon: '📋', description: 'Apply template' },
  { value: 'lookup', label: 'Lookup', icon: '🔍', description: 'Map values' },
  { value: 'custom', label: 'Custom', icon: '⚙️', description: 'Custom function' },
  { value: 'conditional', label: 'Conditional', icon: '❓', description: 'If-then-else' },
];

export const PipelineDesigner: React.FC = () => {
  const [rules, setRules] = useState<RuleConfig[]>([]);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showRuleCreator, setShowRuleCreator] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const addRule = (type: string) => {
    const newRule: RuleConfig = {
      type: type as any,
      sourceFields: [],
      targetField: '',
      config: {},
    };
    setRules([...rules, newRule]);
    setShowRuleCreator(false);
  };

  const updateRule = (index: number, rule: RuleConfig) => {
    const updated = [...rules];
    updated[index] = rule;
    setRules(updated);
  };

  const deleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const duplicateRule = (index: number) => {
    setRules([...rules, { ...rules[index] }]);
  };

  const testRules = async () => {
    const mockRecord = {
      id: 'test_rec',
      sourceId: 'test',
      timestamp: new Date(),
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@uni.edu',
        grade: 85,
        status: 'Active',
      },
      lineage: { source: 'test', transformations: [], validations: [] },
      quality: { score: 100, issues: [] },
    };

    const result = await transformationRulesEngine.transformBatch([mockRecord], rules.map(r => ({
      id: `rule_${Math.random()}`,
      name: `${r.type}_rule`,
      ...r,
    } as any)));

    setPreviewData(result.records[0]?.data);
  };

  const renderRuleConfig = (rule: RuleConfig, index: number) => {
    return (
      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRule(expandedRule === index ? null : index)}>
          <div className="flex items-center gap-2">
            <span>{RULE_TYPES.find(t => t.value === rule.type)?.icon}</span>
            <span className="font-semibold">{rule.type.toUpperCase()}</span>
            <span className="text-sm text-gray-600">
              {rule.sourceFields.join(', ')} → {rule.targetField}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); duplicateRule(index); }} className="text-blue-500 hover:text-blue-700">
              <Copy size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); deleteRule(index); }} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
            {expandedRule === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {expandedRule === index && (
          <div className="mt-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Source Fields</label>
                <input
                  type="text"
                  placeholder="Field names (comma-separated)"
                  value={rule.sourceFields.join(', ')}
                  onChange={(e) => updateRule(index, { ...rule, sourceFields: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Field</label>
                <input
                  type="text"
                  placeholder="Output field name"
                  value={rule.targetField}
                  onChange={(e) => updateRule(index, { ...rule, targetField: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            {rule.type === 'concat' && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Separator</label>
                <input
                  type="text"
                  placeholder=" "
                  value={rule.config.separator || ' '}
                  onChange={(e) => updateRule(index, { ...rule, config: { ...rule.config, separator: e.target.value } })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            )}

            {rule.type === 'split' && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Delimiter</label>
                <input
                  type="text"
                  placeholder=","
                  value={rule.config.delimiter || ','}
                  onChange={(e) => updateRule(index, { ...rule, config: { ...rule.config, delimiter: e.target.value } })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            )}

            {rule.type === 'format' && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Template</label>
                <input
                  type="text"
                  placeholder="{firstName} {lastName}"
                  value={rule.config.template || ''}
                  onChange={(e) => updateRule(index, { ...rule, config: { ...rule.config, template: e.target.value } })}
                  className="w-full border rounded px-3 py-2 text-sm font-mono"
                />
              </div>
            )}

            {rule.type === 'lookup' && (
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">Lookup Table (JSON)</label>
                <textarea
                  placeholder='{"90": "A", "80": "B"}'
                  value={JSON.stringify(rule.config.lookupTable || {})}
                  onChange={(e) => {
                    try {
                      updateRule(index, { ...rule, config: { ...rule.config, lookupTable: JSON.parse(e.target.value) } });
                    } catch { }
                  }}
                  className="w-full border rounded px-3 py-2 text-sm font-mono"
                  rows={3}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card title="Pipeline Designer" subtitle="Build transformation rules visually">
        <div className="space-y-4">
          {/* Rules List */}
          <div>
            <h3 className="font-semibold mb-3">Transformation Rules</h3>
            {rules.length > 0 ? (
              rules.map((rule, idx) => renderRuleConfig(rule, idx))
            ) : (
              <p className="text-gray-500 text-center py-6">No rules yet. Add one to get started.</p>
            )}
          </div>

          {/* Add Rule */}
          <div className="border-t pt-4">
            {!showRuleCreator ? (
              <Button onClick={() => setShowRuleCreator(true)} variant="primary">
                <Plus size={18} /> Add Rule
              </Button>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {RULE_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => addRule(type.value)}
                    className="p-3 border rounded-lg hover:bg-blue-50 text-left"
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Test & Preview */}
          <div className="border-t pt-4">
            <Button onClick={testRules} variant="secondary">
              Test Rules
            </Button>
            {previewData && (
              <div className="mt-3 bg-gray-100 rounded p-3 font-mono text-sm overflow-auto max-h-48">
                <pre>{JSON.stringify(previewData, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="border-t pt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-2xl font-bold">{rules.length}</div>
              <div className="text-xs text-gray-600">Rules</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold">{transformationRulesEngine.getStatistics().customFunctions}</div>
              <div className="text-xs text-gray-600">Functions</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-2xl font-bold">Ready</div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PipelineDesigner;
