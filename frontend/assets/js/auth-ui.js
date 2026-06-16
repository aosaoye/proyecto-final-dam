import { authService } from './api-services.js';

function getRedirectPath(destinationType, user = null) {
    const basePath = window.location.pathname.includes('/frontend/') ? '/frontend' : '';
    if (destinationType === 'home') {
        return `${basePath}/pages/index.html`;
    }
    const isAdmin = user && user.role === 'admin';
    return isAdmin
        ? `${basePath}/pages/dashboard/intranet.html`
        : `${basePath}/pages/index.html`;
}

/**
 * Initializes Google Sign-In using Google Identity Services (GSI).
 * @param {string} clientId  - Your Google OAuth Client ID
 * @param {string} containerId - The DOM id where the button should render
 * @param {'login'|'register'} context
 */
export function initGoogleAuth(clientId, containerId = 'google-btn', context = 'login') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isPlaceholder = clientId.includes('76vcr19n8k02o03c8477d94943j11abc') || clientId === 'YOUR_GOOGLE_CLIENT_ID';

    if (isPlaceholder) {
        // Render custom styled Google button to intercept click and show instructions
        container.innerHTML = `
            <button type="button" class="google-custom-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border: 1px solid #dadce0; border-radius: 8px; background: white; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: #3c4043; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                ${context === 'register' ? 'Registrarse con Google' : 'Iniciar sesión con Google'}
            </button>
        `;

        container.querySelector('button').addEventListener('click', () => {
            Swal.fire({
                title: 'Configuración Google OAuth',
                html: `
                    <div style="text-align: left; font-size: 0.9rem; line-height: 1.5; color: #4b5563;">
                        <p style="margin-bottom: 12px;">Estás utilizando un <strong>Client ID</strong> de ejemplo:</p>
                        <p style="margin-bottom: 12px; background: #f3f4f6; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.75rem; word-break: break-all;">
                            ${clientId}
                        </p>
                        <p style="margin-bottom: 12px;">Para realizar un inicio de sesión real, debes registrar tu aplicación en la consola de Google Developers de tu cuenta <strong>22.osaoye@gmail.com</strong>, habilitar los orígenes de JavaScript autorizados y sustituir este ID en tus páginas HTML.</p>
                        <p style="margin-bottom: 12px; font-weight: 600;">¿Deseas simular el acceso real a través de Google (con registro automático en base de datos) para probar el flujo?</p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Simular Login de Google',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#635bff',
                cancelButtonColor: '#ef4444'
            }).then(async (res) => {
                if (res.isConfirmed) {
                    Swal.fire({ title: 'Simulando OAuth de Google...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                    try {
                        const mockToken = `mock_google_token_22.osaoye@gmail.com`;
                        const result = await authService.googleAuth(mockToken);
                        
                        Swal.fire({
                            icon: 'success',
                            title: '¡Acceso Concedido!',
                            text: `Iniciado sesión como ${result.user.name}`,
                            timer: 1500,
                            showConfirmButton: false
                        });
                        
                        setTimeout(() => {
                            window.location.replace(getRedirectPath('auth', result.user));
                        }, 800);
                    } catch (err) {
                        Swal.fire({ icon: 'error', title: 'Error en Simulación', text: err.message });
                    }
                }
            });
        });
        return;
    }

    if (!window.google || !window.google.accounts) {
        console.warn('Google Identity Services script not loaded yet.');
        return;
    }

    window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
            const idToken = response.credential;
            Swal.fire({ title: 'Connecting with Google...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            try {
                const result = await authService.googleAuth(idToken);
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome!',
                    text: `Signed in as ${result.user.name}`,
                    timer: 1500,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.replace(getRedirectPath('auth', result.user));
                }, 800);
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: err.message });
            }
        },
        ux_mode: 'popup',
    });

    window.google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: context === 'register' ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
        width: '100%',
    });
}

/**
 * Configures logic for the Login Flow gateway.
 * @param {String} formId
 */
export function initLoginView(formId = 'login-form') {
    // 1. Pre-auth check redirect
    if (authService.isAuthenticated()) {
        window.location.replace(getRedirectPath('home'));
        return;
    }

    const frm = document.getElementById(formId);
    if (!frm) return;

    frm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        Swal.fire({
            title: 'Signing In...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const response = await authService.login(email, password);
            Swal.fire({
                icon: 'success',
                title: 'Authorized',
                timer: 1500,
                showConfirmButton: false
            });

            // Smart navigation route based on clearance level
            setTimeout(() => {
                window.location.replace(getRedirectPath('auth', response.user));
            }, 800);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Denied',
                text: error.message || 'Check your credentials.'
            });
        }
    });

    // Inject recovery flow
    const forgotBtn = document.getElementById('forgot-password-trigger');
    if (forgotBtn) {
        forgotBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const { value: email } = await Swal.fire({
                title: 'Recover Access',
                input: 'email',
                inputLabel: 'Registered email address',
                showCancelButton: true,
                confirmButtonText: 'Send Token',
                inputValidator: (v) => !v ? 'Required field' : null
            });

            if (email) {
                Swal.fire({ title: 'Transmitting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                try {
                    await authService.requestPasswordReset(email);
                    const { value: fd } = await Swal.fire({
                        icon: 'info', title: 'Token Transmitted',
                        html: `
                            <p style="font-size:0.8rem;">Input your 6-digit recovery key sent below.</p>
                            <input type="text" id="rt" class="swal2-input" placeholder="6-Digit Key" maxlength="6" style="text-align:center;">
                            <input type="password" id="rn" class="swal2-input" placeholder="Replacement Password">
                        `,
                        showCancelButton: true,
                        confirmButtonText: 'Cycle Token',
                        preConfirm: () => {
                            const t = document.getElementById('rt').value;
                            const n = document.getElementById('rn').value;
                            return (!t || !n) ? (Swal.showValidationMessage('Missing data') && false) : { t, n };
                        }
                    });

                    if (fd) {
                        Swal.fire({ title: 'Finalizing...', didOpen: () => Swal.showLoading() });
                        await authService.confirmPasswordReset(fd.t, fd.n);
                        Swal.fire('Update Success!', 'Your cryptographic credentials have been rotated.', 'success');
                    }
                } catch (err) {
                    Swal.fire('Transmision Fault', err.message, 'error');
                }
            }
        });
    }
}

/**
 * Configures logic for the Registration Flow gateway.
 * @param {String} formId
 */
export function initRegisterView(formId = 'register-form') {
    if (authService.isAuthenticated()) {
        window.location.replace(getRedirectPath('home'));
        return;
    }

    const frm = document.getElementById(formId);
    if (!frm) return;

    frm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        Swal.fire({
            title: 'Persisting Entity...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            await authService.register({ name, email, password });
            
            Swal.fire({
                icon: 'success',
                title: 'Profile Synchronized!',
                text: 'Access gateway initialized. Proceeding to login.'
            }).then(() => {
                window.location.href = 'login.html';
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Constraint Violation',
                text: error.message
            });
        }
    });
}
