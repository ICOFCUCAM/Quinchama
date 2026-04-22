import React from 'react';
import { useAppContext, Page } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import {
  LayoutDashboard, Users, GraduationCap, CreditCard, Calendar, BookOpen, FileText,
  Wallet, MessageSquare, Settings, LogOut, Globe, Menu, X, ChevronLeft, Bell
} from 'lucide-react';

interface NavItem {
  page: Page;
  icon: React.ElementType;
  key: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { page: 'dashboard', icon: LayoutDashboard, key: 'dash.overview', roles: ['admin', 'teacher', 'parent'] },
  { page: 'students', icon: Users, key: 'dash.students', roles: ['admin', 'teacher'] },
  { page: 'teachers', icon: GraduationCap, key: 'dash.teachers', roles: ['admin'] },
  { page: 'fees', icon: CreditCard, key: 'dash.fees', roles: ['admin', 'parent'] },
  { page: 'timetable', icon: Calendar, key: 'dash.timetable', roles: ['admin', 'teacher', 'parent'] },
  { page: 'grades', icon: BookOpen, key: 'dash.academics', roles: ['admin', 'teacher', 'parent'] },
  { page: 'reports', icon: FileText, key: 'dash.reports', roles: ['admin', 'teacher', 'parent'] },
  { page: 'salary', icon: Wallet, key: 'dash.salary', roles: ['admin', 'teacher'] },
  { page: 'messages', icon: MessageSquare, key: 'dash.messages', roles: ['admin', 'teacher', 'parent'] },
  { page: 'settings', icon: Settings, key: 'dash.settings', roles: ['admin'] },
];

export const DashboardSidebar: React.FC = () => {
  const { language, currentPage, setCurrentPage, sidebarOpen, toggleSidebar, userRole, userName, logout } = useAppContext();

  const filteredItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col ${
        sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 min-h-[72px]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-sm">BSME Academy</h2>
                <p className="text-xs text-blue-600 capitalize">{userRole} Portal</p>
              </div>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-gray-500" /> : <Menu className="w-5 h-5 text-gray-500" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredItems.map(item => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => { setCurrentPage(item.page); if (window.innerWidth < 1024) toggleSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? t(item.key, language) : undefined}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {sidebarOpen && <span>{t(item.key, language)}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-3 space-y-1">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {sidebarOpen && <span>{t('dash.website', language)}</span>}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>{t('dash.logout', language)}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export const DashboardHeader: React.FC = () => {
  const { language, setLanguage, userName, userRole, sidebarOpen, toggleSidebar, messages } = useAppContext();
  const unreadCount = messages.filter(m => m.status === 'sent').length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">

      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {language === 'en' ? `Welcome, ${userName}` : `Bienvenue, ${userName}`}
            </h1>
            <p className="text-xs text-gray-500 capitalize">{userRole} {language === 'en' ? 'Dashboard' : 'Tableau de Bord'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-all"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Bell className="w-5 h-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
