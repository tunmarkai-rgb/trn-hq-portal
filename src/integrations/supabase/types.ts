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
          destination_member_id: string | null
          estimated_value: number | null
          id: string
          notes: string | null
          partner_id: string | null
          property_address: string | null
          referral_fee_percent: number | null
          related_intro_id: string | null
          related_opportunity_id: string | null
          stage: string | null
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          deal_type?: string | null
          destination_member_id?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          property_address?: string | null
          referral_fee_percent?: number | null
          related_intro_id?: string | null
          related_opportunity_id?: string | null
          stage?: string | null
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          deal_type?: string | null
          destination_member_id?: string | null
          estimated_value?: number | null
          id?: string
          notes?: string | null
          partner_id?: string | null
          property_address?: string | null
          referral_fee_percent?: number | null
          related_intro_id?: string | null
          related_opportunity_id?: string | null
          stage?: string | null
          status?: string
          summary?: string | null
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
          target_audience: string | null
          timezone: string | null
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
          target_audience?: string | null
          timezone?: string | null
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
          target_audience?: string | null
          timezone?: string | null
          title?: string
        }
        Relationships: []
      }
      introductions: {
        Row: {
          admin_notes: string | null
          context: string | null
          created_at: string
          id: string
          linked_deal_id: string | null
          linked_opportunity_id: string | null
          message: string | null
          reason: string | null
          requester_id: string
          status: string
          target_id: string
          target_type: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          admin_notes?: string | null
          context?: string | null
          created_at?: string
          id?: string
          linked_deal_id?: string | null
          linked_opportunity_id?: string | null
          message?: string | null
          reason?: string | null
          requester_id: string
          status?: string
          target_id: string
          target_type?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          admin_notes?: string | null
          context?: string | null
          created_at?: string
          id?: string
          linked_deal_id?: string | null
          linked_opportunity_id?: string | null
          message?: string | null
          reason?: string | null
          requester_id?: string
          status?: string
          target_id?: string
          target_type?: string | null
          updated_at?: string
          urgency?: string | null
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
      network_updates: {
        Row: {
          content: string | null
          created_at: string
          featured_image: string | null
          id: string
          markets: string[] | null
          published: boolean | null
          summary: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          markets?: string[] | null
          published?: boolean | null
          summary?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          markets?: string[] | null
          published?: boolean | null
          summary?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
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
          internal_contact_email: string | null
          internal_contact_name: string | null
          internal_notes: string | null
          internal_referral_structure: string | null
          logo_url: string | null
          markets_served: string[] | null
          name: string
          use_cases: string | null
          website: string | null
          who_they_help: string | null
        }
        Insert: {
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          internal_contact_email?: string | null
          internal_contact_name?: string | null
          internal_notes?: string | null
          internal_referral_structure?: string | null
          logo_url?: string | null
          markets_served?: string[] | null
          name: string
          use_cases?: string | null
          website?: string | null
          who_they_help?: string | null
        }
        Update: {
          category?: string
          contact_info?: string | null
          created_at?: string
          description?: string | null
          id?: string
          internal_contact_email?: string | null
          internal_contact_name?: string | null
          internal_notes?: string | null
          internal_referral_structure?: string | null
          logo_url?: string | null
          markets_served?: string[] | null
          name?: string
          use_cases?: string | null
          website?: string | null
          who_they_help?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency: string | null
          approval_status: string
          avatar_url: string | null
          bio: string | null
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
          linkedin_url: string | null
          longitude: number | null
          looking_for: string | null
          niche: string[] | null
          role: string | null
          title: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          agency?: string | null
          approval_status?: string
          avatar_url?: string | null
          bio?: string | null
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
          linkedin_url?: string | null
          longitude?: number | null
          looking_for?: string | null
          niche?: string[] | null
          role?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          agency?: string | null
          approval_status?: string
          avatar_url?: string | null
          bio?: string | null
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
          linkedin_url?: string | null
          longitude?: number | null
          looking_for?: string | null
          niche?: string[] | null
          role?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      referral_opportunities: {
        Row: {
          budget_range: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          ideal_counterpart: string | null
          market_city: string | null
          market_country: string | null
          opportunity_type: string
          posted_by: string
          status: string | null
          title: string
          urgency: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          ideal_counterpart?: string | null
          market_city?: string | null
          market_country?: string | null
          opportunity_type?: string
          posted_by: string
          status?: string | null
          title: string
          urgency?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          ideal_counterpart?: string | null
          market_city?: string | null
          market_country?: string | null
          opportunity_type?: string
          posted_by?: string
          status?: string | null
          title?: string
          urgency?: string | null
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
      collaboration_requests: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          market_relevance: string | null
          reason: string | null
          requester_id: string
          status: string
          what_they_bring: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          market_relevance?: string | null
          reason?: string | null
          requester_id: string
          status?: string
          what_they_bring?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          market_relevance?: string | null
          reason?: string | null
          requester_id?: string
          status?: string
          what_they_bring?: string | null
        }
        Relationships: []
      }
      community_members: {
        Row: {
          city: string | null
          country: string
          created_at: string
          email: string | null
          first_name: string
          form_submitted_at: string | null
          how_did_you_hear: string | null
          id: string
          instagram: string | null
          last_name: string | null
          linkedin: string | null
          notes: string | null
          removal_scheduled_at: string | null
          role: string | null
          status: string
          whatsapp: string
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string
          email?: string | null
          first_name: string
          form_submitted_at?: string | null
          how_did_you_hear?: string | null
          id?: string
          instagram?: string | null
          last_name?: string | null
          linkedin?: string | null
          notes?: string | null
          removal_scheduled_at?: string | null
          role?: string | null
          status?: string
          whatsapp: string
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          first_name?: string
          form_submitted_at?: string | null
          how_did_you_hear?: string | null
          id?: string
          instagram?: string | null
          last_name?: string | null
          linkedin?: string | null
          notes?: string | null
          removal_scheduled_at?: string | null
          role?: string | null
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      investment_listings: {
        Row: {
          asking_price: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          deal_status: string
          description: string | null
          featured: boolean | null
          id: string
          investment_type: string
          posted_by: string
          roi_potential: string | null
          summary: string | null
          title: string
        }
        Insert: {
          asking_price?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          deal_status?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          investment_type?: string
          posted_by: string
          roi_potential?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          asking_price?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          deal_status?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          investment_type?: string
          posted_by?: string
          roi_potential?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      referral_templates: {
        Row: {
          created_at: string
          description: string | null
          download_link: string
          id: string
          name: string
          type: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_link: string
          id?: string
          name: string
          type?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          download_link?: string
          id?: string
          name?: string
          type?: string
          version?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          title: string
          youtube_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          title: string
          youtube_url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          youtube_url?: string
        }
        Relationships: []
      }
      sop_library: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
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
