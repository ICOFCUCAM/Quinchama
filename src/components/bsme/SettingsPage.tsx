import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { Settings, Globe, School, Bell, Shield, Database, Save } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useAppContext();
  const [schoolName, setSchoolName] = useState('BSME Academy');
  const [schoolEmail, setSchoolEmail] = useState('info@bsme-academy.edu');
  const [schoolPhone, setSchoolPhone] = useState('+237 670 001 000');
  const [schoolAddress, setSchoolAddress] = useState('Rue de la Liberté, Bonanjo, Douala');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [currentTerm, setCurrentTerm] = useState('term2');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifInApp, setNotifInApp] = useState(true);

  const handleSave = () => {
    toast.success(language === 'en' ? 'Settings saved successfully' : 'Paramètres enregistrés avec succès');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('dash.settings', language)}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'Configure school and system settings' : 'Configurer les paramètres de l\'école et du système'}</p>
      </div>

      {/* School Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <School className="w-5 h-5 text-blue-600" />
          {language === 'en' ? 'School Information' : 'Informations de l\'École'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'School Name' : 'Nom de l\'École'}</label>
            <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={schoolEmail} onChange={e => setSchoolEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Phone' : 'Téléphone'}</label>
              <input type="tel" value={schoolPhone} onChange={e => setSchoolPhone(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Address' : 'Adresse'}</label>
            <input type="text" value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>

      {/* Academic Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Database className="w-5 h-5 text-emerald-600" />
          {language === 'en' ? 'Academic Settings' : 'Paramètres Académiques'}
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Academic Year' : 'Année Académique'}</label>
            <input type="text" value={academicYear} onChange={e => setAcademicYear(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Current Term' : 'Trimestre Actuel'}</label>
            <select value={currentTerm} onChange={e => setCurrentTerm(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="term1">{language === 'en' ? 'Term 1' : 'Trimestre 1'}</option>
              <option value="term2">{language === 'en' ? 'Term 2' : 'Trimestre 2'}</option>
              <option value="term3">{language === 'en' ? 'Term 3' : 'Trimestre 3'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Globe className="w-5 h-5 text-purple-600" />
          {language === 'en' ? 'Language Settings' : 'Paramètres de Langue'}
        </h3>
        <div className="flex gap-3">
          <button onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            English
          </button>
          <button onClick={() => setLanguage('fr')} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${language === 'fr' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            Français
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-amber-600" />
          {language === 'en' ? 'Notification Settings' : 'Paramètres de Notification'}
        </h3>
        <div className="space-y-3">
          {[
            { label: language === 'en' ? 'Email Notifications' : 'Notifications par Email', value: notifEmail, setter: setNotifEmail },
            { label: language === 'en' ? 'SMS Notifications' : 'Notifications SMS', value: notifSms, setter: setNotifSms },
            { label: language === 'en' ? 'In-App Notifications' : 'Notifications In-App', value: notifInApp, setter: setNotifInApp },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button
                onClick={() => item.setter(!item.value)}
                className={`w-12 h-6 rounded-full transition-all relative ${item.value ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${item.value ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2">
        <Save className="w-5 h-5" /> {t('common.save', language)}
      </button>
    </div>
  );
};

export default SettingsPage;
