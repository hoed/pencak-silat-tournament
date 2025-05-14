export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      judges: {
        Row: {
          created_at: string
          full_name: string
          id: string
          judge_number: number
          password: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          judge_number: number
          password: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          judge_number?: number
          password?: string
          username?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          match_number: number
          participant1_id: string | null
          participant2_id: string | null
          round_number: number
          winner_id: string | null
          category: 'bout' | 'arts' // Added category field
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          match_number: number
          participant1_id?: string | null
          participant2_id?: string | null
          round_number: number
          winner_id?: string | null
          category?: 'bout' | 'arts'
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          match_number?: number
          participant1_id?: string | null
          participant2_id?: string | null
          round_number?: number
          winner_id?: string | null
          category?: 'bout' | 'arts'
        }
        Relationships: [
          {
            foreignKeyName: "matches_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          age_category: string
          branch: string
          created_at: string
          date_of_birth: string
          full_name: string
          gender: string
          id: string
          organization: string
          region: string
          sub_branch: string
          weight_category: string
        }
        Insert: {
          age_category: string
          branch: string
          created_at?: string
          date_of_birth: string
          full_name: string
          gender: string
          id?: string
          organization: string
          region: string
          sub_branch: string
          weight_category: string
        }
        Update: {
          age_category?: string
          branch?: string
          created_at?: string
          date_of_birth?: string
          full_name?: string
          gender?: string
          id?: string
          organization?: string
          region?: string
          sub_branch?: string
          weight_category?: string
        }
        Relationships: []
      }
      round_scores: {
        Row: {
          created_at: string
          id: string
          judge_id: string
          match_id: string
          round_number: number
          participant1_score: number
          participant2_score: number
          participant1_punches: number | null
          participant1_kicks: number | null
          participant1_throws: number | null
          participant1_locks: number | null
          participant2_punches: number | null
          participant2_kicks: number | null
          participant2_throws: number | null
          participant2_locks: number | null
          participant1_fouls: number | null
          participant2_fouls: number | null
          participant1_technique: number | null
          participant1_compactness: number | null
          participant1_expression: number | null
          participant1_timing: number | null
          participant2_technique: number | null
          participant2_compactness: number | null
          participant2_expression: number | null
          participant2_timing: number | null
          category: 'bout' | 'arts'
        }
        Insert: {
          created_at?: string
          id?: string
          judge_id: string
          match_id: string
          round_number: number
          participant1_score: number
          participant2_score: number
          participant1_punches?: number | null
          participant1_kicks?: number | null
          participant1_throws?: number | null
          participant1_locks?: number | null
          participant2_punches?: number | null
          participant2_kicks?: number | null
          participant2_throws?: number | null
          participant2_locks?: number | null
          participant1_fouls?: number | null
          participant2_fouls?: number | null
          participant1_technique?: number | null
          participant1_compactness?: number | null
          participant1_expression?: number | null
          participant1_timing?: number | null
          participant2_technique?: number | null
          participant2_compactness?: number | null
          participant2_expression?: number | null
          participant2_timing?: number | null
          category: 'bout' | 'arts'
        }
        Update: {
          created_at?: string
          id?: string
          judge_id?: string
          match_id?: string
          round_number?: number
          participant1_score?: number
          participant2_score?: number
          participant1_punches?: number | null
          participant1_kicks?: number | null
          participant1_throws?: number | null
          participant1_locks?: number | null
          participant2_punches?: number | null
          participant2_kicks?: number | null
          participant2_throws?: number | null
          participant2_locks?: number | null
          participant1_fouls?: number | null
          participant2_fouls?: number | null
          participant1_technique?: number | null
          participant1_compactness?: number | null
          participant1_expression?: number | null
          participant1_timing?: number | null
          participant2_technique?: number | null
          participant2_compactness?: number | null
          participant2_expression?: number | null
          participant2_timing?: number | null
          category?: 'bout' | 'arts'
        }
        Relationships: [
          {
            foreignKeyName: "round_scores_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const