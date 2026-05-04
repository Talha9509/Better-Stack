"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation"
import Link from 'next/link'
import {
  Activity,
  Bell,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  LayoutDashboard,
  Menu,
  Shield,
  TrendingUp,
  X,
  Zap,
  ArrowRight,
  AlertCircle,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

const SITES = [
  { url: 'google.com', status: 'up', ms: 173, uptime: '99.99%' },
  { url: 'facebook.com', status: 'up', ms: 599, uptime: '99.97%' },
  { url: 'chatgpt.com', status: 'up', ms: 321, uptime: '99.92%' },
  { url: 'neon.com', status: 'up', ms: 169, uptime: '99.98%' },
  { url: 'perplexity.com', status: 'up', ms: 23, uptime: '100%' },
  { url: 'yoursite.io', status: 'down', ms: null, uptime: '98.12%' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#16a34a] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">B</span>
              </div>
              <span className="text-[#16a34a] font-bold text-xl tracking-tight">BetterUpTime</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-600 hover:text-[#16a34a] text-sm font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href={"/signin"}  className="text-sm font-medium text-gray-700 hover:text-[#16a34a] transition-colors px-4 py-2">
                Log in
              </Link>
              <Link href={"/signup"}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Start free
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {['Features', 'How it works', 'Pricing', 'Docs'].map((item) => (
              <a key={item} href="#" className="block text-gray-700 font-medium py-1">
                {item}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <a href="#" className="text-center text-gray-700 font-medium py-2 border border-gray-200 rounded-lg">
                Log in
              </a>
              <a href="#" className="text-center bg-[#16a34a] text-white font-semibold py-2.5 rounded-lg">
                Start free
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-to-b from-[#f0fdf4] to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#dcfce7] text-[#16a34a] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse" />
              Live monitoring — always on
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Know the moment your{' '}
              <span className="text-[#16a34a]">website goes down</span>
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
              BetterUpTime continuously monitors your websites, measures response times, and alerts you
              instantly — before your users ever notice a problem.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={"/signup"}
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors shadow-sm text-base"
              >
                Start monitoring free
                <ArrowRight size={18} />
              </Link>
              <div
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-[#16a34a] hover:text-[#16a34a] font-semibold px-7 py-3.5 rounded-lg transition-colors text-base"
              >
                <LayoutDashboard size={18} />
                View demo
              </div>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-green-100 border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#16a34a] rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-[#16a34a] font-bold text-base">BetterUpTime</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 hidden sm:block">Welcome, user@example.com</span>
                  <button className="text-sm font-semibold text-gray-700 hidden sm:block">Logout</button>
                </div>
              </div>

              <div className="bg-[#f0fdf4] px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-56">
                  <Globe size={15} className="text-gray-400" />
                  <span className="text-sm text-gray-400">Search websites...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
                    All Status
                  </div>
                  <button className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                  <button className="bg-[#16a34a] text-white rounded-lg px-4 py-2 text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                    + Add Website
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      {['WEBSITE', 'STATUS', 'RESPONSE TIME', 'UPTIME', 'LAST CHECKED'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SITES.map((site, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">https://{site.url}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                              site.status === 'up'
                                ? 'bg-[#dcfce7] text-[#16a34a]'
                                : 'bg-red-50 text-red-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                site.status === 'up' ? 'bg-[#16a34a]' : 'bg-red-500'
                              }`}
                            />
                            {site.status === 'up' ? 'Up' : 'Down'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {site.ms ? `${site.ms}ms` : <span className="text-red-400">—</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{site.uptime}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">Just now</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Websites monitored', value: 84000, suffix: '+' },
              { label: 'Checks per minute', value: 2400000, suffix: '+' },
              { label: 'Avg response accuracy', value: 99, suffix: '.9%' },
              { label: 'Teams trust us', value: 12000, suffix: '+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything you need to stay online
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Comprehensive monitoring tools designed to give you full visibility into your website's health and performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Activity size={22} />,
                title: 'Uptime Monitoring',
                desc: 'Monitor any HTTP/HTTPS endpoint every 30 seconds from multiple global locations.',
              },
              {
                icon: <Zap size={22} />,
                title: 'Response Time Tracking',
                desc: 'Track response times in milliseconds and spot performance degradations instantly.',
              },
              {
                icon: <Bell size={22} />,
                title: 'Instant Alerts',
                desc: 'Get notified via email, SMS, Slack, or webhook the moment something goes wrong.',
              },
              {
                icon: <BarChart2 size={22} />,
                title: 'Detailed Analytics',
                desc: 'Historical uptime reports, response time charts, and exportable incident logs.',
              },
              {
                icon: <Shield size={22} />,
                title: 'SSL Monitoring',
                desc: 'Track certificate expiry and get warnings 30 days before they expire.',
              },
              {
                icon: <Globe size={22} />,
                title: 'Status Pages',
                desc: 'Public-facing status pages to keep your users informed during incidents.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-[#16a34a]/30 hover:shadow-lg hover:shadow-green-50 transition-all duration-200"
              >
                <div className="w-11 h-11 bg-[#dcfce7] text-[#16a34a] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#16a34a] group-hover:text-white transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#f0fdf4] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Up and running in 60 seconds
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No complex setup. No agents to install. Just add your URL and we handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-[#bbf7d0]" />

            {[
              {
                step: '01',
                icon: <Globe size={24} />,
                title: 'Add your website',
                desc: 'Enter your URL — HTTP, HTTPS, or custom port. We start monitoring immediately.',
              },
              {
                step: '02',
                icon: <RefreshCw size={24} />,
                title: 'We check continuously',
                desc: 'Our global infrastructure sends checks every 30 seconds from multiple regions.',
              },
              {
                step: '03',
                icon: <Bell size={24} />,
                title: 'Get instant alerts',
                desc: 'When something breaks, you know in seconds — not minutes — via your preferred channel.',
              },
            ].map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white border-2 border-[#bbf7d0] rounded-2xl flex items-center justify-center text-[#16a34a] shadow-sm">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 bg-[#16a34a] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {step.step.replace('0', '')}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alert showcase */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 px-4 items-center">
            <div>
              <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-widest mb-3">Real-time alerts</p>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
                Never miss a downtime event again
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Our multi-channel alerting ensures the right people are notified at the right time.
                Configure escalation policies so nothing slips through the cracks.
              </p>
              <ul className="space-y-4">
                {[
                  'Email & SMS notifications',
                  'Slack & Teams webhooks',
                  'Alert escalation policies',
                  'Incident timeline & resolution tracking',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                    <CheckCircle size={18} className="text-[#16a34a] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {[
                {
                  site: 'api.yoursite.io',
                  msg: 'Site is DOWN — connection refused',
                  time: '14:32:01',
                  bg: 'bg-red-50',
                  border: 'border-red-200',
                  textColor: 'text-red-700',
                  icon: <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />,
                },
                {
                  site: 'checkout.yoursite.io',
                  msg: 'Response time degraded — 2340ms (threshold: 1000ms)',
                  time: '14:29:44',
                  bg: 'bg-amber-50',
                  border: 'border-amber-200',
                  textColor: 'text-amber-700',
                  icon: <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />,
                },
                {
                  site: 'api.yoursite.io',
                  msg: 'Site is back UP — downtime lasted 3m 12s',
                  time: '14:35:13',
                  bg: 'bg-[#f0fdf4]',
                  border: 'border-[#bbf7d0]',
                  textColor: 'text-[#15803d]',
                  icon: <CheckCircle size={18} className="text-[#16a34a] shrink-0 mt-0.5" />,
                },
                {
                  site: 'yoursite.io',
                  msg: 'SSL certificate expires in 28 days',
                  time: '13:00:00',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200',
                  textColor: 'text-blue-700',
                  icon: <Shield size={18} className="text-blue-500 shrink-0 mt-0.5" />,
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${alert.bg} border ${alert.border} rounded-xl px-4 py-3.5`}
                >
                  {alert.icon}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${alert.textColor}`}>{alert.site}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{alert.msg}</p>
                  </div>
                  <span className="text-xs text-gray-400 font-mono shrink-0">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance metrics */}
      <section className="py-24 bg-[#f0fdf4] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-green-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-bold text-gray-900">Response Time — Last 24h</p>
                  <p className="text-xs text-gray-400 mt-0.5">https://yoursite.io</p>
                </div>
                <span className="text-xs bg-[#dcfce7] text-[#16a34a] font-semibold px-2.5 py-1 rounded-full">
                  Avg 187ms
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-32">
                {[40, 55, 35, 70, 45, 60, 38, 80, 42, 58, 35, 65, 48, 72, 38, 55, 62, 44, 78, 50, 35, 68, 42, 190].map(
                  (h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className={`rounded-sm ${h > 100 ? 'bg-amber-300' : 'bg-[#86efac]'}`}
                        style={{ height: `${(h / 200) * 100}%` }}
                      />
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Now</span>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">30-day uptime</p>
                  <span className="text-sm font-bold text-[#16a34a]">99.97%</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 90 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-6 rounded-sm ${
                        i === 23 || i === 67 ? 'bg-red-300' : i === 44 ? 'bg-amber-300' : 'bg-[#86efac]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-widest mb-3">Analytics</p>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
                Deep performance insights
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Beautiful charts and detailed analytics give you a complete picture of your website's
                reliability over time. Identify trends and act before users are affected.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Response time history', icon: <TrendingUp size={16} /> },
                  { label: 'Uptime timeline', icon: <BarChart2 size={16} /> },
                  { label: 'Incident reports', icon: <AlertCircle size={16} /> },
                  { label: 'Check frequency logs', icon: <Clock size={16} /> },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <span className="text-[#16a34a]">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#16a34a] font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Start free. Scale when you're ready. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Hobby',
                price: 'Free',
                period: '',
                desc: 'Perfect for personal projects and small sites.',
                features: ['5 monitors', '5-min check interval', 'Email alerts', '7-day log history'],
                cta: 'Get started',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$19',
                period: '/mo',
                desc: 'For growing teams that need reliable monitoring.',
                features: ['50 monitors', '30-sec check interval', 'All alert channels', '90-day history', 'Status pages', 'SSL monitoring'],
                cta: 'Start free trial',
                highlight: true,
              },
              {
                name: 'Business',
                price: '$59',
                period: '/mo',
                desc: 'For organizations that need enterprise-grade uptime.',
                features: ['Unlimited monitors', '10-sec check interval', 'Priority support', '1-year history', 'Team management', 'API access'],
                cta: 'Contact sales',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 flex flex-col ${
                  plan.highlight
                    ? 'bg-[#16a34a] text-white shadow-2xl shadow-green-200 scale-105'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <span className="self-start bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <p className={`font-bold text-lg mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-extrabold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm mb-1 ${plan.highlight ? 'text-green-200' : 'text-gray-400'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-green-100' : 'text-gray-500'}`}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-green-50' : 'text-gray-600'}`}>
                      <CheckCircle size={15} className={plan.highlight ? 'text-green-200 shrink-0' : 'text-[#16a34a] shrink-0'} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-white text-[#16a34a] hover:bg-green-50'
                      : 'bg-[#16a34a] text-white hover:bg-[#15803d]'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#16a34a] px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-5">
            Start monitoring your website today
          </h2>
          <p className="text-green-100 text-lg mb-10">
            Join thousands of teams who rely on BetterUpTime to protect their online presence.
            Free plan available — no credit card needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#16a34a] font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 transition-colors shadow-lg text-base"
            >
              Start for free
              <ChevronRight size={18} />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 border border-green-400 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-700 transition-colors text-base"
            >
              See all features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-[#16a34a] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-white font-bold text-base">BetterUpTime</span>
              </div>
              <p className="text-sm leading-relaxed">
                Real-time website monitoring that keeps your team informed and your users happy.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'SLA'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">2026 BetterUpTime. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
