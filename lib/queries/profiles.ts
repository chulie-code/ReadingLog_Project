import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileUpdate } from "@/lib/types/database";

/** 현재 로그인 사용자의 프로필. RLS로 본인 행만 조회됨. 미로그인/없으면 null. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/** 본인 프로필 갱신(닉네임 등). RLS가 소유권 강제. */
export async function updateProfile(
  patch: Pick<ProfileUpdate, "nickname">,
): Promise<Profile> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
