export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-slate-700 font-sans leading-relaxed space-y-8">
      <div className="border-b border-slate-200 pb-8 mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-deduce-navy)] font-display mb-4">
          Términos y Condiciones
        </h1>
        <p className="text-lg text-slate-500">
          DEDUCE — Asistente de Deducciones Fiscales
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Última actualización: 1 de Julio de 2026.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">1. Aceptación de los términos</h2>
        <p>
          Al registrarse, acceder o utilizar los servicios de Ismael Vargas Martinez (en adelante, “La Plataforma”), 
          usted (en adelante, “El Usuario”) acepta vincularse legalmente por estos Términos y Condiciones. Si no está de acuerdo, absténgase de usar el servicio.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">2. Descripción del servicio</h2>
        <p>
          La Plataforma es un software como servicio (SaaS) que permite la carga, clasificación automatizada y 
          seguimiento de Comprobantes Fiscales Digitales por Internet (CFDI) para efectos de deducciones personales 
          del Impuesto Sobre la Renta (ISR) en México, incluyendo:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Clasificación automática de CFDI por categoría de deducción personal.</li>
          <li>Detección de inconsistencias (uso de CFDI incorrecto, forma de pago no deducible, errores de RFC, entre otros).</li>
          <li>Cálculo estimado del acumulado frente al tope legal aplicable y estimación de ahorro fiscal / saldo a favor.</li>
          <li>Generación de reportes descargables y, en el plan Premium, envío de dichos reportes a terceros designados por el Usuario.</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4 text-amber-900">
          <strong>Aviso importante:</strong> La Plataforma no es una asesoría fiscal, contable ni legal. Las clasificaciones, 
          cálculos y estimaciones son generados por algoritmos con base en la información cargada por el Usuario y en la 
          interpretación vigente de la normatividad fiscal aplicable (LISR, CFF y disposiciones misceláneas), pero pueden contener 
          errores, quedar desactualizados por reformas fiscales, o no contemplar circunstancias particulares del Usuario. 
          El Usuario es el único responsable de validar la información con un contador público o abogado fiscal certificado 
          antes de presentar su declaración anual ante el SAT.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">3. Requisitos y elegibilidad</h2>
        <p>
          El Usuario declara ser mayor de edad y contar con capacidad legal para contratar. El servicio está dirigido a 
          personas físicas residentes fiscales en México.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">4. Propiedad de los datos y licencia</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Propiedad del Usuario:</strong> El Usuario conserva la titularidad de los CFDI y demás información fiscal que cargue (“Contenido del Usuario”). Estos documentos fueron originalmente emitidos por terceros (SAT/emisores) y el Usuario garantiza contar con el derecho de cargarlos para su propio uso.</li>
          <li><strong>Licencia de procesamiento:</strong> Al cargar Contenido del Usuario, este otorga a La Plataforma una licencia limitada, no exclusiva y libre de regalías, para almacenar, procesar, clasificar y analizar dicho contenido, únicamente con el propósito de prestar el servicio.</li>
          <li><strong>Garantía de legalidad:</strong> El Usuario garantiza que los CFDI cargados corresponden a comprobantes emitidos a su nombre o a nombre de dependientes económicos respecto de los cuales tiene autorización para tratarlos, y que no infringe derechos de terceros ni disposiciones legales al cargarlos.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">5. Planes de suscripción — Free y Premium</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Plan Free:</strong> Incluye límite de CFDI mensuales, clasificación automática básica y dashboard de acumulado, sin costo.</li>
          <li><strong>Plan Premium:</strong> Incluye CFDI ilimitados, estimador de ahorro fiscal e ISR, alertas proactivas, exportación de reportes en Excel y envío a terceros designados (por ejemplo, su contador), y soporte prioritario, sujeto al pago periódico (mensual o anual) indicado al momento de la contratación.</li>
          <li><strong>Facturación:</strong> Los pagos se procesan a través de Stripe, Inc. El Usuario autoriza el cobro recurrente conforme a la periodicidad elegida, hasta que cancele su suscripción.</li>
          <li><strong>Cancelación:</strong> El Usuario puede cancelar su suscripción Premium en cualquier momento desde su cuenta; el acceso a las funciones Premium continuará hasta el final del periodo ya pagado, sin reembolsos proporcionales, salvo que la legislación aplicable disponga lo contrario.</li>
          <li><strong>Cambios de precio:</strong> Cualquier ajuste al precio de la suscripción será notificado con al menos 30 días naturales de anticipación.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">6. Política de retención de datos</h2>
        <p>
          A diferencia de herramientas de procesamiento temporal de archivos, este servicio conserva el Contenido del Usuario 
          mientras la cuenta permanezca activa, para permitir el seguimiento del acumulado a lo largo del ejercicio fiscal. 
          Al cancelar la cuenta, los datos se eliminan conforme al plazo establecido en el Aviso de Privacidad. Es responsabilidad 
          exclusiva del Usuario conservar copias de sus CFDI originales; La Plataforma no sustituye el repositorio oficial del 
          SAT ni constituye un servicio de respaldo (backup).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">7. Limitación de responsabilidad</h2>
        <p>El servicio se ofrece “tal cual” y “según disponibilidad”. En la máxima medida permitida por la ley aplicable:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>La Plataforma no garantiza que las clasificaciones, detecciones de inconsistencias o estimaciones de ISR sean 100% precisas, completas o estén libres de errores.</li>
          <li>La Plataforma no será responsable por sanciones, multas, recargos, actualizaciones, diferencias en el cálculo del ISR, pérdida de deducciones, ni cualquier otro perjuicio fiscal o económico que resulte de decisiones tomadas por el Usuario con base en la información generada por el servicio.</li>
          <li>No seremos responsables por daños indirectos, incidentales o consecuentes (incluyendo pérdida de datos o interrupción del servicio) derivados del uso de la Plataforma.</li>
        </ul>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4 italic">
          <strong>Ejemplo:</strong> Si el sistema clasifica incorrectamente un CFDI y el Usuario presenta su declaración anual 
          sin verificarlo con su contador, la responsabilidad de dicha presentación es exclusiva del Usuario.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">8. Función de envío a terceros (contador)</h2>
        <p>
          El plan Premium permite compartir reportes con un tercero designado por el Usuario (por ejemplo, su contador). 
          El Usuario es responsable de verificar la identidad y el correo electrónico del destinatario antes de enviar dicha 
          información. La Plataforma no verifica la identidad del tercero receptor ni es responsable del uso que este dé a 
          la información recibida.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">9. Propiedad intelectual de la plataforma</h2>
        <p>
          El código fuente, los algoritmos de clasificación, el diseño de interfaz, los logotipos, las tablas fiscales 
          precargadas y la estructura de la base de datos son propiedad exclusiva de Ismael Vargas Martinez. El Usuario 
          no podrá realizar ingeniería inversa, descompilar, ni intentar extraer el código fuente o los algoritmos de 
          clasificación de la Plataforma.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">10. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos en cualquier momento, particularmente para reflejar 
          reformas a la legislación fiscal aplicable. Notificaremos cambios significativos a través del correo electrónico 
          asociado a la cuenta o mediante aviso en el dashboard.
        </p>
      </section>

      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-bold text-[var(--color-deduce-navy)]">11. Ley aplicable y jurisdicción</h2>
        <p>
          Para la interpretación y cumplimiento de los presentes Términos, las partes se someten a las leyes y tribunales 
          competentes de la ciudad de Santiago de Querétaro, Querétaro, México, renunciando a cualquier otro fuero que pudiera corresponderles.
        </p>
      </section>
    </div>
  );
}