-- 밑줄 (Mitjul) — 초기 스키마
-- 테이블: profiles, books, user_books, notes, ai_results
-- + FK/인덱스, profiles 자동 생성 트리거, RLS 정책

--------------------------------------------------------------------------------
-- 공통 함수: updated_at 자동 갱신
--------------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

--------------------------------------------------------------------------------
-- profiles (auth.users 확장)
--------------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

--------------------------------------------------------------------------------
-- books (공유 도서 데이터)
--------------------------------------------------------------------------------
create table public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  cover_url text,
  isbn text,
  aladin_item_id text,
  created_at timestamptz not null default now()
);

-- 중복 책 방지(값이 있을 때만 유니크). 알라딘 item_id / isbn 기준 재사용.
create unique index books_aladin_item_id_key on public.books (aladin_item_id) where aladin_item_id is not null;
create unique index books_isbn_key on public.books (isbn) where isbn is not null;

--------------------------------------------------------------------------------
-- user_books (User <-> Book 중간 테이블)
--------------------------------------------------------------------------------
create table public.user_books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  status text not null default 'want' check (status in ('want','reading','done')),
  rating int check (rating between 1 and 5),
  progress int not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index user_books_user_id_idx on public.user_books (user_id);
create index user_books_book_id_idx on public.user_books (book_id);

create trigger user_books_set_updated_at
  before update on public.user_books
  for each row execute function public.handle_updated_at();

--------------------------------------------------------------------------------
-- notes (기록: 밑줄/인용/메모)
--------------------------------------------------------------------------------
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_book_id uuid not null references public.user_books(id) on delete cascade,
  type text not null check (type in ('highlight','quote','memo')),
  content text not null,
  page int,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index notes_user_book_id_idx on public.notes (user_book_id);

--------------------------------------------------------------------------------
-- ai_results (AI 정리 결과 — 책×타입당 1개, 재사용 캐시)
--------------------------------------------------------------------------------
create table public.ai_results (
  id uuid primary key default gen_random_uuid(),
  user_book_id uuid not null references public.user_books(id) on delete cascade,
  type text not null check (type in ('summary','action','book_structure')),
  content jsonb not null,
  created_at timestamptz not null default now(),
  -- 책x타입당 1개 → '이미 있으면 재사용', '다시 생성'은 upsert로 교체
  unique (user_book_id, type)
);

create index ai_results_user_book_id_idx on public.ai_results (user_book_id);

--------------------------------------------------------------------------------
-- profiles 자동 생성 트리거 (auth.users INSERT 시)
--------------------------------------------------------------------------------
-- SECURITY DEFINER 필요: auth INSERT 컨텍스트에서 public.profiles에 삽입.
-- search_path='' 고정 + 스키마 정규화로 안전하게(Supabase 표준 패턴).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

--------------------------------------------------------------------------------
-- RLS
--------------------------------------------------------------------------------

-- profiles: 본인만
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- books: 읽기 공유, 인증 사용자 INSERT만 (UPDATE/DELETE 정책 없음 → 공유 데이터 보호)
alter table public.books enable row level security;

create policy "books_select_all" on public.books
  for select to anon, authenticated using (true);
create policy "books_insert_authenticated" on public.books
  for insert to authenticated with check (true);

-- user_books: 본인 소유 행만 (4개 명령 전부)
alter table public.user_books enable row level security;

create policy "user_books_select_own" on public.user_books
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "user_books_insert_own" on public.user_books
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "user_books_update_own" on public.user_books
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "user_books_delete_own" on public.user_books
  for delete to authenticated using ((select auth.uid()) = user_id);

-- notes: user_books 경유 EXISTS 소유 확인
alter table public.notes enable row level security;

create policy "notes_select_own" on public.notes
  for select to authenticated using (
    exists (select 1 from public.user_books ub
            where ub.id = notes.user_book_id and ub.user_id = (select auth.uid())));
create policy "notes_insert_own" on public.notes
  for insert to authenticated with check (
    exists (select 1 from public.user_books ub
            where ub.id = notes.user_book_id and ub.user_id = (select auth.uid())));
create policy "notes_update_own" on public.notes
  for update to authenticated
  using (exists (select 1 from public.user_books ub
            where ub.id = notes.user_book_id and ub.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_books ub
            where ub.id = notes.user_book_id and ub.user_id = (select auth.uid())));
create policy "notes_delete_own" on public.notes
  for delete to authenticated using (
    exists (select 1 from public.user_books ub
            where ub.id = notes.user_book_id and ub.user_id = (select auth.uid())));

-- ai_results: user_books 경유 EXISTS 소유 확인
alter table public.ai_results enable row level security;

create policy "ai_results_select_own" on public.ai_results
  for select to authenticated using (
    exists (select 1 from public.user_books ub
            where ub.id = ai_results.user_book_id and ub.user_id = (select auth.uid())));
create policy "ai_results_insert_own" on public.ai_results
  for insert to authenticated with check (
    exists (select 1 from public.user_books ub
            where ub.id = ai_results.user_book_id and ub.user_id = (select auth.uid())));
create policy "ai_results_update_own" on public.ai_results
  for update to authenticated
  using (exists (select 1 from public.user_books ub
            where ub.id = ai_results.user_book_id and ub.user_id = (select auth.uid())))
  with check (exists (select 1 from public.user_books ub
            where ub.id = ai_results.user_book_id and ub.user_id = (select auth.uid())));
create policy "ai_results_delete_own" on public.ai_results
  for delete to authenticated using (
    exists (select 1 from public.user_books ub
            where ub.id = ai_results.user_book_id and ub.user_id = (select auth.uid())));
