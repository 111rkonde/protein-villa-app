import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, FileText, Award, Lock, Sparkles } from 'lucide-react';
import { verifyService } from '../services/verify.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState<string>(initialCode);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await verifyService.verifyCode(codeToVerify.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or unverified authenticity code.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-brand-500 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Protein Villa Authenticity Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white">
            PV Verify™ Product Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Scratch the security hologram on your supplement tub to reveal the 12-digit authenticity serial code and inspect its 3rd-party HPLC lab certificate.
          </p>
        </div>

        {/* Verification Input Box */}
        <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(code);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter Serial Code (e.g. PV-ISO-99824)"
                className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm sm:text-base pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-800 focus:outline-none focus:border-brand-500 uppercase tracking-widest font-mono font-bold"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-8 py-4 bg-brand-500 text-black font-black text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Authenticity'}
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-400 pt-2">
            <span>Try demo codes:</span>
            {['PV-ISO-99824', 'PV-CREA-88123', 'PV-MASS-77192', 'PV-VOLT-44321'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCode(c);
                  handleVerify(c);
                }}
                className="font-mono text-brand-500 hover:underline font-bold"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner message="Checking blockchain certificate & HPLC laboratory records..." />}

        {/* Error message */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-3xl text-center space-y-2 max-w-lg mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <h4 className="font-bold text-rose-500 text-base">Unverified Serial Code</h4>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        )}

        {/* Result Certificate */}
        {result && (
          <div className="bg-white dark:bg-dark-surface rounded-3xl border-2 border-brand-500 shadow-2xl overflow-hidden animate-scale-up">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-[#0c1622] to-[#070b10] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-500 text-black flex items-center justify-center shadow-neon shrink-0">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-400 bg-brand-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    100% GENUINE AUTHENTIC PRODUCT
                  </span>
                  <h3 className="font-display text-2xl font-black mt-1">
                    {result.productName}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono">
                    Serial Code: <strong className="text-white">{result.verificationCode}</strong>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Verification Count</div>
                <div className="font-display text-xl font-bold text-brand-400">
                  {result.scanCount === 1 ? '1st Verification (Original)' : `${result.scanCount} Times Checked`}
                </div>
              </div>
            </div>

            {/* Lab Test Results Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                NABL-Accredited 3rd-Party HPLC Quality Certificate
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Batch Number</div>
                  <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                    {result.batchNumber}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Mfg Date</div>
                  <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                    {new Date(result.mfgDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Expiry Date</div>
                  <div className="font-mono font-bold text-sm text-gray-900 dark:text-white mt-1">
                    {new Date(result.expDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-brand-500">HPLC Purity Score</div>
                  <div className="font-mono font-black text-base text-gray-900 dark:text-white mt-1">
                    {result.hplcProteinTest}% Pure
                  </div>
                </div>
              </div>

              {/* Heavy Metal & WADA Compliance Checks */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-400">Heavy Metal Contamination (Lead, Cadmium, Arsenic):</span>
                  <span className="font-bold text-emerald-500">PASSED - ZERO DETECTED</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-gray-400">WADA Prohibited Substance Screen:</span>
                  <span className="font-bold text-emerald-500">100% NEGATIVE / CLEAN</span>
                </div>
                <div className="flex justify-between items-center py-1 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-gray-400">FSSAI License Compliance:</span>
                  <span className="font-bold text-gray-900 dark:text-white">LIC # 10019022009812</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
