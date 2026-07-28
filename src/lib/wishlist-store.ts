import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WishlistItem {
  productId: string
  name: string
  slug: string
  image: string | null
  category: string | null
  price: number // VNĐ
}

interface WishlistState {
  items: WishlistItem[]
  /** Toggle: nếu đã có thì xóa, chưa có thì thêm */
  toggle: (item: WishlistItem) => void
  remove: (productId: string) => void
  /** Check xem product đã yêu thích chưa */
  has: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId)
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }))
        } else {
          set((state) => ({ items: [...state.items, item] }))
        }
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      has: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "aplus-wishlist",
    }
  )
)
