import { memo } from "react";
import { useDivisePreview } from "../../../../../context/device-preview-context";
import { useAppContext } from "../../../../../context/AppContext";

interface TerminoCondicionesProps {
  onClose?: () => void;
  className?: string;
}

export const TerminoCondiciones: React.FC<TerminoCondicionesProps> = memo(
  ({ className = "" }) => {
    const { deviceType } = useDivisePreview();
    const { states } = useAppContext();
    const { textColorModal, bgModalColor } = states;

    return (
      <div
        className={`flex flex-col w-full max-h-[85vh] ${className}`}
        style={{
          color: textColorModal,
          backgroundColor: bgModalColor,
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2
            className={`font-bold text-center ${
              deviceType === "desktop" ? "md:text-2xl text-xl" : "text-xl"
            }`}
          >
            Términos y Condiciones
          </h2>
          <div className="w-16 h-0.5 bg-current mt-2 opacity-30" />
        </div>

        {/* Content Container with Scroll */}
        <div
          className={`overflow-y-auto pr-2 ${
            deviceType === "desktop"
              ? "max-h-[45vh] md:max-h-[50vh]"
              : "max-h-[40vh]"
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: `${textColorModal}40 transparent`,
          }}
        >
          <div
            className={`flex flex-col gap-4 ${
              deviceType === "desktop" ? "md:gap-6" : "gap-4"
            }`}
          >
            {/* Sección 1: Aceptación */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                1. Aceptación de los Términos
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                Al utilizar este servicio de pago, usted acepta cumplir con
                todos los términos y condiciones establecidos en este documento.
                Si no está de acuerdo con alguna parte de estos términos, no
                debe utilizar el servicio.
              </p>
            </section>

            {/* Sección 2: Uso del Servicio */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                2. Uso del Servicio
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 mb-2 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                El servicio está destinado para realizar pagos de manera segura
                y eficiente. Usted se compromete a:
              </p>
              <ul
                className={`list-disc list-inside space-y-1 ml-2 opacity-90 ${
                  deviceType === "desktop" ? "md:text-base text-sm" : "text-sm"
                }`}
              >
                <li>Proporcionar información veraz y precisa</li>
                <li>Mantener la confidencialidad de sus datos</li>
                <li>No utilizar el servicio para fines ilegales</li>
                <li>Notificar cualquier actividad sospechosa</li>
              </ul>
            </section>

            {/* Sección 3: Privacidad y Seguridad */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                3. Privacidad y Seguridad
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                Nos comprometemos a proteger su información personal y
                financiera. Todos los datos se transmiten mediante protocolos de
                seguridad avanzados. Su información no será compartida con
                terceros sin su consentimiento, excepto cuando sea requerido por
                ley.
              </p>
            </section>

            {/* Sección 4: Responsabilidades */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                4. Responsabilidades del Usuario
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                Usted es responsable de mantener la confidencialidad de sus
                credenciales y de todas las actividades que ocurran bajo su
                cuenta. Debe notificar inmediatamente cualquier uso no
                autorizado de su cuenta.
              </p>
            </section>

            {/* Sección 5: Limitación de Responsabilidad */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                5. Limitación de Responsabilidad
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                En la medida permitida por la ley, no seremos responsables de
                daños indirectos, incidentales o consecuentes derivados del uso
                o la imposibilidad de usar el servicio.
              </p>
            </section>

            {/* Sección 6: Modificaciones */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                6. Modificaciones de los Términos
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                Nos reservamos el derecho de modificar estos términos en
                cualquier momento. Los cambios entrarán en vigor inmediatamente
                después de su publicación. Es su responsabilidad revisar
                periódicamente estos términos.
              </p>
            </section>

            {/* Sección 7: Contacto */}
            <section>
              <h3
                className={`font-semibold mb-2 ${
                  deviceType === "desktop"
                    ? "md:text-lg text-base"
                    : "text-base"
                }`}
              >
                7. Contacto
              </h3>
              <p
                className={`text-sm leading-relaxed opacity-90 ${
                  deviceType === "desktop" ? "md:text-base" : "text-sm"
                }`}
              >
                Si tiene preguntas sobre estos términos y condiciones, puede
                contactarnos a través de los canales de atención al cliente
                disponibles en el sitio.
              </p>{" "}
              <a
                href="https://pruebas.sypago.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://pruebas.sypago.net
              </a>
            </section>
          </div>
        </div>

        {/* Footer con fecha de última actualización */}
        <div className="mt-6 pt-4 border-t border-current opacity-30">
          <p
            className={`text-center opacity-70 ${
              deviceType === "desktop" ? "md:text-sm text-xs" : "text-xs"
            }`}
          >
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    );
  }
);

TerminoCondiciones.displayName = "TerminoCondiciones";

export default TerminoCondiciones;
