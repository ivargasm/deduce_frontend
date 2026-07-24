import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TriangleAlert, ShieldCheck, CheckCircle2, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-deduce-bg)] font-sans text-[var(--color-deduce-navy)] selection:bg-[#0D9488] selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="max-w-xl">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-[#89f5e7]/30 text-[#005049] uppercase mb-6 border border-[#89f5e7]/50">
            Cumplimiento Inteligente
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-deduce-navy)] font-display leading-[1.1] mb-6">
            Controla tus impuestos todo el año, <span className="text-[var(--color-deduce-teal)]">no solo en abril.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Detecta errores en tus CFDI y maximiza tu ahorro fiscal antes de la declaración anual. Transforma la incertidumbre fiscal en certeza financiera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-[var(--color-deduce-teal)] hover:bg-[#0b7a70] text-white rounded-lg text-base shadow-sm">
                Comienza gratis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-lg text-base border-slate-300 text-slate-700 hover:bg-slate-50">
              Ver demo
            </Button>
          </div>
        </div>

        {/* Right Floating Widget */}
        <div className="relative">
          {/* Main Card */}
          <Card className="p-8 rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)] border-slate-200/60 bg-white relative z-10 mx-auto max-w-md w-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Ahorro Estimado 2024</span>
            </div>
            <div className="flex items-end justify-between mb-8">
              <span className="text-4xl font-bold font-display text-[var(--color-deduce-navy)] tabular-nums">$42,850.00 MXN</span>
              <span className="inline-flex items-center gap-1 bg-[#89f5e7]/30 text-[#005049] text-xs font-semibold px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> +12% vs 2023
              </span>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-slate-600">Límite de Deducciones Personales</span>
                <span className="text-slate-900 tabular-nums">82%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-deduce-teal)] rounded-full w-[82%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CFDIs Validados</div>
                <div className="text-xl font-bold text-[var(--color-deduce-navy)] tabular-nums">1,204</div>
              </div>
              <div className="border border-red-200 rounded-xl p-4 bg-red-50/50">
                <div className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Alertas Fiscales</div>
                <div className="text-xl font-bold text-red-600 tabular-nums">3</div>
              </div>
            </div>
          </Card>

          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#89f5e7]/20 to-blue-200/20 blur-3xl -z-10 rounded-full opacity-70 pointer-events-none"></div>
        </div>
      </section>

      {/* Contrast Section */}
      <section className="py-24 px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chaos Card */}
          <div className="bg-[#f1f5f9] rounded-3xl p-10 flex flex-col justify-between border border-slate-200/60 group overflow-hidden">
            <div>
              <div className="w-12 h-12 bg-red-100 text-red-500 flex items-center justify-center rounded-xl mb-6">
                <TriangleAlert className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold font-display text-[var(--color-deduce-navy)] mb-4">El caos de Abril</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Descubrir facturas mal emitidas, regímenes incorrectos o beneficios perdidos justo antes del cierre anual es costoso y estresante.
              </p>
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden mt-auto bg-slate-300">
              {/* Grayscale aesthetic representation */}
              <div className="absolute inset-0 bg-slate-800/20 mix-blend-multiply"></div>
              <Image src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop&grayscale=true" alt="Messy desk with papers" fill className="object-cover" />
            </div>
          </div>

          {/* Peace Card */}
          <div className="bg-[#89f5e7]/20 rounded-3xl p-10 flex flex-col justify-between border border-[#89f5e7]/40 group overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--color-deduce-teal)] text-white flex items-center justify-center rounded-xl mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold font-display text-[var(--color-deduce-navy)] mb-4">Paz mental todo el año</h3>
              <p className="text-slate-700 text-lg leading-relaxed mb-8">
                Con Deduce, cada CFDI se analiza al momento. Corrige errores en tiempo real y llega a tu declaración con la tranquilidad de quien tiene todo bajo control.
              </p>
            </div>
            <div className="relative h-48 rounded-xl overflow-hidden mt-auto shadow-xl">
              <Image src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" alt="Clean desk with analytics" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-display text-[var(--color-deduce-navy)] mb-6">Inteligencia Fiscal en tus Manos</h2>
          <p className="text-lg text-slate-600">Tecnología diseñada para personas y profesionales que buscan optimizar su carga tributaria sin complicaciones técnicas.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Clasificacion Automatica */}
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-slate-100 text-[var(--color-deduce-teal)] flex items-center justify-center rounded-lg mb-6">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-deduce-navy)] mb-3">Clasificación Automática</h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Nuestro motor de IA identifica automáticamente tus gastos y los asigna a las categorías deducibles correspondientes según tu régimen.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">🏥</div>
                  <span className="font-medium text-slate-700">Honorarios Médicos</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase tracking-wide">Deducible</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600">🛒</div>
                  <span className="font-medium text-slate-700">Supermercado</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-500 rounded uppercase tracking-wide">No Deducible</span>
              </div>
            </div>
          </div>

          {/* Deteccion Inconsistencias */}
          <div className="bg-[var(--color-deduce-navy)] rounded-3xl p-10 text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="w-10 h-10 bg-white/10 text-[var(--color-deduce-coral)] flex items-center justify-center rounded-lg mb-6">
                <TriangleAlert className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Detección de Inconsistencias</h3>
              <p className="text-slate-400 leading-relaxed mb-8">
                Alertas instantáneas para CFDIs emitidos con errores de RFC, Uso de CFDI incorrecto o métodos de pago no permitidos.
              </p>
            </div>
            <div className="mt-auto border border-red-500/30 bg-red-500/10 rounded-xl p-4 flex items-center gap-3">
              <TriangleAlert className="w-5 h-5 text-[var(--color-deduce-coral)]" />
              <span className="text-sm font-medium text-red-200">3 errores detectados este mes</span>
            </div>
          </div>
        </div>

        {/* Wide Banner */}
        <div className="bg-gradient-to-r from-[#89f5e7]/40 to-[#89f5e7]/10 rounded-3xl p-10 border border-[#89f5e7]/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold font-display text-[var(--color-deduce-navy)] mb-3">Estimador de Ahorro en Tiempo Real</h3>
            <p className="text-slate-700 mb-6">No esperes a que tu contador haga el cálculo final. Visualiza tu saldo a favor proyectado cada vez que subes una factura.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[var(--color-deduce-navy)] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-deduce-teal)]" /> Cálculo basado en leyes vigentes 2024
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-deduce-navy)] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[var(--color-deduce-teal)]" /> Proyección de devolución ISR
              </li>
            </ul>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl flex-1 md:w-48">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Saldo A Favor</div>
              <div className="text-3xl font-bold text-[var(--color-deduce-navy)] tabular-nums">$14,200</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-6 rounded-2xl flex-1 md:w-48">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Potencial Max.</div>
              <div className="text-3xl font-bold text-[var(--color-deduce-navy)] tabular-nums">$22,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="bg-[var(--color-deduce-navy)] rounded-[2rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          {/* Subtle background pattern/glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0D9488]/20 via-transparent to-transparent opacity-60"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">¿Listo para tomar el control de tus finanzas?</h2>
            <p className="text-xl text-slate-400 mb-10">Únete a cientos de usuarios que ya no le temen al mes de abril.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 bg-[var(--color-deduce-teal)] hover:bg-[#0b7a70] text-white rounded-xl text-lg shadow-sm">
                  Empezar ahora
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl text-lg border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                Hablar con ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-[var(--color-deduce-navy)] mb-4 block">
              Deduce
            </Link>
            <p className="text-slate-500 text-sm max-w-xs mb-4">
              Cumplimiento fiscal simplificado a través de tecnología inteligente y análisis de datos en tiempo real.
            </p>
            <p className="text-slate-400 text-xs italic max-w-xs">
              *Esta herramienta es un apoyo informático y no sustituye la asesoría de un contador profesional.*
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-deduce-navy)] mb-4">Producto</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="#" className="hover:text-[var(--color-deduce-teal)]">Funcionalidades</Link></li>
              <li><Link href="/premium" className="hover:text-[var(--color-deduce-teal)]">Precios</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-deduce-teal)]">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-deduce-navy)] mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link href="/terminos" className="hover:text-[var(--color-deduce-teal)]">Términos</Link></li>
              <li><Link href="/privacidad" className="hover:text-[var(--color-deduce-teal)]">Privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-12 pt-8 border-t border-slate-100 text-sm text-slate-400 text-center md:text-left">
          © {new Date().getFullYear()} Deduce. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}
