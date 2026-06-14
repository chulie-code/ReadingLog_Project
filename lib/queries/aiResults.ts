import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AiResult, AiResultType, Json } from "@/lib/types/database";

/**
 * 특정 user_book × 타입의 AI 결과. 책×타입당 1개(unique).
 * 이미 있으면 재사용해 재생성 비용 절감. 없으면 null.
 */
export async function getAiResult(
  userBookId: string,
  type: AiResultType,
): Promise<AiResult | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_results")
    .select("*")
    .eq("user_book_id", userBookId)
    .eq("type", type)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * AI 결과 저장/교체('다시 생성'). (user_book_id, type) unique 기준 upsert.
 * RLS(EXISTS)가 user_book 소유권 강제.
 */
export async function upsertAiResult(
  userBookId: string,
  type: AiResultType,
  content: Json,
): Promise<AiResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_results")
    .upsert(
      { user_book_id: userBookId, type, content },
      { onConflict: "user_book_id,type" },
    )
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
