import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { Message, MessageStatus } from '@/lib/schoolData';
import { Send, Inbox, CheckCircle, Clock, AlertCircle, Plus, X, Mail, Users, Bell, Eye } from 'lucide-react';
import { toast } from 'sonner';

const CommunicationSystem: React.FC = () => {
  const { language, messages, addMessage, userName } = useAppContext();
  const [view, setView] = useState<'inbox' | 'compose' | 'tracking'>('inbox');
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [composeForm, setComposeForm] = useState({
    to: 'All Parents',
    subject: '',
    body: '',
    type: 'announcement' as Message['type'],
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.subject || !composeForm.body) {
      toast.error(language === 'en' ? 'Please fill in all fields' : 'Veuillez remplir tous les champs');
      return;
    }
    const newMsg: Message = {
      id: `MSG${Date.now()}`,
      from: userName || 'Admin',
      fromRole: 'admin',
      to: composeForm.to,
      toRole: 'parent',
      subject: composeForm.subject,
      body: composeForm.body,
      date: new Date().toISOString().split('T')[0],
      status: 'sent',
      type: composeForm.type,
    };
    addMessage(newMsg);
    setComposeForm({ to: 'All Parents', subject: '', body: '', type: 'announcement' });
    setView('inbox');
  };

  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case 'read': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'sent': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: MessageStatus) => {
    const labels: Record<MessageStatus, Record<string, string>> = {
      read: { en: 'Read', fr: 'Lu' },
      delivered: { en: 'Delivered', fr: 'Livré' },
      sent: { en: 'Sent', fr: 'Envoyé' },
      failed: { en: 'Failed', fr: 'Échoué' },
    };
    return labels[status][language];
  };

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'announcement': return 'bg-blue-50 text-blue-700';
      case 'fee_reminder': return 'bg-amber-50 text-amber-700';
      case 'result_notification': return 'bg-emerald-50 text-emerald-700';
      case 'general': return 'bg-gray-50 text-gray-700';
    }
  };

  const getTypeLabel = (type: Message['type']) => {
    const labels: Record<Message['type'], Record<string, string>> = {
      announcement: { en: 'Announcement', fr: 'Annonce' },
      fee_reminder: { en: 'Fee Reminder', fr: 'Rappel de Frais' },
      result_notification: { en: 'Result Notification', fr: 'Notification de Résultats' },
      general: { en: 'General', fr: 'Général' },
    };
    return labels[type][language];
  };

  // Stats
  const sentCount = messages.filter(m => m.status === 'sent').length;
  const deliveredCount = messages.filter(m => m.status === 'delivered').length;
  const readCount = messages.filter(m => m.status === 'read').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dash.messages', language)}</h2>
          <p className="text-sm text-gray-500">{language === 'en' ? 'Communication and dispatch system' : 'Système de communication et d\'envoi'}</p>
        </div>
        <button
          onClick={() => setView('compose')}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> {language === 'en' ? 'New Message' : 'Nouveau Message'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Send className="w-6 h-6 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{sentCount}</p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'Sent' : 'Envoyé'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{deliveredCount}</p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'Delivered' : 'Livré'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Eye className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-900">{readCount}</p>
          <p className="text-xs text-gray-500">{language === 'en' ? 'Read' : 'Lu'}</p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2">
        {(['inbox', 'compose', 'tracking'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === v ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {v === 'inbox' ? (language === 'en' ? 'Inbox' : 'Boîte de Réception') :
             v === 'compose' ? (language === 'en' ? 'Compose' : 'Rédiger') :
             (language === 'en' ? 'Dispatch Tracking' : 'Suivi d\'Envoi')}
          </button>
        ))}
      </div>

      {view === 'inbox' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'announcement' ? 'bg-blue-100' :
                  msg.type === 'fee_reminder' ? 'bg-amber-100' :
                  msg.type === 'result_notification' ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  {msg.type === 'announcement' ? <Bell className="w-5 h-5 text-blue-600" /> :
                   msg.type === 'fee_reminder' ? <Mail className="w-5 h-5 text-amber-600" /> :
                   msg.type === 'result_notification' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                   <Mail className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{msg.subject}</h4>
                    <span className="text-xs text-gray-400 flex-shrink-0">{msg.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{msg.from} → {msg.to}</p>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">{msg.body}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(msg.type)}`}>{getTypeLabel(msg.type)}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">{getStatusIcon(msg.status)} {getStatusLabel(msg.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'compose' && (
        <form onSubmit={handleSend} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'To' : 'À'}</label>
              <select value={composeForm.to} onChange={e => setComposeForm(p => ({ ...p, to: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="All Parents">{language === 'en' ? 'All Parents' : 'Tous les Parents'}</option>
                <option value="All Teachers">{language === 'en' ? 'All Teachers' : 'Tous les Enseignants'}</option>
                <option value="Prenursery Parents">{language === 'en' ? 'Prenursery Parents' : 'Parents Pré-Maternelle'}</option>
                <option value="Primary Parents">{language === 'en' ? 'Primary Parents' : 'Parents Primaire'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Type' : 'Type'}</label>
              <select value={composeForm.type} onChange={e => setComposeForm(p => ({ ...p, type: e.target.value as Message['type'] }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="announcement">{language === 'en' ? 'Announcement' : 'Annonce'}</option>
                <option value="fee_reminder">{language === 'en' ? 'Fee Reminder' : 'Rappel de Frais'}</option>
                <option value="result_notification">{language === 'en' ? 'Result Notification' : 'Notification de Résultats'}</option>
                <option value="general">{language === 'en' ? 'General' : 'Général'}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Subject' : 'Sujet'}</label>
            <input type="text" value={composeForm.subject} onChange={e => setComposeForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Message' : 'Message'}</label>
            <textarea rows={6} value={composeForm.body} onChange={e => setComposeForm(p => ({ ...p, body: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setView('inbox')} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">{t('common.cancel', language)}</button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <Send className="w-4 h-4" /> {t('common.send', language)}
            </button>
          </div>
        </form>
      )}

      {view === 'tracking' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Subject' : 'Sujet'}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{language === 'en' ? 'Recipient' : 'Destinataire'}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{language === 'en' ? 'Date' : 'Date'}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Type' : 'Type'}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Status' : 'Statut'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {messages.map(msg => (
                  <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{msg.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{msg.to}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{msg.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(msg.type)}`}>{getTypeLabel(msg.type)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center justify-center gap-1 text-xs">{getStatusIcon(msg.status)} {getStatusLabel(msg.status)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMsg(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{selectedMsg.subject}</h3>
              <button onClick={() => setSelectedMsg(null)} className="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'From' : 'De'}: <span className="font-medium text-gray-900">{selectedMsg.from}</span></p>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'To' : 'À'}: <span className="font-medium text-gray-900">{selectedMsg.to}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{selectedMsg.date}</p>
                  <span className="flex items-center gap-1 text-xs mt-1">{getStatusIcon(selectedMsg.status)} {getStatusLabel(selectedMsg.status)}</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMsg.body}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationSystem;
