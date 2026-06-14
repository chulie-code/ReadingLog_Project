# 밑줄 (Mitjul) — 프로젝트 컨텍스트

자기계발·실용서 독자를 위한 독서기록 앱.
핵심 흐름: **기록 → AI 정리 → 현실 적용 → 나만의 책**.
가장 중요한 차별점은 **현실 적용**(읽은 내용을 오늘의 실천 액션으로 바꿔주기). 모바일 우선 반응형.

## 스택
- Next.js (App Router) + TypeScript
- Supabase (Postgres + Auth), `@supabase/ssr`
- AI: OpenRouter (OpenAI 호환, `baseURL = https://openrouter.ai/api/v1`)
- 도서 데이터: 알라딘 Open API (`output=js`)
- 배포: Vercel

## 데이터 모델 (snake_case 테이블)
- `profiles` — auth.users 확장(닉네임 등)
- `books` — 제목, 저자, 표지URL, isbn, 알라딘 item_id (공유 데이터)
- `user_books` — user_id, book_id, status(want/reading/done), rating, progress (User↔Book 중간 테이블)
- `notes` — user_book_id, type(highlight/quote/memo), content, page, tags[], created_at
- `ai_results` — user_book_id, type(summary/action/book_structure), content, created_at

## 기능 (4축)
1. **기록** — 밑줄/인용/메모를 책별로
2. **AI 정리** — 기록을 핵심 요약 + 키워드로
3. **현실 적용 (핵심)** — 읽은 내용을 오늘의 실천 액션으로
4. **나만의 책** — 기록을 한 권으로 엮기. AI는 장(chapter) 구성을 **보조**할 뿐, 저자는 사용자

## 규칙
- DB 컬럼은 snake_case, TS 변수는 camelCase
- **비밀키(OpenRouter / 알라딘 / Supabase secret)는 서버 API 라우트(`app/api/.../route.ts`)에서만 사용. 절대 클라이언트 노출 금지(`NEXT_PUBLIC_` 붙이지 말 것)**
- 모든 사용자 데이터 테이블에 RLS 적용: 사용자는 자기 데이터만 접근. `books`만 읽기 공유
- AI 호출은 서버에서만 하고, 결과는 `ai_results`에 저장해 재생성 비용 절감(이미 있으면 재사용 + '다시 생성' 제공)
- 서버 컴포넌트 우선, 상호작용 필요한 곳에만 `"use client"`
- 한 번에 한 기능씩 작업하고, 단계마다 `git commit`
