import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  UserBook,
  UserBookStatus,
  UserBookUpdate,
} from "@/lib/types/database";

/** 현재 사용자의 서재 목록. RLS로 본인 행만. status로 선택 필터. */
export async function getUserBooks(
  status?: UserBookStatus,
): Promise<UserBook[]> {
  const supabase = await createClient();
  let query = supabase
    .from("user_books")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/** 단일 user_book. RLS로 본인 행만. 없으면 null. */
export async function getUserBook(id: string): Promise<UserBook | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_books")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** 서재에 책 추가. user_id는 RLS/세션 기준으로 명시. */
export async function addUserBook(
  bookId: string,
  status: UserBookStatus = "want",
): Promise<UserBook> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("user_books")
    .insert({ user_id: user.id, book_id: bookId, status })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/** 상태/평점/진행률 갱신. RLS가 소유권 강제. */
export async function updateUserBook(
  id: string,
  patch: Pick<UserBookUpdate, "status" | "rating" | "progress">,
): Promise<UserBook> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_books")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/** 서재에서 제거(연결된 notes/ai_results는 FK cascade로 함께 삭제). */
export async function removeUserBook(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("user_books").delete().eq("id", id);
  if (error) throw error;
}
