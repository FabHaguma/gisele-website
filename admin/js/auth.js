// admin/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const loginErrorEl = document.getElementById('loginError');

    // Redirect if trying to access protected page without session
    // This is a basic check, more robust checks can be added
    const protectedPages = ['dashboard.html', 'manage-posts.html', 'edit-post.html'];
    const currentPage = window.location.pathname.split('/').pop();

    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && protectedPages.includes(currentPage)) {
            console.log('User signed in:', session.user.email);
            // If on login page and signed in, redirect to dashboard
            if (currentPage === 'index.html' || currentPage === '') {
                 window.location.href = 'dashboard.html';
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            if (protectedPages.includes(currentPage)) {
                window.location.href = 'index.html'; // Redirect to login
            }
        }

        // Initial check for protected pages on load
        if (protectedPages.includes(currentPage)) {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) {
                console.log('No active session, redirecting to login.');
                window.location.href = 'index.html';
            } else {
                 // Display user email on dashboard-like pages
                const userEmailSpan = document.getElementById('userEmail');
                if (userEmailSpan && user.email) {
                    userEmailSpan.textContent = user.email;
                }
            }
        }
    });


    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            if (loginErrorEl) loginErrorEl.textContent = '';

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) {
                    console.error('Login error:', error.message);
                    if (loginErrorEl) loginErrorEl.textContent = error.message;
                    return;
                }

                console.log('Login successful:', data.user);
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } catch (err) {
                console.error('Unexpected login error:', err);
                if (loginErrorEl) loginErrorEl.textContent = 'An unexpected error occurred.';
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                alert('Error logging out: ' + error.message);
            } else {
                console.log('Logged out successfully');
                window.location.href = 'index.html'; // Redirect to login page
            }
        });
    }
});