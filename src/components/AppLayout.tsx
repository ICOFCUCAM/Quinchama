import React from 'react';
import { useAppContext } from '@/contexts/AppContext';

// Public Website Components
import { PublicNavbar, HomePage, AboutPage, AdmissionsPage, AcademicsPage, NewsPage, ContactPage, PublicFooter } from './bsme/PublicWebsite';

// Dashboard Components
import { DashboardSidebar, DashboardHeader } from './bsme/DashboardLayout';
import AdminOverview from './bsme/AdminOverview';
import StudentManagement from './bsme/StudentManagement';
import TeacherManagement from './bsme/TeacherManagement';
import FeeManagement from './bsme/FeeManagement';
import TimetableSystem from './bsme/TimetableSystem';
import { GradesView, ReportCardsView } from './bsme/AcademicSystem';
import SalarySystem from './bsme/SalarySystem';
import CommunicationSystem from './bsme/CommunicationSystem';
import LoginPage from './bsme/LoginModal';
import SettingsPage from './bsme/SettingsPage';

const publicPages = ['home', 'about', 'admissions', 'academics', 'news', 'contact', 'login'];

const AppLayout: React.FC = () => {
  const { currentPage, isLoggedIn, sidebarOpen } = useAppContext();

  const isPublicPage = publicPages.includes(currentPage);

  // Public Website Layout
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNavbar />
        <main>
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'admissions' && <AdmissionsPage />}
          {currentPage === 'academics' && <AcademicsPage />}
          {currentPage === 'news' && <NewsPage />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'login' && <LoginPage />}
        </main>
        {currentPage !== 'login' && <PublicFooter />}
      </div>
    );
  }

  // Dashboard Layout (Admin/Teacher/Parent)
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          <DashboardHeader />
          <main className="p-4 lg:p-8">
            {currentPage === 'dashboard' && <AdminOverview />}
            {currentPage === 'students' && <StudentManagement />}
            {currentPage === 'teachers' && <TeacherManagement />}
            {currentPage === 'fees' && <FeeManagement />}
            {currentPage === 'timetable' && <TimetableSystem />}
            {currentPage === 'grades' && <GradesView />}
            {currentPage === 'reports' && <ReportCardsView />}
            {currentPage === 'salary' && <SalarySystem />}
            {currentPage === 'messages' && <CommunicationSystem />}
            {currentPage === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    );
  }

  // Fallback to home
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <HomePage />
      <PublicFooter />
    </div>
  );
};

export default AppLayout;
