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

    // Check if data already exists
    const { count } = await supabase.from('teachers').select('*', { count: 'exact', head: true });
    if (count && count > 0) {
      return new Response(JSON.stringify({ message: 'Data already seeded', count }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 1. Create admin profile
    const { data: adminProfile } = await supabase.from('profiles').insert({
      email: 'admin@quinchama.edu',
      full_name: 'Dr. Grace Nkemba',
      role: 'admin',
      phone: '+237670001000'
    }).select().single();

    // 2. Create teacher profiles and teachers
    const teacherData = [
      { code: 'T001', fn: 'Grace', ln: 'Nkemba', email: 'grace.nkemba@quinchama.edu', phone: '+237670001001', subjects: ['English Language', 'Social Studies'], classes: ['prenursery-en'], section: 'english', salary: 180000, hire: '2022-09-01' },
      { code: 'T002', fn: 'Marie', ln: 'Tchinda', email: 'marie.tchinda@quinchama.edu', phone: '+237670001002', subjects: ['Langue Française', 'Études Sociales'], classes: ['prenursery-fr'], section: 'french', salary: 180000, hire: '2021-09-01' },
      { code: 'T003', fn: 'John', ln: 'Okafor', email: 'john.okafor@quinchama.edu', phone: '+237670001003', subjects: ['Mathematics', 'General Science'], classes: ['nursery1-en', 'nursery2-en'], section: 'english', salary: 200000, hire: '2020-09-01' },
      { code: 'T004', fn: 'Sylvie', ln: 'Diallo', email: 'sylvie.diallo@quinchama.edu', phone: '+237670001004', subjects: ['Mathématiques', 'Sciences Générales'], classes: ['nursery1-fr', 'nursery2-fr'], section: 'french', salary: 200000, hire: '2020-09-01' },
      { code: 'T005', fn: 'Peter', ln: 'Mbeki', email: 'peter.mbeki@quinchama.edu', phone: '+237670001005', subjects: ['English Language', 'Creative Arts'], classes: ['primary1-en', 'primary2-en'], section: 'english', salary: 220000, hire: '2019-09-01' },
      { code: 'T006', fn: 'Claudine', ln: 'Foncha', email: 'claudine.foncha@quinchama.edu', phone: '+237670001006', subjects: ['Langue Française', 'Arts Créatifs'], classes: ['primary1-fr', 'primary2-fr'], section: 'french', salary: 220000, hire: '2019-09-01' },
      { code: 'T007', fn: 'David', ln: 'Balogun', email: 'david.balogun@quinchama.edu', phone: '+237670001007', subjects: ['Mathematics', 'ICT'], classes: ['primary3-en', 'primary4-en'], section: 'english', salary: 240000, hire: '2018-09-01' },
      { code: 'T008', fn: 'Aminata', ln: 'Kamara', email: 'aminata.kamara@quinchama.edu', phone: '+237670001008', subjects: ['Mathématiques', 'Informatique'], classes: ['primary3-fr', 'primary4-fr'], section: 'french', salary: 240000, hire: '2018-09-01' },
      { code: 'T009', fn: 'Samuel', ln: 'Mensah', email: 'samuel.mensah@quinchama.edu', phone: '+237670001009', subjects: ['English Language', 'General Science', 'Physical Education'], classes: ['primary5-en', 'primary6-en'], section: 'english', salary: 260000, hire: '2017-09-01' },
      { code: 'T010', fn: 'Fatima', ln: 'Traore', email: 'fatima.traore@quinchama.edu', phone: '+237670001010', subjects: ['Langue Française', 'Sciences Générales', 'Éducation Physique'], classes: ['primary5-fr', 'primary6-fr'], section: 'french', salary: 260000, hire: '2017-09-01' },
      { code: 'T011', fn: 'Emmanuel', ln: 'Atanga', email: 'emmanuel.atanga@quinchama.edu', phone: '+237670001011', subjects: ['Music', 'Moral Education'], classes: ['primary1-en', 'primary2-en', 'primary3-en'], section: 'english', salary: 190000, hire: '2023-01-01' },
      { code: 'T012', fn: 'Berthe', ln: 'Ndongo', email: 'berthe.ndongo@quinchama.edu', phone: '+237670001012', subjects: ['Musique', 'Éducation Morale'], classes: ['primary1-fr', 'primary2-fr', 'primary3-fr'], section: 'french', salary: 190000, hire: '2023-01-01' },
    ];

    // Create teacher profiles
    const teacherProfiles = teacherData.map(t => ({
      email: t.email, full_name: `${t.fn} ${t.ln}`, role: 'teacher', phone: t.phone, section: t.section
    }));
    const { data: tProfiles } = await supabase.from('profiles').insert(teacherProfiles).select();

    // Create teachers
    const teacherRows = teacherData.map((t, i) => ({
      profile_id: tProfiles?.[i]?.id,
      teacher_code: t.code,
      first_name: t.fn,
      last_name: t.ln,
      email: t.email,
      phone: t.phone,
      photo: IMAGES.teachers[i % IMAGES.teachers.length],
      subjects: t.subjects,
      assigned_classes: t.classes,
      section: t.section,
      salary: t.salary,
      hire_date: t.hire,
      status: 'active'
    }));
    const { data: insertedTeachers } = await supabase.from('teachers').insert(teacherRows).select();

    // 3. Create parent profile
    const { data: parentProfile } = await supabase.from('profiles').insert({
      email: 'parent@quinchama.edu',
      full_name: 'Amara Nkemba',
      role: 'parent',
      phone: '+237670009001'
    }).select().single();

    // 4. Create students
    const firstNames = ['Amara', 'Binta', 'Chidi', 'Dayo', 'Emeka', 'Fatou', 'Gbenga', 'Hadiza', 'Ibrahim', 'Juma', 'Kemi', 'Lamine', 'Musa', 'Ngozi', 'Oumar', 'Patience', 'Rashida', 'Sekou', 'Tunde', 'Uche', 'Viviane', 'Wale', 'Yemi', 'Zara', 'Aisha', 'Bola', 'Chioma', 'Dele', 'Efua', 'Femi', 'Grace', 'Hassan', 'Ife', 'Joseph', 'Kofi', 'Lola'];
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
        student_code: `QA-2026-S${String(i + 1).padStart(4, '0')}`,
        first_name: fn,
        last_name: ln,
        date_of_birth: `${2018 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
        gender: i % 2 === 0 ? 'M' : 'F',
        level,
        section,
        parent_id: i === 0 ? parentProfile?.id : null,
        parent_name: `${parentFn} ${ln}`,
        parent_phone: `+23767${String(1000000 + i * 111).padStart(7, '0')}`,
        parent_email: `${parentFn.toLowerCase()}.${ln.toLowerCase()}@email.com`,
        payment_ref: `PAY-${ln.toUpperCase().slice(0, 3)}-${String(i + 1).padStart(4, '0')}`,
        photo: IMAGES.students[i % IMAGES.students.length],
        enrollment_date: '2025-09-01',
        status: 'active'
      });
    }
    const { data: insertedStudents } = await supabase.from('students').insert(studentRows).select();

    // 5. Create fee records and payment transactions
    const feeRows = [];
    const paymentRows = [];
    for (const s of (insertedStudents || [])) {
      const total = feeStructure[s.level] || 85000;
      const paid = Math.floor(Math.random() * (total + 1));
      const balance = total - paid;
      const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
      feeRows.push({
        student_id: s.id,
        student_name: `${s.first_name} ${s.last_name}`,
        level: s.level,
        section: s.section,
        term: 'term1',
        total_amount: total,
        paid_amount: paid,
        balance,
        status
      });
    }
    const { data: insertedFees } = await supabase.from('fee_records').insert(feeRows).select();

    // Create payment transactions for paid/partial fees
    for (const fee of (insertedFees || [])) {
      if (fee.paid_amount > 0) {
        const methods = ['mtn_momo', 'orange_money', 'bank_transfer', 'cash'];
        paymentRows.push({
          fee_record_id: fee.id,
          student_id: fee.student_id,
          amount: fee.paid_amount,
          method: methods[Math.floor(Math.random() * methods.length)],
          reference: `REF${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'confirmed',
          transaction_date: '2026-01-15'
        });
      }
    }
    if (paymentRows.length > 0) {
      await supabase.from('payment_transactions').insert(paymentRows);
    }

    // 6. Create salary records
    const salaryRows = [];
    const months = ['January 2026', 'February 2026', 'March 2026'];
    for (const t of (insertedTeachers || [])) {
      for (let mi = 0; mi < months.length; mi++) {
        const allowances = Math.floor(Number(t.salary) * 0.1);
        const deductions = Math.floor(Number(t.salary) * 0.05);
        const methods = ['mtn_momo', 'orange_money', 'bank_transfer'];
        salaryRows.push({
          teacher_id: t.id,
          teacher_name: `${t.first_name} ${t.last_name}`,
          month: months[mi],
          base_salary: t.salary,
          allowances,
          deductions,
          net_salary: Number(t.salary) + allowances - deductions,
          status: mi < 2 ? 'paid' : 'pending',
          payment_method: methods[Math.floor(Math.random() * methods.length)],
          payment_date: mi < 2 ? `2026-0${mi + 1}-28` : null
        });
      }
    }
    await supabase.from('salary_records').insert(salaryRows);

    // 7. Create grades
    const SUBJECTS_EN = ['English Language', 'Mathematics', 'General Science', 'Social Studies', 'French Language', 'Physical Education', 'Creative Arts', 'ICT', 'Moral Education', 'Music'];
    const SUBJECTS_FR = ['Langue Française', 'Mathématiques', 'Sciences Générales', 'Études Sociales', 'Langue Anglaise', 'Éducation Physique', 'Arts Créatifs', 'Informatique', 'Éducation Morale', 'Musique'];
    const gradeComments: Record<string, { en: string; fr: string }> = {
      A: { en: 'Excellent performance. Keep it up!', fr: 'Excellente performance. Continuez ainsi!' },
      B: { en: 'Very good work. Well done!', fr: 'Très bon travail. Bien fait!' },
      C: { en: 'Good effort. Can improve further.', fr: 'Bon effort. Peut encore s\'améliorer.' },
      D: { en: 'Fair performance. Needs more effort.', fr: 'Performance passable. Doit faire plus d\'efforts.' },
      E: { en: 'Below average. Must work harder.', fr: 'En dessous de la moyenne. Doit travailler plus dur.' },
      F: { en: 'Poor performance. Requires urgent attention.', fr: 'Mauvaise performance. Nécessite une attention urgente.' },
    };

    const gradeRows = [];
    for (const s of (insertedStudents || [])) {
      const subjects = s.section === 'english' ? SUBJECTS_EN : SUBJECTS_FR;
      for (const subject of subjects) {
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
        gradeRows.push({
          student_id: s.id,
          student_name: `${s.first_name} ${s.last_name}`,
          subject,
          ca1, ca2, exam, total, grade,
          term: 'term1',
          comment_en: gradeComments[grade].en,
          comment_fr: gradeComments[grade].fr
        });
      }
    }
    // Insert in batches
    for (let i = 0; i < gradeRows.length; i += 100) {
      await supabase.from('grades').insert(gradeRows.slice(i, i + 100));
    }

    // 8. Create messages
    const messageRows = [
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'School Resumption Notice', body: 'Dear Parents, we are pleased to inform you that the new academic term begins on January 6th, 2026. Please ensure all fees are paid before resumption.', message_type: 'announcement', status: 'delivered' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'Fee Payment Reminder', body: 'This is a friendly reminder that school fees for Term 1 are due by January 15th, 2026. Payments can be made via MTN MoMo or Orange Money.', message_type: 'fee_reminder', status: 'delivered' },
      { sender_name: 'Grace Nkemba', sender_role: 'teacher', recipient: 'Amara Nkemba (Parent)', recipient_role: 'parent', subject: 'Student Progress Update', body: "Dear Parent, I am writing to inform you about your child's excellent progress in English Language this term.", message_type: 'general', status: 'read' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Teachers', recipient_role: 'teacher', subject: 'Staff Meeting Notice', body: 'All teachers are required to attend a staff meeting on Friday, March 6th at 3:00 PM in the conference room.', message_type: 'announcement', status: 'delivered' },
      { sender_name: 'Admin', sender_role: 'admin', recipient: 'All Parents', recipient_role: 'parent', subject: 'Report Cards Available', body: 'Term 1 report cards are now available on the parent portal. Please log in to view your child\'s academic performance.', message_type: 'result_notification', status: 'sent' },
    ];
    await supabase.from('messages').insert(messageRows);

    // 9. Create classes
    const LEVELS_DATA = [
      { value: 'prenursery', labelEn: 'Pre-Nursery' },
      { value: 'nursery1', labelEn: 'Nursery 1' },
      { value: 'nursery2', labelEn: 'Nursery 2' },
      { value: 'primary1', labelEn: 'Primary 1' },
      { value: 'primary2', labelEn: 'Primary 2' },
      { value: 'primary3', labelEn: 'Primary 3' },
      { value: 'primary4', labelEn: 'Primary 4' },
      { value: 'primary5', labelEn: 'Primary 5' },
      { value: 'primary6', labelEn: 'Primary 6' },
    ];
    const classRows = [];
    for (const level of LEVELS_DATA) {
      for (const section of ['english', 'french']) {
        const classCode = `${level.value}-${section === 'english' ? 'en' : 'fr'}`;
        const teacher = (insertedTeachers || []).find((t: any) => t.assigned_classes?.includes(classCode));
        const studentCount = (insertedStudents || []).filter((s: any) => s.level === level.value && s.section === section).length;
        classRows.push({
          class_code: classCode,
          level: level.value,
          section,
          teacher_id: teacher?.id || null,
          teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'TBD',
          student_count: studentCount,
          subjects: section === 'english'
            ? SUBJECTS_EN
            : SUBJECTS_FR
        });
      }
    }
    await supabase.from('classes').insert(classRows);

    return new Response(JSON.stringify({
      success: true,
      message: 'Database seeded successfully',
      counts: {
        teachers: insertedTeachers?.length || 0,
        students: insertedStudents?.length || 0,
        fees: insertedFees?.length || 0,
        grades: gradeRows.length,
        salaries: salaryRows.length,
        messages: messageRows.length,
        classes: classRows.length
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
