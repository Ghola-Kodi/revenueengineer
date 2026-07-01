import { create } from "zustand"
import type { Session } from "@supabase/supabase-js"

interface AuthStore {
  session: Session | null
  loading: boolean
  setSession: (session: Session | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,
  setSession: (session) => set({ session, loading: false }),
  logout: () => set({ session: null, loading: false }),
}))
