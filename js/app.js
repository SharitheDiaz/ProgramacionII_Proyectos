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
            this.selectOrden = document.getElementById('ordenar-historial');

            this.contrasenasComunes = [
                "123456", "password", "123456789", "qwerty", "12345678",
                "111111", "1234567", "hola1234", "admin", "password123",
                "iloveyou", "contraseña", "welcome", "abc12345", "security",
                "root", "login", "password1>", "password1234", "admin123"
            ];

            this.init();
        }

        init() {
            if (this.selectOrden) {
                this.selectOrden.addEventListener('change', () => this.renderizarTabla());
            }
            if (this.passwordInput) {
                this.passwordInput.addEventListener('input', () => this.evaluar());
            }
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.guardar(e));
            }
            if (this.togglePasswordBtn) {
                this.togglePasswordBtn.addEventListener('click', () => this.toggleMostrar());
            }

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

            const btnExportar = document.getElementById('btn-exportar-json');
            if (btnExportar) {
                btnExportar.addEventListener('click', () => this.exportarJSON());
            }

            if (this.tablaHistorial) {
                this.renderizarTabla();
            }
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
            const claveMinuscula = clave.toLowerCase().trim();

            const esComun = this.contrasenasComunes.some(comun => claveMinuscula.includes(comun));

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
                    if (status && !esComun) {
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
                if (esComun) {
                    document.documentElement.style.setProperty('--width-percent', '100%');
                    barra.style.background = '#ff3344';
                    textoNivel.textContent = 'Nivel: Crítico (Contraseña común detectada en diccionario)';
                    textoNivel.style.color = '#ff3344';
                    return 0;
                }

                const percentages = ['10%', '20%', '40%', '60%', '80%', '100%'];
                const niveles = ['Crítico', 'Débil', 'Débil', 'Media', 'Media', 'Fuerte'];
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

            const errorServicio = document.getElementById('error-servicio');
            const errorPassword = document.getElementById('error-password');

            if (errorServicio) errorServicio.textContent = '';
            if (errorPassword) errorPassword.textContent = '';
            this.servicioInput.style.borderColor = '';
            this.passwordInput.style.borderColor = '';

            let formularioValido = true;

            if (!servicio) {
                if (errorServicio) errorServicio.textContent = "El nombre del servicio o entorno es obligatorio.";
                this.servicioInput.style.borderColor = '#ff3344';
                formularioValido = false;
            }

            if (!clave) {
                if (errorPassword) errorPassword.textContent = "La contraseña a evaluar no puede estar vacía.";
                this.passwordInput.style.borderColor = '#ff3344';
                formularioValido = false;
            }

            if (!formularioValido) return;

            const claveMinuscula = clave.toLowerCase().trim();
            const esComun = this.contrasenasComunes.some(comun => claveMinuscula.includes(comun));

            const score = esComun ? 0 : this.evaluar();
            const niveles = ['Crítico', 'Débil', 'Débil', 'Media', 'Media', 'Fuerte'];

            const nuevoLog = {
                fecha: new Date().toISOString(),
                servicio: servicio,
                longitud: clave.length,
                puntaje: score,
                nivel: esComun ? 'Crítico' : niveles[score]
            };

            if (window.CryptoStorage) {
                window.CryptoStorage.guardarRegistro(nuevoLog);
                this.form.reset();
                this.evaluar();
                alert(`🛡️ Evaluación registrada con éxito en el historial (Nivel: ${nuevoLog.nivel}).`);
            }
        }

        renderizarTabla() {
            if (!this.tablaHistorial) return;

            let registros = window.CryptoStorage ? window.CryptoStorage.obtenerRegistros() : [];
            const statPromedio = document.getElementById('stat-promedio');
            const statPorcentaje = document.getElementById('stat-porcentaje');
            const statBarras = document.getElementById('stat-barras');

            if (statPromedio && statPorcentaje && statBarras) {
                if (registros.length === 0) {
                    statPromedio.textContent = "0.0";
                    statPorcentaje.textContent = "0%";
                    statBarras.textContent = "Fuerte: 0 | Media: 0 | Débil: 0 | Crítico: 0";
                } else {
                    const total = registros.length;
                    const sumaPuntajes = registros.reduce((acc, r) => acc + r.puntaje, 0);
                    const promedio = (sumaPuntajes / total).toFixed(1);

                    const fuertes = registros.filter(r => r.nivel === 'Fuerte').length;
                    const medias = registros.filter(r => r.nivel === 'Media').length;
                    const debiles = registros.filter(r => r.nivel === 'Débil').length;
                    const criticos = registros.filter(r => r.nivel === 'Crítico').length;

                    const porcentajeFuertes = Math.round((fuertes / total) * 100);

                    statPromedio.textContent = promedio;
                    statPorcentaje.textContent = `${porcentajeFuertes}%`;
                    statBarras.textContent = `Fuerte: ${fuertes} | Media: ${medias} | Débil: ${debiles} | Crítico: ${criticos}`;
                }
            }

            const busqueda = this.inputBuscar ? this.inputBuscar.value.toLowerCase().trim() : '';
            const filtroNivel = this.selectFiltro ? this.selectFiltro.value : '';

            if (busqueda) {
                registros = registros.filter(reg => reg.servicio.toLowerCase().includes(busqueda));
            }
            if (filtroNivel) {
                registros = registros.filter(reg => reg.nivel === filtroNivel);
            }

            const tipoOrden = this.selectOrden ? this.selectOrden.value : 'fecha-desc';
            registros.sort((a, b) => {
                if (tipoOrden === 'fecha-desc') return new Date(b.fecha) - new Date(a.fecha);
                if (tipoOrden === 'fecha-asc') return new Date(a.fecha) - new Date(b.fecha);
                if (tipoOrden === 'puntaje-desc') return b.puntaje - a.puntaje;
                if (tipoOrden === 'puntaje-asc') return a.puntaje - b.puntaje;
                return 0;
            });

            this.tablaHistorial.textContent = '';

            if (registros.length === 0) {
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 7;
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

                const tdAcciones = document.createElement('td');
                tdAcciones.style.display = 'flex';
                tdAcciones.style.gap = '8px';

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.type = 'button';
                btnEditar.style.cursor = 'pointer';
                btnEditar.addEventListener('click', () => this.ejecutarEdicion(reg.id, reg.servicio));

                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.type = 'button';
                btnEliminar.style.cursor = 'pointer';
                btnEliminar.addEventListener('click', () => this.ejecutarEliminacion(reg.id));

                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                tr.appendChild(tdAcciones);

                this.tablaHistorial.appendChild(tr);
            });
        }

        cargarEjemplos() {
            if (!window.CryptoStorage) return;
            const muestras = [
                { id: "EVAL-01", fecha: "2026-11-01T10:00:00Z", servicio: "Banca Comercial", longitud: 14, puntaje: 5, nivel: "Fuerte" },
                { id: "EVAL-02", fecha: "2026-11-01T11:15:00Z", servicio: "Portal Educativo", longitud: 7, puntaje: 1, nivel: "Débil" },
                { id: "EVAL-03", fecha: "2026-11-02T09:30:00Z", servicio: "Red Social Alfa", longitud: 12, puntaje: 4, nivel: "Media" },
                { id: "EVAL-04", fecha: "2026-11-02T14:22:00Z", servicio: "Servidor Git Local", longitud: 16, puntaje: 5, nivel: "Fuerte" },
                { id: "EVAL-05", fecha: "2026-11-03T08:05:00Z", servicio: "Correo de Pruebas", longitud: 8, puntaje: 2, nivel: "Débil" },
                { id: "EVAL-06", fecha: "2026-11-03T16:45:00Z", servicio: "Plataforma Virtual", longitud: 11, puntaje: 3, nivel: "Media" },
                { id: "EVAL-07", fecha: "2026-11-04T12:10:00Z", servicio: "Consola de Base Datos", longitud: 15, puntaje: 5, nivel: "Fuerte" },
                { id: "EVAL-08", fecha: "2026-11-04T17:00:00Z", servicio: "Aplicación Interna", longitud: 6, puntaje: 0, nivel: "Crítico" },
                { id: "EVAL-09", fecha: "2026-11-05T10:50:00Z", servicio: "Enrutador Académico", longitud: 13, puntaje: 4, nivel: "Media" },
                { id: "EVAL-10", fecha: "2026-11-05T15:35:00Z", servicio: "Intranet Alumnos", longitud: 9, puntaje: 2, nivel: "Débil" }
            ];
            muestras.forEach(m => window.CryptoStorage.guardarRegistro(m));
            this.renderizarTabla();
        }
        ejecutarEdicion(id, servicioActual) {
            const nuevoServicio = prompt("Modificar el nombre del servicio:", servicioActual);
            if (nuevoServicio !== null && nuevoServicio.trim() !== "") {
                window.CryptoStorage.editarRegistro(id, { servicio: nuevoServicio.trim() });
                this.renderizarTabla();
            }
        }
        ejecutarEliminacion(id) {
            if (confirm("¿Estás seguro de que deseas eliminar permanentemente este registro?")) {
                window.CryptoStorage.eliminarRegistro(id);
                this.renderizarTabla();
            }
        }
        exportarJSON() {
            if (!window.CryptoStorage) return;
            const registros = window.CryptoStorage.obtenerRegistros();
            if (registros.length === 0) {
                alert("No hay registros en la base de datos local para exportar.");
                return;
            }
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registros, null, 4));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "shieldcheck_audit_log.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        initMenu();
        new PasswordAnalyzer();
    });
})();