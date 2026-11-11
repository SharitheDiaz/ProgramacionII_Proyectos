# Fichas de Investigación Autónoma (S11 - S15)
### Asignatura: Programación II (IC010404) | Escuela de Ingeniería en Ciberseguridad - FIIS-UNAS
**Equipo 2:** Gabriela S. Diaz Fernandez & Shayury Minerva Meza

---

### 🛡️ Ficha S11: CSS y Diseño Responsive (Aplicado en E2)
*   **Respuesta:** Cuando dos selectores compiten en especificidad, el navegador calcula un peso matemático: los estilos en línea ganan a los identificadores (IDs), estos a las clases o pseudoclases, y finalmente a las etiquetas de elemento. A igualdad de peso, gana la última regla declarada por orden de cascada. La propiedad `box-sizing` altera el modelo de caja elemental. Bajo `content-box` (valor por defecto), el ancho y alto del elemento se aplican solo al contenido, expandiendo la caja si se añaden rellenos (`padding`) o bordes. En cambio, `border-box` absorbe el padding y el contorno dentro de las dimensiones fijadas, simplificando los cálculos de diseño elástico. Para la distribución espacial de componentes, Flexbox organiza los elementos en un eje unidimensional (filas o columnas), mientras que CSS Grid implementa una cuadrícula bidimensional avanzada. Finalmente, una media query intercepta las características físicas del dispositivo (como el ancho de pantalla), inyectando reglas condicionales para adaptar la interfaz dinámicamente.
*   **Aplicación en ShieldCheck:** Se mitiga el uso de estilos en línea para cumplir con las directivas de seguridad CSP (Content Security Policy), centralizando el diseño táctico responsivo en un archivo externo (`css/estilos.css`) mediante variables globales en el bloque `:root` verificadas en tres anchos (hasta 600px, 601 a 960px y más de 960px).
*   **Fuentes (APA):** 
    *   Mozilla MDN Web Docs. (2026). *CSS: Cascading Style Sheets*. https://mozilla.org
    *   W3C. (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://w3.org

---

### 🛡️ Ficha S12: JavaScript Aplicado (Aplicado en E3)
*   **Respuestas:** El DOM (Document Object Model) constituye una interfaz de programación estructurada en forma de árbol que representa el documento HTML, permitiendo a JavaScript alterar dinámicamente elementos, atributos, nodos y eventos de la página a través de métodos como `document.createElement()` o `appendChild()`. Para asegurar la persistencia síncrona en el navegador, se emplea la API de Web Storage. Dado que `localStorage` solo almacena cadenas de texto plano (`strings`), un arreglo de objetos debe serializarse pasándolo a formato JSON mediante `JSON.stringify()` antes de ser guardado en disco. Para recuperarlo y manipularlo de nuevo en memoria dinámica como una estructura analizable, se deserializa usando el método inverso `JSON.parse()`. En términos de ciberseguridad, es imperativo renderizar datos ingresados por el usuario mediante la propiedad `textContent`, la cual sanitiza la entrada tratándola estrictamente como texto plano. Utilizar `innerHTML` procesaría la cadena como código ejecutable, exponiendo la consola a inyecciones maliciosas.
*   **Aplicación en ShieldCheck:** Se implementa el método `JSON.stringify()` para serializar el historial analítico antes de escribirlo en disco, y `JSON.parse()` para deserializar la estructura de objetos al renderizar la tabla de auditorías dinámicas. Toda manipulación de filas se inyecta estrictamente mediante la propiedad `.textContent` para bloquear ataques de Cross-Site Scripting (XSS).
*   **Fuentes (APA):**
    *   Haverbeke, M. (2024). *Eloquent JavaScript* (4.ª ed.). No Starch Press. https://eloquentjavascript.net
    *   Mozilla MDN Web Docs. (2026). *Web Storage API*. https://mozilla.org

---

### 🛡️ Ficha S13: Interfaces Gráficas (Aplicado en E4)
*   **Respuesta:** Implementamos cinco heurísticas esenciales de Jakob Nielsen: 1. Visibilidad del estado del sistema (mediante la barra de progreso reactiva); 2. Consistencia y estándares (controles globales uniformes); 3. Prevención de errores (bloqueo de envíos vacíos); 4. Reconocimiento antes que recuerdo (requisitos del sistema siempre visibles); 5. Flexibilidad y eficiencia de uso (filtros y buscador rápido). Para documentar fallas de usabilidad de forma accesible, un mensaje de error no puede depender exclusivamente del color (como un borde rojo), ya que excluiría a usuarios con daltonismo; debe vincularse semánticamente al campo de entrada mediante el atributo `aria-describedby` usando texto descriptivo legible y propiedades `aria-live`. Por último, en el ciclo de vida del software, el cliente valida formatos en tiempo real para optimizar la experiencia de usuario y ahorrar cómputo, pero el servidor debe validar obligatoriamente para garantizar la seguridad lógica innegociable de la base de datos contra peticiones manipuladas.
*   **Aplicación en ShieldCheck:** Se integra el control en tiempo real mediante el evento `input`, se acoplan los atributos nativos `aria-expanded` para lectores de pantalla en entornos móviles, y se enlazan los errores de validación junto al campo usando etiquetas estructuradas con identificadores accesibles.
*   **Fuentes (APA):**
    *   Nielsen, J. (1994). *Enhancing the explanatory power of usability heuristics*. En Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 152-158). ACM.
    *   Nielsen Norman Group. (2024). *10 usability heuristics for user interface design*. https://nngroup.com

---

### 🛡️ Ficha S14: Frameworks Front End (Aplicado en E5)
*   **Respuesta:** Un framework resuelve el problema de la sincronización manual entre los datos en memoria (estado) y la interfaz gráfica del usuario, automatizando las actualizaciones del DOM mediante un enfoque declarativo. Un componente es una pieza de interfaz de usuario encapsulada, independiente y reutilizable que maneja su propia estructura, estilos y comportamiento lógico. En nuestro proyecto, las partes que se convertirían en componentes reutilizables serían el formulario de entrada del evaluador, la barra de progreso dinámico de fortaleza, las viñetas individuales de la lista de criterios, y las filas interactivas del historial de auditoría. Respecto a las diferencias tecnológicas: React se diferencia por ser una librería centrada en el renderizado mediante un DOM Virtual que utiliza JSX para combinar lógica y maquetación; mientras que Vue se diferencia por ser un framework progresivo que utiliza un sistema de reactividad nativo basado en plantillas HTML limpias y un enlace de datos bidireccional integrado.
*   **Aplicación en ShieldCheck:** El proyecto se mantiene estrictamente en Vanilla JS por exigencia de la rúbrica, pero esta fundamentación teórica permite proyectar cómo la arquitectura orientada a objetos de la clase `PasswordAnalyzer` facilitaría una migración directa hacia componentes reactivos modulares.
*   **Fuentes (APA):**
    *   Meta Platforms Inc. (2026). *React Documentation*. https://react.dev
    *   VueJS Foundation. (2026). *Vue.js Guide*. https://vuejs.org

---

### 🛡️ Ficha S15: Integración y Publicación (Aplicado en E5)
*   **Respuesta:** GitHub Pages es una infraestructura de alojamiento y despliegue estático automatizado que procesa y publica archivos HTML, CSS y JavaScript directamente desde un repositorio remoto de GitHub a internet, siendo incapaz de ejecutar lenguajes o scripts de backend (como PHP o Python) ni conectarse a bases de datos del servidor. Respecto al almacenamiento en el cliente, `localStorage` posee una capacidad máxima de 5MB por origen y carece por completo de cifrado nativo. Cualquier script inyectado (mediante XSS o extensiones maliciosas) posee acceso plano a las llaves de almacenamiento, por lo que nunca deben resguardarse secretos como contraseñas, tokens o llaves criptográficas. Finalmente, un caso de prueba manual se diseña mediante una estructura formal estructurada que detalla un identificador único, precondiciones del entorno, pasos secuenciales de ejecución lógicos, datos de entrada del sistema y el resultado esperado verificable que dictamina el éxito de la prueba.
*   **Aplicación en ShieldCheck:** Publicación productiva e interactiva de la consola mediante GitHub Pages, garantizando alta disponibilidad. Se implementa el **Principio de Privacidad de OWASP**: las contraseñas reales jamás se guardan en el `localStorage` para mitigar los riesgos de filtración frente a vectores de ataque locales en el navegador.
*   **Fuentes (APA):**
    *   GitHub Inc. (2026). *GitHub Pages documentation*. https://github.com
    *   Mozilla MDN Web Docs. (2026). *Web Storage API Security Guidelines*. https://mozilla.org
