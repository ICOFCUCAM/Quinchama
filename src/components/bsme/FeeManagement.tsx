import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { formatCFA, getLevelLabel, getPaymentMethodLabel, PaymentMethod, FeeRecord } from '@/lib/schoolData';
import { Search, CreditCard, X, CheckCircle, Clock, AlertCircle, Receipt, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

const FeeManagement: React.FC = () => {
  const { language, feeRecords, recordPayment } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentModal, setPaymentModal] = useState<FeeRecord | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('mtn_momo');
  const [detailModal, setDetailModal] = useState<FeeRecord | null>(null);

  const filtered = useMemo(() => {
    return feeRecords.filter(f => {
      const matchSearch = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.studentId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [feeRecords, search, statusFilter]);

  const totalCollected = feeRecords.reduce((s, f) => s + f.paidAmount, 0);
  const totalPending = feeRecords.reduce((s, f) => s + f.balance, 0);
  const totalExpected = feeRecords.reduce((s, f) => s + f.totalAmount, 0);

  const handlePayment = () => {
    const amount = parseInt(payAmount);
    if (!amount || amount <= 0 || !paymentModal) {
      toast.error(language === 'en' ? 'Enter a valid amount' : 'Entrez un montant valide');
      return;
    }
    if (amount > paymentModal.balance) {
      toast.error(language === 'en' ? 'Amount exceeds balance' : 'Le montant dépasse le solde');
      return;
    }
    recordPayment(paymentModal.id, amount, payMethod);
    setPaymentModal(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('dash.fees', language)}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'Track and manage school fee payments' : 'Suivre et gérer les paiements des frais scolaires'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-blue-100">{language === 'en' ? 'Total Expected' : 'Total Attendu'}</p>
          <p className="text-2xl font-bold mt-1">{formatCFA(totalExpected)}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <p className="text-sm text-emerald-100">{language === 'en' ? 'Total Collected' : 'Total Collecté'}</p>
          <p className="text-2xl font-bold mt-1">{formatCFA(totalCollected)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl p-5 text-white">
          <p className="text-sm text-red-100">{language === 'en' ? 'Outstanding Balance' : 'Solde Impayé'}</p>
          <p className="text-2xl font-bold mt-1">{formatCFA(totalPending)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={language === 'en' ? 'Search by student name or ID...' : 'Rechercher par nom ou ID...'} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{t('common.all', language)}</option>
          <option value="paid">{language === 'en' ? 'Fully Paid' : 'Entièrement Payé'}</option>
          <option value="partial">{language === 'en' ? 'Partial' : 'Partiel'}</option>
          <option value="unpaid">{language === 'en' ? 'Unpaid' : 'Non Payé'}</option>
        </select>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('student.name', language)}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{t('student.level', language)}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('fee.total', language)}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t('fee.paid', language)}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('fee.balance', language)}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('fee.status', language)}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('student.actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(fee => (
                <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{fee.studentName}</p>
                    <p className="text-xs text-gray-400">{fee.studentId.slice(-8)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{getLevelLabel(fee.level, language)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">{formatCFA(fee.totalAmount)}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 font-medium text-right hidden sm:table-cell">{formatCFA(fee.paidAmount)}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">{formatCFA(fee.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      fee.status === 'partial' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {fee.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : fee.status === 'partial' ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {fee.status === 'paid' ? (language === 'en' ? 'Paid' : 'Payé') : fee.status === 'partial' ? (language === 'en' ? 'Partial' : 'Partiel') : (language === 'en' ? 'Unpaid' : 'Impayé')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetailModal(fee)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all" title={t('common.view', language)}>
                        <Receipt className="w-4 h-4" />
                      </button>
                      {fee.status !== 'paid' && (
                        <button onClick={() => { setPaymentModal(fee); setPayAmount(''); }} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-all" title={t('fee.recordPayment', language)}>
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPaymentModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                {t('fee.recordPayment', language)}
              </h3>
              <button onClick={() => setPaymentModal(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">{language === 'en' ? 'Student' : 'Élève'}</p>
                <p className="font-semibold text-gray-900">{paymentModal.studentName}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{language === 'en' ? 'Outstanding' : 'Solde'}</span>
                  <span className="font-bold text-red-600">{formatCFA(paymentModal.balance)}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Amount (FCFA)' : 'Montant (FCFA)'}</label>
                <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{language === 'en' ? 'Payment Method' : 'Méthode de Paiement'}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['mtn_momo', 'orange_money', 'bank_transfer', 'cash'] as PaymentMethod[]).map(method => (
                    <button
                      key={method}
                      onClick={() => setPayMethod(method)}
                      className={`p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                        payMethod === method ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {getPaymentMethodLabel(method)}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handlePayment} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg">
                {language === 'en' ? 'Confirm Payment' : 'Confirmer le Paiement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Payment History' : 'Historique des Paiements'}</h3>
              <button onClick={() => setDetailModal(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="font-semibold text-gray-900">{detailModal.studentName}</p>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-gray-400">{language === 'en' ? 'Total' : 'Total'}</p>
                    <p className="text-sm font-bold text-gray-900">{formatCFA(detailModal.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{language === 'en' ? 'Paid' : 'Payé'}</p>
                    <p className="text-sm font-bold text-emerald-600">{formatCFA(detailModal.paidAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{language === 'en' ? 'Balance' : 'Solde'}</p>
                    <p className="text-sm font-bold text-red-600">{formatCFA(detailModal.balance)}</p>
                  </div>
                </div>
              </div>
              {detailModal.payments.length > 0 ? (
                <div className="space-y-3">
                  {detailModal.payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatCFA(p.amount)}</p>
                        <p className="text-xs text-gray-400">{p.date} - {getPaymentMethodLabel(p.method)}</p>
                        <p className="text-xs text-gray-400">Ref: {p.reference}</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">{p.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-6">{language === 'en' ? 'No payments recorded' : 'Aucun paiement enregistré'}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
