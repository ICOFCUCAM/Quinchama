// ============================================
// TYPES
// ============================================

export type Language = 'en' | 'fr';
export type UserRole = 'admin' | 'teacher' | 'parent' | 'public';
export type Section = 'english' | 'french';
export type Level = 'prenursery' | 'nursery1' | 'nursery2' | 'primary1' | 'primary2' | 'primary3' | 'primary4' | 'primary5' | 'primary6';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';
export type PaymentMethod = 'mtn_momo' | 'orange_money' | 'bank_transfer' | 'cash';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type Term = 'term1' | 'term2' | 'term3';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  level: Level;
  section: Section;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  paymentRef: string;
  photo: string;
  enrollmentDate: string;
  status: 'active' | 'graduated' | 'withdrawn';
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  subjects: string[];
  assignedClasses: string[];
  section: Section;
  salary: number;
  hireDate: string;
  status: 'active' | 'on_leave' | 'terminated';
}

export interface ClassInfo {
  id: string;
  level: Level;
  section: Section;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  subjects: string[];
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  level: Level;
  section: Section;
  term: Term;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: PaymentStatus;
  payments: PaymentTransaction[];
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface SalaryRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  month: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'processing';
  paymentMethod: PaymentMethod;
  paymentDate?: string;
}

export interface TimetableSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  room: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  term: Term;
  commentEn: string;
  commentFr: string;
}

export interface Message {
  id: string;
  from: string;
  fromRole: UserRole;
  to: string;
  toRole: UserRole;
  subject: string;
  body: string;
  date: string;
  status: MessageStatus;
  type: 'announcement' | 'fee_reminder' | 'result_notification' | 'general';
}

export interface NewsEvent {
  id: string;
  title: string;
  titleFr: string;
  content: string;
  contentFr: string;
  date: string;
  image: string;
  category: 'news' | 'event' | 'announcement';
}

export interface AcademicCalendar {
  term: Term;
  label: string;
  labelFr: string;
  startDate: string;
  endDate: string;
  examStart: string;
  examEnd: string;
  holidays: { name: string; nameFr: string; date: string }[];
}

// ============================================
// CONSTANTS
// ============================================

export const LEVELS: { value: Level; labelEn: string; labelFr: string }[] = [
  { value: 'prenursery', labelEn: 'Pre-Nursery', labelFr: 'Pré-Maternelle' },
  { value: 'nursery1', labelEn: 'Nursery 1', labelFr: 'Maternelle 1' },
  { value: 'nursery2', labelEn: 'Nursery 2', labelFr: 'Maternelle 2' },
  { value: 'primary1', labelEn: 'Primary 1', labelFr: 'Cours Préparatoire' },
  { value: 'primary2', labelEn: 'Primary 2', labelFr: 'Cours Élémentaire 1' },
  { value: 'primary3', labelEn: 'Primary 3', labelFr: 'Cours Élémentaire 2' },
  { value: 'primary4', labelEn: 'Primary 4', labelFr: 'Cours Moyen 1' },
  { value: 'primary5', labelEn: 'Primary 5', labelFr: 'Cours Moyen 2' },
  { value: 'primary6', labelEn: 'Primary 6', labelFr: 'Classe de Sixième' },
];

export const SUBJECTS_EN = ['English Language', 'Mathematics', 'General Science', 'Social Studies', 'French Language', 'Physical Education', 'Creative Arts', 'ICT', 'Moral Education', 'Music'];
export const SUBJECTS_FR = ['Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Langue Anglaise', 'Éducation Physique', 'Arts Créatifs', 'Informatique', 'Éducation Morale', 'Musique'];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

export const TIME_SLOTS = [
  { start: '07:30', end: '08:15' },
  { start: '08:15', end: '09:00' },
  { start: '09:00', end: '09:45' },
  { start: '09:45', end: '10:00', isBreak: true },
  { start: '10:00', end: '10:45' },
  { start: '10:45', end: '11:30' },
  { start: '11:30', end: '12:15' },
  { start: '12:15', end: '13:00', isBreak: true },
  { start: '13:00', end: '13:45' },
  { start: '13:45', end: '14:30' },
];

export const FEE_STRUCTURE: Record<string, number> = {
  prenursery: 75000,
  nursery1: 85000,
  nursery2: 85000,
  primary1: 95000,
  primary2: 95000,
  primary3: 100000,
  primary4: 100000,
  primary5: 110000,
  primary6: 110000,
};

// ============================================
// IMAGES
// ============================================

export const IMAGES = {
  hero: 'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743263200_95f75ac9.jpg',
  school: 'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743397808_9d32dfdf.jpg',
  students: [
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743377079_f52f1e41.png',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743323863_a830b716.png',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743283988_7c6deed3.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743339184_75be52e9.png',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743542646_834450a1.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743544154_9f667d89.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743575429_e4e51e85.png',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743622428_7b58e5a4.png',
  ],
  teachers: [
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743428591_03af60d1.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743524003_10b5624d.png',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743422759_79d0497d.jpg',
    'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743438477_e485c306.png',
  ],
};

// ============================================
// MOCK DATA GENERATORS
// ============================================

const firstNames = ['Amara', 'Binta', 'Chidi', 'Dayo', 'Emeka', 'Fatou', 'Gbenga', 'Hadiza', 'Ibrahim', 'Juma', 'Kemi', 'Lamine', 'Musa', 'Ngozi', 'Oumar', 'Patience', 'Rashida', 'Sekou', 'Tunde', 'Uche', 'Viviane', 'Wale', 'Yemi', 'Zara'];
const lastNames = ['Nkemba', 'Okafor', 'Diallo', 'Mbeki', 'Fon', 'Tchinda', 'Njoku', 'Balogun', 'Kamara', 'Mensah', 'Adekunle', 'Ndiaye', 'Osei', 'Traore', 'Ekwueme', 'Foncha', 'Atanga', 'Ndongo', 'Tabi', 'Ewane'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(prefix: string): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BSME-2026-${prefix}${num}`;
}

// ============================================
// MOCK DATA
// ============================================

export const mockTeachers: Teacher[] = [
  { id: 'T001', firstName: 'Grace', lastName: 'Nkemba', email: 'grace.nkemba@bsme.edu', phone: '+237670001001', photo: IMAGES.teachers[0], subjects: ['English Language', 'Social Studies'], assignedClasses: ['prenursery-en'], section: 'english', salary: 180000, hireDate: '2022-09-01', status: 'active' },
  { id: 'T002', firstName: 'Marie', lastName: 'Tchinda', email: 'marie.tchinda@bsme.edu', phone: '+237670001002', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Études Sociales'], assignedClasses: ['prenursery-fr'], section: 'french', salary: 180000, hireDate: '2021-09-01', status: 'active' },
  { id: 'T003', firstName: 'John', lastName: 'Okafor', email: 'john.okafor@bsme.edu', phone: '+237670001003', photo: IMAGES.teachers[2], subjects: ['Mathematics', 'General Science'], assignedClasses: ['nursery1-en', 'nursery2-en'], section: 'english', salary: 200000, hireDate: '2020-09-01', status: 'active' },
  { id: 'T004', firstName: 'Sylvie', lastName: 'Diallo', email: 'sylvie.diallo@bsme.edu', phone: '+237670001004', photo: IMAGES.teachers[3], subjects: ['Mathématiques', 'Sciences Générales'], assignedClasses: ['nursery1-fr', 'nursery2-fr'], section: 'french', salary: 200000, hireDate: '2020-09-01', status: 'active' },
  { id: 'T005', firstName: 'Peter', lastName: 'Mbeki', email: 'peter.mbeki@bsme.edu', phone: '+237670001005', photo: IMAGES.teachers[0], subjects: ['English Language', 'Creative Arts'], assignedClasses: ['primary1-en', 'primary2-en'], section: 'english', salary: 220000, hireDate: '2019-09-01', status: 'active' },
  { id: 'T006', firstName: 'Claudine', lastName: 'Foncha', email: 'claudine.foncha@bsme.edu', phone: '+237670001006', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Arts Créatifs'], assignedClasses: ['primary1-fr', 'primary2-fr'], section: 'french', salary: 220000, hireDate: '2019-09-01', status: 'active' },
  { id: 'T007', firstName: 'David', lastName: 'Balogun', email: 'david.balogun@bsme.edu', phone: '+237670001007', photo: IMAGES.teachers[2], subjects: ['Mathematics', 'ICT'], assignedClasses: ['primary3-en', 'primary4-en'], section: 'english', salary: 240000, hireDate: '2018-09-01', status: 'active' },
  { id: 'T008', firstName: 'Aminata', lastName: 'Kamara', email: 'aminata.kamara@bsme.edu', phone: '+237670001008', photo: IMAGES.teachers[3], subjects: ['Mathématiques', 'Informatique'], assignedClasses: ['primary3-fr', 'primary4-fr'], section: 'french', salary: 240000, hireDate: '2018-09-01', status: 'active' },
  { id: 'T009', firstName: 'Samuel', lastName: 'Mensah', email: 'samuel.mensah@bsme.edu', phone: '+237670001009', photo: IMAGES.teachers[0], subjects: ['English Language', 'General Science', 'Physical Education'], assignedClasses: ['primary5-en', 'primary6-en'], section: 'english', salary: 260000, hireDate: '2017-09-01', status: 'active' },
  { id: 'T010', firstName: 'Fatima', lastName: 'Traore', email: 'fatima.traore@bsme.edu', phone: '+237670001010', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Sciences Générales', 'Éducation Physique'], assignedClasses: ['primary5-fr', 'primary6-fr'], section: 'french', salary: 260000, hireDate: '2017-09-01', status: 'active' },
  { id: 'T011', firstName: 'Emmanuel', lastName: 'Atanga', email: 'emmanuel.atanga@bsme.edu', phone: '+237670001011', photo: IMAGES.teachers[2], subjects: ['Music', 'Moral Education'], assignedClasses: ['primary1-en', 'primary2-en', 'primary3-en'], section: 'english', salary: 190000, hireDate: '2023-01-01', status: 'active' },
  { id: 'T012', firstName: 'Berthe', lastName: 'Ndongo', email: 'berthe.ndongo@bsme.edu', phone: '+237670001012', photo: IMAGES.teachers[3], subjects: ['Musique', 'Éducation Morale'], assignedClasses: ['primary1-fr', 'primary2-fr', 'primary3-fr'], section: 'french', salary: 190000, hireDate: '2023-01-01', status: 'active' },
];

export const mockClasses: ClassInfo[] = LEVELS.flatMap(level => [
  {
    id: `${level.value}-en`,
    level: level.value,
    section: 'english' as Section,
    teacherId: mockTeachers.find(t => t.assignedClasses.includes(`${level.value}-en`))?.id || 'T001',
    teacherName: (() => { const t = mockTeachers.find(t => t.assignedClasses.includes(`${level.value}-en`)); return t ? `${t.firstName} ${t.lastName}` : 'TBD'; })(),
    studentCount: Math.floor(15 + Math.random() * 15),
    subjects: SUBJECTS_EN,
  },
  {
    id: `${level.value}-fr`,
    level: level.value,
    section: 'french' as Section,
    teacherId: mockTeachers.find(t => t.assignedClasses.includes(`${level.value}-fr`))?.id || 'T002',
    teacherName: (() => { const t = mockTeachers.find(t => t.assignedClasses.includes(`${level.value}-fr`)); return t ? `${t.firstName} ${t.lastName}` : 'TBD'; })(),
    studentCount: Math.floor(15 + Math.random() * 15),
    subjects: SUBJECTS_FR,
  },
]);

export function generateStudents(count: number): Student[] {
  const students: Student[] = [];
  const levels: Level[] = ['prenursery', 'nursery1', 'nursery2', 'primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'];
  for (let i = 0; i < count; i++) {
    const fn = randomFrom(firstNames);
    const ln = randomFrom(lastNames);
    const level = levels[i % levels.length];
    const section: Section = i % 2 === 0 ? 'english' : 'french';
    const parentFn = randomFrom(firstNames);
    students.push({
      id: `BSME-2026-S${String(i + 1).padStart(4, '0')}`,
      firstName: fn,
      lastName: ln,
      dateOfBirth: `${2018 + Math.floor(Math.random() * 5)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
      gender: i % 2 === 0 ? 'M' : 'F',
      level,
      section,
      parentId: `P${String(i + 1).padStart(4, '0')}`,
      parentName: `${parentFn} ${ln}`,
      parentPhone: `+23767${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
      parentEmail: `${parentFn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
      paymentRef: `PAY-${ln.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`,
      photo: IMAGES.students[i % IMAGES.students.length],
      enrollmentDate: '2025-09-01',
      status: 'active',
    });
  }
  return students;
}

export const mockStudents = generateStudents(36);

export function generateFeeRecords(students: Student[]): FeeRecord[] {
  return students.map(s => {
    const total = FEE_STRUCTURE[s.level] || 85000;
    const paid = Math.floor(Math.random() * (total + 1));
    const payments: PaymentTransaction[] = [];
    if (paid > 0) {
      const numPayments = paid === total ? Math.ceil(Math.random() * 3) : Math.ceil(Math.random() * 2);
      let remaining = paid;
      for (let i = 0; i < numPayments && remaining > 0; i++) {
        const amt = i === numPayments - 1 ? remaining : Math.floor(remaining / (numPayments - i));
        payments.push({
          id: `TXN-${s.id}-${i + 1}`,
          date: `2026-0${1 + i}-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}`,
          amount: amt,
          method: randomFrom(['mtn_momo', 'orange_money', 'bank_transfer', 'cash'] as PaymentMethod[]),
          reference: `REF${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'confirmed',
        });
        remaining -= amt;
      }
    }
    return {
      id: `FEE-${s.id}`,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      level: s.level,
      section: s.section,
      term: 'term1' as Term,
      totalAmount: total,
      paidAmount: paid,
      balance: total - paid,
      status: paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
      payments,
    };
  });
}

export const mockFeeRecords = generateFeeRecords(mockStudents);

export function generateSalaryRecords(teachers: Teacher[]): SalaryRecord[] {
  const months = ['January 2026', 'February 2026', 'March 2026'];
  const records: SalaryRecord[] = [];
  teachers.forEach(t => {
    months.forEach((month, idx) => {
      const allowances = Math.floor(t.salary * 0.1);
      const deductions = Math.floor(t.salary * 0.05);
      records.push({
        id: `SAL-${t.id}-${idx + 1}`,
        teacherId: t.id,
        teacherName: `${t.firstName} ${t.lastName}`,
        month,
        baseSalary: t.salary,
        allowances,
        deductions,
        netSalary: t.salary + allowances - deductions,
        status: idx < 2 ? 'paid' : 'pending',
        paymentMethod: randomFrom(['mtn_momo', 'orange_money', 'bank_transfer'] as PaymentMethod[]),
        paymentDate: idx < 2 ? `2026-0${idx + 1}-28` : undefined,
      });
    });
  });
  return records;
}

export const mockSalaryRecords = generateSalaryRecords(mockTeachers);

export function generateTimetable(classId: string): TimetableSlot[] {
  const cls = mockClasses.find(c => c.id === classId);
  if (!cls) return [];
  const subjects = cls.subjects;
  const slots: TimetableSlot[] = [];
  DAYS.forEach(day => {
    TIME_SLOTS.forEach((ts, idx) => {
      if (ts.isBreak) return;
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const teacher = mockTeachers.find(t => t.assignedClasses.includes(classId));
      slots.push({
        id: `TT-${classId}-${day}-${idx}`,
        day,
        startTime: ts.start,
        endTime: ts.end,
        subject,
        teacherId: teacher?.id || 'T001',
        teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'TBD',
        classId,
        room: `Room ${Math.floor(100 + Math.random() * 20)}`,
      });
    });
  });
  return slots;
}

export function generateGrades(students: Student[]): Grade[] {
  const grades: Grade[] = [];
  students.forEach(s => {
    const subjects = s.section === 'english' ? SUBJECTS_EN : SUBJECTS_FR;
    subjects.forEach(subject => {
      const ca1 = Math.floor(5 + Math.random() * 16);
      const ca2 = Math.floor(5 + Math.random() * 16);
      const exam = Math.floor(20 + Math.random() * 41);
      const total = ca1 + ca2 + exam;
      let grade = 'F';
      if (total >= 80) grade = 'A';
      else if (total >= 70) grade = 'B';
      else if (total >= 60) grade = 'C';
      else if (total >= 50) grade = 'D';
      else if (total >= 40) grade = 'E';
      const comments: Record<string, { en: string; fr: string }> = {
        A: { en: 'Excellent performance. Keep it up!', fr: 'Excellente performance. Continuez ainsi!' },
        B: { en: 'Very good work. Well done!', fr: 'Très bon travail. Bien fait!' },
        C: { en: 'Good effort. Can improve further.', fr: 'Bon effort. Peut encore s\'améliorer.' },
        D: { en: 'Fair performance. Needs more effort.', fr: 'Performance passable. Doit faire plus d\'efforts.' },
        E: { en: 'Below average. Must work harder.', fr: 'En dessous de la moyenne. Doit travailler plus dur.' },
        F: { en: 'Poor performance. Requires urgent attention.', fr: 'Mauvaise performance. Nécessite une attention urgente.' },
      };
      grades.push({
        id: `GR-${s.id}-${subject.replace(/\s/g, '')}`,
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        subject,
        ca1,
        ca2,
        exam,
        total,
        grade,
        term: 'term1',
        commentEn: comments[grade].en,
        commentFr: comments[grade].fr,
      });
    });
  });
  return grades;
}

export const mockGrades = generateGrades(mockStudents);

export const mockMessages: Message[] = [
  { id: 'MSG001', from: 'Admin', fromRole: 'admin', to: 'All Parents', toRole: 'parent', subject: 'School Resumption Notice', body: 'Dear Parents, we are pleased to inform you that the new academic term begins on January 6th, 2026. Please ensure all fees are paid before resumption.', date: '2025-12-20', status: 'delivered', type: 'announcement' },
  { id: 'MSG002', from: 'Admin', fromRole: 'admin', to: 'All Parents', toRole: 'parent', subject: 'Fee Payment Reminder', body: 'This is a friendly reminder that school fees for Term 1 are due by January 15th, 2026. Payments can be made via MTN MoMo or Orange Money.', date: '2026-01-10', status: 'delivered', type: 'fee_reminder' },
  { id: 'MSG003', from: 'Grace Nkemba', fromRole: 'teacher', to: 'Amara Nkemba (Parent)', toRole: 'parent', subject: 'Student Progress Update', body: 'Dear Parent, I am writing to inform you about your child\'s excellent progress in English Language this term.', date: '2026-02-15', status: 'read', type: 'general' },
  { id: 'MSG004', from: 'Admin', fromRole: 'admin', to: 'All Teachers', toRole: 'teacher', subject: 'Staff Meeting Notice', body: 'All teachers are required to attend a staff meeting on Friday, March 6th at 3:00 PM in the conference room.', date: '2026-03-01', status: 'delivered', type: 'announcement' },
  { id: 'MSG005', from: 'Admin', fromRole: 'admin', to: 'All Parents', toRole: 'parent', subject: 'Report Cards Available', body: 'Term 1 report cards are now available on the parent portal. Please log in to view your child\'s academic performance.', date: '2026-03-25', status: 'sent', type: 'result_notification' },
];

export const mockNews: NewsEvent[] = [
  { id: 'N001', title: 'New Academic Year 2025/2026 Registration Open', titleFr: 'Inscriptions ouvertes pour l\'année académique 2025/2026', content: 'We are excited to announce that registration for the new academic year is now open. Early bird discounts available for registrations before August 31st.', contentFr: 'Nous sommes ravis d\'annoncer que les inscriptions pour la nouvelle année académique sont maintenant ouvertes. Réductions pour les inscriptions avant le 31 août.', date: '2025-07-15', image: IMAGES.school, category: 'announcement' },
  { id: 'N002', title: 'Annual Sports Day 2026', titleFr: 'Journée Sportive Annuelle 2026', content: 'Join us for our annual sports day on March 15th, 2026. Students will participate in various athletic events and team competitions.', contentFr: 'Rejoignez-nous pour notre journée sportive annuelle le 15 mars 2026. Les élèves participeront à divers événements athlétiques et compétitions par équipes.', date: '2026-02-28', image: IMAGES.students[0], category: 'event' },
  { id: 'N003', title: 'Bilingual Day Celebration', titleFr: 'Célébration de la Journée du Bilinguisme', content: 'Our school celebrates National Bilingualism Day with special cultural activities, poetry recitals, and drama performances in both English and French.', contentFr: 'Notre école célèbre la Journée nationale du bilinguisme avec des activités culturelles spéciales, des récitals de poésie et des représentations théâtrales en anglais et en français.', date: '2026-02-11', image: IMAGES.students[1], category: 'event' },
];

export const academicCalendar: AcademicCalendar[] = [
  {
    term: 'term1',
    label: 'First Term',
    labelFr: 'Premier Trimestre',
    startDate: '2025-09-08',
    endDate: '2025-12-19',
    examStart: '2025-12-08',
    examEnd: '2025-12-17',
    holidays: [
      { name: 'Youth Day', nameFr: 'Fête de la Jeunesse', date: '2025-02-11' },
      { name: 'Christmas Break', nameFr: 'Vacances de Noël', date: '2025-12-20' },
    ],
  },
  {
    term: 'term2',
    label: 'Second Term',
    labelFr: 'Deuxième Trimestre',
    startDate: '2026-01-06',
    endDate: '2026-03-27',
    examStart: '2026-03-16',
    examEnd: '2026-03-25',
    holidays: [
      { name: 'National Day', nameFr: 'Fête Nationale', date: '2026-02-11' },
    ],
  },
  {
    term: 'term3',
    label: 'Third Term',
    labelFr: 'Troisième Trimestre',
    startDate: '2026-04-13',
    endDate: '2026-07-03',
    examStart: '2026-06-22',
    examEnd: '2026-07-01',
    holidays: [
      { name: 'Labour Day', nameFr: 'Fête du Travail', date: '2026-05-01' },
      { name: 'National Day', nameFr: 'Fête Nationale', date: '2026-05-20' },
    ],
  },
];

// Helper to format currency (CFA Franc)
export function formatCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function getLevelLabel(level: Level, lang: Language): string {
  const l = LEVELS.find(l => l.value === level);
  return lang === 'en' ? (l?.labelEn || level) : (l?.labelFr || level);
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    mtn_momo: 'MTN MoMo',
    orange_money: 'Orange Money',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash',
  };
  return labels[method];
}
