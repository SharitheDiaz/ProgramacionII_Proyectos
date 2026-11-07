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
                registrosActuales.push(nuevoRegistro);
                localStorage.setItem(this.storageKey, JSON.stringify(registrosActuales));
                return true;
            } catch (error) {
                return false;
            }
        }

        obtenerDatosEjemplo() {
            return [
                { fecha: "2026-11-01T10:14:00Z", servicio: "Banca por Internet", longitud: 16, puntaje: 5, nivel: "Fuerte" },
                { fecha: "2026-11-03T14:22:00Z", servicio: "Plataforma Educativa", longitud: 8, puntaje: 2, nivel: "Débil" },
                { fecha: "2026-11-05T09:05:00Z", servicio: "Red Social Prueba", longitud: 12, puntaje: 3, nivel: "Media" }
            ];
        }
    }

    window.CryptoStorage = new StorageRepository();
})();
