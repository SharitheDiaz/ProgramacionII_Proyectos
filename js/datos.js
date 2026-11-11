(() => {
    'use strict';

    class StorageRepository {
        constructor() {
            this.storageKey = 'shieldcheck_audit_logs';
        }

        obtenerRegistros() {
            try {
                const datosRaw = localStorage.getItem(this.storageKey);
                return datosRaw ? JSON.parse(datosRaw) : [];
            } catch (error) {
                return [];
            }
        }

        guardarRegistro(nuevoRegistro) {
            try {
                const registrosActuales = this.obtenerRegistros();

                const registroParaGuardar = { ...nuevoRegistro };

                if (!registroParaGuardar.id) {
                    registroParaGuardar.id = 'EVAL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                } else if (registrosActuales.some(reg => reg.id === registroParaGuardar.id)) {
                    registroParaGuardar.id = registroParaGuardar.id + '-' + Math.floor(Math.random() * 1000);
                }

                registrosActuales.push(registroParaGuardar);
                localStorage.setItem(this.storageKey, JSON.stringify(registrosActuales));
                return true;
            } catch (error) {
                return false;
            }
        }

        eliminarRegistro(id) {
            try {
                const registrosActuales = this.obtenerRegistros();
                const filtrados = registrosActuales.filter(reg => reg.id !== id);
                localStorage.setItem(this.storageKey, JSON.stringify(filtrados));
                return true;
            } catch (error) {
                return false;
            }
        }

        editarRegistro(id, datosActualizados) {
            try {
                const registrosActuales = this.obtenerRegistros();
                const indice = registrosActuales.findIndex(reg => reg.id === id);

                if (indice !== -1) {
                    registrosActuales[indice] = { ...registrosActuales[indice], ...datosActualizados };
                    localStorage.setItem(this.storageKey, JSON.stringify(registrosActuales));
                    return true;
                }
                return false;
            } catch (error) {
                return false;
            }
        }

        obtenerDatosEjemplo() {
            return [
                { id: "EVAL-MOCK1", fecha: "2026-11-01T10:14:00Z", servicio: "Banca por Internet", longitud: 16, puntaje: 5, nivel: "Fuerte" },
                { id: "EVAL-MOCK2", fecha: "2026-11-03T14:22:00Z", servicio: "Plataforma Educativa", longitud: 8, puntaje: 2, nivel: "Débil" },
                { id: "EVAL-MOCK3", fecha: "2026-11-05T09:05:00Z", servicio: "Red Social Prueba", longitud: 12, puntaje: 3, nivel: "Media" }
            ];
        }
    }

    window.CryptoStorage = new StorageRepository();
})();
