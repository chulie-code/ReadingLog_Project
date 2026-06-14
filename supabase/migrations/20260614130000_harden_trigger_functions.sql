-- 트리거 전용 함수 보안 강화 (Supabase security advisor 대응)
-- 1) handle_updated_at: search_path 고정 (function_search_path_mutable 경고 해소)
-- 2) 두 함수 모두 트리거에서만 쓰이므로 REST RPC 직접 호출 권한 회수
--    (트리거 실행은 EXECUTE 권한 검사를 우회하므로 동작에 영향 없음)

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.handle_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
