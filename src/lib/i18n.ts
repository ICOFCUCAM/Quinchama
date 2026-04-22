import { Language } from './schoolData';

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.about': { en: 'About Us', fr: 'À Propos' },
  'nav.admissions': { en: 'Admissions', fr: 'Admissions' },
  'nav.academics': { en: 'Academics', fr: 'Programmes' },
  'nav.news': { en: 'News & Events', fr: 'Actualités' },
  'nav.contact': { en: 'Contact', fr: 'Contact' },
  'nav.login': { en: 'Portal Login', fr: 'Connexion Portail' },
  'nav.parentPortal': { en: 'Parent Portal', fr: 'Portail Parent' },
  'nav.teacherPortal': { en: 'Teacher Portal', fr: 'Portail Enseignant' },
  'nav.adminDashboard': { en: 'Admin Dashboard', fr: 'Tableau de Bord Admin' },

  // Hero
  'hero.title': { en: 'Bilingual Excellence in Education', fr: 'L\'Excellence Bilingue en Éducation' },
  'hero.subtitle': { en: 'Nurturing young minds in English and French from Pre-Nursery through Primary 6', fr: 'Former les jeunes esprits en anglais et en français de la pré-maternelle au CM2' },
  'hero.cta1': { en: 'Apply Now', fr: 'Postuler Maintenant' },
  'hero.cta2': { en: 'Learn More', fr: 'En Savoir Plus' },

  // About
  'about.title': { en: 'About Our School', fr: 'À Propos de Notre École' },
  'about.mission': { en: 'Our Mission', fr: 'Notre Mission' },
  'about.missionText': { en: 'To provide quality bilingual education that nurtures intellectual curiosity, moral values, and global citizenship in every child.', fr: 'Fournir une éducation bilingue de qualité qui nourrit la curiosité intellectuelle, les valeurs morales et la citoyenneté mondiale chez chaque enfant.' },
  'about.vision': { en: 'Our Vision', fr: 'Notre Vision' },
  'about.visionText': { en: 'To be the leading bilingual school in the region, producing well-rounded graduates who excel in both English and French.', fr: 'Être l\'école bilingue de référence dans la région, formant des diplômés complets qui excellent en anglais et en français.' },

  // Stats
  'stats.students': { en: 'Students Enrolled', fr: 'Élèves Inscrits' },
  'stats.teachers': { en: 'Qualified Teachers', fr: 'Enseignants Qualifiés' },
  'stats.years': { en: 'Years of Excellence', fr: 'Années d\'Excellence' },
  'stats.classes': { en: 'Classes', fr: 'Classes' },

  // Dashboard
  'dash.overview': { en: 'Dashboard Overview', fr: 'Aperçu du Tableau de Bord' },
  'dash.students': { en: 'Students', fr: 'Élèves' },
  'dash.teachers': { en: 'Teachers', fr: 'Enseignants' },
  'dash.fees': { en: 'School Fees', fr: 'Frais Scolaires' },
  'dash.timetable': { en: 'Timetable', fr: 'Emploi du Temps' },
  'dash.academics': { en: 'Academics', fr: 'Académique' },
  'dash.reports': { en: 'Report Cards', fr: 'Bulletins' },
  'dash.salary': { en: 'Salaries', fr: 'Salaires' },
  'dash.messages': { en: 'Messages', fr: 'Messages' },
  'dash.settings': { en: 'Settings', fr: 'Paramètres' },
  'dash.website': { en: 'Website', fr: 'Site Web' },
  'dash.logout': { en: 'Logout', fr: 'Déconnexion' },
  'dash.totalStudents': { en: 'Total Students', fr: 'Total Élèves' },
  'dash.totalTeachers': { en: 'Total Teachers', fr: 'Total Enseignants' },
  'dash.totalRevenue': { en: 'Total Revenue', fr: 'Revenu Total' },
  'dash.pendingFees': { en: 'Pending Fees', fr: 'Frais en Attente' },
  'dash.recentPayments': { en: 'Recent Payments', fr: 'Paiements Récents' },
  'dash.feeCollection': { en: 'Fee Collection', fr: 'Collecte des Frais' },

  // Student Management
  'student.add': { en: 'Add Student', fr: 'Ajouter un Élève' },
  'student.search': { en: 'Search students...', fr: 'Rechercher des élèves...' },
  'student.name': { en: 'Student Name', fr: 'Nom de l\'Élève' },
  'student.level': { en: 'Level', fr: 'Niveau' },
  'student.section': { en: 'Section', fr: 'Section' },
  'student.parent': { en: 'Parent/Guardian', fr: 'Parent/Tuteur' },
  'student.status': { en: 'Status', fr: 'Statut' },
  'student.actions': { en: 'Actions', fr: 'Actions' },

  // Fees
  'fee.total': { en: 'Total Amount', fr: 'Montant Total' },
  'fee.paid': { en: 'Amount Paid', fr: 'Montant Payé' },
  'fee.balance': { en: 'Balance', fr: 'Solde' },
  'fee.status': { en: 'Payment Status', fr: 'Statut de Paiement' },
  'fee.recordPayment': { en: 'Record Payment', fr: 'Enregistrer un Paiement' },

  // Common
  'common.save': { en: 'Save', fr: 'Enregistrer' },
  'common.cancel': { en: 'Cancel', fr: 'Annuler' },
  'common.edit': { en: 'Edit', fr: 'Modifier' },
  'common.delete': { en: 'Delete', fr: 'Supprimer' },
  'common.view': { en: 'View', fr: 'Voir' },
  'common.print': { en: 'Print', fr: 'Imprimer' },
  'common.download': { en: 'Download', fr: 'Télécharger' },
  'common.search': { en: 'Search', fr: 'Rechercher' },
  'common.filter': { en: 'Filter', fr: 'Filtrer' },
  'common.all': { en: 'All', fr: 'Tous' },
  'common.english': { en: 'English', fr: 'Anglais' },
  'common.french': { en: 'French', fr: 'Français' },
  'common.active': { en: 'Active', fr: 'Actif' },
  'common.submit': { en: 'Submit', fr: 'Soumettre' },
  'common.close': { en: 'Close', fr: 'Fermer' },
  'common.send': { en: 'Send', fr: 'Envoyer' },

  // Footer
  'footer.rights': { en: 'All rights reserved.', fr: 'Tous droits réservés.' },
  'footer.address': { en: 'Douala, Cameroon', fr: 'Douala, Cameroun' },
  'footer.quickLinks': { en: 'Quick Links', fr: 'Liens Rapides' },
  'footer.contact': { en: 'Contact Us', fr: 'Contactez-nous' },
  'footer.followUs': { en: 'Follow Us', fr: 'Suivez-nous' },

  // Admissions
  'admissions.title': { en: 'Admissions', fr: 'Admissions' },
  'admissions.subtitle': { en: 'Begin your child\'s bilingual education journey', fr: 'Commencez le parcours éducatif bilingue de votre enfant' },
  'admissions.apply': { en: 'Apply Online', fr: 'Postuler en Ligne' },
  'admissions.requirements': { en: 'Requirements', fr: 'Conditions Requises' },
  'admissions.process': { en: 'Admission Process', fr: 'Processus d\'Admission' },

  // Contact
  'contact.title': { en: 'Get in Touch', fr: 'Contactez-nous' },
  'contact.name': { en: 'Full Name', fr: 'Nom Complet' },
  'contact.email': { en: 'Email Address', fr: 'Adresse Email' },
  'contact.phone': { en: 'Phone Number', fr: 'Numéro de Téléphone' },
  'contact.message': { en: 'Message', fr: 'Message' },

  // Login
  'login.title': { en: 'Portal Login', fr: 'Connexion au Portail' },
  'login.email': { en: 'Email', fr: 'Email' },
  'login.password': { en: 'Password', fr: 'Mot de Passe' },
  'login.role': { en: 'Login as', fr: 'Se connecter en tant que' },
  'login.submit': { en: 'Sign In', fr: 'Se Connecter' },
  'login.forgot': { en: 'Forgot Password?', fr: 'Mot de passe oublié?' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || key;
}

export default translations;
