// Módulo para la gestión de autenticación

import { API_BASE_URL } from './config.js';

const Auth = {
    // Verifica si el usuario está autenticado
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    // Inicia sesión con nombre de usuario y contraseña
    async login(username, password) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const message = await response.json();
            throw new Error(message.message || 'Error al iniciar sesión');
        }

        localStorage.setItem('isLoggedIn', 'true');
        return response;
    },

    // Registra un nuevo usuario
    async register(username, password) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const message = await response.json();
            throw new Error(message.message || 'Error al registrar usuario');
        }

        return response;
    },

    // Cierra la sesión del usuario actual
    async logout() {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST'
            });
            
            // Aunque falle el logout en el servidor, limpiamos el estado local
            localStorage.removeItem('isLoggedIn');
            return response;
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            localStorage.removeItem('isLoggedIn');
            throw error;
        }
    }
};

export default Auth;