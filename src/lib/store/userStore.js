import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const userStore = create(
  persist(
    (set, get) => ({
      user: {},
      login: (newUser) => set({ user: newUser }),
      logout: () => set({ user: {} })
    }),
    {
      name: 'siaconca-storage' // name of the item in the storage (must be unique)
    }
  )
)

export default userStore
