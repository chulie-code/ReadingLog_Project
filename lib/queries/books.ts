import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Book, BookInsert } from "@/lib/types/database";

/** 알라딘 item_id로 기존 책 조회(공유 데이터). 없으면 null. */
export async function findBookByAladinId(
  aladinItemId: string,
): Promise<Book | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("aladin_item_id", aladinItemId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** ISBN으로 기존 책 조회(공유 데이터). 없으면 null. */
export async function findBookByIsbn(isbn: string): Promise<Book | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("isbn", isbn)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * 책을 보장(없으면 생성, 있으면 재사용). 공유 데이터라 인증 사용자 INSERT만 허용.
 * 알라딘 item_id → ISBN 순으로 기존 책을 먼저 찾고, 없을 때만 삽입.
 */
export async function ensureBook(input: BookInsert): Promise<Book> {
  if (input.aladin_item_id) {
    const existing = await findBookByAladinId(input.aladin_item_id);
    if (existing) return existing;
  }
  if (input.isbn) {
    const existing = await findBookByIsbn(input.isbn);
    if (existing) return existing;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
