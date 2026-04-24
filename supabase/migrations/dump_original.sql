--
-- PostgreSQL database dump
--


-- Dumped from database version 15.12
-- Dumped by pg_dump version 15.16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: prj_Lj7icxkW4B-c; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "prj_Lj7icxkW4B-c";


--
-- Name: prj_Lj7icxkW4B-c_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "prj_Lj7icxkW4B-c_auth";


--
-- Name: prj_Lj7icxkW4B-c_storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "prj_Lj7icxkW4B-c_storage";


--
-- Name: realtime_notify_messages(); Type: FUNCTION; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE FUNCTION "prj_Lj7icxkW4B-c".realtime_notify_messages() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
            'type', TG_OP,
            'schema', 'public',
            'table', TG_TABLE_NAME,
            'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN jsonb_build_object('id', NEW.id) ELSE NULL END,
            'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN jsonb_build_object('id', OLD.id) ELSE NULL END,
            'commit_timestamp', now()::text,
            'truncated', true
          );
          payload_text := payload::text;
        END IF;
        BEGIN
          PERFORM pg_notify('realtime:jqigxzgbzbxbmaayljfw:public:messages', payload_text);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
        RETURN COALESCE(NEW, OLD);
      END;
      $$;


--
-- Name: realtime_notify_payment_transactions(); Type: FUNCTION; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE FUNCTION "prj_Lj7icxkW4B-c".realtime_notify_payment_transactions() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
            'type', TG_OP,
            'schema', 'public',
            'table', TG_TABLE_NAME,
            'record', CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN jsonb_build_object('id', NEW.id) ELSE NULL END,
            'old_record', CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN jsonb_build_object('id', OLD.id) ELSE NULL END,
            'commit_timestamp', now()::text,
            'truncated', true
          );
          payload_text := payload::text;
        END IF;
        BEGIN
          PERFORM pg_notify('realtime:jqigxzgbzbxbmaayljfw:public:payment_transactions', payload_text);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
        RETURN COALESCE(NEW, OLD);
      END;
      $$;


--
-- Name: auth_uid(); Type: FUNCTION; Schema: prj_Lj7icxkW4B-c_auth; Owner: -
--

CREATE FUNCTION "prj_Lj7icxkW4B-c_auth".auth_uid() RETURNS uuid
    LANGUAGE sql
    AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;


--
-- Name: role(); Type: FUNCTION; Schema: prj_Lj7icxkW4B-c_auth; Owner: -
--

CREATE FUNCTION "prj_Lj7icxkW4B-c_auth".role() RETURNS text
    LANGUAGE sql
    AS $$
  SELECT COALESCE(current_setting('request.jwt.claim.role', true), 'anon')
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: prj_Lj7icxkW4B-c_storage; Owner: -
--

CREATE FUNCTION "prj_Lj7icxkW4B-c_storage".foldername(name text) RETURNS text[]
    LANGUAGE sql IMMUTABLE
    AS $$
  SELECT string_to_array(name, '/')
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: classes; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".classes (
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


--
-- Name: fee_records; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".fee_records (
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


--
-- Name: grades; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".grades (
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


--
-- Name: messages; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".messages (
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


--
-- Name: payment_transactions; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".payment_transactions (
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


--
-- Name: profiles; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".profiles (
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


--
-- Name: salary_records; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".salary_records (
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


--
-- Name: students; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".students (
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


--
-- Name: teachers; Type: TABLE; Schema: prj_Lj7icxkW4B-c; Owner: -
--

CREATE TABLE "prj_Lj7icxkW4B-c".teachers (
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


--
-- Name: classes classes_class_code_key; Type: CONSTRAINT; Schema: prj_Lj7icxkW4B-c; Owner: -
--

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".classes
    ADD CONSTRAINT classes_class_code_key UNIQUE (class_code);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".classes
    ADD CONSTRAINT classes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".fee_records
    ADD CONSTRAINT fee_records_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".profiles
    ADD CONSTRAINT profiles_auth_id_key UNIQUE (auth_id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".salary_records
    ADD CONSTRAINT salary_records_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".students
    ADD CONSTRAINT students_student_code_key UNIQUE (student_code);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".teachers
    ADD CONSTRAINT teachers_teacher_code_key UNIQUE (teacher_code);


--
-- Indexes
--

CREATE INDEX idx_fee_records_status ON "prj_Lj7icxkW4B-c".fee_records USING btree (status);
CREATE INDEX idx_fee_records_student_id ON "prj_Lj7icxkW4B-c".fee_records USING btree (student_id);
CREATE INDEX idx_grades_student_id ON "prj_Lj7icxkW4B-c".grades USING btree (student_id);
CREATE INDEX idx_grades_term ON "prj_Lj7icxkW4B-c".grades USING btree (term);
CREATE INDEX idx_messages_status ON "prj_Lj7icxkW4B-c".messages USING btree (status);
CREATE INDEX idx_payment_transactions_fee_record_id ON "prj_Lj7icxkW4B-c".payment_transactions USING btree (fee_record_id);
CREATE INDEX idx_profiles_auth_id ON "prj_Lj7icxkW4B-c".profiles USING btree (auth_id);
CREATE INDEX idx_profiles_role ON "prj_Lj7icxkW4B-c".profiles USING btree (role);
CREATE INDEX idx_salary_records_teacher_id ON "prj_Lj7icxkW4B-c".salary_records USING btree (teacher_id);
CREATE INDEX idx_students_level ON "prj_Lj7icxkW4B-c".students USING btree (level);
CREATE INDEX idx_students_parent_id ON "prj_Lj7icxkW4B-c".students USING btree (parent_id);
CREATE INDEX idx_students_section ON "prj_Lj7icxkW4B-c".students USING btree (section);


--
-- Foreign keys
--

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".classes
    ADD CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES "prj_Lj7icxkW4B-c".teachers(id) ON DELETE SET NULL;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".fee_records
    ADD CONSTRAINT fee_records_student_id_fkey FOREIGN KEY (student_id) REFERENCES "prj_Lj7icxkW4B-c".students(id) ON DELETE CASCADE;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".grades
    ADD CONSTRAINT grades_student_id_fkey FOREIGN KEY (student_id) REFERENCES "prj_Lj7icxkW4B-c".students(id) ON DELETE CASCADE;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".payment_transactions
    ADD CONSTRAINT payment_transactions_fee_record_id_fkey FOREIGN KEY (fee_record_id) REFERENCES "prj_Lj7icxkW4B-c".fee_records(id) ON DELETE CASCADE;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".payment_transactions
    ADD CONSTRAINT payment_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES "prj_Lj7icxkW4B-c".students(id) ON DELETE CASCADE;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".salary_records
    ADD CONSTRAINT salary_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES "prj_Lj7icxkW4B-c".teachers(id) ON DELETE CASCADE;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".students
    ADD CONSTRAINT students_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES "prj_Lj7icxkW4B-c".profiles(id) ON DELETE SET NULL;

ALTER TABLE ONLY "prj_Lj7icxkW4B-c".teachers
    ADD CONSTRAINT teachers_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES "prj_Lj7icxkW4B-c".profiles(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--
