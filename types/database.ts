export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          compare_price: number | null
          category_id: string | null
          images: string[]
          tags: string[]
          is_active: boolean
          is_featured: boolean
          stock_quantity: number
          unit: string
          weight: string | null
          brand: string | null
          sku: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          subtotal: number
          discount: number
          delivery_fee: number
          items: Json
          shipping_address: Json
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'failed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          rewards_points: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          image_url: string
          link_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['banners']['Insert']>
      }
    }
  }
}

// Convenience types
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type Banner = Database['public']['Tables']['banners']['Row']

export interface CartItemWithProduct extends CartItem {
  product: Product
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}
