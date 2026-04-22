import { supabase } from '@/lib/supabase';
import {
  Student, Teacher, FeeRecord, SalaryRecord, Grade, Message, PaymentMethod, PaymentTransaction,
  mockStudents, mockTeachers, mockFeeRecords, mockSalaryRecords, mockGrades, mockMessages,
  IMAGES, FEE_STRUCTURE, SUBJECTS_EN, SUBJECTS_FR,
} from '@/lib/schoolData';

// ============ TYPE MAPPERS ============
function mapStudent(row: any): Student {
  return {
    id: row.student_code || row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth || '',
    gender: row.gender || 'M',
    level: row.level,
    section: row.section,
    parentId: row.parent_id || '',
    parentName: row.parent_name || '',
    parentPhone: row.parent_phone || '',
    parentEmail: row.parent_email || '',
    paymentRef: row.payment_ref || '',
    photo: row.photo || IMAGES.students[0],
    enrollmentDate: row.enrollment_date || '',
    status: row.status || 'active',
    _dbId: row.id, // keep UUID for DB operations
  } as Student & { _dbId?: string };
}

function mapTeacher(row: any): Teacher {
  return {
    id: row.teacher_code || row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone || '',
    photo: row.photo || IMAGES.teachers[0],
    subjects: row.subjects || [],
    assignedClasses: row.assigned_classes || [],
    section: row.section,
    salary: Number(row.salary) || 0,
    hireDate: row.hire_date || '',
    status: row.status || 'active',
    _dbId: row.id,
  } as Teacher & { _dbId?: string };
}

function mapFeeRecord(row: any, payments: any[] = []): FeeRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name || '',
    level: row.level,
    section: row.section,
    term: row.term,
    totalAmount: Number(row.total_amount) || 0,
    paidAmount: Number(row.paid_amount) || 0,
    balance: Number(row.balance) || 0,
    status: row.status || 'unpaid',
    payments: payments.map(p => ({
      id: p.id,
      date: p.transaction_date || p.created_at?.split('T')[0] || '',
      amount: Number(p.amount) || 0,
      method: p.method as PaymentMethod,
      reference: p.reference || '',
      status: p.status || 'confirmed',
    })),
  };
}

function mapSalaryRecord(row: any): SalaryRecord {
  return {
    id: row.id,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name || '',
    month: row.month,
    baseSalary: Number(row.base_salary) || 0,
    allowances: Number(row.allowances) || 0,
    deductions: Number(row.deductions) || 0,
    netSalary: Number(row.net_salary) || 0,
    status: row.status || 'pending',
    paymentMethod: row.payment_method as PaymentMethod,
    paymentDate: row.payment_date || undefined,
  };
}

function mapGrade(row: any): Grade {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name || '',
    subject: row.subject,
    ca1: Number(row.ca1) || 0,
    ca2: Number(row.ca2) || 0,
    exam: Number(row.exam) || 0,
    total: Number(row.total) || 0,
    grade: row.grade || 'F',
    term: row.term,
    commentEn: row.comment_en || '',
    commentFr: row.comment_fr || '',
  };
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    from: row.sender_name,
    fromRole: row.sender_role as any,
    to: row.recipient,
    toRole: row.recipient_role as any,
    subject: row.subject,
    body: row.body,
    date: row.sent_at?.split('T')[0] || row.created_at?.split('T')[0] || '',
    status: row.status as any,
    type: row.message_type as any,
  };
}

// ============ DATA FETCHERS ============
export async function fetchStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase.from('students').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return mockStudents;
    return data.map(mapStudent);
  } catch { return mockStudents; }
}

export async function fetchTeachers(): Promise<Teacher[]> {
  try {
    const { data, error } = await supabase.from('teachers').select('*').order('teacher_code');
    if (error || !data || data.length === 0) return mockTeachers;
    return data.map(mapTeacher);
  } catch { return mockTeachers; }
}

export async function fetchFeeRecords(): Promise<FeeRecord[]> {
  try {
    const { data: fees, error } = await supabase.from('fee_records').select('*').order('created_at');
    if (error || !fees || fees.length === 0) return mockFeeRecords;
    const { data: payments } = await supabase.from('payment_transactions').select('*');
    return fees.map(f => mapFeeRecord(f, (payments || []).filter(p => p.fee_record_id === f.id)));
  } catch { return mockFeeRecords; }
}

export async function fetchSalaryRecords(): Promise<SalaryRecord[]> {
  try {
    const { data, error } = await supabase.from('salary_records').select('*').order('created_at');
    if (error || !data || data.length === 0) return mockSalaryRecords;
    return data.map(mapSalaryRecord);
  } catch { return mockSalaryRecords; }
}

export async function fetchGrades(): Promise<Grade[]> {
  try {
    const { data, error } = await supabase.from('grades').select('*').order('student_name');
    if (error || !data || data.length === 0) return mockGrades;
    return data.map(mapGrade);
  } catch { return mockGrades; }
}

export async function fetchMessages(): Promise<Message[]> {
  try {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return mockMessages;
    return data.map(mapMessage);
  } catch { return mockMessages; }
}

// ============ MUTATIONS ============
export async function dbAddStudent(student: Student): Promise<boolean> {
  try {
    const { error } = await supabase.from('students').insert({
      student_code: student.id,
      first_name: student.firstName,
      last_name: student.lastName,
      date_of_birth: student.dateOfBirth || null,
      gender: student.gender,
      level: student.level,
      section: student.section,
      parent_name: student.parentName,
      parent_phone: student.parentPhone,
      parent_email: student.parentEmail,
      payment_ref: student.paymentRef,
      photo: student.photo,
      enrollment_date: student.enrollmentDate,
      status: student.status,
    });
    return !error;
  } catch { return false; }
}

export async function dbDeleteStudent(studentCode: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('students').delete().eq('student_code', studentCode);
    return !error;
  } catch { return false; }
}

export async function dbRecordPayment(feeId: string, amount: number, method: PaymentMethod): Promise<boolean> {
  try {
    // Get fee record
    const { data: fee } = await supabase.from('fee_records').select('*').eq('id', feeId).single();
    if (!fee) return false;
    const newPaid = Number(fee.paid_amount) + amount;
    const newBalance = Number(fee.total_amount) - newPaid;
    // Update fee record
    await supabase.from('fee_records').update({
      paid_amount: newPaid,
      balance: newBalance,
      status: newBalance <= 0 ? 'paid' : 'partial',
      updated_at: new Date().toISOString(),
    }).eq('id', feeId);
    // Insert payment transaction
    await supabase.from('payment_transactions').insert({
      fee_record_id: feeId,
      student_id: fee.student_id,
      amount,
      method,
      reference: `REF${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed',
      transaction_date: new Date().toISOString().split('T')[0],
    });
    return true;
  } catch { return false; }
}

export async function dbAddMessage(msg: Message): Promise<boolean> {
  try {
    const { error } = await supabase.from('messages').insert({
      sender_name: msg.from,
      sender_role: msg.fromRole,
      recipient: msg.to,
      recipient_role: msg.toRole,
      subject: msg.subject,
      body: msg.body,
      message_type: msg.type,
      status: 'sent',
    });
    return !error;
  } catch { return false; }
}

export async function dbUpdateGrade(gradeId: string, updates: Partial<Grade>): Promise<boolean> {
  try {
    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.ca1 !== undefined) dbUpdates.ca1 = updates.ca1;
    if (updates.ca2 !== undefined) dbUpdates.ca2 = updates.ca2;
    if (updates.exam !== undefined) dbUpdates.exam = updates.exam;
    if (updates.total !== undefined) dbUpdates.total = updates.total;
    if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
    const { error } = await supabase.from('grades').update(dbUpdates).eq('id', gradeId);
    return !error;
  } catch { return false; }
}

export async function dbProcessSalary(salaryId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('salary_records').update({
      status: 'paid',
      payment_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }).eq('id', salaryId);
    return !error;
  } catch { return false; }
}

// ============ AUTH ============
export async function signUpUser(email: string, password: string, fullName: string, role: string) {
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } });
  if (!error && data.user) {
    await supabase.from('profiles').insert({ auth_id: data.user.id, email, full_name: fullName, role });
  }
  return { data, error };
}

export async function signInUser(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}

export async function getProfile(authId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('auth_id', authId).single();
  return data;
}

// ============ REALTIME ============
export function subscribeToPayments(callback: (payload: any) => void) {
  return supabase.channel('payment-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payment_transactions' }, callback).subscribe();
}

export function subscribeToMessages(callback: (payload: any) => void) {
  return supabase.channel('message-changes').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, callback).subscribe();
}

// ============ SEED FROM CLIENT ============
export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await supabase.functions.invoke('seed-bsme-data', { body: {} });
    return { success: true, message: data?.message || 'Seed initiated' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Seed failed' };
  }
}
