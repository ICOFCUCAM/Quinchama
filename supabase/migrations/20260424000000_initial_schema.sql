-- Quinchama School Management System - Initial Schema

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    auth_id uuid,
    email text NOT NULL,
    full_name text NOT NULL,
    role text NOT NULL,
    phone text,
    avatar_url text,
    section text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'teacher'::text, 'parent'::text]))),
    CONSTRAINT profiles_section_check CHECK ((section = ANY (ARRAY['english'::text, 'french'::text])))
);

CREATE TABLE public.teachers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    profile_id uuid,
    teacher_code text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    photo text,
    subjects text[] DEFAULT '{}'::text[],
    assigned_classes text[] DEFAULT '{}'::text[],
    section text NOT NULL,
    salary numeric(12,2) DEFAULT 0,
    hire_date date,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT teachers_section_check CHECK ((section = ANY (ARRAY['english'::text, 'french'::text]))),
    CONSTRAINT teachers_status_check CHECK ((status = ANY (ARRAY['active'::text, 'on_leave'::text, 'terminated'::text])))
);

CREATE TABLE public.students (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_code text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    date_of_birth date,
    gender text,
    level text NOT NULL,
    section text NOT NULL,
    parent_id uuid,
    parent_name text,
    parent_phone text,
    parent_email text,
    payment_ref text,
    photo text,
    enrollment_date date DEFAULT CURRENT_DATE,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT students_gender_check CHECK ((gender = ANY (ARRAY['M'::text, 'F'::text]))),
    CONSTRAINT students_section_check CHECK ((section = ANY (ARRAY['english'::text, 'french'::text]))),
    CONSTRAINT students_status_check CHECK ((status = ANY (ARRAY['active'::text, 'graduated'::text, 'withdrawn'::text])))
);

CREATE TABLE public.classes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    class_code text NOT NULL,
    level text NOT NULL,
    section text NOT NULL,
    teacher_id uuid,
    teacher_name text,
    student_count integer DEFAULT 0,
    subjects text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT classes_section_check CHECK ((section = ANY (ARRAY['english'::text, 'french'::text])))
);

CREATE TABLE public.fee_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid,
    student_name text,
    level text,
    section text,
    term text NOT NULL,
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    paid_amount numeric(12,2) DEFAULT 0 NOT NULL,
    balance numeric(12,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'unpaid'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fee_records_status_check CHECK ((status = ANY (ARRAY['paid'::text, 'partial'::text, 'unpaid'::text]))),
    CONSTRAINT fee_records_term_check CHECK ((term = ANY (ARRAY['term1'::text, 'term2'::text, 'term3'::text])))
);

CREATE TABLE public.payment_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fee_record_id uuid,
    student_id uuid,
    amount numeric(12,2) NOT NULL,
    method text NOT NULL,
    reference text,
    status text DEFAULT 'confirmed'::text,
    transaction_date date DEFAULT CURRENT_DATE,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_transactions_method_check CHECK ((method = ANY (ARRAY['mtn_momo'::text, 'orange_money'::text, 'bank_transfer'::text, 'cash'::text]))),
    CONSTRAINT payment_transactions_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'pending'::text, 'failed'::text])))
);

CREATE TABLE public.salary_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    teacher_id uuid,
    teacher_name text,
    month text NOT NULL,
    base_salary numeric(12,2) DEFAULT 0 NOT NULL,
    allowances numeric(12,2) DEFAULT 0,
    deductions numeric(12,2) DEFAULT 0,
    net_salary numeric(12,2) DEFAULT 0 NOT NULL,
    status text DEFAULT 'pending'::text,
    payment_method text,
    payment_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT salary_records_payment_method_check CHECK ((payment_method = ANY (ARRAY['mtn_momo'::text, 'orange_money'::text, 'bank_transfer'::text, 'cash'::text]))),
    CONSTRAINT salary_records_status_check CHECK ((status = ANY (ARRAY['paid'::text, 'pending'::text, 'processing'::text])))
);

CREATE TABLE public.grades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid,
    student_name text,
    subject text NOT NULL,
    ca1 numeric(5,2) DEFAULT 0,
    ca2 numeric(5,2) DEFAULT 0,
    exam numeric(5,2) DEFAULT 0,
    total numeric(5,2) DEFAULT 0,
    grade text,
    term text NOT NULL,
    comment_en text,
    comment_fr text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT grades_term_check CHECK ((term = ANY (ARRAY['term1'::text, 'term2'::text, 'term3'::text])))
);

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sender_name text NOT NULL,
    sender_role text NOT NULL,
    recipient text NOT NULL,
    recipient_role text,
    subject text NOT NULL,
    body text NOT NULL,
    message_type text DEFAULT 'general'::text,
    status text DEFAULT 'sent'::text,
    sent_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT messages_message_type_check CHECK ((message_type = ANY (ARRAY['announcement'::text, 'fee_reminder'::text, 'result_notification'::text, 'general'::text]))),
    CONSTRAINT messages_status_check CHECK ((status = ANY (ARRAY['sent'::text, 'delivered'::text, 'read'::text, 'failed'::text])))
);

-- ============================================================
-- PRIMARY KEYS & UNIQUE CONSTRAINTS
-- ============================================================

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id),
    ADD CONSTRAINT profiles_auth_id_key UNIQUE (auth_id);

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id),
    ADD CONSTRAINT teachers_teacher_code_key UNIQUE (teacher_code);

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id),
    ADD CONSTRAINT students_student_code_key UNIQUE (student_code);

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id),
    ADD CONSTRAINT classes_class_code_key UNIQUE (class_code);

ALTER TABLE ONLY public.fee_records
    ADD CONSTRAINT fee_records_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_auth_id ON public.profiles USING btree (auth_id);
CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);
CREATE INDEX idx_students_level ON public.students USING btree (level);
CREATE INDEX idx_students_section ON public.students USING btree (section);
CREATE INDEX idx_students_parent_id ON public.students USING btree (parent_id);
CREATE INDEX idx_fee_records_student_id ON public.fee_records USING btree (student_id);
CREATE INDEX idx_fee_records_status ON public.fee_records USING btree (status);
CREATE INDEX idx_payment_transactions_fee_record_id ON public.payment_transactions USING btree (fee_record_id);
CREATE INDEX idx_salary_records_teacher_id ON public.salary_records USING btree (teacher_id);
CREATE INDEX idx_grades_student_id ON public.grades USING btree (student_id);
CREATE INDEX idx_grades_term ON public.grades USING btree (term);
CREATE INDEX idx_messages_status ON public.messages USING btree (status);

-- ============================================================
-- FOREIGN KEYS
-- ============================================================

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.fee_records
    ADD CONSTRAINT fee_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_fee_record_id_fkey FOREIGN KEY (fee_record_id) REFERENCES public.fee_records(id) ON DELETE CASCADE,
    ADD CONSTRAINT payment_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.salary_records
    ADD CONSTRAINT salary_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON public.profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE USING (true);

-- Teachers policies
CREATE POLICY teachers_select ON public.teachers FOR SELECT USING (true);
CREATE POLICY teachers_insert ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY teachers_update ON public.teachers FOR UPDATE USING (true);
CREATE POLICY teachers_delete ON public.teachers FOR DELETE USING (true);

-- Students policies
CREATE POLICY students_select ON public.students FOR SELECT USING (true);
CREATE POLICY students_insert ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY students_update ON public.students FOR UPDATE USING (true);
CREATE POLICY students_delete ON public.students FOR DELETE USING (true);

-- Classes policies
CREATE POLICY classes_select ON public.classes FOR SELECT USING (true);
CREATE POLICY classes_insert ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY classes_update ON public.classes FOR UPDATE USING (true);

-- Fee records policies
CREATE POLICY fee_records_select ON public.fee_records FOR SELECT USING (true);
CREATE POLICY fee_records_insert ON public.fee_records FOR INSERT WITH CHECK (true);
CREATE POLICY fee_records_update ON public.fee_records FOR UPDATE USING (true);

-- Payment transactions policies
CREATE POLICY payment_transactions_select ON public.payment_transactions FOR SELECT USING (true);
CREATE POLICY payment_transactions_insert ON public.payment_transactions FOR INSERT WITH CHECK (true);

-- Salary records policies
CREATE POLICY salary_records_select ON public.salary_records FOR SELECT USING (true);
CREATE POLICY salary_records_insert ON public.salary_records FOR INSERT WITH CHECK (true);
CREATE POLICY salary_records_update ON public.salary_records FOR UPDATE USING (true);

-- Grades policies
CREATE POLICY grades_select ON public.grades FOR SELECT USING (true);
CREATE POLICY grades_insert ON public.grades FOR INSERT WITH CHECK (true);
CREATE POLICY grades_update ON public.grades FOR UPDATE USING (true);

-- Messages policies
CREATE POLICY messages_select ON public.messages FOR SELECT USING (true);
CREATE POLICY messages_insert ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY messages_update ON public.messages FOR UPDATE USING (true);

-- ============================================================
-- REALTIME TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.realtime_notify_messages() RETURNS trigger
    LANGUAGE plpgsql AS $$
DECLARE
  payload jsonb;
  payload_text text;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'schema', 'public',
    'table', TG_TABLE_NAME,
    'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END,
    'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)::jsonb ELSE NULL END,
    'commit_timestamp', now()::text
  );
  payload_text := payload::text;
  IF length(payload_text) > 7500 THEN
    payload := jsonb_build_object(
      'type', TG_OP, 'schema', 'public', 'table', TG_TABLE_NAME,
      'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN jsonb_build_object('id', NEW.id) ELSE NULL END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN jsonb_build_object('id', OLD.id) ELSE NULL END,
      'commit_timestamp', now()::text, 'truncated', true
    );
    payload_text := payload::text;
  END IF;
  BEGIN
    PERFORM pg_notify('realtime:public:messages', payload_text);
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.realtime_notify_payment_transactions() RETURNS trigger
    LANGUAGE plpgsql AS $$
DECLARE
  payload jsonb;
  payload_text text;
BEGIN
  payload := jsonb_build_object(
    'type', TG_OP,
    'schema', 'public',
    'table', TG_TABLE_NAME,
    'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END,
    'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)::jsonb ELSE NULL END,
    'commit_timestamp', now()::text
  );
  payload_text := payload::text;
  IF length(payload_text) > 7500 THEN
    payload := jsonb_build_object(
      'type', TG_OP, 'schema', 'public', 'table', TG_TABLE_NAME,
      'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN jsonb_build_object('id', NEW.id) ELSE NULL END,
      'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN jsonb_build_object('id', OLD.id) ELSE NULL END,
      'commit_timestamp', now()::text, 'truncated', true
    );
    payload_text := payload::text;
  END IF;
  BEGIN
    PERFORM pg_notify('realtime:public:payment_transactions', payload_text);
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER realtime_trigger_messages
    AFTER INSERT OR DELETE OR UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.realtime_notify_messages();

CREATE TRIGGER realtime_trigger_payment_transactions
    AFTER INSERT OR DELETE OR UPDATE ON public.payment_transactions
    FOR EACH ROW EXECUTE FUNCTION public.realtime_notify_payment_transactions();
