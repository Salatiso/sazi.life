/**
 * loader.js
 * This script dynamically loads reusable HTML components (like header and footer)
 * into the main document. This avoids code duplication.
 */
document.addEventListener('DOMContentLoaded', function() {

    // An array of components to load. Each object has the placeholder's ID
    // and the path to the component's HTML file.
    const components = [
        { id: 'header-placeholder', path: 'components/header.html' },
        { id: 'footer-placeholder', path: 'components/footer.html' }
    ];

    // A function to fetch and inject a component
    const loadComponent = (component) => {
        fetch(component.path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${component.path}`);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(component.id);
                if (placeholder) {
                    placeholder.innerHTML = data;
                }
            })
            .catch(error => {
                console.error('Error loading component:', error);
                const placeholder = document.getElementById(component.id);
                if (placeholder) {
                    placeholder.innerHTML = `<p class="text-red-500 text-center">Error: Could not load ${component.id}.</p>`;
                }
            });
    };

    // Load all defined components
    components.forEach(loadComponent);

    // After loading components, we might need to initialize other scripts
    // that depend on them. We use a custom event for this.
    // This ensures the language switcher exists before we try to use it.
    document.body.addEventListener('htmx:afterSwap', function() {
        // This is a common pattern with libraries like htmx, but we can fire our own.
        // For simplicity, we'll just let translate.js run after this script.
    });

    // Simple dynamic year for the footer
    // We need to wait for the footer to be loaded. A simple timeout works for this demo.
    setTimeout(() => {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }, 500); // Wait 500ms for footer to likely be loaded.

});
