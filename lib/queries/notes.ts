import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Note, NoteInsert, NoteUpdate } from "@/lib/types/database";

/** 특정 user_book의 기록 목록. RLS(EXISTS)로 본인 소유만 조회됨. */
export async function getNotes(userBookId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_book_id", userBookId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** 기록 생성. RLS(EXISTS)가 user_book 소유권 강제. */
export async function createNote(
  input: Omit<NoteInsert, "id" | "created_at">,
): Promise<Note> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/** 기록 수정. RLS가 소유권 강제. */
export async function updateNote(
  id: string,
  patch: Pick<NoteUpdate, "type" | "content" | "page" | "tags">,
): Promise<Note> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/** 기록 삭제. RLS가 소유권 강제. */
export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
