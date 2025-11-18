import { useState } from 'react'

function BranchGraphic() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-64 sm:h-72 md:h-80 opacity-70">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* central spine */}
      <path d="M400 30 L400 360" stroke="url(#g)" strokeWidth="2.5" fill="none" filter="url(#glow)" />

      {/* left branches */}
      <path d="M400 120 C340 120, 320 110, 270 90" stroke="url(#g)" strokeWidth="2" fill="none" />
      <path d="M400 190 C340 190, 315 175, 260 150" stroke="url(#g)" strokeWidth="2" fill="none" />
      <path d="M400 260 C340 260, 320 250, 270 235" stroke="url(#g)" strokeWidth="2" fill="none" />

      {/* right branches */}
      <path d="M400 150 C460 150, 485 130, 540 110" stroke="url(#g)" strokeWidth="2" fill="none" />
      <path d="M400 220 C460 220, 490 205, 550 185" stroke="url(#g)" strokeWidth="2" fill="none" />
      <path d="M400 300 C460 300, 490 295, 560 290" stroke="url(#g)" strokeWidth="2" fill="none" />

      {/* nodes */}
      {[
        [400, 80],[400, 150],[400, 220],[400, 300],
        [270, 90],[260, 150],[270, 235],
        [540, 110],[550, 185],[560, 290]
      ].map(([x,y],i)=> (
        <circle key={i} cx={x} cy={y} r="4" fill="#93c5fd" className="animate-pulse" />
      ))}
    </svg>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMessage('')

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' })
      })
      if (!res.ok) throw new Error('Failed to join. Please try again.')
      setStatus('success')
      setMessage('You\'re on the list. We\'ll be in touch soon!')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* soft vignette and grain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,rgba(59,130,246,0.12),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{backgroundImage:'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize:'10px 10px'}} />

      <main className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <section className="w-full max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200 text-xs tracking-wide mb-6">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            branched.chat
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
            Conversations that branch with you
          </h1>
          <p className="mt-4 text-slate-300/90 text-lg max-w-2xl mx-auto">
            A minimal, fast canvas for multi‑path chats. Explore ideas, keep context, and see where thinking diverges—without losing the thread.
          </p>

          <div className="mt-10">
            <BranchGraphic />
          </div>

          <form onSubmit={submit} className="mx-auto mt-6 flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-500/60 transition"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.15)]" />
            </div>
            <button
              type="submit"
              disabled={status==='loading'}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-900 font-semibold px-4 py-3 hover:from-sky-400 hover:to-cyan-300 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status==='loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>

          {message && (
            <p className={`mt-3 text-sm ${status==='success' ? 'text-emerald-300' : 'text-rose-300'}`}>
              {message}
            </p>
          )}

          <div className="mt-10 text-xs text-slate-400/80">
            No spam. Just a single note when we open access.
          </div>
        </section>
      </main>

      {/* subtle glow blobs */}
      <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
    </div>
  )
}

export default App
