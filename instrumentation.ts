export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { connectDB } = await import('./lib/db/mongoose')
    try {
      await connectDB()
    } catch {
      // per-request handlers will retry; startup failure is non-fatal
    }
  }
}
