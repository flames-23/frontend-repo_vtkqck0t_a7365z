import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { Mail, Github, Linkedin, ArrowRight, Download, Filter, Star, Sun, Moon } from 'lucide-react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(media.matches)
    handler()
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  return { theme, setTheme }
}

function useKeyToggle(key = 'g') {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === key.toLowerCase()) setOn(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key])
  return [on, setOn]
}

function Navbar({ onScrollTo, theme, setTheme }) {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const curr = window.scrollY
      setHidden(curr > last && curr > 64)
      last = curr
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: hidden ? -72 : 0, opacity: 1 }} transition={{ duration: 0.35 }} className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 backdrop-blur supports-[backdrop-filter]:bg-white/5 dark:supports-[backdrop-filter]:bg-black/10 border border-zinc-900/20 dark:border-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
          <button aria-label="Scroll to hero" onClick={() => onScrollTo('hero')} className="font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">Arnav Parashar</button>
          <div className="flex items-center gap-2">
            {['projects','about','blog','contact'].map(k => (
              <button key={k} onClick={() => onScrollTo(k)} className="hidden sm:inline-flex text-sm text-zinc-700 dark:text-zinc-300 hover:text-cyan-500 dark:hover:text-cyan-400 px-2 py-1 rounded transition-colors">
                {k.charAt(0).toUpperCase()+k.slice(1)}
              </button>
            ))}
            <button aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ml-2 p-2 rounded-lg border border-zinc-900/20 dark:border-white/10 hover:bg-zinc-100/50 dark:hover:bg-white/5 transition">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function Hero({ onScrollTo }) {
  const reduced = usePrefersReducedMotion()
  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center">
      <div className="absolute inset-0" aria-hidden>
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24">
        <AnimatePresence>
          <motion.h1 initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} className="text-4xl sm:text-6xl font-[800] tracking-[-0.02em] text-white">
            Arnav Parashar
          </motion.h1>
        </AnimatePresence>
        <motion.p initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, duration: 0.35 }} className="mt-3 text-lg sm:text-xl text-zinc-200">
          AI/ML + Full‑Stack — building low‑latency systems and clean web experiences.
        </motion.p>
        <motion.div initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.35 }} className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => onScrollTo('projects')} className="group inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-zinc-900 font-semibold px-5 py-2.5 transition">
            View Projects <ArrowRight className="group-hover:translate-x-0.5 transition" size={16} />
          </button>
          <button onClick={() => onScrollTo('contact')} className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 text-white px-5 py-2.5 backdrop-blur">
            Get in Touch <Mail size={16} />
          </button>
          <a href="/resume.pdf" className="inline-flex items-center gap-2 rounded-full border border-white/20 hover:border-white/40 text-white px-5 py-2.5">
            Download Résumé <Download size={16} />
          </a>
        </motion.div>
        <SkillTicker />
      </div>
    </section>
  )
}

function SkillTicker() {
  const skills = ['AI', 'Backend', 'Systems', 'Low‑latency', 'Data Infra', 'Web']
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      {skills.map((s, i) => (
        <motion.span key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05, duration: 0.3 }} className="text-xs uppercase tracking-wider text-cyan-300/80 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          {s}
        </motion.span>
      ))}
    </div>
  )
}

function FilterPills({ tags, active, onChange }) {
  const all = ['All', ...tags]
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((t) => (
        <button key={t} onClick={() => onChange(t)} className={`px-3 py-1.5 rounded-full text-sm border transition ${active === t ? 'bg-cyan-500 text-zinc-900 border-cyan-400' : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'}`}>{t}</button>
      ))}
    </div>
  )
}

function ProjectCard({ p }) {
  return (
    <motion.a href={p.demo_url || p.github_url || `#case-${p.slug}`}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 transition overflow-hidden">
      <div className="aspect-video w-full bg-gradient-to-br from-zinc-800 to-zinc-900" style={{ backgroundImage: p.cover_url ? `url(${p.cover_url})` : undefined, backgroundSize: p.cover_url ? 'cover' : undefined }} />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {p.featured && <Star size={14} className="text-cyan-400" />}
          <h3 className="font-semibold text-white">{p.title}</h3>
        </div>
        <p className="text-sm text-zinc-400 line-clamp-2">{p.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.stack?.slice(0, 5).map(s => (
            <span key={s} className="text-[11px] text-cyan-300/90 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">{s}</span>
          ))}
        </div>
        {p.impact && <p className="mt-3 text-xs text-emerald-300/90">{p.impact}</p>}
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    </motion.a>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/projects`)
        const data = await res.json()
        setProjects(data)
      } catch (e) {
        setError('Could not load projects')
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const tags = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags || []))), [projects])
  const filtered = useMemo(() => active === 'All' ? projects : projects.filter(p => p.tags?.includes(active)), [projects, active])

  return (
    <section id="projects" className="relative py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Projects</h2>
          <div className="flex items-center gap-3 text-zinc-400">
            <Filter size={16} />
            <FilterPills tags={tags} active={active} onChange={setActive} />
          </div>
        </div>
        {loading ? (
          <p className="text-zinc-400">Loading…</p>
        ) : error ? (
          <p className="text-rose-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <ProjectCard key={p.slug} p={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-transparent to-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">About</h2>
          <p className="text-zinc-300 leading-relaxed">
            I design and build systems that are simple on the surface and sharp under the hood. I care about latency, clarity, and long-term maintainability. Previously shipped intern work across AI/ML and platform engineering. Certificates include Google AI/ML Beginner.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['TypeScript','React','Next.js','FastAPI','Rust','Kafka','ClickHouse','Postgres'].map(t => (
              <span key={t} className="text-xs text-zinc-300 border border-zinc-700 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="font-semibold text-white mb-2">Timeline</h3>
          <ul className="text-sm text-zinc-300 space-y-2">
            <li>2025 — Building data infra side projects; exploring vector search ergonomics.</li>
            <li>2024 — Internship: platform team; shipped CI speedups and observability dashboards.</li>
            <li>2023 — Led student team for robotics vision; won regional competition.</li>
          </ul>
          <a className="mt-4 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300" href="/resume.pdf"><Download size={16}/>Download Résumé</a>
        </div>
      </div>
    </section>
  )
}

function Blog() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch(`${BACKEND}/api/posts`).then(r => r.json()).then(setPosts).catch(()=>{})
  }, [])
  if (!posts.length) return null
  return (
    <section id="blog" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Notes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map(po => (
            <article key={po.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="text-white font-semibold">{po.title}</h3>
              {po.excerpt && <p className="text-zinc-400 mt-1">{po.excerpt}</p>}
              <p className="mt-3 text-sm text-zinc-300 line-clamp-3 whitespace-pre-wrap">{po.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const valid = form.name && /.+@.+/.test(form.email) && form.message.length > 5

  const submit = async (e) => {
    e.preventDefault()
    if (!valid) return
    setStatus('loading')
    try {
      const res = await fetch(`${BACKEND}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-t from-transparent to-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Contact</h2>
          <p className="text-zinc-300">arnavparashar040907@gmail.com</p>
          <div className="mt-4 flex gap-3 text-zinc-300">
            <a className="hover:text-cyan-400" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={18}/></a>
            <a className="hover:text-cyan-400" href="https://linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={18}/></a>
          </div>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <label className="block text-sm text-zinc-300">Name</label>
          <input value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} className="mt-1 mb-3 w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500" required />
          <label className="block text-sm text-zinc-300">Email</label>
          <input type="email" value={form.email} onChange={e=>setForm(f=>({ ...f, email: e.target.value }))} className="mt-1 mb-3 w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500" required />
          <label className="block text-sm text-zinc-300">Message</label>
          <textarea value={form.message} onChange={e=>setForm(f=>({ ...f, message: e.target.value }))} rows={5} className="mt-1 mb-4 w-full bg-zinc-950/60 border border-zinc-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500" required />
          <button disabled={!valid || status==='loading'} className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-zinc-900 font-semibold px-5 py-2.5 transition disabled:opacity-50">
            {status==='success' ? 'Sent!' : status==='loading' ? 'Sending…' : 'Send Message'}
          </button>
          {status==='success' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-emerald-300">Thanks — I’ll get back soon.</motion.div>}
          {status==='error' && <div className="mt-3 text-rose-400">Something went wrong. Try again.</div>}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-10 text-sm text-zinc-400">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Arnav Parashar</p>
        <p>Built with React, Tailwind, Framer Motion</p>
      </div>
    </footer>
  )
}

function CursorDot() {
  const [pos, setPos] = useState({ x: -20, y: -20 })
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  if (reduced) return null
  return (
    <motion.div style={{ left: pos.x, top: pos.y }} className="pointer-events-none fixed z-[60] size-3 rounded-full bg-cyan-400/80 mix-blend-screen" initial={false} animate={{ x: -6, y: -6 }} />
  )
}

function GridOverlay({ show }) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-[55] ${show ? 'opacity-100' : 'opacity-0'} transition-opacity`} aria-hidden>
      <div className="w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  )
}

export default function App() {
  const { theme, setTheme } = useTheme()
  const [showGrid, setShowGrid] = useKeyToggle('g')

  const onScrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 selection:bg-cyan-300/40">
      <a href="#projects" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-cyan-500 text-black px-3 py-1 rounded">Skip to content</a>
      <Navbar onScrollTo={onScrollTo} theme={theme} setTheme={setTheme} />
      <main>
        <Hero onScrollTo={onScrollTo} />
        <Projects />
        <About />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <CursorDot />
      <GridOverlay show={showGrid} />
    </div>
  )
}
