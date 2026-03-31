export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          id: string
          pinned: boolean
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          pinned?: boolean
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          pinned?: boolean
          title?: string
        }
        Relationships: []
      }
      community_links: {
        Row: {
          channel_type: string
          created_at: string
          description: string | null
          id: string
          label: string
          url: string
        }
        Insert: {
          channel_type?: string
          created_at?: string
          description?: string | null
          id?: string
          label: string
          url: string
        }
        Update: {
          channel_type?: string
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          url?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          created_by: string
          deal_type: string | null
          estimated_value: number | null
          id: string
          notes: string | null
          partner_id: string | null
          property_address: string | null
          referral_fee_percent: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          deal_type?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          property_address?: string | null
          referral_fee_percent?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          deal_type?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          property_address?: string | null
          referral_fee_percent?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          join_link: string | null
          recording_url: string | null
          speaker: string | null
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string
          id?: string
          join_link?: string | null
          recording_url?: string | null
          speaker?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          join_link?: string | null
          recording_url?: string | null
          speaker?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      introductions: {
        Row: {
          created_at: string
          id: string
          message: string | null
          requester_id: string
          status: string
          target_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          requester_id: string
          status?: string
          target_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          requester_id?: string
          status?: string
          target_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_resources: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string
          id: string
          link: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          id?: string
          link?: string | null
          title?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          contact_info: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency: string | null
          avatar_url: string | null
          can_help_with: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          instagram: string | null
          languages: string[] | null
          latitude: number | null
          longitude: number | null
          looking_for: string | null
          niche: string[] | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agency?: string | null
          avatar_url?: string | null
          can_help_with?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          looking_for?: string | null
          niche?: string[] | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agency?: string | null
          avatar_url?: string | null
          can_help_with?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          instagram?: string | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          looking_for?: string | null
          niche?: string[] | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_opportunities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          market_city: string | null
          market_country: string | null
          opportunity_type: string
          posted_by: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          market_city?: string | null
          market_country?: string | null
          opportunity_type?: string
          posted_by: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          market_city?: string | null
          market_country?: string | null
          opportunity_type?: string
          posted_by?: string
          title?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          client_contact: string | null
          client_name: string
          created_at: string
          id: string
          location: string | null
          notes: string | null
          property_type: string | null
          referral_fee_percent: number | null
          sent_by: string
          sent_to: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_contact?: string | null
          client_name: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          property_type?: string | null
          referral_fee_percent?: number | null
          sent_by: string
          sent_to?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_contact?: string | null
          client_name?: string
          created_at?: string
          id?: string
          location?: string | null
          notes?: string | null
          property_type?: string | null
          referral_fee_percent?: number | null
          sent_by?: string
          sent_to?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member"],
    },
  },
} as const
