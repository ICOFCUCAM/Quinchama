import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const IMAGES = {
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

    // Clean existing data first
    await supabase.from('grades').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('payment_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('fee_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('salary_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('classes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('teachers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const errors: string[] = [];

    // 1. Create profiles
    const profileRows = [
      { email: 'admin@bsme.edu', full_name: 'Dr. Grace Nkemba', role: 'admin', phone: '+237670001000' },
      { email: 'parent@bsme.edu', full_name: 'Amara Nkemba', role: 'parent', phone: '+237670009001' },
    ];
    const { data: profiles, error: profErr } = await supabase.from('profiles').insert(profileRows).select();
    if (profErr) errors.push(`profiles: ${profErr.message}`);

    // 2. Create teachers (without profile_id for simplicity)
    const teacherData = [
      { teacher_code: 'T001', first_name: 'Grace', last_name: 'Nkemba', email: 'grace.nkemba@bsme.edu', phone: '+237670001001', photo: IMAGES.teachers[0], subjects: ['English Language', 'Social Studies'], assigned_classes: ['prenursery-en'], section: 'english', salary: 180000, hire_date: '2022-09-01', status: 'active' },
      { teacher_code: 'T002', first_name: 'Marie', last_name: 'Tchinda', email: 'marie.tchinda@bsme.edu', phone: '+237670001002', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Études Sociales'], assigned_classes: ['prenursery-fr'], section: 'french', salary: 180000, hire_date: '2021-09-01', status: 'active' },
      { teacher_code: 'T003', first_name: 'John', last_name: 'Okafor', email: 'john.okafor@bsme.edu', phone: '+237670001003', photo: IMAGES.teachers[2], subjects: ['Mathematics', 'General Science'], assigned_classes: ['nursery1-en', 'nursery2-en'], section: 'english', salary: 200000, hire_date: '2020-09-01', status: 'active' },
      { teacher_code: 'T004', first_name: 'Sylvie', last_name: 'Diallo', email: 'sylvie.diallo@bsme.edu', phone: '+237670001004', photo: IMAGES.teachers[3], subjects: ['Mathématiques', 'Sciences Générales'], assigned_classes: ['nursery1-fr', 'nursery2-fr'], section: 'french', salary: 200000, hire_date: '2020-09-01', status: 'active' },
      { teacher_code: 'T005', first_name: 'Peter', last_name: 'Mbeki', email: 'peter.mbeki@bsme.edu', phone: '+237670001005', photo: IMAGES.teachers[0], subjects: ['English Language', 'Creative Arts'], assigned_classes: ['primary1-en', 'primary2-en'], section: 'english', salary: 220000, hire_date: '2019-09-01', status: 'active' },
      { teacher_code: 'T006', first_name: 'Claudine', last_name: 'Foncha', email: 'claudine.foncha@bsme.edu', phone: '+237670001006', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Arts Créatifs'], assigned_classes: ['primary1-fr', 'primary2-fr'], section: 'french', salary: 220000, hire_date: '2019-09-01', status: 'active' },
      { teacher_code: 'T007', first_name: 'David', last_name: 'Balogun', email: 'david.balogun@bsme.edu', phone: '+237670001007', photo: IMAGES.teachers[2], subjects: ['Mathematics', 'ICT'], assigned_classes: ['primary3-en', 'primary4-en'], section: 'english', salary: 240000, hire_date: '2018-09-01', status: 'active' },
      { teacher_code: 'T008', first_name: 'Aminata', last_name: 'Kamara', email: 'aminata.kamara@bsme.edu', phone: '+237670001008', photo: IMAGES.teachers[3], subjects: ['Mathématiques', 'Informatique'], assigned_classes: ['primary3-fr', 'primary4-fr'], section: 'french', salary: 240000, hire_date: '2018-09-01', status: 'active' },
      { teacher_code: 'T009', first_name: 'Samuel', last_name: 'Mensah', email: 'samuel.mensah@bsme.edu', phone: '+237670001009', photo: IMAGES.teachers[0], subjects: ['English Language', 'General Science', 'Physical Education'], assigned_classes: ['primary5-en', 'primary6-en'], section: 'english', salary: 260000, hire_date: '2017-09-01', status: 'active' },
      { teacher_code: 'T010', first_name: 'Fatima', last_name: 'Traore', email: 'fatima.traore@bsme.edu', phone: '+237670001010', photo: IMAGES.teachers[1], subjects: ['Langue Française', 'Sciences Générales', 'Éducation Physique'], assigned_classes: ['primary5-fr', 'primary6-fr'], section: 'french', salary: 260000, hire_date: '2017-09-01', status: 'active' },
      { teacher_code: 'T011', first_name: 'Emmanuel', last_name: 'Atanga', email: 'emmanuel.atanga@bsme.edu', phone: '+237670001011', photo: IMAGES.teachers[2], subjects: ['Music', 'Moral Education'], assigned_classes: ['primary1-en', 'primary2-en', 'primary3-en'], section: 'english', salary: 190000, hire_date: '2023-01-01', status: 'active' },
      { teacher_code: 'T012', first_name: 'Berthe', last_name: 'Ndongo', email: 'berthe.ndongo@bsme.edu', phone: '+237670001012', photo: IMAGES.teachers[3], subjects: ['Musique', 'Éducation Morale'], assigned_classes: ['primary1-fr', 'primary2-fr', 'primary3-fr'], section: 'french', salary: 190000, hire_date: '2023-01-01', status: 'active' },
    ];
    const { data: insertedTeachers, error: tErr } = await supabase.from('teachers').insert(teacherData).select();
    if (tErr) errors.push(`teachers: ${tErr.message}`);

    // 3. Create students
    const firstNames = ['Amara', 'Binta', 'Chidi', 'Dayo', 'Emeka', 'Fatou', 'Gbenga', 'Hadiza', 'Ibrahim', 'Juma', 'Kemi', 'Lamine', 'Musa', 'Ngozi', 'Oumar', 'Patience', 'Rashida', 'Sekou', 'Tunde', 'Uche', 'Viviane', 'Wale', 'Yemi', 'Zara', 'Aisha', 'Bola', 'Chioma', 'Dele', 'Efua', 'Femi', 'Grace2', 'Hassan', 'Ife', 'Joseph', 'Kofi', 'Lola'];
    const lastNames = ['Nkemba', 'Okafor', 'Diallo', 'Mbeki', 'Fon', 'Tchinda', 'Njoku', 'Balogun', 'Kamara', 'Mensah', 'Adekunle', 'Ndiaye', 'Osei', 'Traore', 'Ekwueme', 'Foncha', 'Atanga', 'Ndongo', 'Tabi', 'Ewane'];
    const levels = ['prenursery', 'nursery1', 'nursery2', 'primary1', 'primary2', 'primary3', 'primary4', 'primary5', 'primary6'];
    const feeStructure: Record<string, number> = { prenursery: 75000, nursery1: 85000, nursery2: 85000, primary1: 95000, primary2: 95000, primary3: 100000, primary4: 100000, primary5: 110000, primary6: 110000 };

    const studentRows = [];
    for (let i = 0; i < 36; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const level = levels[i % levels.length];
      const section = i % 2 === 0 ? 'english' : 'french';
      const parentFn = firstNames[(i + 5) % firstNames.length];
      studentRows.push({
        student_code: `BSME-2026-S${String(i + 1).padStart(4, '0')}`,
        first_name: fn, last_name: ln,
        date_of_birth: `${2018 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
        gender: i % 2 === 0 ? 'M' : 'F',
        level, section,
        parent_name: `${parentFn} ${ln}`,
        parent_phone: `+23767${String(1000000 + i * 111).padStart(7, '0')}`,
        parent_email: `${parentFn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
        payment_ref: `PAY-${ln.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`,
        photo: IMAGES.students[i % IMAGES.students.length],
        enrollment_date: '2025-09-01', status: 'active'
      });
    }
    const { data: insertedStudents, error: sErr } = await supabase.from('students').insert(studentRows).select();
    if (sErr) errors.push(`students: ${sErr.message}`);

    // 4. Fee records
    const feeRows = (insertedStudents || []).map((s: any) => {
      const total = feeStructure[s.level] || 85000;
      const paid = Math.floor(Math.random() * (total + 1));
      return {
        student_id: s.id, student_name: `${s.first_name} ${s.last_name}`,
        level: s.level, section: s.section, term: 'term1',
        total_amount: total, paid_amount: paid, balance: total - paid,
        status: paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
      };
    });
    const { data: insertedFees, error: fErr } = await supabase.from('fee_records').insert(feeRows).select();
    if (fErr) errors.push(`fees: ${fErr.message}`);

    // 5. Payment transactions
    const paymentRows = (insertedFees || []).filter((f: any) => f.paid_amount > 0).map((f: any) => ({
      fee_record_id: f.id, student_id: f.student_id, amount: f.paid_amount,
      method: ['mtn_momo', 'orange_money', 'bank_transfer', 'cash'][Math.floor(Math.random() * 4)],
      reference: `REF${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmed', transaction_date: '2026-01-15'
    }));
    if (paymentRows.length > 0) {
      const { error: pErr } = await supabase.from('payment_transactions').insert(paymentRows);
      if (pErr) errors.push(`payments: ${pErr.message}`);
    }

    // 6. Salary records
    const salaryRows: any[] = [];
    const months = ['January 2026', 'February 2026', 'March 2026'];
    for (const t of (insertedTeachers || [])) {
      for (let mi = 0; mi < months.length; mi++) {
        const a = Math.floor(Number(t.salary) * 0.1);
        const d = Math.floor(Number(t.salary) * 0.05);
        salaryRows.push({
          teacher_id: t.id, teacher_name: `${t.first_name} ${t.last_name}`,
          month: months[mi], base_salary: t.salary, allowances: a, deductions: d,
          net_salary: Number(t.salary) + a - d,
          status: mi < 2 ? 'paid' : 'pending',
          payment_method: ['mtn_momo', 'orange_money', 'bank_transfer'][Math.floor(Math.random() * 3)],
          payment_date: mi < 2 ? `2026-0${mi + 1}-28` : null
        });
      }
    }
    if (salaryRows.length > 0) {
      const { error: salErr } = await supabase.from('salary_records').insert(salaryRows);
      if (salErr) errors.push(`salaries: ${salErr.message}`);
    }

    // 7. Grades
    const SUBJECTS_EN = ['English Language', 'Mathematics', 'General Science', 'Social Studies', 'French Language', 'Physical Education', 'Creative Arts', 'ICT', 'Moral Education', 'Music'];
    const SUBJECTS_FR = ['Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Langue Anglaise', 'Éducation Physique', 'Arts Créatifs', 'Informatique', 'Éducation Morale', 'Musique'];
    const gc: Record<string, { en: string; fr: string }> = {
      A: { en: 'Excellent performance. Keep it up!', fr: 'Excellente performance. Continuez ainsi!' },
      B: { en: 'Very good work. Well done!', fr: 'Très bon travail. Bien fait!' },
      C: { en: 'Good effort. Can improve further.', fr: 'Bon effort.' },
      D: { en: 'Fair performance. Needs more effort.', fr: 'Performance passable.' },
      E: { en: 'Below average. Must work harder.', fr: 'En dessous de la moyenne.' },
      F: { en: 'Poor performance.', fr: 'Mauvaise performance.' },
    };
    const gradeRows: any[] = [];
    for (const s of (insertedStudents || [])) {
      const subjects = s.section === 'english' ? SUBJECTS_EN : SUBJECTS_FR;
      for (const subject of subjects) {
        const ca1 = Math.floor(5 + Math.random() * 16);
        const ca2 = Math.floor(5 + Math.random() * 16);
        const exam = Math.floor(20 + Math.random() * 41);
        const total = ca1 + ca2 + exam;
        let grade = 'F';
        if (total >= 80) grade = 'A'; else if (total >= 70) grade = 'B'; else if (total >= 60) grade = 'C'; else if (total >= 50) grade = 'D'; else if (total >= 40) grade = 'E';
        gradeRows.push({ student_id: s.id, student_name: `${s.first_name} ${s.last_name}`, subject, ca1, ca2, exam, total, grade, term: 'term1', comment_en: gc[grade].en, comment_fr: gc[grade].fr });
      }
    }
    for (let i = 0; i < gradeRows.length; i += 50) {
      const { error: gErr } = await supabase.from('grades').insert(gradeRows.slice(i, i + 50));
      if (gErr) errors.push(`grades batch ${i}: ${gErr.message}`);
    }

    // 8. Messages
    await supabase.from('messages').insert([
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'School Resumption Notice', body: 'Dear Parents, the new academic term begins on January 6th, 2026.', message_type: 'announcement', status: 'delivered' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'Fee Payment Reminder', body: 'School fees for Term 1 are due by January 15th, 2026.', message_type: 'fee_reminder', status: 'delivered' },
      { sender_name: 'Grace Nkemba', sender_role: 'teacher', recipient: 'Amara Nkemba (Parent)', recipient_role: 'parent', subject: 'Student Progress Update', body: 'Your child has shown excellent progress this term.', message_type: 'general', status: 'read' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Teachers', recipient_role: 'teacher', subject: 'Staff Meeting Notice', body: 'Staff meeting on Friday, March 6th at 3:00 PM.', message_type: 'announcement', status: 'delivered' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'Report Cards Available', body: 'Term 1 report cards are now available.', message_type: 'result_notification', status: 'sent' },
    ]);

    // 9. Classes
    const SUBJECTS_EN_REF = ['English Language', 'Mathematics', 'General Science', 'Social Studies', 'French Language', 'Physical Education', 'Creative Arts', 'ICT', 'Moral Education', 'Music'];
    const SUBJECTS_FR_REF = ['Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Langue Anglaise', 'Éducation Physique', 'Arts Créatifs', 'Informatique', 'Éducation Morale', 'Musique'];
    const classRows: any[] = [];
    for (const lv of ['prenursery','nursery1','nursery2','primary1','primary2','primary3','primary4','primary5','primary6']) {
      for (const sec of ['english', 'french']) {
        const cc = `${lv}-${sec === 'english' ? 'en' : 'fr'}`;
        const teacher = (insertedTeachers || []).find((t: any) => t.assigned_classes?.includes(cc));
        const sc = (insertedStudents || []).filter((s: any) => s.level === lv && s.section === sec).length;
        classRows.push({ class_code: cc, level: lv, section: sec, teacher_id: teacher?.id || null, teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'TBD', student_count: sc, subjects: sec === 'english' ? SUBJECTS_EN_REF : SUBJECTS_FR_REF });
      }
    }
    await supabase.from('classes').insert(classRows);

    return new Response(JSON.stringify({
      success: errors.length === 0,
      errors,
      counts: {
        profiles: profiles?.length || 0,
        teachers: insertedTeachers?.length || 0,
        students: insertedStudents?.length || 0,
        fees: insertedFees?.length || 0,
        grades: gradeRows.length,
        salaries: salaryRows.length,
      }
    }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
