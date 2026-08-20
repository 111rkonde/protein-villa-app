import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Radio,
  Building,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Settings2,
  RefreshCw,
  Lock,
  ArrowRight,
  ExternalLink,
  Info,
  Server,
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import { useToast } from '../context/ToastContext';

interface GatewayPlugin {
  id: string;
  name: string;
  provider: 'NATIVE_NPCI' | 'RAZORPAY' | 'PHONEPE' | 'CASHFREE' | 'PAYTM';
  description: string;
  icon: string;
  isActive: boolean;
  isZeroFee: boolean;
  environment: 'SANDBOX' | 'PRODUCTION';
  config: {
    merchantId?: string;
    apiKeyId?: string;
    apiKeySecret?: string;
    saltKey?: string;
    saltIndex?: string;
    webhookSecret?: string;
    customUpiVpa?: string;
    autoVerifyLedger?: boolean;
  };
  supportedApps: string[];
}

export const AdminPaymentGatewayPage: React.FC = () => {
  const { showToast } = useToast();
  const [plugins, setPlugins] = useState<GatewayPlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlugin, setSelectedPlugin] = useState<GatewayPlugin | null>(null);
  const [testingPluginId, setTestingPluginId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form Edit State
  const [envMode, setEnvMode] = useState<'SANDBOX' | 'PRODUCTION'>('PRODUCTION');
  const [merchantId, setMerchantId] = useState('');
  const [apiKeyId, setApiKeyId] = useState('');
  const [apiKeySecret, setApiKeySecret] = useState('');
  const [saltKey, setSaltKey] = useState('');
  const [saltIndex, setSaltIndex] = useState('1');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPlugins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGatewayPlugins();
      setPlugins(data);
    } catch (err: any) {
      showToast('Failed to load payment gateway plugins.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const handleActivate = async (plugin: GatewayPlugin) => {
    try {
      const res = await adminService.activateGatewayPlugin(plugin.id);
      showToast(
        `⚡ ${res.name || plugin.name} is now your ACTIVE checkout payment gateway!`,
        'success',
        'Gateway Activated'
      );
      fetchPlugins();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to activate gateway plugin.', 'error');
    }
  };

  const handleTestConnection = async (plugin: GatewayPlugin) => {
    setTestingPluginId(plugin.id);
    try {
      const res = await adminService.testGatewayPlugin(plugin.id);
      showToast(res.message, 'success', 'Gateway Test Passed');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Gateway handshake test failed.', 'error');
    } finally {
      setTestingPluginId(null);
    }
  };

  const openConfigModal = (plugin: GatewayPlugin) => {
    setSelectedPlugin(plugin);
    setEnvMode(plugin.environment || 'PRODUCTION');
    setMerchantId(plugin.config.merchantId || '');
    setApiKeyId(plugin.config.apiKeyId || '');
    setApiKeySecret(plugin.config.apiKeySecret || '');
    setSaltKey(plugin.config.saltKey || '');
    setSaltIndex(plugin.config.saltIndex || '1');
    setWebhookSecret(plugin.config.webhookSecret || '');
    setIsEditModalOpen(true);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlugin) return;

    try {
      setSaving(true);
      await adminService.updateGatewayPlugin(selectedPlugin.id, {
        environment: envMode,
        config: {
          merchantId: merchantId.trim(),
          apiKeyId: apiKeyId.trim(),
          apiKeySecret: apiKeySecret.trim(),
          saltKey: saltKey.trim(),
          saltIndex: saltIndex.trim(),
          webhookSecret: webhookSecret.trim(),
        },
      });

      showToast(`${selectedPlugin.name} configuration updated successfully!`, 'success');
      setIsEditModalOpen(false);
      fetchPlugins();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save plugin configuration.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getPluginIcon = (provider: string) => {
    switch (provider) {
      case 'NATIVE_NPCI':
        return <Building className="w-6 h-6 text-emerald-400" />;
      case 'RAZORPAY':
        return <Zap className="w-6 h-6 text-cyan-400" />;
      case 'PHONEPE':
        return <Smartphone className="w-6 h-6 text-purple-400" />;
      case 'CASHFREE':
        return <Radio className="w-6 h-6 text-amber-400" />;
      default:
        return <Server className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f18] text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                🔌 Gateway Integration Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Routing v2.6
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              UPI QR Payment Gateway Plugins
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Manage and configure instant UPI Dynamic QR payment gateways. Switch seamlessly between 0% Fee Native NPCI Bank Settlement and Commercial PG Aggregators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPlugins}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync Gateways
            </button>
          </div>
        </div>

        {/* Architecture Info Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Direct Native NPCI Bank QR (Recommended)
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  0% Fee • Zero Intermediary
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Customers scan the dynamic QR on Google Pay / PhonePe / Paytm. Money deposits directly into your primary registered bank account with 0% platform deductions.
              </p>
            </div>
          </div>
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className={`relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 ${
                plugin.isActive
                  ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Active Badge */}
              {plugin.isActive && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-[10px] tracking-wider uppercase rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                  ⚡ Active Gateway in Checkout
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl">
                      {getPluginIcon(plugin.provider)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{plugin.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-gray-400 uppercase">
                          {plugin.provider}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            plugin.environment === 'PRODUCTION'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {plugin.environment}
                        </span>
                      </div>
                    </div>
                  </div>

                  {plugin.isZeroFee && (
                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg uppercase">
                      0% Fee
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {plugin.description}
                </p>

                {/* Supported Apps */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Supported UPI Apps
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plugin.supportedApps.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 text-gray-300 text-[10px] font-medium rounded-md"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => openConfigModal(plugin)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Configure
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(plugin)}
                    disabled={testingPluginId === plugin.id}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 text-gray-400 hover:text-gray-200 text-xs font-bold rounded-xl transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingPluginId === plugin.id ? 'animate-spin' : ''}`} />
                    Test Ping
                  </button>

                  {!plugin.isActive ? (
                    <button
                      onClick={() => handleActivate(plugin)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs rounded-xl shadow-md transition"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Set Active
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {isEditModalOpen && selectedPlugin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 bg-slate-800 border border-slate-700 rounded-xl">
                  {getPluginIcon(selectedPlugin.provider)}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Configure {selectedPlugin.name}
                  </h3>
                  <span className="text-[11px] text-gray-400">
                    Vault encrypted credentials storage
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-lg p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Environment */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['PRODUCTION', 'SANDBOX'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEnvMode(mode)}
                      className={`py-2 px-3 rounded-xl font-bold border transition ${
                        envMode === mode
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-gray-400 hover:border-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Merchant ID */}
              {selectedPlugin.provider !== 'NATIVE_NPCI' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Merchant ID / Account MID
                  </label>
                  <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="e.g. rzp_merchant_9210 or PG_MID_1002"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              )}

              {/* API Key ID */}
              {(selectedPlugin.provider === 'RAZORPAY' || selectedPlugin.provider === 'CASHFREE') && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    API Key ID / App ID
                  </label>
                  <input
                    type="text"
                    value={apiKeyId}
                    onChange={(e) => setApiKeyId(e.target.value)}
                    placeholder="rzp_test_... or cf_app_..."
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              )}

              {/* API Key Secret */}
              {(selectedPlugin.provider === 'RAZORPAY' || selectedPlugin.provider === 'CASHFREE') && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    API Key Secret
                  </label>
                  <input
                    type="password"
                    value={apiKeySecret}
                    onChange={(e) => setApiKeySecret(e.target.value)}
                    placeholder="••••••••••••••••••••••••"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              )}

              {/* PhonePe Salt Key & Index */}
              {selectedPlugin.provider === 'PHONEPE' && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Salt Key
                    </label>
                    <input
                      type="password"
                      value={saltKey}
                      onChange={(e) => setSaltKey(e.target.value)}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Salt Index
                    </label>
                    <input
                      type="text"
                      value={saltIndex}
                      onChange={(e) => setSaltIndex(e.target.value)}
                      placeholder="1"
                      className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Webhook Secret */}
              {selectedPlugin.provider !== 'NATIVE_NPCI' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Webhook Signing Secret
                  </label>
                  <input
                    type="password"
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="whsec_••••••••••••••••"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              )}

              {/* Native NPCI details */}
              {selectedPlugin.provider === 'NATIVE_NPCI' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    Automatic Zero-Config Settlement
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    The Native NPCI Plugin automatically syncs with your Primary Bank Account set in Bank Settings (State Bank of India • SANGITA SATISH KONDE) to generate verified dynamic QR codes on checkout with ₹0 gateway commission fees.
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl shadow-lg transition"
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentGatewayPage;
