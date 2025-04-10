import { create } from 'zustand'

type Store = {
  userId: number
  tripId: number | null
  location: { lat: number; lng: number } | null
  route: { lat: number; lng: number }[]
  setUserId: (id: number) => void
  setTripId: (id: number | null) => void
  setLocation: (lat: number, lng: number) => void
  addRoutePoint: (lat: number, lng: number) => void
  startTime: number | null
  setStartTime: (ts: number | null) => void
}

export const useAppStore = create<Store>((set) => ({
  startTime: null,
  setStartTime: (ts) => set({ startTime: ts }),
  userId: 1,
  tripId: null,
  location: null,
  route: [],
  setUserId: (id: number) => set({ userId: id }),
  setTripId: (id) => set({ tripId: id }), // ✅ без типа, всё ок
  setLocation: (lat, lng) => set({ location: { lat, lng } }),
  addRoutePoint: (lat, lng) =>
    set((state) => ({
      route: [...state.route, { lat, lng }],
    })),
}))
