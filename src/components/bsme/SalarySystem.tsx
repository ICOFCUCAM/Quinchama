import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { formatCFA, getPaymentMethodLabel, SalaryRecord } from '@/lib/schoolData';
import { Search, Wallet, CheckCircle, Clock, Printer, X, CreditCard } from 'lucide-react';

const SalarySystem: React.FC = () => {
  const { language, salaryRecords, processSalary } = useAppContext();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [payslipModal, setPayslipModal] = useState<SalaryRecord | null>(null);

  const months = [...new Set(salaryRecords.map(s => s.month))];

  const filtered = useMemo(() => {
    return salaryRecords.filter(s => {
      const matchSearch = s.teacherName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      const matchMonth = monthFilter === 'all' || s.month === monthFilter;
      return matchSearch && matchStatus && matchMonth;
    });
  }, [salaryRecords, search, statusFilter, monthFilter]);

  const totalPaid = salaryRecords.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.netSalary, 0);
  const totalPending = salaryRecords.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.netSalary, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('dash.salary', language)}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'Manage teacher salaries and payslips' : 'Gérer les salaires et fiches de paie des enseignants'}</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <p className="text-sm text-emerald-100">{language === 'en' ? 'Total Paid' : 'Total Payé'}</p>
          </div>
          <p className="text-2xl font-bold">{formatCFA(totalPaid)}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-amber-200" />
            <p className="text-sm text-amber-100">{language === 'en' ? 'Pending Payments' : 'Paiements en Attente'}</p>
          </div>
          <p className="text-2xl font-bold">{formatCFA(totalPending)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={language === 'en' ? 'Search teacher...' : 'Rechercher un enseignant...'} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{language === 'en' ? 'All Months' : 'Tous les Mois'}</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{t('common.all', language)}</option>
          <option value="paid">{language === 'en' ? 'Paid' : 'Payé'}</option>
          <option value="pending">{language === 'en' ? 'Pending' : 'En Attente'}</option>
        </select>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Teacher' : 'Enseignant'}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{language === 'en' ? 'Month' : 'Mois'}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">{language === 'en' ? 'Base' : 'Base'}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">{language === 'en' ? 'Allowances' : 'Primes'}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">{language === 'en' ? 'Deductions' : 'Déductions'}</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Net Salary' : 'Salaire Net'}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Status' : 'Statut'}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('student.actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{record.teacherName}</p>
                    <p className="text-xs text-gray-400">{record.teacherId}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{record.month}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right hidden lg:table-cell">{formatCFA(record.baseSalary)}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 text-right hidden lg:table-cell">+{formatCFA(record.allowances)}</td>
                  <td className="px-4 py-3 text-sm text-red-600 text-right hidden lg:table-cell">-{formatCFA(record.deductions)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCFA(record.netSalary)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {record.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {record.status === 'paid' ? (language === 'en' ? 'Paid' : 'Payé') : (language === 'en' ? 'Pending' : 'En Attente')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setPayslipModal(record)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all" title={language === 'en' ? 'View Payslip' : 'Voir la Fiche de Paie'}>
                        <Wallet className="w-4 h-4" />
                      </button>
                      {record.status === 'pending' && (
                        <button onClick={() => processSalary(record.id)} className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-all" title={language === 'en' ? 'Process Payment' : 'Traiter le Paiement'}>
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

      {/* Payslip Modal */}
      {payslipModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPayslipModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Payslip' : 'Fiche de Paie'}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-gray-100"><Printer className="w-5 h-5 text-gray-500" /></button>
                <button onClick={() => setPayslipModal(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6">
              {/* Payslip Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-blue-600">
                <h4 className="text-lg font-bold text-blue-800">BSME ACADEMY</h4>
                <p className="text-xs text-gray-500">{language === 'en' ? 'SALARY PAYSLIP' : 'FICHE DE PAIE'}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{payslipModal.month}</p>
              </div>

              {/* Employee Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm"><span className="text-gray-500">{language === 'en' ? 'Employee:' : 'Employé:'}</span> <span className="font-semibold">{payslipModal.teacherName}</span></p>
                <p className="text-sm"><span className="text-gray-500">ID:</span> <span className="font-semibold">{payslipModal.teacherId}</span></p>
              </div>

              {/* Salary Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{language === 'en' ? 'Base Salary' : 'Salaire de Base'}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCFA(payslipModal.baseSalary)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-emerald-600">{language === 'en' ? 'Allowances' : 'Primes'}</span>
                  <span className="text-sm font-medium text-emerald-600">+{formatCFA(payslipModal.allowances)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-red-600">{language === 'en' ? 'Deductions' : 'Déductions'}</span>
                  <span className="text-sm font-medium text-red-600">-{formatCFA(payslipModal.deductions)}</span>
                </div>
                <div className="flex justify-between py-3 bg-blue-50 rounded-xl px-4">
                  <span className="text-sm font-bold text-blue-900">{language === 'en' ? 'Net Salary' : 'Salaire Net'}</span>
                  <span className="text-lg font-bold text-blue-700">{formatCFA(payslipModal.netSalary)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500 pt-2">
                <span>{language === 'en' ? 'Payment Method' : 'Méthode de Paiement'}: {getPaymentMethodLabel(payslipModal.paymentMethod)}</span>
                <span>{language === 'en' ? 'Status' : 'Statut'}: {payslipModal.status === 'paid' ? (language === 'en' ? 'Paid' : 'Payé') : (language === 'en' ? 'Pending' : 'En Attente')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySystem;
