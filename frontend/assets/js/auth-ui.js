import { authService } from './api-services.js';

/**
 * Configures logic for the Login Flow gateway.
 * @param {String} formId
 */
export function initLoginView(formId = 'login-form') {
    // 1. Pre-auth check redirect
    if (authService.isAuthenticated()) {
        window.location.replace('../index.html');
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
                window.location.href = (response.user && response.user.role === 'admin')
                    ? '../dashboard/intranet.html'
                    : '../index.html';
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
        window.location.replace('../index.html');
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
