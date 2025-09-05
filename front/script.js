document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links and content sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Show the login section by default
    document.getElementById('login-section').classList.add('active');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the corresponding section based on the link's ID
            if (event.target.id === 'show-report') {
                document.getElementById('report-section').classList.add('active');
            } else if (event.target.id === 'show-previous') {
                document.getElementById('previous-issues-section').classList.add('active');
            } else if (event.target.id === 'show-login') {
                document.getElementById('login-section').classList.add('active');
            }
        });
    });

    // Form submission event listeners (placeholder for future functionality)
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Login form submitted! (This is a placeholder action)');
    });

    const reportForm = document.getElementById('report-form');
    reportForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Report form submitted! (This is a placeholder action)');
    });

});