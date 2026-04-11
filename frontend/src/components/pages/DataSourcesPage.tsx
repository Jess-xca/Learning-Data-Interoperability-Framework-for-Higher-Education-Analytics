/**
 * Data Sources Page (M3)
 * Main management dashboard for configuring and monitoring data source connections
 */

import { useState, useEffect } from "react";
import { MainContent, Card, DataSourceWizard } from "..";
import { Plus, RefreshCw, CheckCircle2, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { dataSourceService } from "../../services/DataSourceService";
import type { DataSource as DataSourceType } from "../../types/datasources";

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<DataSourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWizard, setShowAddWizard] = useState(false);

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    setLoading(true);
    let sources = dataSourceService.getAllDataSources();
    
    // Load sample data if no sources exist
    if (sources.length === 0) {
      dataSourceService.createSampleDataSources();
      sources = dataSourceService.getAllDataSources();
    }
    
    setDataSources(sources);
    setLoading(false);
  };

  const handleTestConnection = async (sourceId: string) => {
    const result = await dataSourceService.testConnection(sourceId);
    if (result.success) {
      await loadDataSources();
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Connection test failed: ${result.message}`);
    }
  };

  const handleSyncNow = async (sourceId: string) => {
    const result = await dataSourceService.syncNow(sourceId);
    if (result.success) {
      await loadDataSources();
      alert(`✅ ${result.message}`);
    } else {
      alert(`❌ Sync failed: ${result.message}`);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (confirm("Are you sure you want to delete this data source?")) {
      const success = await dataSourceService.deleteDataSource(sourceId);
      if (success) {
        await loadDataSources();
        alert("✅ Data source deleted");
      }
    }
  };

  const stats = dataSourceService.getStatistics();

  const getStatusBg = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-yellow-50";
    }
  };

  return (
    <MainContent>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest mb-2">
              DATA MANAGEMENT - PHASE 3
            </p>
            <h1 className="text-4xl font-black text-[#002045] tracking-tight">Data Sources</h1>
            <p className="text-sm text-[#1a365d] font-medium mt-2">
              Connect and manage learning management systems, student information systems, and other data sources.
            </p>
          </div>
          <button
            onClick={() => setShowAddWizard(true)}
            className="px-6 py-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] text-white rounded-lg font-bold text-xs hover:shadow-lg transition-all h-fit whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Data Source
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 border-l-4 border-blue-500">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Sources</p>
            <p className="text-3xl font-black text-slate-700">{stats.totalSources}</p>
          </Card>
          <Card className="p-4 border-l-4 border-green-500">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Connected</p>
            <p className="text-3xl font-black text-green-600">{stats.connectedSources}</p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Errors</p>
            <p className="text-3xl font-black text-red-600">{stats.errorSources}</p>
          </Card>
          <Card className="p-4 border-l-4 border-purple-500">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Total Students</p>
            <p className="text-3xl font-black text-purple-600">{stats.totalRecords.students}</p>
          </Card>
        </div>

        {/* Data Sources Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-700">Connected Sources</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-slate-500">Loading data sources...</p>
            </div>
          ) : dataSources.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-500 mb-4">No data sources configured yet</p>
              <button
                onClick={() => setShowAddWizard(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all"
              >
                Add Your First Source
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Last Sync</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSources.map((source) => (
                    <tr
                      key={source.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-700">{source.name}</p>
                          <p className="text-xs text-slate-500">{source.organization}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                          {source.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusBg(source.status)} ${source.status === "connected" ? "text-green-600" : "text-red-600"}`}>
                          {source.status === "connected" ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Connected
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4" />
                              {source.status}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-700">
                          {source.recordCounts.students.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {source.lastSync
                          ? new Date(source.lastSync).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTestConnection(source.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Test Connection"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSyncNow(source.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Sync Now"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {}}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add Source Wizard */}
        {showAddWizard && (
          <DataSourceWizard
            onComplete={async (wizardData) => {
              try {
                const source = await dataSourceService.addDataSource({
                  type: wizardData.sourceType,
                  name: wizardData.name,
                  url: wizardData.url,
                  organization: wizardData.organization,
                  contactEmail: wizardData.contactEmail,
                  credentials: {
                    username: wizardData.username,
                    password: wizardData.password,
                  },
                });
                await loadDataSources();
                setShowAddWizard(false);
                alert(`✅ Successfully added ${source.name}`);
              } catch (error) {
                alert(`❌ Error adding data source: ${error}`);
              }
            }}
            onCancel={() => setShowAddWizard(false)}
          />
        )}
      </div>
    </MainContent>
  );
}
