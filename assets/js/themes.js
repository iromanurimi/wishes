    
        // Theme Switching JavaScript
        document.addEventListener('DOMContentLoaded', function () {
            // Theme toggle button
            const themeToggle = document.getElementById('theme-toggle');
            const themeToggleChat = document.getElementById('theme-toggle-chat');

            // Check for saved theme or prefer-color-scheme
            const getPreferredTheme = () => {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                    return savedTheme;
                }

                // Check system preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    return 'dark';
                }

                return 'light';
            };

            // Set theme
            const setTheme = (theme) => {
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);

                // Update theme color meta tag for PWA
                const themeColor = theme === 'dark' ? '#0f172a' : '#7c3aed';
                document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);

                // Update button aria-label
                const buttons = [themeToggle, themeToggleChat].filter(btn => btn);
                buttons.forEach(button => {
                    if (button) {
                        button.setAttribute('aria-label',
                            theme === 'dark' ? 'Canza zuwa haske' : 'Canza zuwa duhu');
                    }
                });
            };

            // Toggle theme
            const toggleTheme = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            };

            // Initialize theme
            const preferredTheme = getPreferredTheme();
            setTheme(preferredTheme);

            // Add event listeners
            if (themeToggle) {
                themeToggle.addEventListener('click', toggleTheme);
            }

            if (themeToggleChat) {
                themeToggleChat.addEventListener('click', toggleTheme);
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    setTheme(newTheme);
                }
            });

            // Add theme transition styles
            const style = document.createElement('style');
            style.textContent = `
        * {
            transition: background-color 0.3s ease, 
                        border-color 0.3s ease, 
                        color 0.3s ease,
                        box-shadow 0.3s ease;
        }
        
        .no-transition * {
            transition: none !important;
        }
    `;
            document.head.appendChild(style);
        });
  