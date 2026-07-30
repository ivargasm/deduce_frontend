import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DownloadCloud, UploadCloud, PieChart, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-[var(--color-deduce-bg)] font-sans text-[var(--color-deduce-navy)] selection:bg-[#0D9488] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-xl">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-[#89f5e7]/30 text-[#005049] uppercase mb-6 border border-[#89f5e7]/50">
            Guía de Inicio
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-deduce-navy)] font-display leading-[1.1] mb-6">
            Cómo funciona <span className="text-[var(--color-deduce-teal)]">Deducciones</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Nuestra plataforma automatiza el análisis de tus CFDI (facturas y nóminas) para que conozcas exactamente cuánto saldo a favor te corresponde, sin complicaciones.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="h-12 px-8 bg-[var(--color-deduce-teal)] hover:bg-[#0b7a70] text-white rounded-lg text-base shadow-sm">
                Crear cuenta gratuita
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full h-[400px] lg:h-[500px]">
          <Image 
            src="/como_funciona_hero.png" 
            alt="Ilustración isométrica del proceso de deducciones" 
            fill 
            className="object-contain" 
            priority
          />
        </div>
      </section>

      {/* Step by Step */}
      <section className="py-20 px-6 lg:px-8 max-w-[1280px] mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 font-display">El proceso en 3 pasos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <DownloadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">1. Descarga tus XMLs</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Ingresa al portal del SAT y descarga los archivos XML de los gastos que hayas realizado (honorarios médicos, seguros, colegiaturas, etc.) y tus recibos de nómina.
            </p>
          </Card>
          
          <Card className="p-8 border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">2. Súbelos a la plataforma</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Arrastra y suelta tus archivos ZIP o XML directamente en nuestro portal. El sistema procesará cada factura de forma segura en segundos.
            </p>
          </Card>

          <Card className="p-8 border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-slate-100 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <PieChart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">3. Analiza y Optimiza</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Obtén un dashboard completo con tus ingresos, retenciones, topes fiscales y monto exacto de deducciones personales válidas.
            </p>
          </Card>
        </div>
      </section>

      {/* Características Destacadas */}
      <section className="bg-slate-50 py-20 px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 font-display">Todo lo que necesitas saber</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">RFC e Ingresos Manuales (Plan Free)</h4>
                <p className="text-slate-600">
                  Al registrarte, podrás configurar tu RFC (puedes modificarlo después) e ingresar manualmente tu estimación de ingresos anuales para que podamos calcular el límite de tus deducciones (Art. 151 LISR).
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Ingresos y Retenciones Exactas (Plan PRO)</h4>
                <p className="text-slate-600">
                  Si eres usuario Premium, en lugar de ingresar tus ingresos a mano, puedes subir los <strong>XMLs de tus Recibos de Nómina</strong> y de tus <strong>Constancias de Retención</strong>. La plataforma extraerá los montos exactos para un cálculo preciso del ISR retenido y saldo a favor.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Colegiaturas y Complementos IEDU</h4>
                <p className="text-slate-600">
                  Identificamos automáticamente las facturas de colegiaturas (Complemento IEDU) y separamos los topes según el nivel educativo (Preescolar, Primaria, Secundaria, etc.) para que no pierdas ningún beneficio fiscal.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Alertas Proactivas</h4>
                <p className="text-slate-600">
                  Detectamos si una factura fue pagada en efectivo (forma de pago 01) o si tiene un &quot;Uso de CFDI&quot; incorrecto y te avisamos para que puedas pedirle a tu proveedor que la corrija a tiempo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-[var(--color-deduce-teal)] mx-auto mb-4" />
          <h2 className="text-3xl font-bold font-display">Preguntas Frecuentes</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-lg mb-2">¿Es seguro subir mis archivos XML?</h4>
            <p className="text-slate-600">
              Absolutamente. No almacenamos tus archivos físicos y los datos extraídos se guardan con cifrado. Solo tú puedes acceder a tu información fiscal.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-lg mb-2">¿Puedo probarlo gratis?</h4>
            <p className="text-slate-600">
              Sí, el Plan Free te permite subir hasta 30 facturas al mes, calcular tus deducciones y ver tus estadísticas generales sin costo alguno.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-lg mb-2">¿Qué pasa si mi contador ya hace esto?</h4>
            <p className="text-slate-600">
              Deducciones es la herramienta perfecta para hacer equipo con tu contador. Los usuarios Premium pueden enviarle un reporte Excel consolidado y pre-clasificado a su contador con un solo clic.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
