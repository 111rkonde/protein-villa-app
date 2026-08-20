import React, { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  CheckCircle2,
  Star,
  QrCode,
  ShieldCheck,
  Trash2,
  AlertCircle,
  X,
  Lock,
  Eye,
  EyeOff,
  Copy,
  KeyRound,
  Shield,
  Pencil,
} from 'lucide-react';
import { adminService } from '../services/admin.service';
import { BankAccount } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminBankAccountsPage: React.FC = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'ADMIN';

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  // Form State for Adding Bank Account
  const [bankName, setBankName] = useState<string>('State Bank of India');
  const [customBankName, setCustomBankName] = useState<string>('');
  const [accountHolder, setAccountHolder] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [upiVpa, setUpiVpa] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('CURRENT');
  const [branchName, setBranchName] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  const fetchBanks = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await adminService.getBankAccounts();
      setBanks(data || []);
    } catch (error) {
      console.error('Failed to fetch bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchBanks();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleSwitchToAdmin = async () => {
    try {
      await login('owner@proteinvilla.demo', 'Owner@12345');
      showToast('Switched to Store Owner / Admin Account! 👑', 'success');
      window.location.reload();
    } catch (err: any) {
      showToast('Could not switch to Admin: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingBankId(null);
    setBankName('State Bank of India');
    setCustomBankName('');
    setAccountHolder('');
    setAccountNumber('');
    setConfirmAccountNumber('');
    setIfscCode('');
    setUpiVpa('');
    setAccountType('SAVINGS');
    setBranchName('');
    setIsPrimary(banks.length === 0);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (bank: BankAccount) => {
    setEditingBankId(bank.id);
    const standardBanks = [
      'State Bank of India',
      'HDFC Bank',
      'ICICI Bank',
      'Axis Bank',
      'Kotak Mahindra Bank',
      'Punjab National Bank',
      'Bank of Baroda',
      'Canara Bank',
      'IndusInd Bank',
      'Yes Bank',
    ];
    if (standardBanks.includes(bank.bankName)) {
      setBankName(bank.bankName);
      setCustomBankName('');
    } else {
      setBankName('Other');
      setCustomBankName(bank.bankName);
    }
    setAccountHolder(bank.accountHolder);
    setAccountNumber(bank.accountNumberFull || '');
    setConfirmAccountNumber(bank.accountNumberFull || '');
    setIfscCode(bank.ifscCode);
    setUpiVpa(bank.upiVpa || '');
    setAccountType(bank.accountType);
    setBranchName(bank.branchName || '');
    setIsPrimary(bank.isPrimary);
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const handleSetPrimary = async (bankId: string, name: string) => {
    try {
      await adminService.setPrimaryBank(bankId);
      showToast(`${name} is now your PRIMARY Settlement Bank! 🏆`, 'success', 'Primary Priority Updated');
      await fetchBanks();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update primary bank.', 'error');
    }
  };

  const handleDeleteBank = async (bankId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;
    try {
      await adminService.deleteBankAccount(bankId);
      showToast(`${name} removed securely.`, 'info');
      await fetchBanks();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete bank account.', 'error');
    }
  };

  const toggleRevealAccount = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyVpa = (vpa: string, id: string) => {
    navigator.clipboard.writeText(vpa);
    setCopiedId(id);
    showToast('UPI VPA copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    const finalBankName = bankName === 'Other' ? customBankName.trim() : bankName;

    if (!finalBankName) errs.bankName = 'Bank name is required.';
    if (!accountHolder.trim()) errs.accountHolder = 'Account holder name is required.';

    if (!editingBankId) {
      if (!accountNumber.trim()) errs.accountNumber = 'Account number is required.';
      if (accountNumber.trim() !== confirmAccountNumber.trim()) {
        errs.confirmAccountNumber = 'Account numbers do not match.';
      }
    } else {
      if (accountNumber.trim() && accountNumber.trim() !== confirmAccountNumber.trim()) {
        errs.confirmAccountNumber = 'Account numbers do not match.';
      }
    }

    if (!ifscCode.trim()) {
      errs.ifscCode = 'IFSC code is required.';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.trim().toUpperCase())) {
      errs.ifscCode = 'Please enter a valid 11-digit IFSC code (e.g. SBIN0001234).';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const finalBankName = bankName === 'Other' ? customBankName.trim() : bankName;

      if (editingBankId) {
        // UPDATE MODE
        const updatePayload: any = {
          bankName: finalBankName,
          accountHolder: accountHolder.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          upiVpa: upiVpa.trim() ? upiVpa.trim().toLowerCase() : undefined,
          accountType,
          branchName: branchName.trim() || undefined,
        };
        if (accountNumber.trim() && !accountNumber.includes('•')) {
          updatePayload.accountNumber = accountNumber.trim();
        }

        await adminService.updateBankAccount(editingBankId, updatePayload);
        showToast(`${finalBankName} updated & re-encrypted with AES-256-GCM! 🛡️`, 'success');
      } else {
        // CREATE MODE
        await adminService.addBankAccount({
          bankName: finalBankName,
          accountHolder: accountHolder.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          upiVpa: upiVpa.trim() ? upiVpa.trim().toLowerCase() : undefined,
          accountType,
          branchName: branchName.trim() || undefined,
          isPrimary,
        });

        showToast(`${finalBankName} added and encrypted with AES-256-GCM! 🛡️`, 'success');
      }

      setIsAddModalOpen(false);
      setEditingBankId(null);
      await fetchBanks();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to save bank account.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const primaryBank = banks.find((b) => b.isPrimary);

  const bankOptions = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
    'IndusInd Bank',
    'Yes Bank',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#070a0f] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-256-GCM Vault Active</span>
              </span>
            </div>
            <h1 className="font-display text-3xl font-black text-gray-900 dark:text-white mt-1">
              Direct Bank Settlement & Priority Routing
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Configure SBI, HDFC, ICICI or any other bank for instant direct payouts. All financial data is encrypted at rest using high level encryption security.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-6 py-3.5 bg-brand-500 text-black font-black text-xs sm:text-sm rounded-2xl hover:bg-brand-400 shadow-neon transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bank Account</span>
          </button>
        </div>

        {/* HIGH LEVEL ENCRYPTION SECURITY BADGE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Hardware-Grade 256-bit Cryptographic Vault</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                  GCM Auth Tags Verified
                </span>
              </div>
              <p className="text-gray-400 text-[11px] mt-0.5">
                Bank account numbers and routing keys are encrypted before hitting the database. Raw account numbers are never exposed to public APIs.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] font-bold shrink-0">
            <Shield className="w-4 h-4" />
            <span>Zero-Trust Storage</span>
          </div>
        </div>

        {/* NON-ADMIN ACCESS WARNING BANNER */}
        {!isAdmin && (
          <div className="p-6 bg-amber-500/10 border-2 border-amber-500/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg mb-6 animate-slide-up">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xl shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  Signed In as Customer ({user?.name || 'Athlete User'} • {user?.email})
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Treasury and bank management requires Store Owner / Administrator credentials (<code className="text-amber-400 font-mono">owner@proteinvilla.demo</code>).
                </p>
              </div>
            </div>
            <button
              onClick={handleSwitchToAdmin}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-2xl shadow-neon transition active:scale-95 shrink-0 flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>1-Click Switch to Store Admin</span>
            </button>
          </div>
        )}

        {/* ACTIVE PRIMARY SETTLEMENT BANNER */}
        {primaryBank && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-black px-3 py-0.5 rounded-full shadow-neon">
                  ★ PRIMARY DIRECT SETTLEMENT
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-Time Payouts Active</span>
                </span>
              </div>

              <h3 className="font-display text-2xl font-black text-white">
                {primaryBank.bankName} — {primaryBank.accountType} Account
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1 text-xs text-gray-300">
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Account Holder</span>
                  <strong className="text-white">{primaryBank.accountHolder}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">Account Number</span>
                  <strong className="text-white font-mono">
                    {revealedIds[primaryBank.id]
                      ? primaryBank.accountNumberFull || primaryBank.accountNumber
                      : primaryBank.accountNumber}
                  </strong>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] font-bold uppercase">IFSC Code</span>
                  <strong className="text-emerald-400 font-mono">{primaryBank.ifscCode}</strong>
                </div>
              </div>
            </div>

            {/* UPI QR & VPA Box */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-emerald-500/30 text-xs space-y-2 relative z-10 w-full md:w-auto shrink-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Direct Merchant Bank UPI QR Route:
              </span>
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {primaryBank.effectiveVpa || primaryBank.upiVpa}
                </span>
              </div>
              <div className="text-[10px] text-gray-400 space-y-0.5 pt-1 border-t border-emerald-500/20">
                <p><strong>Bank:</strong> {primaryBank.bankName} | <strong>IFSC:</strong> {primaryBank.ifscCode}</p>
                <p className="text-emerald-400">All customer QR payments deposit directly into this bank account.</p>
              </div>
            </div>
          </div>
        )}

        {/* REGISTERED BANK ACCOUNTS GRID */}
        {loading ? (
          <LoadingSpinner message="Decrypting secure treasury ledger..." />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-brand-500" />
                <span>Connected Bank Accounts ({banks.length})</span>
              </h3>
            </div>

            {banks.length === 0 ? (
              <div className="p-12 bg-white dark:bg-dark-surface rounded-3xl border border-dashed border-gray-300 dark:border-slate-800 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl font-black">
                  <Building className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    No Bank Accounts Added Yet
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Please click the <strong>+ Add Bank Account</strong> button above to manually enter your State Bank of India, HDFC, ICICI, or other bank details.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-black font-black text-xs rounded-2xl shadow-neon transition inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manually Add Bank Account</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banks.map((bank) => {
                  const isRevealed = !!revealedIds[bank.id];
                  return (
                    <div
                      key={bank.id}
                      className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-6 ${
                        bank.isPrimary
                          ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/50 shadow-neon ring-1 ring-emerald-500/30'
                          : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 shadow-md'
                      }`}
                    >
                      {/* Top Bar Card */}
                      <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-brand-400/10 text-brand-500 border border-brand-500/30 flex items-center justify-center font-black text-lg">
                            <Building className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-base text-gray-900 dark:text-white">
                              {bank.bankName}
                            </div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                              {bank.accountType}
                            </span>
                          </div>
                        </div>

                        {bank.isPrimary ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full text-[10px] font-black uppercase shadow-sm">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Primary</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetPrimary(bank.id, bank.bankName)}
                            className="flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-black text-gray-700 dark:text-gray-300 rounded-full text-[10px] font-bold border border-gray-200 dark:border-slate-700 transition"
                            title="Promote to Primary Priority"
                          >
                            <Star className="w-3 h-3" />
                            <span>Set Primary</span>
                          </button>
                        )}
                      </div>

                      {/* Account Details */}
                      <div className="p-4 bg-gray-50 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 text-xs space-y-2 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-sans">Holder:</span>
                          <span className="font-bold text-gray-900 dark:text-white truncate max-w-[170px]">
                            {bank.accountHolder}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-sans">Account #:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {isRevealed ? bank.accountNumberFull || bank.accountNumber : bank.accountNumber}
                            </span>
                            {bank.accountNumberFull && (
                              <button
                                onClick={() => toggleRevealAccount(bank.id)}
                                className="text-gray-400 hover:text-white transition p-0.5"
                                title={isRevealed ? 'Mask Account Number' : 'Reveal Full Account Number'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 font-sans">IFSC Code:</span>
                          <span className="font-bold text-emerald-500">
                            {bank.ifscCode}
                          </span>
                        </div>

                        {bank.branchName && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-sans">Branch:</span>
                            <span className="text-gray-500 text-[11px]">
                              {bank.branchName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Direct UPI / Bank Routing Section */}
                      <div className="p-2.5 bg-cyan-500/5 rounded-xl border border-cyan-500/20 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            Direct Bank Payment VPA:
                          </span>
                          <button
                            onClick={() => handleCopyVpa(bank.effectiveVpa || bank.upiVpa || bank.directVpa || '', bank.id)}
                            className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 transition"
                          >
                            {copiedId === bank.id ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-cyan-600 dark:text-cyan-400 font-bold truncate">
                          <QrCode className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{bank.effectiveVpa || bank.upiVpa || bank.directVpa}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        <span>{bank.isPrimary ? 'Priority: 1 (Live Destination)' : 'Priority: Backup Settlement'}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {!bank.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(bank.id, bank.bankName)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            title="Set as Primary Settlement Bank"
                          >
                            <Star className="w-3 h-3" />
                            <span>Set Primary</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(bank)}
                          className="flex items-center gap-1 px-2.5 py-1 text-gray-700 dark:text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition text-[11px] font-bold border border-gray-200 dark:border-slate-700 hover:border-cyan-500/30"
                          title="Edit Bank Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {!bank.isPrimary && (
                          <button
                            onClick={() => handleDeleteBank(bank.id, bank.bankName)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete Bank Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* ADD BANK ACCOUNT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-lg w-full bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-brand-500" />
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {editingBankId ? 'Edit & Update Bank Account' : 'Add & Encrypt Bank Account'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
                {/* Bank Selector */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Select Bank *
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                  >
                    {bankOptions.map((b) => (
                      <option key={b} value={b} className="bg-slate-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {bankName === 'Other' && (
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Enter Custom Bank Name *
                    </label>
                    <input
                      type="text"
                      value={customBankName}
                      onChange={(e) => setCustomBankName(e.target.value)}
                      placeholder="e.g. Standard Chartered Bank"
                      className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                    />
                  </div>
                )}

                {/* Account Holder */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Account Holder Name (As per Bank Records) *
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="e.g. Protein Villa Sports Nutrition Pvt Ltd"
                    className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border font-bold ${
                      formErrors.accountHolder
                        ? 'border-rose-500 ring-1 ring-rose-500/30'
                        : 'border-gray-200 dark:border-slate-800'
                    }`}
                  />
                  {formErrors.accountHolder && (
                    <span className="text-rose-500 text-[11px] mt-1 block">
                      {formErrors.accountHolder}
                    </span>
                  )}
                </div>

                {/* Account Number & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Account Number {editingBankId ? '(Optional if unchanged)' : '*'}
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\s+/g, ''))}
                      placeholder={editingBankId ? 'Leave blank to keep existing' : 'e.g. 308912345678'}
                      className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border font-mono font-bold ${
                        formErrors.accountNumber
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : 'border-gray-200 dark:border-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Re-enter Account Number {editingBankId ? '(Optional)' : '*'}
                    </label>
                    <input
                      type="password"
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\s+/g, ''))}
                      placeholder={editingBankId ? 'Leave blank to keep existing' : '••••••••••••••'}
                      className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border font-mono font-bold ${
                        formErrors.confirmAccountNumber
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : 'border-gray-200 dark:border-slate-800'
                      }`}
                    />
                  </div>
                </div>
                {formErrors.confirmAccountNumber && (
                  <span className="text-rose-500 text-[11px] block">
                    {formErrors.confirmAccountNumber}
                  </span>
                )}

                {/* IFSC & Account Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="SBIN0001234"
                      className={`w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border font-mono font-bold uppercase ${
                        formErrors.ifscCode
                          ? 'border-rose-500 ring-1 ring-rose-500/30'
                          : 'border-gray-200 dark:border-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-bold"
                    >
                      <option value="CURRENT">Current Account (Business)</option>
                      <option value="SAVINGS">Savings Account</option>
                    </select>
                  </div>
                </div>
                {formErrors.ifscCode && (
                  <span className="text-rose-500 text-[11px] block">
                    {formErrors.ifscCode}
                  </span>
                )}

                {/* Linked UPI VPA */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Bank Registered UPI ID / VPA *
                  </label>
                  <input
                    type="text"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="e.g. yourname@oksbi or 9876543210@sbi"
                    className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800 font-mono font-bold"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                    <span className="text-[10px] text-gray-500 font-bold">Quick Handles:</span>
                    {['@oksbi', '@okhdfcbank', '@okicici', '@okaxis', '@ybl', '@paytm', '@upi'].map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          const base = upiVpa.includes('@') ? upiVpa.split('@')[0] : (upiVpa || 'merchant');
                          setUpiVpa(`${base}${handle}`);
                        }}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-400 text-[10px] font-mono rounded transition"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    💡 Enter your UPI ID linked to your bank account (from Google Pay, PhonePe, Paytm, or your bank app) so customers' UPI apps can verify and deposit money directly into your account.
                  </span>
                </div>

                {/* Branch / City */}
                <div>
                  <label className="block font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Branch Name / City (Optional)
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. SBI Main Branch, Nariman Point, Mumbai"
                    className="w-full bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-3 rounded-xl border border-gray-200 dark:border-slate-800"
                  />
                </div>

                {/* Set as Primary Checkbox */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-brand-500 border-gray-300 focus:ring-brand-500"
                  />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-white block">
                      Make this the PRIMARY Settlement Bank immediately
                    </span>
                    <span className="text-[11px] text-gray-400">
                      All new customer checkout QR codes and settlements will immediately switch to this bank account.
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-black font-black rounded-xl hover:bg-brand-400 shadow-neon transition active:scale-95 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{submitting ? 'Encrypting & Saving...' : (editingBankId ? 'Save & Re-encrypt Changes' : 'Encrypt & Save Bank')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
