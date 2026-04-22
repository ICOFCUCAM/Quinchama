import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Language, UserRole, Student, Teacher, FeeRecord, SalaryRecord, Message, Grade,
  mockStudents, mockTeachers, mockFeeRecords, mockSalaryRecords, mockGrades, mockMessages,
  PaymentMethod, PaymentTransaction,
} from '@/lib/schoolData';
import {
  fetchStudents, fetchTeachers, fetchFeeRecords, fetchSalaryRecords, fetchGrades, fetchMessages,
  dbAddStudent, dbDeleteStudent, dbRecordPayment, dbAddMessage, dbUpdateGrade, dbProcessSalary,
  signInUser, signOutUser, signUpUser, getProfile,
  subscribeToPayments, subscribeToMessages, seedDatabase,
} from '@/lib/dbService';
import { supabase } from '@/lib/supabase';

export type Page =
  | 'home' | 'about' | 'admissions' | 'academics' | 'news' | 'contact' | 'login'
  | 'dashboard' | 'students' | 'teachers' | 'fees' | 'timetable' | 'grades' | 'reports' | 'salary' | 'messages' | 'settings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isLoggedIn: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  login: (role: UserRole, name: string) => void;
  loginWithEmail: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<boolean>;
  logout: () => void;
  students: Student[];
  teachers: Teacher[];
  feeRecords: FeeRecord[];
  salaryRecords: SalaryRecord[];
  grades: Grade[];
  messages: Message[];
  addStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  recordPayment: (feeId: string, amount: number, method: PaymentMethod) => void;
  addMessage: (msg: Message) => void;
  updateGrade: (gradeId: string, updates: Partial<Grade>) => void;
  processSalary: (salaryId: string) => void;
  isLoading: boolean;
  dbConnected: boolean;
  refreshData: () => void;
  runSeed: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(mockFeeRecords);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(mockSalaryRecords);
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const subsRef = useRef<any[]>([]);

  // Load data from DB on mount
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [s, t, f, sal, g, m] = await Promise.all([
        fetchStudents(), fetchTeachers(), fetchFeeRecords(),
        fetchSalaryRecords(), fetchGrades(), fetchMessages(),
      ]);
      // Check if we got real DB data (not mock fallback) by checking if first item has _dbId
      const isReal = s.length > 0 && (s[0] as any)._dbId;
      setDbConnected(!!isReal);
      setStudents(s);
      setTeachers(t);
      setFeeRecords(f);
      setSalaryRecords(sal);
      setGrades(g);
      setMessages(m);
    } catch {
      setDbConnected(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    // Check existing auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        getProfile(session.user.id).then(profile => {
          if (profile) {
            setIsLoggedIn(true);
            setUserRole(profile.role as UserRole);
            setUserName(profile.full_name);
            setUserEmail(profile.email);
          }
        });
      }
    });
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setIsLoggedIn(true);
          setUserRole(profile.role as UserRole);
          setUserName(profile.full_name);
          setUserEmail(profile.email);
          setCurrentPage('dashboard');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUserRole('public');
        setUserName('');
        setUserEmail('');
        setCurrentPage('home');
      }
    });
    return () => { subscription.unsubscribe(); };
  }, [loadData]);

  // Real-time subscriptions
  useEffect(() => {
    const paymentSub = subscribeToPayments((payload: any) => {
      toast.success(language === 'en' ? 'New payment received!' : 'Nouveau paiement reçu!');
      loadData(); // Refresh all data
    });
    const messageSub = subscribeToMessages((payload: any) => {
      toast.info(language === 'en' ? 'New message received!' : 'Nouveau message reçu!');
      loadData();
    });
    subsRef.current = [paymentSub, messageSub];
    return () => {
      subsRef.current.forEach(s => s?.unsubscribe?.());
    };
  }, [language, loadData]);

  const toggleSidebar = useCallback(() => setSidebarOpen(p => !p), []);

  // Demo login (no auth required)
  const login = useCallback((role: UserRole, name: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setUserName(name);
    setCurrentPage('dashboard');
    toast.success(language === 'en' ? `Welcome, ${name}!` : `Bienvenue, ${name}!`);
  }, [language]);

  // Real Supabase auth login
  const loginWithEmail = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await signInUser(email, password);
      if (error) {
        toast.error(error.message);
        return false;
      }
      if (data.user) {
        const profile = await getProfile(data.user.id);
        if (profile) {
          setIsLoggedIn(true);
          setUserRole(profile.role as UserRole);
          setUserName(profile.full_name);
          setUserEmail(profile.email);
          setCurrentPage('dashboard');
          toast.success(language === 'en' ? `Welcome, ${profile.full_name}!` : `Bienvenue, ${profile.full_name}!`);
          return true;
        }
      }
      // Fallback to demo login if no profile
      login(role, email.split('@')[0]);
      return true;
    } catch {
      // Fallback to demo login
      const names: Record<UserRole, string> = { admin: 'Dr. Grace Nkemba', teacher: 'John Okafor', parent: 'Amara Nkemba', public: 'Guest' };
      login(role, names[role]);
      return true;
    }
  }, [language, login]);

  // Sign up
  const signUp = useCallback(async (email: string, password: string, fullName: string, role: string): Promise<boolean> => {
    try {
      const { error } = await signUpUser(email, password, fullName, role);
      if (error) { toast.error(error.message); return false; }
      toast.success(language === 'en' ? 'Account created! Please check your email.' : 'Compte créé! Vérifiez votre email.');
      return true;
    } catch { toast.error('Sign up failed'); return false; }
  }, [language]);

  const logout = useCallback(async () => {
    await signOutUser();
    setIsLoggedIn(false);
    setUserRole('public');
    setUserName('');
    setUserEmail('');
    setCurrentPage('home');
    toast.info(language === 'en' ? 'Logged out successfully' : 'Déconnexion réussie');
  }, [language]);

  const addStudent = useCallback(async (student: Student) => {
    setStudents(prev => [...prev, student]);
    toast.success(language === 'en' ? 'Student added successfully' : 'Élève ajouté avec succès');
    dbAddStudent(student); // Fire and forget to DB
  }, [language]);

  const deleteStudent = useCallback(async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success(language === 'en' ? 'Student removed' : 'Élève supprimé');
    dbDeleteStudent(id);
  }, [language]);

  const recordPayment = useCallback(async (feeId: string, amount: number, method: PaymentMethod) => {
    setFeeRecords(prev => prev.map(f => {
      if (f.id !== feeId) return f;
      const newPaid = f.paidAmount + amount;
      const newBalance = f.totalAmount - newPaid;
      const newPayment: PaymentTransaction = {
        id: `TXN-${Date.now()}`, date: new Date().toISOString().split('T')[0],
        amount, method, reference: `REF${Math.floor(100000 + Math.random() * 900000)}`, status: 'confirmed',
      };
      return { ...f, paidAmount: newPaid, balance: newBalance, status: newBalance <= 0 ? 'paid' : 'partial', payments: [...f.payments, newPayment] } as FeeRecord;
    }));
    toast.success(language === 'en' ? 'Payment recorded successfully' : 'Paiement enregistré avec succès');
    dbRecordPayment(feeId, amount, method);
  }, [language]);

  const addMessage = useCallback(async (msg: Message) => {
    setMessages(prev => [msg, ...prev]);
    toast.success(language === 'en' ? 'Message sent' : 'Message envoyé');
    dbAddMessage(msg);
  }, [language]);

  const updateGrade = useCallback(async (gradeId: string, updates: Partial<Grade>) => {
    setGrades(prev => prev.map(g => g.id === gradeId ? { ...g, ...updates } : g));
    dbUpdateGrade(gradeId, updates);
  }, []);

  const processSalary = useCallback(async (salaryId: string) => {
    setSalaryRecords(prev => prev.map(s =>
      s.id === salaryId ? { ...s, status: 'paid' as const, paymentDate: new Date().toISOString().split('T')[0] } : s
    ));
    toast.success(language === 'en' ? 'Salary processed' : 'Salaire traité');
    dbProcessSalary(salaryId);
  }, [language]);

  const refreshData = useCallback(() => { loadData(); }, [loadData]);

  const runSeed = useCallback(async () => {
    toast.info(language === 'en' ? 'Seeding database...' : 'Initialisation de la base de données...');
    const result = await seedDatabase();
    if (result.success) {
      toast.success(language === 'en' ? 'Database seeded! Refreshing...' : 'Base de données initialisée! Actualisation...');
      setTimeout(loadData, 1000);
    } else {
      toast.error(result.message);
    }
  }, [language, loadData]);

  return (
    <AppContext.Provider value={{
      language, setLanguage, currentPage, setCurrentPage,
      sidebarOpen, toggleSidebar,
      isLoggedIn, userRole, userName, userEmail, login, loginWithEmail, signUp, logout,
      students, teachers, feeRecords, salaryRecords, grades, messages,
      addStudent, deleteStudent, recordPayment, addMessage, updateGrade, processSalary,
      isLoading, dbConnected, refreshData, runSeed,
    }}>
      {children}
    </AppContext.Provider>
  );
};
