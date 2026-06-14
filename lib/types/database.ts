// 밑줄 (Mitjul) — DB 타입
// DB 컬럼은 snake_case (Supabase가 반환하는 키 그대로). TS 변수는 camelCase 규칙.
// supabase-js의 createClient<Database>() 제네릭과 호환되는 형태로 손작성.
// 추후 `supabase gen types`로 대체 가능.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// 리터럴 유니온 (DB CHECK 제약과 일치)
export type UserBookStatus = "want" | "reading" | "done";
export type NoteType = "highlight" | "quote" | "memo";
export type AiResultType = "summary" | "action" | "book_structure";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string | null;
          cover_url: string | null;
          isbn: string | null;
          aladin_item_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          author?: string | null;
          cover_url?: string | null;
          isbn?: string | null;
          aladin_item_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          author?: string | null;
          cover_url?: string | null;
          isbn?: string | null;
          aladin_item_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_books: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          status: UserBookStatus;
          rating: number | null;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          status?: UserBookStatus;
          rating?: number | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          status?: UserBookStatus;
          rating?: number | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_books_book_id_fkey";
            columns: ["book_id"];
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      notes: {
        Row: {
          id: string;
          user_book_id: string;
          type: NoteType;
          content: string;
          page: number | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_book_id: string;
          type: NoteType;
          content: string;
          page?: number | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_book_id?: string;
          type?: NoteType;
          content?: string;
          page?: number | null;
          tags?: string[];
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_book_id_fkey";
            columns: ["user_book_id"];
            referencedRelation: "user_books";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_results: {
        Row: {
          id: string;
          user_book_id: string;
          type: AiResultType;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_book_id: string;
          type: AiResultType;
          content: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_book_id?: string;
          type?: AiResultType;
          content?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_results_user_book_id_fkey";
            columns: ["user_book_id"];
            referencedRelation: "user_books";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// 편의 별칭 (각 테이블 Row)
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Book = Database["public"]["Tables"]["books"]["Row"];
export type UserBook = Database["public"]["Tables"]["user_books"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type AiResult = Database["public"]["Tables"]["ai_results"]["Row"];

// Insert/Update 별칭
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
export type UserBookInsert = Database["public"]["Tables"]["user_books"]["Insert"];
export type UserBookUpdate = Database["public"]["Tables"]["user_books"]["Update"];
export type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
export type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];
