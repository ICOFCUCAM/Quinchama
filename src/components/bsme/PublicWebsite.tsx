import React, { useState } from 'react';
import { useAppContext, Page } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { IMAGES, LEVELS, mockNews, FEE_STRUCTURE, formatCFA, mockStudents, mockTeachers } from '@/lib/schoolData';
import { GraduationCap, Users, Calendar, Award, BookOpen, Globe, Phone, Mail, MapPin, ChevronRight, Star, Clock, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

// ============ PUBLIC NAVBAR ============
export const PublicNavbar: React.FC = () => {
  const { language, setLanguage, currentPage, setCurrentPage, isLoggedIn, logout } = useAppContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { page: Page; key: string }[] = [
    { page: 'home', key: 'nav.home' },
    { page: 'about', key: 'nav.about' },
    { page: 'admissions', key: 'nav.admissions' },
    { page: 'academics', key: 'nav.academics' },
    { page: 'news', key: 'nav.news' },
    { page: 'contact', key: 'nav.contact' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">BSME Academy</h1>
              <p className="text-xs text-blue-600 font-medium hidden sm:block">Bilingual School of Excellence</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.page
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                {t(item.key, language)}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-all"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage('dashboard')} className="hidden sm:block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">
                  {t('nav.adminDashboard', language)}
                </button>
                <button onClick={logout} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all">
                  {t('dash.logout', language)}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                {t('nav.login', language)}
              </button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => { setCurrentPage(item.page); setMobileOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                  currentPage === item.page ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t(item.key, language)}
              </button>
            ))}
            {!isLoggedIn && (
              <button
                onClick={() => { setCurrentPage('login'); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-600 bg-blue-50"
              >
                {t('nav.login', language)}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// ============ HOME PAGE ============
export const HomePage: React.FC = () => {
  const { language, setCurrentPage } = useAppContext();

  const stats = [
    { icon: Users, value: `${mockStudents.length * 10}+`, label: t('stats.students', language), color: 'from-blue-500 to-blue-600' },
    { icon: GraduationCap, value: `${mockTeachers.length}+`, label: t('stats.teachers', language), color: 'from-emerald-500 to-emerald-600' },
    { icon: Award, value: '15+', label: t('stats.years', language), color: 'from-amber-500 to-orange-500' },
    { icon: BookOpen, value: '18', label: t('stats.classes', language), color: 'from-purple-500 to-purple-600' },
  ];

  const features = language === 'en' ? [
    { icon: Globe, title: 'Bilingual Education', desc: 'Full curriculum in both English and French with native-speaking teachers' },
    { icon: BookOpen, title: 'Modern Curriculum', desc: 'Updated syllabus aligned with national and international standards' },
    { icon: Users, title: 'Small Class Sizes', desc: 'Maximum 25 students per class for personalized attention' },
    { icon: Award, title: 'Certified Teachers', desc: 'All teachers hold professional teaching certifications' },
    { icon: Calendar, title: 'Extra-Curricular', desc: 'Sports, arts, music, and cultural activities for holistic development' },
    { icon: Star, title: 'Digital Learning', desc: 'ICT-integrated classrooms with modern learning tools' },
  ] : [
    { icon: Globe, title: 'Éducation Bilingue', desc: 'Programme complet en anglais et en français avec des enseignants natifs' },
    { icon: BookOpen, title: 'Programme Moderne', desc: 'Programme mis à jour conforme aux normes nationales et internationales' },
    { icon: Users, title: 'Petites Classes', desc: 'Maximum 25 élèves par classe pour une attention personnalisée' },
    { icon: Award, title: 'Enseignants Certifiés', desc: 'Tous les enseignants détiennent des certifications professionnelles' },
    { icon: Calendar, title: 'Extra-Scolaire', desc: 'Sports, arts, musique et activités culturelles pour un développement holistique' },
    { icon: Star, title: 'Apprentissage Numérique', desc: 'Salles de classe intégrées aux TIC avec des outils d\'apprentissage modernes' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="BSME Academy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              {language === 'en' ? 'Ranked #1 Bilingual School in the Region' : 'Classée #1 École Bilingue de la Région'}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('hero.title', language)}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle', language)}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCurrentPage('admissions')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2"
              >
                {t('hero.cta1', language)}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                {t('hero.cta2', language)}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100 hover:shadow-2xl transition-all">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Why Choose BSME Academy?' : 'Pourquoi Choisir BSME Academy?'}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {language === 'en' ? 'We provide a nurturing environment where every child thrives academically and personally.' : 'Nous offrons un environnement stimulant où chaque enfant s\'épanouit académiquement et personnellement.'}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Preview */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Programs' : 'Nos Programmes'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: IMAGES.students[0], title: language === 'en' ? 'Pre-Nursery' : 'Pré-Maternelle', age: language === 'en' ? 'Ages 2-3' : 'Âges 2-3', desc: language === 'en' ? 'Early childhood development through play-based learning' : 'Développement de la petite enfance par l\'apprentissage par le jeu' },
              { img: IMAGES.students[1], title: language === 'en' ? 'Nursery' : 'Maternelle', age: language === 'en' ? 'Ages 3-5' : 'Âges 3-5', desc: language === 'en' ? 'Building foundational skills in literacy and numeracy' : 'Développer les compétences fondamentales en lecture et calcul' },
              { img: IMAGES.students[4], title: language === 'en' ? 'Primary' : 'Primaire', age: language === 'en' ? 'Ages 5-12' : 'Âges 5-12', desc: language === 'en' ? 'Comprehensive bilingual curriculum for academic excellence' : 'Programme bilingue complet pour l\'excellence académique' },
            ].map((prog, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer" onClick={() => setCurrentPage('academics')}>
                <div className="h-52 overflow-hidden">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{prog.age}</span>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{prog.title}</h3>
                  <p className="text-gray-500 text-sm">{prog.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                    {language === 'en' ? 'Learn More' : 'En Savoir Plus'} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t('nav.news', language)}</h2>
          <button onClick={() => setCurrentPage('news')} className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            {language === 'en' ? 'View All' : 'Voir Tout'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNews.map(news => (
            <div key={news.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer" onClick={() => setCurrentPage('news')}>
              <div className="h-48 overflow-hidden">
                <img src={news.image} alt={language === 'en' ? news.title : news.titleFr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(news.date).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{language === 'en' ? news.title : news.titleFr}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{language === 'en' ? news.content : news.contentFr}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {language === 'en' ? 'Ready to Give Your Child the Best Start?' : 'Prêt à Donner le Meilleur Départ à Votre Enfant?'}
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            {language === 'en' ? 'Enrollment for the 2026/2027 academic year is now open. Secure your child\'s place today.' : 'Les inscriptions pour l\'année académique 2026/2027 sont ouvertes. Réservez la place de votre enfant dès aujourd\'hui.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setCurrentPage('admissions')} className="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl">
              {t('hero.cta1', language)}
            </button>
            <button onClick={() => setCurrentPage('contact')} className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
              {t('nav.contact', language)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============ ABOUT PAGE ============
export const AboutPage: React.FC = () => {
  const { language } = useAppContext();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('about.title', language)}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {language === 'en' ? 'Established in 2010, BSME Academy has been at the forefront of bilingual education in Cameroon.' : 'Fondée en 2010, BSME Academy est à l\'avant-garde de l\'éducation bilingue au Cameroun.'}
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img src={IMAGES.school} alt="BSME Academy" className="rounded-2xl shadow-xl w-full" />
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Star className="w-5 h-5 text-blue-600" /></div>
              {t('about.mission', language)}
            </h3>
            <p className="text-gray-600 leading-relaxed">{t('about.missionText', language)}</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Award className="w-5 h-5 text-emerald-600" /></div>
              {t('about.vision', language)}
            </h3>
            <p className="text-gray-600 leading-relaxed">{t('about.visionText', language)}</p>
          </div>
        </div>
      </div>
      {/* Team */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">{language === 'en' ? 'Our Leadership Team' : 'Notre Équipe de Direction'}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Dr. Grace Nkemba', role: language === 'en' ? 'Principal' : 'Directrice', img: IMAGES.teachers[0] },
          { name: 'Marie Tchinda', role: language === 'en' ? 'Vice Principal (French)' : 'Vice-Directrice (Français)', img: IMAGES.teachers[1] },
          { name: 'John Okafor', role: language === 'en' ? 'Head of Academics' : 'Chef des Études', img: IMAGES.teachers[2] },
          { name: 'Sylvie Diallo', role: language === 'en' ? 'Head of Administration' : 'Chef de l\'Administration', img: IMAGES.teachers[3] },
        ].map((member, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all">
            <div className="h-56 overflow-hidden">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <p className="text-sm text-blue-600">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ ADMISSIONS PAGE ============
export const AdmissionsPage: React.FC = () => {
  const { language } = useAppContext();
  const [formData, setFormData] = useState({ childName: '', dob: '', level: '', section: '', parentName: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.childName || !formData.parentName || !formData.phone) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    setSubmitted(true);
    toast.success(language === 'en' ? 'Application submitted successfully!' : 'Candidature soumise avec succès!');
  };

  const steps = language === 'en' ? [
    { step: '01', title: 'Submit Application', desc: 'Complete the online admission form with your child\'s details' },
    { step: '02', title: 'Document Review', desc: 'Our admissions team reviews your application within 48 hours' },
    { step: '03', title: 'Assessment', desc: 'Schedule an assessment test for your child (Primary levels)' },
    { step: '04', title: 'Enrollment', desc: 'Complete registration and pay admission fees' },
  ] : [
    { step: '01', title: 'Soumettre la Candidature', desc: 'Remplissez le formulaire d\'admission en ligne avec les détails de votre enfant' },
    { step: '02', title: 'Examen des Documents', desc: 'Notre équipe d\'admission examine votre candidature dans les 48 heures' },
    { step: '03', title: 'Évaluation', desc: 'Planifiez un test d\'évaluation pour votre enfant (niveaux primaires)' },
    { step: '04', title: 'Inscription', desc: 'Complétez l\'inscription et payez les frais d\'admission' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('admissions.title', language)}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t('admissions.subtitle', language)}</p>
      </div>

      {/* Process Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {steps.map((s, i) => (
          <div key={i} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
            <span className="text-4xl font-bold text-blue-100">{s.step}</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Fee Structure */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{language === 'en' ? 'Fee Structure (Per Term)' : 'Structure des Frais (Par Trimestre)'}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS.map(level => (
            <div key={level.value} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
              <span className="font-medium text-gray-700">{language === 'en' ? level.labelEn : level.labelFr}</span>
              <span className="font-bold text-blue-600">{formatCFA(FEE_STRUCTURE[level.value])}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('admissions.apply', language)}</h2>
        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{language === 'en' ? 'Application Received!' : 'Candidature Reçue!'}</h3>
            <p className="text-gray-600">{language === 'en' ? 'We will contact you within 48 hours.' : 'Nous vous contacterons dans les 48 heures.'}</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all">
              {language === 'en' ? 'Submit Another' : 'Soumettre une Autre'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Child\'s Full Name *' : 'Nom Complet de l\'Enfant *'}</label>
                <input type="text" value={formData.childName} onChange={e => setFormData(p => ({ ...p, childName: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Date of Birth *' : 'Date de Naissance *'}</label>
                <input type="date" value={formData.dob} onChange={e => setFormData(p => ({ ...p, dob: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Level *' : 'Niveau *'}</label>
                <select value={formData.level} onChange={e => setFormData(p => ({ ...p, level: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
                  <option value="">{language === 'en' ? 'Select Level' : 'Sélectionner le Niveau'}</option>
                  {LEVELS.map(l => <option key={l.value} value={l.value}>{language === 'en' ? l.labelEn : l.labelFr}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Section *' : 'Section *'}</label>
                <select value={formData.section} onChange={e => setFormData(p => ({ ...p, section: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
                  <option value="">{language === 'en' ? 'Select Section' : 'Sélectionner la Section'}</option>
                  <option value="english">{language === 'en' ? 'English Section' : 'Section Anglophone'}</option>
                  <option value="french">{language === 'en' ? 'French Section' : 'Section Francophone'}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Parent/Guardian Name *' : 'Nom du Parent/Tuteur *'}</label>
              <input type="text" value={formData.parentName} onChange={e => setFormData(p => ({ ...p, parentName: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Phone Number *' : 'Numéro de Téléphone *'}</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="+237..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Additional Notes' : 'Notes Supplémentaires'}</label>
              <textarea rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" />
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
              {t('common.submit', language)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ============ ACADEMICS PAGE ============
export const AcademicsPage: React.FC = () => {
  const { language } = useAppContext();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{language === 'en' ? 'Academic Programs' : 'Programmes Académiques'}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          {language === 'en' ? 'Our comprehensive bilingual curriculum covers Pre-Nursery through Primary 6 in both English and French sections.' : 'Notre programme bilingue complet couvre de la pré-maternelle au CM2 dans les sections anglophone et francophone.'}
        </p>
      </div>
      <div className="space-y-8">
        {[
          { levels: ['Pre-Nursery'], levelsFr: ['Pré-Maternelle'], ages: '2-3', color: 'from-pink-500 to-rose-500', subjects: language === 'en' ? ['Phonics', 'Numeracy', 'Creative Play', 'Motor Skills', 'Social Skills'] : ['Phonétique', 'Numération', 'Jeu Créatif', 'Motricité', 'Compétences Sociales'] },
          { levels: ['Nursery 1', 'Nursery 2'], levelsFr: ['Maternelle 1', 'Maternelle 2'], ages: '3-5', color: 'from-amber-500 to-orange-500', subjects: language === 'en' ? ['Reading & Writing', 'Mathematics', 'Science Discovery', 'French/English', 'Arts & Crafts', 'Physical Education'] : ['Lecture & Écriture', 'Mathématiques', 'Découverte Scientifique', 'Français/Anglais', 'Arts & Travaux Manuels', 'Éducation Physique'] },
          { levels: ['Primary 1-3'], levelsFr: ['CP - CE2'], ages: '5-9', color: 'from-blue-500 to-indigo-500', subjects: language === 'en' ? ['English Language', 'French Language', 'Mathematics', 'General Science', 'Social Studies', 'ICT', 'Creative Arts', 'Physical Education', 'Moral Education', 'Music'] : ['Langue Anglaise', 'Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Informatique', 'Arts Créatifs', 'Éducation Physique', 'Éducation Morale', 'Musique'] },
          { levels: ['Primary 4-6'], levelsFr: ['CM1 - 6ème'], ages: '9-12', color: 'from-emerald-500 to-teal-500', subjects: language === 'en' ? ['English Language', 'French Language', 'Mathematics', 'General Science', 'Social Studies', 'ICT', 'Creative Arts', 'Physical Education', 'Moral Education', 'Music', 'History', 'Geography'] : ['Langue Anglaise', 'Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Informatique', 'Arts Créatifs', 'Éducation Physique', 'Éducation Morale', 'Musique', 'Histoire', 'Géographie'] },
        ].map((prog, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className={`bg-gradient-to-r ${prog.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{(language === 'en' ? prog.levels : prog.levelsFr).join(' & ')}</h3>
                  <p className="text-white/80 mt-1">{language === 'en' ? `Ages ${prog.ages}` : `Âges ${prog.ages}`}</p>
                </div>
                <BookOpen className="w-10 h-10 text-white/50" />
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-gray-700 mb-3">{language === 'en' ? 'Subjects:' : 'Matières:'}</h4>
              <div className="flex flex-wrap gap-2">
                {prog.subjects.map((s, j) => (
                  <span key={j} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-100">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ NEWS PAGE ============
export const NewsPage: React.FC = () => {
  const { language } = useAppContext();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">{t('nav.news', language)}</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        {mockNews.map(news => (
          <div key={news.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <div className="h-56 overflow-hidden">
              <img src={news.image} alt={language === 'en' ? news.title : news.titleFr} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${news.category === 'event' ? 'bg-purple-100 text-purple-700' : news.category === 'announcement' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {news.category === 'event' ? (language === 'en' ? 'Event' : 'Événement') : news.category === 'announcement' ? (language === 'en' ? 'Announcement' : 'Annonce') : (language === 'en' ? 'News' : 'Actualité')}
                </span>
                <span className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(news.date).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{language === 'en' ? news.title : news.titleFr}</h3>
              <p className="text-gray-500 leading-relaxed">{language === 'en' ? news.content : news.contentFr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ CONTACT PAGE ============
export const ContactPage: React.FC = () => {
  const { language } = useAppContext();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(language === 'en' ? 'Please fill required fields' : 'Veuillez remplir les champs obligatoires');
      return;
    }
    setSent(true);
    toast.success(language === 'en' ? 'Message sent successfully!' : 'Message envoyé avec succès!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{t('contact.title', language)}</h1>
      <p className="text-lg text-gray-500 text-center mb-14 max-w-2xl mx-auto">
        {language === 'en' ? 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.' : 'Vous avez des questions? Nous serions ravis de vous entendre. Envoyez-nous un message et nous répondrons dès que possible.'}
      </p>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {[
            { icon: MapPin, title: language === 'en' ? 'Address' : 'Adresse', info: 'Rue de la Liberté, Bonanjo\nDouala, Cameroon' },
            { icon: Phone, title: language === 'en' ? 'Phone' : 'Téléphone', info: '+237 670 001 000\n+237 650 002 000' },
            { icon: Mail, title: 'Email', info: 'info@bsme-academy.edu\nadmissions@bsme-academy.edu' },
            { icon: Clock, title: language === 'en' ? 'Office Hours' : 'Heures de Bureau', info: language === 'en' ? 'Mon - Fri: 7:00 AM - 4:00 PM\nSat: 8:00 AM - 12:00 PM' : 'Lun - Ven: 7h00 - 16h00\nSam: 8h00 - 12h00' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500 whitespace-pre-line">{item.info}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{language === 'en' ? 'Message Sent!' : 'Message Envoyé!'}</h3>
              <p className="text-gray-600 mb-4">{language === 'en' ? 'We will get back to you within 24 hours.' : 'Nous vous répondrons dans les 24 heures.'}</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all">
                {language === 'en' ? 'Send Another' : 'Envoyer un Autre'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name', language)} *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email', language)} *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone', language)}</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Subject' : 'Sujet'}</label>
                  <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message', language)} *</label>
                <textarea rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg">
                {t('common.send', language)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ FOOTER ============
export const PublicFooter: React.FC = () => {
  const { language, setCurrentPage } = useAppContext();
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-lg">BSME Academy</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {language === 'en' ? 'Providing quality bilingual education since 2010. Nurturing future leaders in English and French.' : 'Fournir une éducation bilingue de qualité depuis 2010. Former les leaders de demain en anglais et en français.'}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks', language)}</h4>
            <ul className="space-y-2">
              {(['home', 'about', 'admissions', 'academics', 'news', 'contact'] as Page[]).map(page => (
                <li key={page}>
                  <button onClick={() => setCurrentPage(page)} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t(`nav.${page === 'news' ? 'news' : page}`, language)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{language === 'en' ? 'Portals' : 'Portails'}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentPage('login')} className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.parentPortal', language)}</button></li>
              <li><button onClick={() => setCurrentPage('login')} className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.teacherPortal', language)}</button></li>
              <li><button onClick={() => setCurrentPage('login')} className="text-sm text-gray-400 hover:text-white transition-colors">{t('nav.adminDashboard', language)}</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact', language)}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /> Rue de la Liberté, Bonanjo, Douala</li>
              <li className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 flex-shrink-0" /> +237 670 001 000</li>
              <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 flex-shrink-0" /> info@bsme-academy.edu</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 BSME Academy. {t('footer.rights', language)}</p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{language === 'en' ? 'Powered by BSME Digital' : 'Propulsé par BSME Digital'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
