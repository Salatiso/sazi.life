/**
 * translate.js
 * This script handles the language switching functionality for the entire site.
 */
document.addEventListener('DOMContentLoaded', function() {
    // We need to wait for the header to be loaded before we can add listeners to the switcher.
    // A MutationObserver is a robust way to do this.
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    const observer = new MutationObserver(function(mutations, me) {
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            initializeLanguageScript();
            me.disconnect(); // Stop observing once the element is found
        }
    });

    observer.observe(headerPlaceholder, {
        childList: true,
        subtree: true
    });
});


function initializeLanguageScript() {
    const languageSwitcher = document.getElementById('language-switcher');
    let translations = {};

    // 1. Fetch the translation data from the JSON file
    fetch('components/languages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            translations = data;
            // 2. Check for a previously saved language in localStorage
            const savedLang = localStorage.getItem('sazi-lang') || 'en';
            setLanguage(savedLang);
            languageSwitcher.value = savedLang;
        })
        .catch(error => {
            console.error('Error fetching or parsing translations:', error);
        });

    // 3. Add an event listener to the language switcher
    languageSwitcher.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    // 4. The core translation function
    function setLanguage(lang) {
        // Find all elements that have a 'data-translate-key' attribute
        const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
        
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[key] && translations[key][lang]) {
                // If a translation exists for the key and language, update the element's text
                element.innerHTML = translations[key][lang];
            } else {
                // Fallback to English if the specific language translation is missing
                if (translations[key] && translations[key]['en']) {
                    element.innerHTML = translations[key]['en'];
                }
            }
        });

        // 5. Save the selected language to localStorage for persistence
        localStorage.setItem('sazi-lang', lang);

        // 6. Update the lang attribute of the <html> tag for accessibility
        document.documentElement.lang = lang;
    }
}
