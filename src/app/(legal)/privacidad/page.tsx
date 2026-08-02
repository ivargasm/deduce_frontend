export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-slate-700 font-sans leading-relaxed space-y-8">
      <div className="border-b border-slate-200 pb-8 mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-deduce-navy)] font-display mb-4">
          Aviso de Privacidad Integral
        </h1>
        <p className="text-lg text-slate-500">
          DEDUCE — Asistente de Deducciones Fiscales
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Última actualización: 1 de Julio de 2026.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">1. Identidad y domicilio del responsable</h2>
        <p>
          Ismael Vargas Martinez (en adelante, “El Responsable”), con domicilio fiscal ubicado en la ciudad de 
          Santiago de Querétaro, Querétaro, México, es responsable del tratamiento de sus datos personales conforme 
          a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) y su Reglamento.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">2. Datos personales que recabamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Datos de identificación:</strong> nombre completo, RFC, nombre de usuario.</li>
          <li><strong>Datos de contacto:</strong> correo electrónico.</li>
          <li><strong>Datos fiscales/laborales:</strong> régimen fiscal, actividad económica (opcional, si aplica para facturación del servicio).</li>
          <li><strong>Datos patrimoniales y financieros:</strong> ingreso anual declarado por usted, montos de los CFDI cargados, retenciones de ISR capturadas, e información de pago de su suscripción (procesada por nuestra pasarela de pagos, ver sección 5).</li>
          <li><strong>Contenido de los CFDI que usted carga:</strong> incluye RFC del emisor y receptor, montos, conceptos, uso de CFDI y forma de pago — datos fiscales necesarios para el funcionamiento del servicio.</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-amber-900 text-sm">
          <strong>Nota sobre datos que pueden revelar información de salud:</strong> Dado que el servicio está diseñado 
          para clasificar comprobantes de gastos médicos, dentales, hospitalarios y de seguros de gastos médicos 
          (CFDI con uso D01, D02, D07, entre otros) como parte de su función principal, el contenido de dichos comprobantes 
          puede reflejar de manera indirecta información relacionada con su salud o la de sus dependientes económicos 
          (por ejemplo, tipo de consulta o especialidad médica). Esta información se trata como dato personal sensible 
          conforme al artículo 3, fracción VI de la LFPDPPP.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">3. Datos personales sensibles y consentimiento expreso</h2>
        <p>
          A diferencia de un procesador de datos genérico, el funcionamiento principal del servicio implica el tratamiento 
          de comprobantes que pueden contener datos de salud indirectos, según se describe en la sección anterior. 
          Por tratarse de datos sensibles, requerimos su consentimiento expreso y por escrito —que otorga al crear su cuenta 
          y aceptar el presente aviso— para:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Clasificar automáticamente sus CFDI de gastos médicos dentro de las categorías de deducción personal correspondientes.</li>
          <li>Almacenar dicha información durante el tiempo necesario para prestar el servicio (ver sección 6).</li>
        </ul>
        <p>
          Usted puede revocar este consentimiento en cualquier momento sin que ello afecte la licitud del tratamiento previo 
          (ver sección 7, Derechos ARCO). No solicitamos ni recabamos intencionalmente otros datos sensibles (origen racial, 
          creencias religiosas, afiliación sindical, preferencia sexual, etc.). Si un CFDI que usted carga contiene 
          incidentalmente este tipo de información, se tratará bajo las mismas medidas de seguridad descritas en este aviso; 
          le recomendamos evitar cargar comprobantes de terceros sin contar con su autorización.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">4. Finalidades del tratamiento</h2>
        
        <h3 className="font-semibold text-slate-800 mt-4">A. Finalidades primarias (necesarias para el servicio):</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Crear y administrar su cuenta de usuario.</li>
          <li>Recibir, procesar, clasificar y validar los CFDI que usted cargue.</li>
          <li>Calcular estimaciones de deducciones acumuladas, tope aplicable, ISR estimado y saldo a favor proyectado.</li>
          <li>Generar reportes descargables (Excel) y, en su caso, enviarlos por correo electrónico a un tercero que usted designe (por ejemplo, su contador), únicamente cuando usted lo solicite expresamente.</li>
          <li>Procesar pagos y administrar su suscripción (plan gratuito o premium).</li>
          <li>Brindar soporte técnico y atender aclaraciones.</li>
          <li>Cumplir obligaciones legales y fiscales propias de El Responsable.</li>
        </ul>

        <h3 className="font-semibold text-slate-800 mt-6">B. Finalidades secundarias (opcionales):</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Envío de boletines, actualizaciones del producto o promociones.</li>
          <li>Análisis estadístico agregado y anonimizado para mejorar los algoritmos de clasificación y detección de inconsistencias.</li>
        </ul>
        <p className="text-sm mt-4">
          Si no desea que sus datos se utilicen para fines secundarios, puede manifestarlo desde este momento enviando 
          un correo a <a href="mailto:soporte@juristechspace.com" className="text-[var(--color-deduce-teal)] hover:underline font-semibold">soporte@juristechspace.com</a>, sin que esto afecte el uso del servicio para sus fines primarios.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">5. Transferencia de datos y procesamiento de pagos</h2>
        <p>Sus datos personales pueden ser compartidos con:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Autoridades competentes, en los casos previstos por la ley.</li>
          <li>Proveedores de infraestructura en la nube (por ejemplo, AWS, Google Cloud o Vercel) necesarios para la operación técnica de la plataforma.</li>
          <li>Stripe, Inc., para el procesamiento de pagos, de conformidad con el artículo 36, fracciones IV y VII de la LFPDPPP. El Responsable no tiene acceso a su número completo de tarjeta ni al CVV; únicamente conservamos referencias (tokens), los últimos 4 dígitos y el historial de transacciones.</li>
          <li>El contador, asesor fiscal o tercero que usted designe expresamente al utilizar la función “Enviar a mi contador”. Esta transferencia ocurre únicamente por instrucción directa suya, y usted es responsable de verificar la identidad y el correo electrónico del destinatario.</li>
        </ul>
        <p>No vendemos, rentamos ni compartimos sus datos personales con fines de mercadotecnia de terceros ajenos a la prestación del servicio.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">6. Retención y eliminación de datos</h2>
        <p>
          A diferencia de una herramienta de procesamiento temporal de archivos, este servicio está diseñado para dar seguimiento a 
          sus deducciones a lo largo de todo el ejercicio fiscal, por lo que sus CFDI y datos asociados se conservan mientras 
          su cuenta permanezca activa.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cuenta activa:</strong> Los datos se conservan para permitir el seguimiento del acumulado anual y comparativos entre ejercicios.</li>
          <li><strong>Cancelación de cuenta:</strong> Al solicitar la baja, sus datos se eliminan de forma permanente dentro de un plazo de 30 días naturales, salvo obligación legal de conservarlos por un periodo mayor.</li>
          <li><strong>Retención de XMLs:</strong> Le informamos que DEDUCE NO almacena los archivos XML (CFDI) que usted sube a la plataforma. Estos archivos son procesados en memoria para extraer únicamente los datos necesarios para el cálculo de sus deducciones, y posteriormente son descartados de inmediato para proteger su privacidad.</li>
        </ul>
        <p>
          Usted puede solicitar la eliminación anticipada de CFDI específicos o de toda su cuenta en cualquier momento 
          (ver sección 7, Derechos ARCO). Cifrado: los datos se transmiten mediante protocolos seguros (SSL/TLS) y se 
          almacenan cifrados en reposo.
        </p>
        <p className="italic text-sm">
          Es responsabilidad del Usuario conservar copias de los CFDI originales emitidos por el SAT; este servicio 
          no sustituye el Buzón Tributario ni el repositorio oficial de comprobantes del SAT.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">7. Derechos ARCO</h2>
        <p>
          Usted tiene derecho a conocer qué datos personales tenemos de usted y para qué los utilizamos (Acceso); 
          a solicitar la corrección de su información cuando esté desactualizada, sea inexacta o incompleta (Rectificación); 
          a que la eliminemos de nuestros registros cuando considere que no está siendo utilizada adecuadamente (Cancelación); 
          así como a oponerse a su uso para fines específicos (Oposición), y a revocar en cualquier momento el consentimiento 
          que nos haya otorgado, incluido el relativo a datos sensibles.
        </p>
        <p>
          Para ejercer cualquiera de los derechos ARCO, envíe su solicitud al correo electrónico <a href="mailto:soporte@juristechspace.com" className="text-[var(--color-deduce-teal)] hover:underline font-semibold">soporte@juristechspace.com</a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">8. Medidas de seguridad</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cifrado en tránsito (SSL/TLS) y en reposo para los CFDI almacenados.</li>
          <li>El procesamiento y clasificación de sus CFDI es realizado por algoritmos automatizados; no existe revisión humana del contenido de sus comprobantes, salvo por orden judicial o solicitud expresa de soporte técnico.</li>
          <li>Autenticación segura para el acceso a su cuenta.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">9. Uso de cookies y tecnologías de rastreo</h2>
        <p>
          Utilizamos cookies y tecnologías similares para mantener su sesión iniciada, recordar sus preferencias 
          (por ejemplo, modo oscuro/claro) y, en su caso, medir el uso agregado de la plataforma con fines de mejora del servicio. 
          Puede deshabilitarlas desde la configuración de su navegador, aunque esto podría limitar algunas funciones.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">10. Naturaleza del servicio y Procesamiento de Pagos</h2>
        <p>
          El tratamiento de sus datos tiene como único fin apoyar el seguimiento, clasificación y estimación de sus 
          deducciones personales. El Responsable no funge como asesor fiscal, contador público ni representante legal 
          del Usuario ante el SAT; las estimaciones generadas no constituyen una declaración oficial ni sustituyen la 
          revisión de un profesional certificado.
        </p>
        <p>
          Los pagos de suscripción a DEDUCE son procesados de forma segura a través de nuestro proveedor externo Stripe. 
          DEDUCE no almacena, procesa ni tiene acceso a la información de sus tarjetas de crédito o débito.
        </p>
      </section>

      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">11. Cambios al aviso de privacidad</h2>
        <p>
          El presente aviso puede sufrir modificaciones derivadas de nuevos requerimientos legales, de nuestras propias 
          necesidades operativas, de cambios en nuestras prácticas de privacidad o de nuestro modelo de negocio. 
          Nos comprometemos a mantenerlo informado sobre dichos cambios a través de notificaciones en el dashboard.
        </p>
      </section>
    </div>
  );
}