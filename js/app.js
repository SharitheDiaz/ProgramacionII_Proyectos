(() => {
    'use strict';

    const initMenu = () => {
        const toggleButton = document.getElementById('menu-toggle');
        const navigationMenu = document.getElementById('menu-nav');

        if (!toggleButton || !navigationMenu) return;

        toggleButton.addEventListener('click', () => {
            const isVisible = navigationMenu.getAttribute('data-visible') === 'true';
            if (isVisible) {
                toggleButton.setAttribute('aria-expanded', 'false');
                navigationMenu.removeAttribute('data-visible');
            } else {
                toggleButton.setAttribute('aria-expanded', 'true');
                navigationMenu.setAttribute('data-visible', 'true');
            }
        });
    };


    class PasswordAnalyzer {
        constructor() {
            this.form = document.getElementById('evaluador-form');
            this.passwordInput = document.getElementById('password');
            this.servicioInput = document.getElementById('servicio');
            this.togglePasswordBtn = document.getElementById('toggle-password-btn');
            this.tablaHistorial = document.getElementById('lista-evaluaciones');
            this.inputBuscar = document.getElementById('buscar-historial');
            this.selectFiltro = document.getElementById('filtro-nivel');

            this.init();
        }

        init() {
            if (this.passwordInput) {
                this.passwordInput.addEventListener('input', () => this.evaluar());
            }
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.guardar(e));
            }
            if (this.togglePasswordBtn) {
                this.togglePasswordBtn.addEventListener('click', () => this.toggleMostrar());
            }

            // Escuchadores de eventos para filtros en tiempo real (Requisito Rúbrica)
            if (this.inputBuscar) {
                this.inputBuscar.addEventListener('input', () => this.renderizarTabla());
            }
            if (this.selectFiltro) {
                this.selectFiltro.addEventListener('change', () => this.renderizarTabla());
            }

            const btnCargar = document.getElementById('btn-cargar-ejemplos');
            if (btnCargar) {
                btnCargar.addEventListener('click', () => this.cargarEjemplos());
            }

            this.renderizarTabla();
        }

        toggleMostrar() {
            if (this.passwordInput.type === 'password') {
                this.passwordInput.type = 'text';
                this.togglePasswordBtn.textContent = 'Ocultar';
            } else {
                this.passwordInput.type = 'password';
                this.togglePasswordBtn.textContent = 'Mostrar';
            }
        }

        evaluar() {
            const clave = this.passwordInput.value;
            const cumple = [
                clave.length >= 12,
                /[A-Z]/.test(clave),
                /[a-z]/.test(clave),
                /[0-9]/.test(clave),
                /[^A-Za-z0-9]/.test(clave)
            ];

            const IDs = ['crit-longitud', 'crit-mayuscula', 'crit-minuscula', 'crit-numero', 'crit-simbolo'];
            let score = 0;

            cumple.forEach((status, index) => {
                const li = document.getElementById(IDs[index]);
                if (li) {
                    if (status) {
                        li.style.background = 'rgba(0, 255, 136, 0.04)';
                        li.style.borderColor = 'rgba(0, 255, 136, 0.3)';
                        li.style.color = '#a3ffcc';
                        li.style.setProperty('--cyber-crimson', '#00ff88');
                        score++;
                    } else {
                        li.style.background = 'rgba(255, 51, 68, 0.02)';
                        li.style.borderColor = 'rgba(255, 51, 68, 0.1)';
                        li.style.color = '#ff99a2';
                        li.style.setProperty('--cyber-crimson', '#ff3344');
                    }
                }
            });

            const barra = document.querySelector('.barra-progreso');
            const textoNivel = document.getElementById('texto-nivel');

            if (barra && textoNivel) {
                if (clave.length === 0) {
                    document.documentElement.style.setProperty('--width-percent', '0%');
                    barra.style.background = '#11182c';
                    textoNivel.textContent = 'Escribe una contraseña para iniciar el escaneo.';
                    textoNivel.style.color = '#7ca3cc';
                    return 0;
                }

                const percentages = ['10%', '20%', '40%', '60%', '80%', '100%'];
                const niveles = ['Fuerza Crítica', 'Fuerza Débil', 'Fuerza Débil', 'Fuerza Media', 'Fuerza Media', 'Fuerza Fuerte'];
                const colores = ['#ff3344', '#ff3344', '#ff3344', '#ffaa00', '#ffaa00', '#00ff88'];

                document.documentElement.style.setProperty('--width-percent', percentages[score]);
                barra.style.background = `linear-gradient(to right, ${colores[score]} ${percentages[score]}, #11182c 0%)`;
                textoNivel.textContent = `Nivel: ${niveles[score]} (${score}/5)`;
                textoNivel.style.color = colores[score];
            }

            return score;
        }

        guardar(e) {
            e.preventDefault();
            const servicio = this.servicioInput.value.trim();
            const clave = this.passwordInput.value;

            if (!servicio || !clave) {
                alert("Por favor, completa todos los campos del formulario de auditoría.");
                return;
            }

            const score = this.evaluar();
            const niveles = ['Crítico', 'Débil', 'Débil', 'Media', 'Media', 'Fuerte'];

            const nuevoLog = {
                fecha: new Date().toISOString(),
                servicio: servicio,
                longitud: clave.length,
                puntaje: score,
                nivel: niveles[score]
            };

            if (window.CryptoStorage) {
                window.CryptoStorage.guardarRegistro(nuevoLog);

                alert(`🛡️ Escaneo completada con éxito.\nServicio: ${servicio}\nNivel: ${niveles[score]} (${score}/5).\n\nEl resultado se ha almacenado de forma segura en el Historial.`);

                this.form.reset();
                this.evaluar();
                this.renderizarTabla();
            }
        }

        renderizarTabla() {
            if (!this.tablaHistorial) return;

            let registros = window.CryptoStorage ? window.CryptoStorage.obtenerRegistros() : [];


            const busqueda = this.inputBuscar ? this.inputBuscar.value.toLowerCase().trim() : '';
            const filtroNivel = this.selectFiltro ? this.selectFiltro.value : '';


            if (busqueda) {
                registros = registros.filter(reg => reg.servicio.toLowerCase().includes(busqueda));
            }
            if (filtroNivel) {
                registros = registros.filter(reg => reg.nivel === filtroNivel);
            }

            this.tablaHistorial.textContent = '';

            if (registros.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 6;
                td.style.textAlign = 'center';
                td.style.color = '#7ca3cc';
                td.textContent = 'No hay evaluaciones registradas que coincidan.';
                tr.appendChild(td);
                this.tablaHistorial.appendChild(tr);
                return;
            }

            registros.forEach(reg => {
                const tr = document.createElement('tr');
                const campos = [
                    new Date(reg.fecha).toLocaleDateString(),
                    reg.servicio,
                    String(reg.longitud),
                    `${reg.puntaje}/5`,
                    reg.nivel,
                    "Completado"
                ];

                campos.forEach(t => {
                    const td = document.createElement('td');
                    td.textContent = t;
                    tr.appendChild(td);
                });
                this.tablaHistorial.appendChild(tr);
            });
        }

        cargarEjemplos() {
            if (!window.CryptoStorage) return;
            window.CryptoStorage.obtenerDatosEjemplo().forEach(m => window.CryptoStorage.guardarRegistro(m));
            this.renderizarTabla();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initMenu();
        new PasswordAnalyzer();
    });
})();
