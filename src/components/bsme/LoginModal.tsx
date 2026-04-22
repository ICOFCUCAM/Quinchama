import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { UserRole } from '@/lib/schoolData';
import { GraduationCap, Shield, BookOpen, Users, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const { language, login, setCurrentPage } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    {
      role: 'admin' as UserRole,
      icon: Shield,
      label: language === 'en' ? 'Administrator' : 'Administrateur',
      desc: language === 'en' ? 'Full system access' : 'Accès complet au système',
      color: 'from-blue-500 to-indigo-600',
      bgHover: 'hover:border-blue-300 hover:bg-blue-50',
      demoEmail: 'admin@bsme.edu',
    },
    {
      role: 'teacher' as UserRole,
      icon: BookOpen,
      label: language === 'en' ? 'Teacher' : 'Enseignant',
      desc: language === 'en' ? 'Grades, timetable, salary' : 'Notes, emploi du temps, salaire',
      color: 'from-emerald-500 to-teal-600',
      bgHover: 'hover:border-emerald-300 hover:bg-emerald-50',
      demoEmail: 'teacher@bsme.edu',
    },
    {
      role: 'parent' as UserRole,
      icon: Users,
      label: 'Parent',
      desc: language === 'en' ? 'Results, fees, messages' : 'Résultats, frais, messages',
      color: 'from-amber-500 to-orange-600',
      bgHover: 'hover:border-amber-300 hover:bg-amber-50',
      demoEmail: 'parent@bsme.edu',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast.error(language === 'en' ? 'Please select a role' : 'Veuillez sélectionner un rôle');
      return;
    }
    if (!email) {
      toast.error(language === 'en' ? 'Please enter your email' : 'Veuillez entrer votre email');
      return;
    }
    const names: Record<UserRole, string> = {
      admin: 'Dr. Grace Nkemba',
      teacher: 'John Okafor',
      parent: 'Amara Nkemba',
      public: 'Guest',
    };
    login(selectedRole, names[selectedRole]);
  };

  const handleQuickLogin = (role: UserRole) => {
    const names: Record<UserRole, string> = {
      admin: 'Dr. Grace Nkemba',
      teacher: 'John Okafor',
      parent: 'Amara Nkemba',
      public: 'Guest',
    };
    login(role, names[role]);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm font-medium transition-all">
          <ArrowLeft className="w-4 h-4" /> {language === 'en' ? 'Back to Website' : 'Retour au Site'}
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{t('login.title', language)}</h2>
            <p className="text-blue-200 text-sm mt-1">BSME Academy</p>
          </div>

          <div className="p-6">
            {/* Role Selection */}
            <p className="text-sm font-medium text-gray-700 mb-3">{t('login.role', language)}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => { setSelectedRole(r.role); setEmail(r.demoEmail); }}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedRole === r.role
                      ? `border-blue-500 bg-blue-50`
                      : `border-gray-200 ${r.bgHover}`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center mx-auto mb-2`}>
                    <r.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{r.label}</p>
                </button>
              ))}
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.email', language)}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@bsme.edu"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.password', language)}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  {language === 'en' ? 'Remember me' : 'Se souvenir de moi'}
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline">{t('login.forgot', language)}</button>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                {t('login.submit', language)}
              </button>
            </form>

            {/* Quick Demo Access */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">{language === 'en' ? 'Quick Demo Access' : 'Accès Démo Rapide'}</p>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button
                    key={r.role}
                    onClick={() => handleQuickLogin(r.role)}
                    className="py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-all"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
