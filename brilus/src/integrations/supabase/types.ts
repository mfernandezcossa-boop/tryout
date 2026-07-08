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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_avatar_url: string | null
          author_bio: string | null
          author_id: string | null
          author_link: string | null
          author_name: string | null
          category: string | null
          content: string | null
          content_path: string | null
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
          views_count: number | null
        }
        Insert: {
          author_avatar_url?: string | null
          author_bio?: string | null
          author_id?: string | null
          author_link?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          content_path?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
        }
        Update: {
          author_avatar_url?: string | null
          author_bio?: string | null
          author_id?: string | null
          author_link?: string | null
          author_name?: string | null
          category?: string | null
          content?: string | null
          content_path?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          child_age_band: string
          child_name: string
          concerns: string
          consent: boolean
          created_at: string
          email: string
          id: string
          parent_full_name: string
          phone: string
        }
        Insert: {
          child_age_band: string
          child_name: string
          concerns: string
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          parent_full_name: string
          phone: string
        }
        Update: {
          child_age_band?: string
          child_name?: string
          concerns?: string
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          parent_full_name?: string
          phone?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          created_by: string | null
          display_location: string
          id: string
          order_index: number | null
          question: string
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          answer: string
          created_at?: string
          created_by?: string | null
          display_location?: string
          id?: string
          order_index?: number | null
          question: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          answer?: string
          created_at?: string
          created_by?: string | null
          display_location?: string
          id?: string
          order_index?: number | null
          question?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          created_at: string
          email: string | null
          form_name: string
          handled_by: string | null
          id: string
          notes: string | null
          payload: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          form_name: string
          handled_by?: string | null
          id?: string
          notes?: string | null
          payload: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          form_name?: string
          handled_by?: string | null
          id?: string
          notes?: string | null
          payload?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      induction_modules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          module_number: number
          order_index: number | null
          pdf_url: string | null
          podcast_url: string | null
          slides_url: string | null
          title: string
          updated_at: string
          updated_by: string | null
          visible: boolean
          youtube_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          module_number: number
          order_index?: number | null
          pdf_url?: string | null
          podcast_url?: string | null
          slides_url?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
          youtube_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          module_number?: number
          order_index?: number | null
          pdf_url?: string | null
          podcast_url?: string | null
          slides_url?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
          youtube_url?: string | null
        }
        Relationships: []
      }
      induction_quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          module_id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_index: number | null
          question_text: string
          updated_at: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          module_id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          order_index?: number | null
          question_text: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          module_id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          order_index?: number | null
          question_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "induction_quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "induction_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          availability_shift: string | null
          availability_type: string
          bachelor_degree: string
          bachelor_university: string
          created_at: string
          cv_file_name: string
          cv_file_path: string
          cv_mime_type: string
          english_level: string
          full_name: string
          has_masters: boolean
          id: string
          masters_degree: string | null
          masters_university: string | null
          mobility_cdmx: string
          motivation: string
          referral_source: string | null
          status: string
          whatsapp: string
          zip_code: string
        }
        Insert: {
          availability_shift?: string | null
          availability_type: string
          bachelor_degree: string
          bachelor_university: string
          created_at?: string
          cv_file_name: string
          cv_file_path: string
          cv_mime_type?: string
          english_level: string
          full_name: string
          has_masters?: boolean
          id?: string
          masters_degree?: string | null
          masters_university?: string | null
          mobility_cdmx: string
          motivation: string
          referral_source?: string | null
          status?: string
          whatsapp: string
          zip_code: string
        }
        Update: {
          availability_shift?: string | null
          availability_type?: string
          bachelor_degree?: string
          bachelor_university?: string
          created_at?: string
          cv_file_name?: string
          cv_file_path?: string
          cv_mime_type?: string
          english_level?: string
          full_name?: string
          has_masters?: boolean
          id?: string
          masters_degree?: string | null
          masters_university?: string | null
          mobility_cdmx?: string
          motivation?: string
          referral_source?: string | null
          status?: string
          whatsapp?: string
          zip_code?: string
        }
        Relationships: []
      }
      knowledge_base_articles: {
        Row: {
          category: string
          content: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          order_index: number | null
          slug: string
          title: string
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          category?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          category?: string
          content?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          image_url: string | null
          name: string
          order_index: number | null
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
          order_index?: number | null
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
          order_index?: number | null
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          age_range: string
          child_name: string
          consent: boolean
          created_at: string
          full_name: string
          id: string
          phone: string
          postal_code: string
          q1_diagnosis: boolean
          q2_difficulties: boolean
          q3_behaviors: boolean
          q4_skills_help: boolean
          q5_family_commitment: boolean
          role: string
          score: number
          segment: string
        }
        Insert: {
          age_range: string
          child_name: string
          consent?: boolean
          created_at?: string
          full_name: string
          id?: string
          phone: string
          postal_code: string
          q1_diagnosis: boolean
          q2_difficulties: boolean
          q3_behaviors: boolean
          q4_skills_help: boolean
          q5_family_commitment: boolean
          role: string
          score: number
          segment: string
        }
        Update: {
          age_range?: string
          child_name?: string
          consent?: boolean
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          postal_code?: string
          q1_diagnosis?: boolean
          q2_difficulties?: boolean
          q3_behaviors?: boolean
          q4_skills_help?: boolean
          q5_family_commitment?: boolean
          role?: string
          score?: number
          segment?: string
        }
        Relationships: []
      }
      screener_leads: {
        Row: {
          answers: Json | null
          caregiver_lastname: string
          caregiver_name: string
          child_birthdate: string
          child_name: string
          completed_at: string | null
          created_at: string
          email: string
          id: string
          parent_lead_id: string | null
          postal_code: string | null
          risk_level: string | null
          score: number | null
          screener_id: string
          started_at: string
          status: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          answers?: Json | null
          caregiver_lastname: string
          caregiver_name: string
          child_birthdate: string
          child_name: string
          completed_at?: string | null
          created_at?: string
          email: string
          id?: string
          parent_lead_id?: string | null
          postal_code?: string | null
          risk_level?: string | null
          score?: number | null
          screener_id: string
          started_at?: string
          status?: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          answers?: Json | null
          caregiver_lastname?: string
          caregiver_name?: string
          child_birthdate?: string
          child_name?: string
          completed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          parent_lead_id?: string | null
          postal_code?: string | null
          risk_level?: string | null
          score?: number | null
          screener_id?: string
          started_at?: string
          status?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "screener_leads_parent_lead_id_fkey"
            columns: ["parent_lead_id"]
            isOneToOne: false
            referencedRelation: "screener_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio_short: string | null
          certification_number: string | null
          consulting_partnership: Json | null
          created_at: string
          created_by: string | null
          credenciales: string[] | null
          credenciales_detalle: Json | null
          email: string | null
          featured_quote: string | null
          filosofia: string | null
          id: string
          languages: string[] | null
          name: string
          order_index: number | null
          phone: string | null
          photo_url: string | null
          presentacion_personal: string | null
          role_title: string
          specialties: string[] | null
          updated_at: string
          updated_by: string | null
          visible: boolean
          years_experience: number | null
        }
        Insert: {
          bio_short?: string | null
          certification_number?: string | null
          consulting_partnership?: Json | null
          created_at?: string
          created_by?: string | null
          credenciales?: string[] | null
          credenciales_detalle?: Json | null
          email?: string | null
          featured_quote?: string | null
          filosofia?: string | null
          id?: string
          languages?: string[] | null
          name: string
          order_index?: number | null
          phone?: string | null
          photo_url?: string | null
          presentacion_personal?: string | null
          role_title: string
          specialties?: string[] | null
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
          years_experience?: number | null
        }
        Update: {
          bio_short?: string | null
          certification_number?: string | null
          consulting_partnership?: Json | null
          created_at?: string
          created_by?: string | null
          credenciales?: string[] | null
          credenciales_detalle?: Json | null
          email?: string | null
          featured_quote?: string | null
          filosofia?: string | null
          id?: string
          languages?: string[] | null
          name?: string
          order_index?: number | null
          phone?: string | null
          photo_url?: string | null
          presentacion_personal?: string | null
          role_title?: string
          specialties?: string[] | null
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
          years_experience?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_photo_url: string | null
          author_vinculo: string | null
          youtube_url: string | null
          created_at: string
          created_by: string | null
          display_location: string
          id: string
          order_index: number | null
          quote: string
          updated_at: string
          updated_by: string | null
          visible: boolean
        }
        Insert: {
          author_name: string
          author_photo_url?: string | null
          author_vinculo?: string | null
          youtube_url?: string | null
          created_at?: string
          created_by?: string | null
          display_location?: string
          id?: string
          order_index?: number | null
          quote: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Update: {
          author_name?: string
          author_photo_url?: string | null
          author_vinculo?: string | null
          youtube_url?: string | null
          created_at?: string
          created_by?: string | null
          display_location?: string
          id?: string
          order_index?: number | null
          quote?: string
          updated_at?: string
          updated_by?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      therapist_quiz_attempts: {
        Row: {
          answers: Json
          completed_at: string
          created_at: string
          id: string
          module_id: string
          score: number
          therapist_id: string
          total_questions: number
        }
        Insert: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          module_id: string
          score: number
          therapist_id: string
          total_questions: number
        }
        Update: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          module_id?: string
          score?: number
          therapist_id?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "therapist_quiz_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "induction_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_quiz_attempts_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      team_members_public: {
        Row: {
          bio_short: string | null
          certification_number: string | null
          consulting_partnership: Json | null
          credenciales: string[] | null
          credenciales_detalle: Json | null
          featured_quote: string | null
          filosofia: string | null
          id: string | null
          languages: string[] | null
          name: string | null
          order_index: number | null
          photo_url: string | null
          presentacion_personal: string | null
          role_title: string | null
          specialties: string[] | null
          visible: boolean | null
          years_experience: number | null
        }
        Insert: {
          bio_short?: string | null
          certification_number?: string | null
          consulting_partnership?: Json | null
          credenciales?: string[] | null
          credenciales_detalle?: Json | null
          featured_quote?: string | null
          filosofia?: string | null
          id?: string | null
          languages?: string[] | null
          name?: string | null
          order_index?: number | null
          photo_url?: string | null
          presentacion_personal?: string | null
          role_title?: string | null
          specialties?: string[] | null
          visible?: boolean | null
          years_experience?: number | null
        }
        Update: {
          bio_short?: string | null
          certification_number?: string | null
          consulting_partnership?: Json | null
          credenciales?: string[] | null
          credenciales_detalle?: Json | null
          featured_quote?: string | null
          filosofia?: string | null
          id?: string | null
          languages?: string[] | null
          name?: string | null
          order_index?: number | null
          photo_url?: string | null
          presentacion_personal?: string | null
          role_title?: string | null
          specialties?: string[] | null
          visible?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
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
      app_role:
        | "admin"
        | "user"
        | "moderator"
        | "admin_operations"
        | "admin_brilers"
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
      app_role: [
        "admin",
        "user",
        "moderator",
        "admin_operations",
        "admin_brilers",
      ],
    },
  },
} as const
