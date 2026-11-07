# Fichas de Investigación Autónoma (S11 - S15)
### Asignatura: Programación II (IC010404) | Escuela de Ingeniería en Ciberseguridad - FIIS-UNAS
**Equipo 2:** Gabriela S. Diaz Fernandez & Shayury Minerva Meza

---

### 🛡️ Ficha S11: Arquitectura de Hojas de Estilos y Especificidad en Cascada
*   **Concepto Central:** El navegador calcula el renderizado final evaluando la especificidad algorítmica de los selectores (pesos numéricos por IDs, clases y elementos). 
*   **Aplicación en ShieldCheck:** Se mitiga el uso de estilos en línea (`inline styles`) para cumplir con las directivas de seguridad CSP (Content Security Policy), centralizando el diseño táctico responsivo en un archivo externo (`css/estilos.css`) mediante variables globales en el bloque `:root`.

---

### 🛡️ Ficha S12: Serialización y Persistencia de Objetos en Almacenamiento Web
*   **Concepto Central:** La API `localStorage` almacena información de manera persistente en formato de texto plano (`strings`), requiriendo transformaciones estructuradas mediante la API JSON.
*   **Aplicación en ShieldCheck:** Se implementa el método `JSON.stringify()` para serializar el historial analítico antes de escribirlo en disco, y `JSON.parse()` para deserializar la estructura de objetos al renderizar la tabla de auditorías dinámicas.

---

### 🛡️ Ficha S13: Mitigación de Vulnerabilidades de Inyección y Sanitización DOM
*   **Concepto Central:** El uso inadvertido de propiedades como `innerHTML` abre vectores de ataque críticos tipo Cross-Site Scripting (XSS), permitiendo la ejecución forzada de scripts maliciosos.
*   **Aplicación en ShieldCheck:** Se implementa el **Principio de Privacidad de OWASP**: las contraseñas reales jamás se guardan ni se envían. Toda manipulación dinámica de filas o mensajes se inyecta estrictamente mediante la propiedad `.textContent` y el método seguro `document.createElement()`, sanitizando automáticamente cualquier carácter especial.

---

### 🛡️ Ficha S14: Usabilidad, Accesibilidad y Control de Flujo de Interfaz (HCI)
*   **Concepto Central:** El diseño centrado en el usuario (UCD) bajo las 10 Heurísticas de Nielsen exige visibilidad constante del estado del sistema, prevención de errores y controles de accesibilidad avanzados (WCAG).
*   **Aplicación en ShieldCheck:** Se integra el control en tiempo real mediante el evento `input`, se acoplan los atributos nativos `aria-expanded` para lectores de pantalla en entornos móviles y se proveen herramientas accesibles como el botón alternador de visibilidad de contraseñas.

---

### 🛡️ Ficha S15: Despliegue en Entornos de Integración Continua Estáticos
*   **Concepto Central:** Los servidores web estáticos modernos procesan arquitecturas del lado del cliente (*Client-Side Architecture*) abstrayéndose de bases de datos relacionales tradicionales del servidor para maximizar la velocidad y la autonomía.
*   **Aplicación en ShieldCheck:** Publicación productiva e interactiva de la consola mediante la infraestructura global de GitHub Pages, garantizando alta disponibilidad sin dependencias de infraestructura backend ni librerías de terceros (CDNs).
