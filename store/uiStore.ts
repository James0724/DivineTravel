import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Navigation
  mobileMenuOpen: boolean
  // Modals
  bookingModalOpen: boolean
  imageGalleryOpen: boolean
  galleryIndex: number
  // Notifications
  toastQueue: Toast[]
  // Admin
  adminSidebarCollapsed: boolean
  // Actions
  setMobileMenuOpen: (open: boolean) => void
  setBookingModalOpen: (open: boolean) => void
  openGallery: (index?: number) => void
  closeGallery: () => void
  setGalleryIndex: (index: number) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toggleAdminSidebar: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      mobileMenuOpen: false,
      bookingModalOpen: false,
      imageGalleryOpen: false,
      galleryIndex: 0,
      toastQueue: [],
      adminSidebarCollapsed: false,

      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      setBookingModalOpen: (bookingModalOpen) => set({ bookingModalOpen }),
      openGallery: (index = 0) =>
        set({ imageGalleryOpen: true, galleryIndex: index }),
      closeGallery: () => set({ imageGalleryOpen: false }),
      setGalleryIndex: (galleryIndex) => set({ galleryIndex }),
      addToast: (toast) =>
        set((state) => ({
          toastQueue: [
            ...state.toastQueue,
            { ...toast, id: Date.now().toString() },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toastQueue: state.toastQueue.filter((t) => t.id !== id),
        })),
      toggleAdminSidebar: () =>
        set((state) => ({
          adminSidebarCollapsed: !state.adminSidebarCollapsed,
        })),
    }),
    { name: 'UIStore' }
  )
)
