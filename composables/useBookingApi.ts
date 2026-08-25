export interface BookingPayload {
  experience: 'classica' | 'verticale' | 'sumisura'
  date: string
  guests: number
  name: string
  email: string
}

// chatbot/server.js hosts the real /api/booking endpoint; this site is deployed static (GitHub Pages),
// so bookings are submitted to wherever that Express server is hosted, not to a Nuxt server route.
export function useBookingApi() {
  const config = useRuntimeConfig()

  async function submitBooking(payload: BookingPayload) {
    const base = config.public.bookingApiUrl || ''
    await $fetch('/api/booking', { method: 'POST', baseURL: base || undefined, body: payload })
  }

  return { submitBooking }
}
