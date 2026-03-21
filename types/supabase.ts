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
      categories: {
        Row: {
          category_name: string
          id: number
        }
        Insert: {
          category_name: string
          id?: never
        }
        Update: {
          category_name?: string
          id?: never
        }
        Relationships: []
      }
      companies: {
        Row: {
          email: string | null
          id: number
          name: string
          phone: string | null
        }
        Insert: {
          email?: string | null
          id?: never
          name: string
          phone?: string | null
        }
        Update: {
          email?: string | null
          id?: never
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      company_categories: {
        Row: {
          category_id: number
          company_id: number
        }
        Insert: {
          category_id: number
          company_id: number
        }
        Update: {
          category_id?: number
          company_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          document_date: string
          document_notes: string | null
          document_title: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id: number
          property_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_date: string
          document_notes?: string | null
          document_title: string
          document_type: Database["public"]["Enums"]["document_type"]
          document_url: string
          id?: never
          property_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_date?: string
          document_notes?: string | null
          document_title?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          document_url?: string
          id?: never
          property_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_files: {
        Row: {
          file_url: string
          id: number
          incident_id: number
        }
        Insert: {
          file_url: string
          id?: never
          incident_id: number
        }
        Update: {
          file_url?: string
          id?: never
          incident_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "incident_files_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          incident_company: string | null
          incident_cost: number | null
          incident_date: string
          incident_description: string
          incident_status: Database["public"]["Enums"]["incident_status"]
          incident_title: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          property_id: number
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: never
          incident_company?: string | null
          incident_cost?: number | null
          incident_date: string
          incident_description: string
          incident_status: Database["public"]["Enums"]["incident_status"]
          incident_title: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          property_id: number
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: never
          incident_company?: string | null
          incident_cost?: number | null
          incident_date?: string
          incident_description?: string
          incident_status?: Database["public"]["Enums"]["incident_status"]
          incident_title?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          property_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          created_at: string | null
          id: number
          property_address: string
          property_name: string
          size: number | null
          type: Database["public"]["Enums"]["property_type"] | null
          updated_at: string | null
          user_id: number
          year_purchased: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          property_address: string
          property_name: string
          size?: number | null
          type?: Database["public"]["Enums"]["property_type"] | null
          updated_at?: string | null
          user_id: number
          year_purchased?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          property_address?: string
          property_name?: string
          size?: number | null
          type?: Database["public"]["Enums"]["property_type"] | null
          updated_at?: string | null
          user_id?: number
          year_purchased?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: number
          last_name: string
          password: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id?: never
          last_name: string
          password: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: never
          last_name?: string
          password?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_type: "escritura" | "seguro" | "factura" | "otros"
      incident_status: "abierto" | "en_proceso" | "solucionado"
      priority_level: "baja" | "media" | "alta"
      property_type: "apartamento" | "casa" | "condominio" | "otro"
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
      document_type: ["escritura", "seguro", "factura", "otros"],
      incident_status: ["abierto", "en_proceso", "solucionado"],
      priority_level: ["baja", "media", "alta"],
      property_type: ["apartamento", "casa", "condominio", "otro"],
    },
  },
} as const
