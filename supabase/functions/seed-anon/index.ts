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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const IMGS_S = [
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743377079_f52f1e41.png',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743323863_a830b716.png',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743283988_7c6deed3.jpg',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743339184_75be52e9.png',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743542646_834450a1.jpg',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743544154_9f667d89.jpg',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743575429_e4e51e85.png',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743622428_7b58e5a4.png',
    ];
    const IMGS_T = [
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743428591_03af60d1.jpg',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743524003_10b5624d.png',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743422759_79d0497d.jpg',
      'https://d64gsuwffb70l.cloudfront.net/69d7b0a57b133f5246626fb5_1775743438477_e485c306.png',
    ];

    // Clean
    await supabase.from('grades').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('payment_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('fee_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('salary_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('classes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('teachers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const errs: string[] = [];

    // Profiles
    const { data: profs, error: e1 } = await supabase.from('profiles').insert([
      { email: 'admin@bsme.edu', full_name: 'Dr. Grace Nkemba', role: 'admin', phone: '+237670001000' },
      { email: 'parent@bsme.edu', full_name: 'Amara Nkemba', role: 'parent', phone: '+237670009001' },
    ]).select();
    if (e1) errs.push('profiles:' + e1.message);

    // Teachers
    const td = [
      { teacher_code:'T001',first_name:'Grace',last_name:'Nkemba',email:'grace.nkemba@bsme.edu',phone:'+237670001001',photo:IMGS_T[0],subjects:['English Language','Social Studies'],assigned_classes:['prenursery-en'],section:'english',salary:180000,hire_date:'2022-09-01',status:'active'},
      { teacher_code:'T002',first_name:'Marie',last_name:'Tchinda',email:'marie.tchinda@bsme.edu',phone:'+237670001002',photo:IMGS_T[1],subjects:['Langue Française','Études Sociales'],assigned_classes:['prenursery-fr'],section:'french',salary:180000,hire_date:'2021-09-01',status:'active'},
      { teacher_code:'T003',first_name:'John',last_name:'Okafor',email:'john.okafor@bsme.edu',phone:'+237670001003',photo:IMGS_T[2],subjects:['Mathematics','General Science'],assigned_classes:['nursery1-en','nursery2-en'],section:'english',salary:200000,hire_date:'2020-09-01',status:'active'},
      { teacher_code:'T004',first_name:'Sylvie',last_name:'Diallo',email:'sylvie.diallo@bsme.edu',phone:'+237670001004',photo:IMGS_T[3],subjects:['Mathématiques','Sciences Générales'],assigned_classes:['nursery1-fr','nursery2-fr'],section:'french',salary:200000,hire_date:'2020-09-01',status:'active'},
      { teacher_code:'T005',first_name:'Peter',last_name:'Mbeki',email:'peter.mbeki@bsme.edu',phone:'+237670001005',photo:IMGS_T[0],subjects:['English Language','Creative Arts'],assigned_classes:['primary1-en','primary2-en'],section:'english',salary:220000,hire_date:'2019-09-01',status:'active'},
      { teacher_code:'T006',first_name:'Claudine',last_name:'Foncha',email:'claudine.foncha@bsme.edu',phone:'+237670001006',photo:IMGS_T[1],subjects:['Langue Française','Arts Créatifs'],assigned_classes:['primary1-fr','primary2-fr'],section:'french',salary:220000,hire_date:'2019-09-01',status:'active'},
      { teacher_code:'T007',first_name:'David',last_name:'Balogun',email:'david.balogun@bsme.edu',phone:'+237670001007',photo:IMGS_T[2],subjects:['Mathematics','ICT'],assigned_classes:['primary3-en','primary4-en'],section:'english',salary:240000,hire_date:'2018-09-01',status:'active'},
      { teacher_code:'T008',first_name:'Aminata',last_name:'Kamara',email:'aminata.kamara@bsme.edu',phone:'+237670001008',photo:IMGS_T[3],subjects:['Mathématiques','Informatique'],assigned_classes:['primary3-fr','primary4-fr'],section:'french',salary:240000,hire_date:'2018-09-01',status:'active'},
      { teacher_code:'T009',first_name:'Samuel',last_name:'Mensah',email:'samuel.mensah@bsme.edu',phone:'+237670001009',photo:IMGS_T[0],subjects:['English Language','General Science','Physical Education'],assigned_classes:['primary5-en','primary6-en'],section:'english',salary:260000,hire_date:'2017-09-01',status:'active'},
      { teacher_code:'T010',first_name:'Fatima',last_name:'Traore',email:'fatima.traore@bsme.edu',phone:'+237670001010',photo:IMGS_T[1],subjects:['Langue Française','Sciences Générales'],assigned_classes:['primary5-fr','primary6-fr'],section:'french',salary:260000,hire_date:'2017-09-01',status:'active'},
      { teacher_code:'T011',first_name:'Emmanuel',last_name:'Atanga',email:'emmanuel.atanga@bsme.edu',phone:'+237670001011',photo:IMGS_T[2],subjects:['Music','Moral Education'],assigned_classes:['primary1-en','primary2-en','primary3-en'],section:'english',salary:190000,hire_date:'2023-01-01',status:'active'},
      { teacher_code:'T012',first_name:'Berthe',last_name:'Ndongo',email:'berthe.ndongo@bsme.edu',phone:'+237670001012',photo:IMGS_T[3],subjects:['Musique','Éducation Morale'],assigned_classes:['primary1-fr','primary2-fr','primary3-fr'],section:'french',salary:190000,hire_date:'2023-01-01',status:'active'},
    ];
    const { data: teachers, error: e2 } = await supabase.from('teachers').insert(td).select();
    if (e2) errs.push('teachers:' + e2.message);

    // Students
    const fns = ['Amara','Binta','Chidi','Dayo','Emeka','Fatou','Gbenga','Hadiza','Ibrahim','Juma','Kemi','Lamine','Musa','Ngozi','Oumar','Patience','Rashida','Sekou','Tunde','Uche','Viviane','Wale','Yemi','Zara','Aisha','Bola','Chioma','Dele','Efua','Femi','Gracia','Hassan','Ife','Joseph','Kofi','Lola'];
    const lns = ['Nkemba','Okafor','Diallo','Mbeki','Fon','Tchinda','Njoku','Balogun','Kamara','Mensah','Adekunle','Ndiaye','Osei','Traore','Ekwueme','Foncha','Atanga','Ndongo','Tabi','Ewane'];
    const lvls = ['prenursery','nursery1','nursery2','primary1','primary2','primary3','primary4','primary5','primary6'];
    const fees: Record<string,number> = {prenursery:75000,nursery1:85000,nursery2:85000,primary1:95000,primary2:95000,primary3:100000,primary4:100000,primary5:110000,primary6:110000};

    const sRows = [];
    for (let i = 0; i < 36; i++) {
      const fn = fns[i%fns.length], ln = lns[i%lns.length], lv = lvls[i%lvls.length], sec = i%2===0?'english':'french';
      sRows.push({ student_code:`BSME-2026-S${String(i+1).padStart(4,'0')}`, first_name:fn, last_name:ln, date_of_birth:`${2018+(i%5)}-${String(1+(i%12)).padStart(2,'0')}-${String(1+(i%28)).padStart(2,'0')}`, gender:i%2===0?'M':'F', level:lv, section:sec, parent_name:`${fns[(i+5)%fns.length]} ${ln}`, parent_phone:`+23767${String(1000000+i*111).padStart(7,'0')}`, parent_email:`${fn.toLowerCase()}.${ln.toLowerCase()}@email.com`, payment_ref:`PAY-${ln.toUpperCase().slice(0,3)}-${String(i+1).padStart(4,'0')}`, photo:IMGS_S[i%IMGS_S.length], enrollment_date:'2025-09-01', status:'active' });
    }
    const { data: students, error: e3 } = await supabase.from('students').insert(sRows).select();
    if (e3) errs.push('students:' + e3.message);

    // Fees
    const fRows = (students||[]).map((s:any)=>{const t=fees[s.level]||85000;const p=Math.floor(Math.random()*(t+1));return{student_id:s.id,student_name:`${s.first_name} ${s.last_name}`,level:s.level,section:s.section,term:'term1',total_amount:t,paid_amount:p,balance:t-p,status:p>=t?'paid':p>0?'partial':'unpaid'};});
    const { data: feeData, error: e4 } = await supabase.from('fee_records').insert(fRows).select();
    if (e4) errs.push('fees:' + e4.message);

    // Payments
    const pRows = (feeData||[]).filter((f:any)=>f.paid_amount>0).map((f:any)=>({fee_record_id:f.id,student_id:f.student_id,amount:f.paid_amount,method:['mtn_momo','orange_money','bank_transfer','cash'][Math.floor(Math.random()*4)],reference:`REF${Math.floor(100000+Math.random()*900000)}`,status:'confirmed',transaction_date:'2026-01-15'}));
    if(pRows.length>0){const{error:e5}=await supabase.from('payment_transactions').insert(pRows);if(e5)errs.push('payments:'+e5.message);}

    // Salaries
    const salRows:any[]=[];
    for(const t of(teachers||[])){for(let m=0;m<3;m++){const a=Math.floor(Number(t.salary)*0.1),d=Math.floor(Number(t.salary)*0.05);salRows.push({teacher_id:t.id,teacher_name:`${t.first_name} ${t.last_name}`,month:['January 2026','February 2026','March 2026'][m],base_salary:t.salary,allowances:a,deductions:d,net_salary:Number(t.salary)+a-d,status:m<2?'paid':'pending',payment_method:['mtn_momo','orange_money','bank_transfer'][m%3],payment_date:m<2?`2026-0${m+1}-28`:null});}}
    if(salRows.length>0){const{error:e6}=await supabase.from('salary_records').insert(salRows);if(e6)errs.push('salaries:'+e6.message);}

    // Grades
    const SE=['English Language','Mathematics','General Science','Social Studies','French Language','Physical Education','Creative Arts','ICT','Moral Education','Music'];
    const SF=['Langue Française','Mathématiques','Sciences Générales','Études Sociales','Langue Anglaise','Éducation Physique','Arts Créatifs','Informatique','Éducation Morale','Musique'];
    const gRows:any[]=[];
    for(const s of(students||[])){const subs=s.section==='english'?SE:SF;for(const sub of subs){const c1=Math.floor(5+Math.random()*16),c2=Math.floor(5+Math.random()*16),ex=Math.floor(20+Math.random()*41),tot=c1+c2+ex;let g='F';if(tot>=80)g='A';else if(tot>=70)g='B';else if(tot>=60)g='C';else if(tot>=50)g='D';else if(tot>=40)g='E';gRows.push({student_id:s.id,student_name:`${s.first_name} ${s.last_name}`,subject:sub,ca1:c1,ca2:c2,exam:ex,total:tot,grade:g,term:'term1',comment_en:g==='A'?'Excellent!':g==='B'?'Very good!':g==='C'?'Good effort.':g==='D'?'Fair.':g==='E'?'Below average.':'Poor.',comment_fr:g==='A'?'Excellent!':g==='B'?'Très bien!':g==='C'?'Bon effort.':g==='D'?'Passable.':g==='E'?'Insuffisant.':'Faible.'});}}
    for(let i=0;i<gRows.length;i+=50){const{error:e7}=await supabase.from('grades').insert(gRows.slice(i,i+50));if(e7)errs.push('grades:'+e7.message);}

    // Messages
    await supabase.from('messages').insert([
      {sender_name:'Admin',sender_role:'admin',recipient:'All Parents',recipient_role:'parent',subject:'School Resumption Notice',body:'Dear Parents, the new academic term begins on January 6th, 2026.',message_type:'announcement',status:'delivered'},
      {sender_name:'Admin',sender_role:'admin',recipient:'All Parents',recipient_role:'parent',subject:'Fee Payment Reminder',body:'School fees for Term 1 are due by January 15th, 2026.',message_type:'fee_reminder',status:'delivered'},
      {sender_name:'Grace Nkemba',sender_role:'teacher',recipient:'Amara Nkemba (Parent)',recipient_role:'parent',subject:'Student Progress Update',body:'Your child has shown excellent progress this term.',message_type:'general',status:'read'},
      {sender_name:'Admin',sender_role:'admin',recipient:'All Teachers',recipient_role:'teacher',subject:'Staff Meeting Notice',body:'Staff meeting on Friday, March 6th at 3:00 PM.',message_type:'announcement',status:'delivered'},
      {sender_name:'Admin',sender_role:'admin',recipient:'All Parents',recipient_role:'parent',subject:'Report Cards Available',body:'Term 1 report cards are now available.',message_type:'result_notification',status:'sent'},
    ]);

    // Classes
    const cRows:any[]=[];
    for(const lv of lvls){for(const sec of['english','french']){const cc=`${lv}-${sec==='english'?'en':'fr'}`;const t=(teachers||[]).find((x:any)=>x.assigned_classes?.includes(cc));const sc=(students||[]).filter((x:any)=>x.level===lv&&x.section===sec).length;cRows.push({class_code:cc,level:lv,section:sec,teacher_id:t?.id||null,teacher_name:t?`${t.first_name} ${t.last_name}`:'TBD',student_count:sc,subjects:sec==='english'?SE:SF});}}
    await supabase.from('classes').insert(cRows);

    return new Response(JSON.stringify({success:errs.length===0,errors:errs,counts:{profiles:profs?.length||0,teachers:teachers?.length||0,students:students?.length||0,fees:feeData?.length||0,grades:gRows.length,salaries:salRows.length}}),{headers:{'Content-Type':'application/json',...corsHeaders}});
  } catch(error) {
    return new Response(JSON.stringify({error:error.message}),{status:500,headers:{'Content-Type':'application/json',...corsHeaders}});
  }
});
