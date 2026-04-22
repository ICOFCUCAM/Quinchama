import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { formatCFA, LEVELS, getLevelLabel } from '@/lib/schoolData';
import {
  Users, GraduationCap, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, AlertCircle, Calendar
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const { language, students, teachers, feeRecords, salaryRecords, messages, setCurrentPage } = useAppContext();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalRevenue = feeRecords.reduce((sum, f) => sum + f.paidAmount, 0);
  const pendingFees = feeRecords.reduce((sum, f) => sum + f.balance, 0);
  const paidCount = feeRecords.filter(f => f.status === 'paid').length;
  const partialCount = feeRecords.filter(f => f.status === 'partial').length;
  const unpaidCount = feeRecords.filter(f => f.status === 'unpaid').length;

  const stats = [
    { icon: Users, label: t('dash.totalStudents', language), value: totalStudents.toString(), change: '+12%', positive: true, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', onClick: () => setCurrentPage('students') },
    { icon: GraduationCap, label: t('dash.totalTeachers', language), value: totalTeachers.toString(), change: '+2', positive: true, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', onClick: () => setCurrentPage('teachers') },
    { icon: CreditCard, label: t('dash.totalRevenue', language), value: formatCFA(totalRevenue), change: '+8%', positive: true, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', onClick: () => setCurrentPage('fees') },
    { icon: TrendingUp, label: t('dash.pendingFees', language), value: formatCFA(pendingFees), change: '-5%', positive: false, color: 'from-red-500 to-rose-500', bgColor: 'bg-red-50', onClick: () => setCurrentPage('fees') },
  ];

  // Students per level
  const levelCounts = LEVELS.map(level => ({
    label: getLevelLabel(level.value, language),
    en: students.filter(s => s.level === level.value && s.section === 'english').length,
    fr: students.filter(s => s.level === level.value && s.section === 'french').length,
  }));

  // Recent payments
  const recentPayments = feeRecords
    .filter(f => f.payments.length > 0)
    .flatMap(f => f.payments.map(p => ({ ...p, studentName: f.studentName, level: f.level })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.positive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
              }`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Fee Collection Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{t('dash.feeCollection', language)}</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-700">{paidCount}</p>
              <p className="text-sm text-emerald-600">{language === 'en' ? 'Fully Paid' : 'Entièrement Payé'}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700">{partialCount}</p>
              <p className="text-sm text-amber-600">{language === 'en' ? 'Partial Payment' : 'Paiement Partiel'}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">{unpaidCount}</p>
              <p className="text-sm text-red-600">{language === 'en' ? 'Unpaid' : 'Non Payé'}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{language === 'en' ? 'Collection Progress' : 'Progression de la Collecte'}</span>
              <span className="font-semibold text-gray-900">{Math.round((totalRevenue / (totalRevenue + pendingFees)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((totalRevenue / (totalRevenue + pendingFees)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{language === 'en' ? 'Quick Actions' : 'Actions Rapides'}</h3>
          <div className="space-y-3">
            {[
              { label: language === 'en' ? 'Add New Student' : 'Ajouter un Élève', page: 'students' as Page, icon: Users, color: 'bg-blue-50 text-blue-600' },
              { label: language === 'en' ? 'Record Payment' : 'Enregistrer un Paiement', page: 'fees' as Page, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
              { label: language === 'en' ? 'Send Message' : 'Envoyer un Message', page: 'messages' as Page, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
              { label: language === 'en' ? 'View Timetable' : 'Voir l\'Emploi du Temps', page: 'timetable' as Page, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
              { label: language === 'en' ? 'Generate Reports' : 'Générer des Bulletins', page: 'reports' as Page, icon: GraduationCap, color: 'bg-rose-50 text-rose-600' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(action.page)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Student Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{language === 'en' ? 'Students by Level' : 'Élèves par Niveau'}</h3>
          <div className="space-y-3">
            {levelCounts.map((lc, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-28 flex-shrink-0 truncate">{lc.label}</span>
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden flex">
                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${(lc.en / Math.max(1, lc.en + lc.fr)) * 100}%` }} />
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(lc.fr / Math.max(1, lc.en + lc.fr)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{lc.en + lc.fr}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /><span className="text-xs text-gray-500">{language === 'en' ? 'English' : 'Anglais'}</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-xs text-gray-500">{language === 'en' ? 'French' : 'Français'}</span></div>
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">{t('dash.recentPayments', language)}</h3>
            <button onClick={() => setCurrentPage('fees')} className="text-sm text-blue-600 font-medium hover:underline">
              {language === 'en' ? 'View All' : 'Voir Tout'}
            </button>
          </div>
          <div className="space-y-3">
            {recentPayments.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    p.method === 'mtn_momo' ? 'bg-yellow-100 text-yellow-700' :
                    p.method === 'orange_money' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {p.method === 'mtn_momo' ? 'MTN' : p.method === 'orange_money' ? 'OM' : p.method === 'bank_transfer' ? 'BK' : 'CA'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.studentName}</p>
                    <p className="text-xs text-gray-400">{p.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">+{formatCFA(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Recent Messages' : 'Messages Récents'}</h3>
          <button onClick={() => setCurrentPage('messages')} className="text-sm text-blue-600 font-medium hover:underline">
            {language === 'en' ? 'View All' : 'Voir Tout'}
          </button>
        </div>
        <div className="space-y-3">
          {messages.slice(0, 4).map(msg => (
            <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer" onClick={() => setCurrentPage('messages')}>
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                msg.status === 'read' ? 'bg-gray-300' : msg.status === 'delivered' ? 'bg-emerald-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{msg.subject}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{msg.date}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{msg.from} → {msg.to}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
