-- NEET MASTER production database schema
create extension if not exists "pgcrypto";

create type public.user_role as enum ('student','admin');
create type public.question_status as enum ('PENDING_REVIEW','APPROVED','REJECTED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option char(1) not null check (correct_option in ('A','B','C','D')),
  explanation text,
  subject text not null,
  chapter text,
  topic text,
  subtopic text,
  difficulty text,
  source text,
  source_pdf_id uuid,
  status public.question_status not null default 'PENDING_REVIEW',
  created_at timestamptz not null default now()
);

create table public.tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subject text,
  duration_minutes int not null default 30,
  correct_marks int not null default 4,
  wrong_marks int not null default -1,
  unattempted_marks int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.test_questions (
  test_id uuid references public.tests(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade,
  position int not null,
  primary key(test_id,question_id)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid not null references public.tests(id) on delete cascade,
  score int not null default 0,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  unattempted_count int not null default 0,
  accuracy numeric(5,2),
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option char(1) check (selected_option in ('A','B','C','D')),
  is_correct boolean,
  marks_awarded int not null default 0,
  primary key(attempt_id,question_id)
);

create table public.pdf_documents (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references public.profiles(id),
  file_name text not null,
  storage_path text not null,
  status text not null default 'UPLOADED',
  extracted_count int not null default 0,
  verified_count int not null default 0,
  created_at timestamptz not null default now()
);

create index questions_subject_chapter_topic_idx on public.questions(subject,chapter,topic);
create index attempts_student_idx on public.attempts(student_id,submitted_at desc);

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.attempts enable row level security;
alter table public.responses enable row level security;
alter table public.pdf_documents enable row level security;

-- Starter policies. Review these carefully before production.
create policy "students can read own profile" on public.profiles for select using (auth.uid()=id);
create policy "students can update own profile" on public.profiles for update using (auth.uid()=id);
create policy "published tests readable" on public.tests for select using (published=true);
create policy "published test questions readable" on public.test_questions for select using (
  exists(select 1 from public.tests t where t.id=test_id and t.published=true)
);
create policy "approved questions readable" on public.questions for select using (status='APPROVED');
create policy "students read own attempts" on public.attempts for select using (student_id=auth.uid());
create policy "students create own attempts" on public.attempts for insert with check (student_id=auth.uid());
create policy "students read own responses" on public.responses for select using (
  exists(select 1 from public.attempts a where a.id=attempt_id and a.student_id=auth.uid())
);
create policy "students create own responses" on public.responses for insert with check (
  exists(select 1 from public.attempts a where a.id=attempt_id and a.student_id=auth.uid())
);

-- IMPORTANT: Admin write policies should be added using a secure role-checking function.
-- Never expose a service-role key in browser code.
