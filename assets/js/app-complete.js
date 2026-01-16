// Main Application JavaScript - Complete version
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // GLOBAL CONSTANTS
    // ============================================
    const babySizes = [
        "Kwayoyin halitta", "Kankana", "Kankana", "Blueberry", "Blueberry",
        "Cherry", "Cherry", "Fig", "Fig", "Lime",
        "Lime", "Lemon", "Lemon", "Apple", "Apple",
        "Avocado", "Avocado", "Pear", "Pear", "Sweet Potato",
        "Sweet Potato", "Mango", "Mango", "Banana", "Banana",
        "Carrot", "Carrot", "Papaya", "Papaya", "Grapefruit",
        "Grapefruit", "Cantaloupe", "Cantaloupe", "Cauliflower", "Cauliflower",
        "Zucchini", "Zucchini", "Eggplant", "Eggplant", "Watermelon"
    ];

    const categoryNames = {
        'all': 'Duka Labarai',
        'pregnancy': 'Labaran Ciki',
        'baby-care': 'Kula da Jariri',
        'health': 'Lafiya',
        'nutrition': 'Abinci mai gina jiki',
        'postpartum': 'Bayan Haihuwa',
        'tips': 'Shawarwari',
        'symptoms': 'Alamun Ciki'
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function showToast(message, duration = 3000) {
        const toast = document.getElementById('error-toast');
        if (!toast) {
            console.error('Toast element not found');
            return;
        }

        const messageEl = toast.querySelector('.toast-message');
        if (messageEl) {
            messageEl.textContent = message;
        }

        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, duration);
    }

    function formatDateHausa(date, format = 'short') {
        if (!date || isNaN(date.getTime())) return '';

        const options = format === 'long' ? {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        } : {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };
        return date.toLocaleDateString('ha-NG', options);
    }

    // ============================================
    // THEME MANAGEMENT
    // ============================================
    function initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.error('Theme toggle button not found');
            return;
        }

        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', function () {
            const isDark = document.body.classList.contains('dark-mode');
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'light' : 'dark');
        });

        // Also initialize chatbot theme toggle
        const themeToggleChat = document.getElementById('theme-toggle-chat');
        if (themeToggleChat) {
            themeToggleChat.addEventListener('click', function () {
                const isDark = document.body.classList.contains('dark-mode');
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('theme', isDark ? 'light' : 'dark');
                showToast(isDark ? "Yanayin haske" : "Yanayin duhu", 2000);
            });
        }
    }

    // ============================================
    // FLIP CARD FUNCTIONALITY
    // ============================================
    function initFlipCards() {
        const flipCards = document.querySelectorAll('.flip-card');

        flipCards.forEach(card => {
            const front = card.querySelector('.card-front');
            const backBtn = card.querySelector('.back-btn');
            const form = card.querySelector('form');

            // Flip on card front click
            if (front) {
                front.addEventListener('click', function (e) {
                    // Don't flip if clicking on interactive elements or hint text
                    if (e.target.closest('.hint-text') ||
                        e.target.tagName === 'BUTTON' ||
                        e.target.tagName === 'INPUT' ||
                        e.target.tagName === 'SELECT') {
                        return;
                    }

                    // Add flipped class to expand height
                    card.classList.add('flipped');

                    // Focus on first input if there's a form
                    setTimeout(() => {
                        const firstInput = card.querySelector('input, select');
                        if (firstInput && firstInput.type !== 'hidden') {
                            firstInput.focus();
                        }
                    }, 300); // Wait for flip animation
                });
            }

            // Flip back on back button click
            if (backBtn) {
                backBtn.addEventListener('click', function (e) {
                    e.stopPropagation();

                    // Remove flipped class to return to normal height
                    card.classList.remove('flipped');

                    // Special handling for articles card
                    if (card.id === 'articles-benefit-card') {
                        const articlesSection = document.getElementById('articles-content-section');
                        if (articlesSection) {
                            articlesSection.style.display = 'none';
                        }
                    }

                    // Reset any forms in the card
                    const form = card.querySelector('form');
                    if (form) {
                        form.reset();
                    }
                });
            }

            // Prevent form submission from flipping card back
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.stopPropagation(); // Don't let click bubble to card
                });
            }

            // Also allow clicking outside form on back to go back
            const cardBack = card.querySelector('.card-back');
            if (cardBack) {
                cardBack.addEventListener('click', function (e) {
                    // If clicking on empty space (not form elements or back button)
                    if (e.target === cardBack &&
                        !e.target.closest('form') &&
                        !e.target.closest('.back-btn')) {
                        card.classList.remove('flipped');
                    }
                });
            }
        });

        // Close flip cards when clicking outside (optional)
        document.addEventListener('click', function (e) {
            // If clicking outside any flip card while one is flipped
            if (!e.target.closest('.flip-card') &&
                !e.target.closest('.calculator-modal') &&
                !e.target.closest('.article-modal')) {

                document.querySelectorAll('.flip-card.flipped').forEach(card => {
                    card.classList.remove('flipped');
                });
            }
        });
    }
    // ============================================
    // OVULATION CALCULATOR
    // ============================================

    // function initOvulationCalculator() {
    //     const ovulationCard = document.getElementById('ovulation-benefit-card');
    //     const ovulationForm = document.getElementById('ovulation-form');
    //     const lmpInput = document.getElementById('lmp-date');
    //     const cycleSelect = document.getElementById('cycle-length');
    //     const modal = document.getElementById('ovulation-results-modal');

    //     if (!ovulationForm || !modal) {
    //         console.error('Ovulation calculator elements not found');
    //         return;
    //     }

    //     // Set default date (today - 14 days)
    //     if (lmpInput) {
    //         const today = new Date();
    //         const defaultDate = new Date(today);
    //         defaultDate.setDate(today.getDate() - 14);

    //         const year = defaultDate.getFullYear();
    //         const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
    //         const day = String(defaultDate.getDate()).padStart(2, '0');

    //         lmpInput.value = `${year}-${month}-${day}`;
    //         lmpInput.max = new Date().toISOString().split('T')[0];
    //     }

    //     // Set default cycle length
    //     if (cycleSelect) {
    //         cycleSelect.value = '28';
    //     }

    //     // Form submission
    //     ovulationForm.addEventListener('submit', function (e) {
    //         e.preventDefault();

    //         const lmpDate = new Date(lmpInput.value);
    //         const cycleLength = parseInt(cycleSelect.value);

    //         // Validate
    //         if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
    //             showToast("Ranar da ka shigar ba ta da inganci");
    //             return;
    //         }

    //         if (cycleLength < 21 || cycleLength > 45) {
    //             showToast("Tsawon lokacin haila bai kamata ya kasance ƙasa da kwanaki 21 ko fiye da 45 ba");
    //             return;
    //         }

    //         // Calculate ovulation dates
    //         const ovulationDay = new Date(lmpDate);
    //         ovulationDay.setDate(ovulationDay.getDate() + (cycleLength - 14));

    //         const fertileStart = new Date(ovulationDay);
    //         fertileStart.setDate(fertileStart.getDate() - 3);

    //         const fertileEnd = new Date(ovulationDay);
    //         fertileEnd.setDate(fertileEnd.getDate() + 3);

    //         // Safe period (before fertile window)
    //         const safeStart = new Date(lmpDate);
    //         safeStart.setDate(safeStart.getDate() + 1);

    //         const safeEnd = new Date(fertileStart);
    //         safeEnd.setDate(safeEnd.getDate() - 1);

    //         // Update modal
    //         document.getElementById('modal-ovulation-day').textContent =
    //             formatDateHausa(ovulationDay, 'short');

    //         document.getElementById('modal-fertile-window').textContent =
    //             `${formatDateHausa(fertileStart, 'short')} - ${formatDateHausa(fertileEnd, 'short')}`;

    //         const safePeriodEl = document.getElementById('modal-safe-period');
    //         if (safePeriodEl) {
    //             safePeriodEl.textContent = `${formatDateHausa(safeStart, 'short')} - ${formatDateHausa(safeEnd, 'short')}`;
    //         }

    //         document.getElementById('results-date-range').textContent =
    //             `Lissafi daga ${formatDateHausa(lmpDate, 'short')} zuwa ${formatDateHausa(ovulationDay, 'short')}`;

    //         // Show modal
    //         modal.style.display = 'flex';
    //         document.body.style.overflow = 'hidden';

    //         // Flip card back
    //         if (ovulationCard) {
    //             ovulationCard.classList.remove('flipped');
    //         }
    //     });

    //     // Modal close functionality
    //     const modalClose = modal.querySelector('.modal-close');
    //     const modalOverlay = modal.querySelector('.modal-overlay');

    //     function closeModal() {
    //         modal.style.display = 'none';
    //         document.body.style.overflow = 'auto';
    //     }

    //     if (modalClose) {
    //         modalClose.addEventListener('click', closeModal);
    //     }

    //     if (modalOverlay) {
    //         modalOverlay.addEventListener('click', closeModal);
    //     }

    //     // Save and share buttons
    //     document.getElementById('save-results-btn')?.addEventListener('click', function () {
    //         showToast("Sakamakon an ajiye shi cikin nasara!");
    //     });

    //     document.getElementById('share-results-btn')?.addEventListener('click', async function () {
    //         try {
    //             const shareData = {
    //                 title: 'Sakamakon Lissafin Ovulation',
    //                 text: `Daga Ciki da Raino App`,
    //                 url: window.location.href
    //             };

    //             if (navigator.share) {
    //                 await navigator.share(shareData);
    //             } else {
    //                 await navigator.clipboard.writeText("Sakamakon an kwafa shi zuwa clipboard!");
    //                 showToast("Sakamakon an kwafa shi zuwa clipboard!");
    //             }
    //         } catch (err) {
    //             showToast("Ba zai yiwu a raba sakamakon ba");
    //         }
    //     });
    // }

    // ============================================
    // UTILITY FUNCTIONS - MUST BE DEFINED FIRST
    // ============================================

    // Toast notification function - ADD THIS FIRST
    function showToast(message, duration = 3000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.custom-toast');
        existingToasts.forEach(toast => toast.remove());

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;

        // Style toast
        toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;

        // Add animation
        const style = document.createElement('style');
        if (!document.querySelector('#toast-animations')) {
            style.id = 'toast-animations';
            style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Helper function for month abbreviation
    function getMonthAbbreviation(monthIndex) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'YUN', 'YUL', 'AUG', 'SAT', 'OKT', 'NUW', 'DIS'];
        return months[monthIndex] || 'DIS';
    }

    // Helper function to format date in Hausa
    function formatDateHausa(date) {
        const hausaFullMonths = [
            'Janairu', 'Faburairu', 'Maris', 'Afrilu', 'Mayu', 'Yuni',
            'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'
        ];

        const day = date.getDate();
        const month = hausaFullMonths[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month}, ${year}`;
    }

    // ============================================
    // PREGNANCY TRACKER - COMPLETE FIXED VERSION
    // ============================================

    function initPregnancyTracker() {
        console.log('=== INITIALIZING PREGNANCY TRACKER ===');

        const pregnancyForm = document.getElementById('pregnancy-form');
        const typeButtons = document.querySelectorAll('.type-btn');
        const lmpContainer = document.getElementById('lmp-input-container');
        const eddContainer = document.getElementById('edd-input-container');
        const lmpDateInput = document.getElementById('pregnancy-lmp-date');
        const eddDateInput = document.getElementById('pregnancy-edd-date');
        const modal = document.getElementById('pregnancy-results-modal');

        console.log('Elements found:', {
            pregnancyForm: !!pregnancyForm,
            typeButtons: typeButtons.length,
            lmpContainer: !!lmpContainer,
            eddContainer: !!eddContainer,
            lmpDateInput: !!lmpDateInput,
            eddDateInput: !!eddDateInput,
            modal: !!modal
        });

        if (!pregnancyForm || !modal) {
            console.error('Pregnancy tracker elements not found');
            return;
        }

        let currentCalculationType = 'lmp';

        // Set calculation type - show only one input
        function setCalculationType(type) {
            currentCalculationType = type;
            console.log('Setting calculation type to:', type);

            // Update active button
            typeButtons.forEach(btn => {
                const isActive = btn.dataset.type === type;
                btn.classList.toggle('active', isActive);
                if (isActive) {
                    btn.style.backgroundColor = '#7c3aed';
                    btn.style.color = 'white';
                } else {
                    btn.style.backgroundColor = '#f1f5f9';
                    btn.style.color = '#64748b';
                }
            });

            // Show/hide input containers
            if (type === 'lmp') {
                if (lmpContainer) {
                    lmpContainer.classList.add('active');
                    lmpContainer.style.display = 'block';
                }
                if (eddContainer) {
                    eddContainer.classList.remove('active');
                    eddContainer.style.display = 'none';
                }

                // Set required attributes
                if (lmpDateInput) lmpDateInput.required = true;
                if (eddDateInput) eddDateInput.required = false;

                // Clear and focus on LMP input
                setTimeout(() => {
                    if (lmpDateInput) lmpDateInput.focus();
                }, 100);
            } else {
                if (lmpContainer) {
                    lmpContainer.classList.remove('active');
                    lmpContainer.style.display = 'none';
                }
                if (eddContainer) {
                    eddContainer.classList.add('active');
                    eddContainer.style.display = 'block';
                }

                // Set required attributes
                if (lmpDateInput) lmpDateInput.required = false;
                if (eddDateInput) eddDateInput.required = true;

                // Clear and focus on EDD input
                setTimeout(() => {
                    if (eddDateInput) eddDateInput.focus();
                }, 100);
            }

            // Clear the inactive input
            if (type === 'lmp' && eddDateInput) {
                eddDateInput.value = '';
            } else if (lmpDateInput) {
                lmpDateInput.value = '';
            }
        }

        // Type button event listeners
        typeButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Type button clicked:', this.dataset.type);
                setCalculationType(this.dataset.type);
            });
        });

        // Set default dates
        function setDefaultDates() {
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            const twoWeeksAgoStr = twoWeeksAgo.toISOString().split('T')[0];

            console.log('Setting default dates, today:', todayStr);

            // Set max/min dates
            if (lmpDateInput) {
                lmpDateInput.max = todayStr;
                lmpDateInput.min = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0];

                // Set default value to 14 days ago
                lmpDateInput.value = twoWeeksAgoStr;
            }

            // For EDD, set min to today and max to 10 months from now
            if (eddDateInput) {
                eddDateInput.min = todayStr;
                const maxDate = new Date(today);
                maxDate.setMonth(maxDate.getMonth() + 10);
                eddDateInput.max = maxDate.toISOString().split('T')[0];

                // Set default value to 9 months from today
                const defaultEDD = new Date(today);
                defaultEDD.setMonth(defaultEDD.getMonth() + 9);
                eddDateInput.value = defaultEDD.toISOString().split('T')[0];
            }
        }

        // Validate date input
        function validateDate(input, isLMP = true) {
            if (!input || !input.value) {
                return { valid: false, error: "Da fatan za a shigar da ranar" };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(input.value);
            selectedDate.setHours(0, 0, 0, 0);

            console.log('Validating date:', {
                inputValue: input.value,
                selectedDate: selectedDate.toISOString(),
                isLMP: isLMP,
                today: today.toISOString()
            });

            if (isNaN(selectedDate.getTime())) {
                return { valid: false, error: "Ranar da ka shigar ba ta da inganci" };
            }

            if (isLMP) {
                // LMP cannot be in the future
                if (selectedDate > today) {
                    return { valid: false, error: "Ba zai yiwu ranar haila ta kasance a nan gaba ba" };
                }

                // LMP shouldn't be older than 1 year
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

                if (selectedDate < oneYearAgo) {
                    return { valid: false, error: "Ranar haila ta wuce shekara guda. Da fatan za a shigar da wadda ta kusa" };
                }
            } else {
                // EDD should be in the future (can be up to 2 weeks overdue)
                const twoWeeksAgo = new Date();
                twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

                if (selectedDate < twoWeeksAgo) {
                    return { valid: false, error: "Ranar haihuwa ta wuce makonni biyu. Da fatan za a shigar da wadda ta dace" };
                }
            }

            return { valid: true, date: selectedDate };
        }

        // Calculate pregnancy details
        function calculatePregnancyDetails(lmp, edd, today) {
            // Calculate days from LMP
            const diffTime = today - lmp;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Calculate weeks and days
            let weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;

            // Cap at 40 weeks
            if (weeks > 40) {
                weeks = 40;
            }

            // Calculate weeks left
            const dueDiffTime = edd - today;
            const dueDiffDays = Math.max(0, Math.floor(dueDiffTime / (1000 * 60 * 60 * 24)));
            const weeksLeft = Math.ceil(dueDiffDays / 7);

            // Calculate trimester
            let trimesterText;
            if (weeks <= 13) {
                trimesterText = "Zango na 1";
            } else if (weeks <= 27) {
                trimesterText = "Zango na 2";
            } else {
                trimesterText = "Zango na 3";
            }

            // Calculate month
            const month = Math.floor(weeks / 4.3) + 1;

            // Calculate progress
            const progress = Math.min(100, Math.round((weeks / 40) * 100));

            // Get baby size from the babySizes object
            const babySize = window.babySizes ? window.babySizes[Math.min(weeks, 40)] || "Ana lissafawa..." : "Ana lissafawa...";

            return {
                lmp: lmp,
                edd: edd,
                weeks: weeks,
                days: days,
                weeksLeft: weeksLeft,
                daysLeft: dueDiffDays,
                trimesterText: trimesterText,
                month: month,
                progress: progress,
                babySize: babySize,
                daysFromLMP: diffDays
            };
        }

        // Calculate from LMP
        function calculateFromLMP(lmpValue) {
            const lmpDate = new Date(lmpValue);
            const today = new Date();
            const edd = new Date(lmpDate);
            edd.setDate(edd.getDate() + 280);

            console.log('Calculating from LMP:', {
                lmp: lmpDate.toISOString(),
                today: today.toISOString(),
                edd: edd.toISOString()
            });

            return calculatePregnancyDetails(lmpDate, edd, today);
        }

        // Calculate from EDD
        function calculateFromEDD(eddValue) {
            const today = new Date();
            const edd = new Date(eddValue);
            const lmp = new Date(edd);
            lmp.setDate(lmp.getDate() - 280);

            console.log('Calculating from EDD:', {
                edd: edd.toISOString(),
                today: today.toISOString(),
                lmp: lmp.toISOString()
            });

            return calculatePregnancyDetails(lmp, edd, today);
        }

        // Development and Advice Data
        const developmentData = {
            4: {
                fruit: "Ɗan Alewa",
                size: "4mm",
                facts: [
                    "Ƙwayoyin jiki sun fara rabuwa da haɓaka",
                    "Cibiyar zuciya ta fara bugawa",
                    "Kanawa da kashin baya sun fara samuwar"
                ]
            },
            8: {
                fruit: "Berry",
                size: "1.6cm",
                facts: [
                    "Yatsun hannu da ƙafafu sun fara bayyana",
                    "Ƙwayoyin idanu sun fara haɓaka",
                    "Tsarin jijiya yana ci gaba sosai"
                ]
            },
            12: {
                fruit: "Lemon",
                size: "5.4cm",
                facts: [
                    "Dukkan gabobin sun kasance a wurinsu",
                    "Jariri yana motsawa cikin ciki",
                    "Kashin baya yana ƙarfafawa da sauri"
                ]
            },
            16: {
                fruit: "Avocado",
                size: "11.6cm",
                facts: [
                    "Gashin fuska yana fara girma",
                    "Zuciya tana bugun cikin sauri (120-160/min)",
                    "Ƙafafu suna iya motsawa sosai"
                ]
            },
            20: {
                fruit: "Mango",
                size: "16.4cm",
                facts: [
                    "Jariri yana jin sauti daga waje",
                    "Fatar jiki yana samun mai (vernix)",
                    "Haɓakar hakora yana farawa a cikin gumi"
                ]
            },
            24: {
                fruit: "Corn",
                size: "21cm",
                facts: [
                    "Idanu suna buɗewa da rufewa",
                    "Sautin murya yana ci gaba sosai",
                    "Jariri yana iya ji da amsa sauti"
                ]
            },
            28: {
                fruit: "Eggplant",
                size: "25cm",
                facts: [
                    "Gashin kai yana girma sosai",
                    "Yatsun hannu yana iya shan yatsa",
                    "Jariri yana iya kallon haske ta cikin ciki"
                ]
            },
            32: {
                fruit: "Coconut",
                size: "28cm",
                facts: [
                    "Ƙwayoyin ƙwaƙwalwa suna haɓaka sosai",
                    "Jariri yana yawan motsawa cikin ciki",
                    "Fatar jiki yana ƙaruwa don dumama"
                ]
            },
            36: {
                fruit: "Papaya",
                size: "31cm",
                facts: [
                    "Jariri yana jujjuya ƙasa don haihuwa",
                    "Haɓakar huhu yana ci gaba sosai",
                    "Dukkan gabobin sun cika haɓakarsu"
                ]
            },
            40: {
                fruit: "Watermelon",
                size: "35cm",
                facts: [
                    "Dukkan gabobin sun cika haɓakarsu",
                    "Jariri yana shirye don haihuwa",
                    "Kai yana daidaitawa don fitowa cikin sauƙi"
                ]
            }
        };

        const adviceData = {
            1: {
                badge: "Zango 1",
                title: "Farkon Ciki",
                description: "Lokacin haɓaka mafi muhimmanci",
                checklist: [
                    "Shan vitamin na folic acid kullum",
                    "Yin gwajin jini na farko",
                    "Shawarwari tare da likitan ciki",
                    "Rage shan abin sha mai gabaɗaya",
                    "Ajiye ranar haihuwa a cikin kalanda"
                ],
                dates: {
                    checkup: 7,
                    vaccine: 14,
                    ultrasound: 28
                }
            },
            2: {
                badge: "Zango 2",
                title: "Tsakiyar Ciki",
                description: "Lokacin jin daɗi da ƙarfafawa",
                checklist: [
                    "Yin gwajin glucose don cutar sukari",
                    "Shan ruwa mai yawa (8 gilas kowace rana)",
                    "Yin motsa jiki na yau da kullun",
                    "Ci abinci mai gina jiki da gina jiki",
                    "Shirya wurin haihuwa da kayan haihuwa"
                ],
                dates: {
                    checkup: 14,
                    vaccine: 28,
                    ultrasound: 35
                }
            },
            3: {
                badge: "Zango 3",
                title: "Ƙarshen Ciki",
                description: "Lokacin shiri don haihuwa",
                checklist: [
                    "Yin bitar haihuwa tare da likita",
                    "Shirya jakar asibiti cikakke",
                    "Koyan alamun haihuwa (contractions)",
                    "Cin abinci mai sauƙin narkewa",
                    "Hutawa sosai da yin shirye-shirye"
                ],
                dates: {
                    checkup: 7,
                    vaccine: 0,
                    ultrasound: 14
                }
            }
        };

        // Top Arrow Navigation Variables
        let currentSlideNumber = 1;
        const totalSlides = 3;

        // Update top navigation
        function updateTopNavigation() {
            const currentSlide = document.querySelector('#pregnancy-results-modal .slide.slide-active');
            if (!currentSlide) return;

            currentSlideNumber = parseInt(currentSlide.dataset.slide);
            const slideTitle = currentSlide.dataset.title;

            console.log('Updating top navigation:', { currentSlideNumber, slideTitle });

            // Update title and slide number
            const slideTitleElement = document.getElementById('current-slide-title');
            const slideNumberElement = document.getElementById('current-slide-number');

            if (slideTitleElement) slideTitleElement.textContent = slideTitle;
            if (slideNumberElement) slideNumberElement.textContent = currentSlideNumber;

            // Update arrow states
            const leftArrow = document.querySelector('#pregnancy-results-modal .left-arrow');
            const rightArrow = document.querySelector('#pregnancy-results-modal .right-arrow');

            if (leftArrow) {
                leftArrow.style.opacity = currentSlideNumber === 1 ? '0.5' : '1';
                leftArrow.style.cursor = currentSlideNumber === 1 ? 'not-allowed' : 'pointer';
            }

            if (rightArrow) {
                rightArrow.style.opacity = currentSlideNumber === totalSlides ? '0.5' : '1';
                rightArrow.style.cursor = currentSlideNumber === totalSlides ? 'not-allowed' : 'pointer';
            }
        }

        // Navigation functions
        function goToPreviousSlide() {
            if (currentSlideNumber > 1) {
                goToSlide(currentSlideNumber - 1);
            }
        }

        function goToNextSlide() {
            if (currentSlideNumber < totalSlides) {
                goToSlide(currentSlideNumber + 1);
            }
        }

        function goToSlide(slideNumber) {
            console.log('Going to slide:', slideNumber);

            // Hide all slides
            document.querySelectorAll('#pregnancy-results-modal .slide').forEach(slide => {
                slide.classList.remove('slide-active');
                slide.style.display = 'none';
            });

            // Show target slide
            const targetSlide = document.querySelector(`#pregnancy-results-modal .slide[data-slide="${slideNumber}"]`);
            if (targetSlide) {
                targetSlide.classList.add('slide-active');
                targetSlide.style.display = 'block';
                console.log('Found and showing target slide');
            } else {
                console.error('Target slide not found:', slideNumber);
            }

            // Update top navigation
            updateTopNavigation();
        }

        // Update development and advice slides with images
        function updateDevelopmentSlides(week) {
            const currentWeek = Math.min(Math.max(week, 4), 40);

            // Find closest development data
            let devData = developmentData[40];
            let closestWeek = 40;
            for (let w = currentWeek; w >= 4; w--) {
                if (developmentData[w]) {
                    devData = developmentData[w];
                    closestWeek = w;
                    break;
                }
            }

            console.log('Updating development slides:', { currentWeek, closestWeek, devData });

            // Update development slide text
            const devWeekLabel = document.getElementById('dev-week-label');
            const comparisonText = document.getElementById('comparison-text');
            const devList = document.getElementById('development-list');

            if (devWeekLabel) devWeekLabel.textContent = `Mako na ${currentWeek}`;
            if (comparisonText) comparisonText.textContent = `Girman ${devData.fruit}`;
            if (devList) devList.innerHTML = devData.facts.map(fact => `<li>${fact}</li>`).join('');

            // Determine trimester for advice
            let trimester = 1;
            if (week >= 28) trimester = 3;
            else if (week >= 14) trimester = 2;

            const advice = adviceData[trimester];

            // Update advice slide
            const adviceWeekLabel = document.getElementById('advice-week-label');
            const trimesterBadge = document.getElementById('trimester-badge');
            const trimesterTitle = document.getElementById('trimester-title');
            const trimesterDesc = document.getElementById('trimester-description');

            if (adviceWeekLabel) adviceWeekLabel.textContent = `Mako na ${currentWeek}`;
            if (trimesterBadge) trimesterBadge.textContent = advice.badge;
            if (trimesterTitle) trimesterTitle.textContent = advice.title;
            if (trimesterDesc) trimesterDesc.textContent = advice.description;

            // Update checklist
            const checklistItems = document.querySelectorAll('#pregnancy-results-modal .checklist-item');
            checklistItems.forEach((item, index) => {
                if (advice.checklist[index]) {
                    const textSpan = item.querySelector('.checklist-text');
                    if (textSpan) {
                        textSpan.textContent = advice.checklist[index];
                    }
                    item.classList.remove('checked');
                }
            });

            // Update important dates
            const nextCheckup = document.getElementById('next-checkup');
            const nextVaccine = document.getElementById('next-vaccine');
            const nextUltrasound = document.getElementById('next-ultrasound');

            if (nextCheckup) {
                nextCheckup.textContent = advice.dates.checkup > 0 ?
                    `Nan da kwanaki ${advice.dates.checkup}` : 'An kammala';
            }

            if (nextVaccine) {
                nextVaccine.textContent = advice.dates.vaccine > 0 ?
                    `Nan da kwanaki ${advice.dates.vaccine}` : 'An kammala';
            }

            if (nextUltrasound) {
                nextUltrasound.textContent = advice.dates.ultrasound > 0 ?
                    `Nan da kwanaki ${advice.dates.ultrasound}` : 'An kammala';
            }
        }

        // Initialize checklist functionality
        function initChecklist() {
            const checklistItems = document.querySelectorAll('#pregnancy-results-modal .checklist-item');

            checklistItems.forEach(item => {
                item.addEventListener('click', function () {
                    this.classList.toggle('checked');

                    // Save to localStorage
                    const checklistId = this.dataset.id;
                    const isChecked = this.classList.contains('checked');
                    const checklistState = JSON.parse(localStorage.getItem('pregnancy_checklist') || '{}');
                    checklistState[checklistId] = isChecked;
                    localStorage.setItem('pregnancy_checklist', JSON.stringify(checklistState));

                    // Show completion message if all checked
                    const allChecked = Array.from(checklistItems).every(item => item.classList.contains('checked'));
                    if (allChecked) {
                        showToast("✓ Duk ayyukan wannan makon an kammala su!", 2000);
                    }
                });
            });

            // Load saved checklist state
            const savedChecklist = JSON.parse(localStorage.getItem('pregnancy_checklist') || '{}');
            Object.entries(savedChecklist).forEach(([id, isChecked]) => {
                const item = document.querySelector(`#pregnancy-results-modal .checklist-item[data-id="${id}"]`);
                if (item && isChecked) {
                    item.classList.add('checked');
                }
            });
        }

        // Modal close functionality
        function initModalClose() {
            const modalClose = document.getElementById('modal-close-btn');
            const modalOverlay = modal.querySelector('.modal-overlay');

            function closeModal() {
                console.log('Closing pregnancy modal');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            if (modalClose) {
                console.log('Found modal close button');
                modalClose.addEventListener('click', closeModal);
            } else {
                console.error('Modal close button not found');
                // Try to find any close button
                const anyClose = modal.querySelector('.modal-close');
                if (anyClose) {
                    anyClose.addEventListener('click', closeModal);
                }
            }

            if (modalOverlay) {
                modalOverlay.addEventListener('click', closeModal);
            }
        }

        // Initialize modal functionality
        function initModalFunctionality() {
            console.log('Initializing modal functionality');

            // Initialize top navigation
            updateTopNavigation();

            // Add event listeners for arrow buttons
            const leftArrow = document.querySelector('#pregnancy-results-modal .left-arrow');
            const rightArrow = document.querySelector('#pregnancy-results-modal .right-arrow');

            if (leftArrow) {
                console.log('Found left arrow');
                leftArrow.addEventListener('click', goToPreviousSlide);
            }

            if (rightArrow) {
                console.log('Found right arrow');
                rightArrow.addEventListener('click', goToNextSlide);
            }

            // Initialize other functionalities
            initChecklist();
            initModalClose();

            // Add keyboard navigation
            document.addEventListener('keydown', function (e) {
                if (modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        goToPreviousSlide();
                    } else if (e.key === 'ArrowRight') {
                        goToNextSlide();
                    } else if (e.key === 'Escape') {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        }

        // Update pregnancy modal (main function)
        function updatePregnancyModal(results) {
            console.log('=== UPDATING PREGNANCY MODAL ===', results);

            if (!results) {
                console.error('No results provided');
                return;
            }

            // Helper function to safely update elements
            const updateElement = (id, text) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = text;
                    console.log(`Updated ${id}: ${text}`);
                } else {
                    console.error(`Element not found: ${id}`);
                }
            };

            // Update Slide 1 - Today Card
            updateElement('current-week', results.weeks);
            updateElement('current-day', results.days);
            updateElement('weeks-left', 40 - results.weeks);
            updateElement('pregnancy-percentage', `${results.progress}%`);
            updateElement('baby-size-text', results.babySize);

            // Update week circle progress
            const weekCircle = document.getElementById('week-circle-progress');
            if (weekCircle) {
                const circumference = 2 * Math.PI * 54;
                const progress = Math.min(results.weeks / 40, 1);
                const offset = circumference * (1 - progress);
                weekCircle.style.strokeDashoffset = offset;
                console.log('Updated circle progress:', progress);
            }

            // Update current date
            const today = new Date();
            updateElement('current-date-display', formatDateHausa(today));

            // Update trimester text
            updateElement('trimester-text', results.trimesterText);
            updateElement('month-display', `Wata ${results.month}`);

            // Update EDD Card
            const eddDate = new Date(results.edd);
            updateElement('edd-month', getMonthAbbreviation(eddDate.getMonth()));
            updateElement('edd-day', eddDate.getDate());
            updateElement('edd-year', eddDate.getFullYear());

            // Update countdown
            updateElement('countdown-weeks', results.weeksLeft);
            updateElement('countdown-days', results.daysLeft);
            updateElement('countdown-months', Math.floor(results.weeksLeft / 4.33));

            // Update progress bar
            const progressFill = document.getElementById('pregnancy-progress-fill');
            const progressPercentage = document.getElementById('progress-percentage');
            if (progressFill && progressPercentage) {
                progressFill.style.width = `${results.progress}%`;
                progressPercentage.textContent = `${results.progress}%`;
                console.log('Updated progress bar:', results.progress + '%');
            }

            // Update notification
            const notification = document.getElementById('edd-notification');
            if (notification) {
                if (results.weeksLeft <= 4) {
                    notification.textContent = `Haihuwa nan da makonni ${results.weeksLeft}!`;
                    notification.style.color = '#ff6b6b';
                } else if (results.weeksLeft <= 12) {
                    notification.textContent = `Shirya don haihuwa nan da makonni ${results.weeksLeft}`;
                    notification.style.color = '#4db8d8';
                } else {
                    notification.textContent = 'Lokaci mai dadi yayi!';
                    notification.style.color = '#94a3b8';
                }
            }

            // Update Slides 2 & 3 with development data
            updateDevelopmentSlides(results.weeks);

            // Reset to slide 1
            setTimeout(() => {
                goToSlide(1);
            }, 100);
        }

        // Form submission handler
        pregnancyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Pregnancy form submitted');

            // Disable submit button temporarily
            const submitBtn = this.querySelector('.calculate-btn');
            if (!submitBtn) {
                console.error('Calculate button not found');
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Ana lissafawa...';
            submitBtn.disabled = true;

            console.log('Current calculation type:', currentCalculationType);

            let validation;
            let results;

            try {
                if (currentCalculationType === 'lmp') {
                    console.log('Calculating from LMP');
                    validation = validateDate(lmpDateInput, true);

                    if (!validation.valid) {
                        console.error('LMP validation failed:', validation.error);
                        showToast(validation.error);
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        return;
                    }

                    results = calculateFromLMP(lmpDateInput.value);
                    console.log('LMP calculation results:', results);
                } else {
                    console.log('Calculating from EDD');
                    validation = validateDate(eddDateInput, false);

                    if (!validation.valid) {
                        console.error('EDD validation failed:', validation.error);
                        showToast(validation.error);
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        return;
                    }

                    results = calculateFromEDD(eddDateInput.value);
                    console.log('EDD calculation results:', results);
                }

                // Check if pregnancy is valid
                if (results.weeks < 0) {
                    console.error('Negative weeks detected');
                    showToast("Ba zai yiwu ciki ya kasance kafin ranar haila ba");
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                // Show results after delay
                setTimeout(() => {
                    console.log('Updating modal with results...');

                    // Update all slides with pregnancy data
                    updatePregnancyModal(results);

                    // Show modal
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    console.log('Modal displayed');

                    // Initialize modal functionality
                    initModalFunctionality();

                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    console.log('Form submission complete');
                }, 500);

            } catch (error) {
                console.error('Error in form submission:', error);
                showToast("An sami matsala tare da lissafin. Gwada sake shi.");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Initialize
        function initialize() {
            console.log('Initializing pregnancy tracker...');
            setCalculationType('lmp');
            setDefaultDates();

            // Load saved data
            const savedData = localStorage.getItem('pregnancy_tracking_data');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    if (data.calculationType) {
                        setCalculationType(data.calculationType);
                    }
                    if (data.lmpDate && lmpDateInput) {
                        lmpDateInput.value = data.lmpDate;
                    }
                    if (data.eddDate && eddDateInput) {
                        eddDateInput.value = data.eddDate;
                    }
                } catch (e) {
                    console.error('Error loading saved pregnancy data:', e);
                }
            }

            console.log('Pregnancy tracker initialized successfully');
        }

        initialize();
    }

    // Make babySizes available globally
    window.babySizes = {
        4: "Girman ɗan Alewa (4mm)",
        5: "Girman Berry (5mm)",
        6: "Girman Lentil (6mm)",
        7: "Girman Blueberry (10mm)",
        8: "Girman Raspberry (1.6cm)",
        9: "Girman Cherry (2.3cm)",
        10: "Girman Kumquat (3.1cm)",
        11: "Girman Fig (4.1cm)",
        12: "Girman Lime (5.4cm)",
        13: "Girman Lemon (7.4cm)",
        14: "Girman Orange (8.7cm)",
        15: "Girman Apple (10.1cm)",
        16: "Girman Avocado (11.6cm)",
        17: "Girman Pear (13cm)",
        18: "Girman Sweet Potato (14.2cm)",
        19: "Girman Mango (15.3cm)",
        20: "Girman Banana (16.4cm)",
        21: "Girman Carrot (26.7cm)",
        22: "Girman Coconut (27.8cm)",
        23: "Girman Grapefruit (28.9cm)",
        24: "Girman Corn (30cm)",
        25: "Girman Rutabaga (34.6cm)",
        26: "Girman Lettuce (35.6cm)",
        27: "Girman Cauliflower (36.6cm)",
        28: "Girman Eggplant (37.6cm)",
        29: "Girman Butternut Squash (38.6cm)",
        30: "Girman Cabbage (39.9cm)",
        31: "Girman Coconut (41.1cm)",
        32: "Girman Kale (42.4cm)",
        33: "Girman Pineapple (43.7cm)",
        34: "Girman Melon (45cm)",
        35: "Girman Honeydew (46.2cm)",
        36: "Girman Romaine Lettuce (47.4cm)",
        37: "Girman Swiss Chard (48.6cm)",
        38: "Girman Leek (49.8cm)",
        39: "Girman Mini Watermelon (50.7cm)",
        40: "Girman Watermelon (51.2cm)"
    };

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOM Content Loaded - Checking for pregnancy form...');

        // Check if we're on the right page
        if (document.getElementById('pregnancy-form')) {
            console.log('Pregnancy form found, initializing tracker...');
            initPregnancyTracker();
        } else {
            console.log('Pregnancy form not found on this page');
        }
    });

    // Also initialize if script loads after DOM
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        if (document.getElementById('pregnancy-form')) {
            console.log('DOM already ready, initializing tracker...');
            initPregnancyTracker();
        }
    }







    // ============================================
    // ARTICLES SECTION
    // ============================================
    function initArticles() {
        const articlesCard = document.getElementById('articles-benefit-card');
        const articlesContentSection = document.getElementById('articles-content-section');
        const articlesGrid = document.getElementById('articles-grid');
        const categoryBtns = document.querySelectorAll('.category-btn');
        const searchInput = document.getElementById('articles-search');
        const searchBtn = document.querySelector('.search-btn');
        const articleDetailModal = document.getElementById('article-detail-modal');

        if (!articlesCard || !articlesContentSection) {
            console.warn('Articles elements not found');
            return;
        }

        // Sample articles data
        const sampleArticles = [
            {
                id: 1,
                title: "Abinci Mai Gina Jiki Ga Uwa Mai Ciki",
                excerpt: "Menene abinci masu muhimmanci don lafiyar ku da ta jariri a lokacin ciki?",
                category: "nutrition",
                content: `<h2>Abinci Mai Gina Jiki Ga Uwa Mai Ciki</h2>
                    <p>A lokacin ciki, cin abinci mai gina jiki yana da muhimmanci ga lafiyar ku da ta jariri.</p>
                    <h3>Abubuwan Gina Jiki Masu Muhimmanci:</h3>
                    <ul>
                        <li>Folic Acid - don hana cututtukan kwakwalwa</li>
                        <li>Ƙarfe - don haɓakar jini</li>
                        <li>Calcium - don ƙashi mai ƙarfi</li>
                        <li>Protein - don ci gaban jariri</li>
                    </ul>`,
                readTime: "5 min",
                date: "15 Janairu 2024",
                icon: "🍎",
                saved: false
            },
            {
                id: 2,
                title: "Alamun Farko na Ciki",
                excerpt: "Menene alamun da za ku iya gani a farkon ciki?",
                category: "symptoms",
                content: `<h2>Alamun Farko na Ciki</h2>
                    <p>Alamun farko na ciki na iya bambanta daga mace zuwa mace, amma akwai wasu na gama gari:</p>`,
                readTime: "3 min",
                date: "10 Janairu 2024",
                icon: "🤰",
                saved: false
            },
            {
                id: 3,
                title: "Yadda Ake Kula da Jariri Bayan Haihuwa",
                excerpt: "Dabarun kula da jariri na farko na watanni",
                category: "baby-care",
                content: `<h2>Kula da Jariri Bayan Haihuwa</h2>
                    <p>Kula da jariri bayan haihuwa yana buƙatar haƙuri da ƙwarewa.</p>`,
                readTime: "7 min",
                date: "5 Janairu 2024",
                icon: "👶",
                saved: false
            }
        ];

        let currentCategory = 'all';
        let currentSearch = '';

        // Load articles
        function loadArticles() {
            // Show loading
            if (articlesGrid) articlesGrid.innerHTML = '';
            const loadingElement = document.getElementById('articles-loading');
            if (loadingElement) loadingElement.style.display = 'flex';

            // Simulate API delay
            setTimeout(() => {
                let filteredArticles = sampleArticles;

                // Filter by category
                if (currentCategory !== 'all') {
                    filteredArticles = filteredArticles.filter(article =>
                        article.category === currentCategory
                    );
                }

                // Filter by search
                if (currentSearch.trim() !== '') {
                    const searchTerm = currentSearch.toLowerCase();
                    filteredArticles = filteredArticles.filter(article =>
                        article.title.toLowerCase().includes(searchTerm) ||
                        article.excerpt.toLowerCase().includes(searchTerm)
                    );
                }

                // Update UI
                updateArticlesUI(filteredArticles);

                // Hide loading
                if (loadingElement) loadingElement.style.display = 'none';
            }, 500);
        }

        // Update articles UI
        function updateArticlesUI(articles) {
            const count = articles.length;
            const countElement = document.getElementById('articles-count');
            const titleElement = document.getElementById('articles-category-title');

            if (countElement) countElement.textContent = `${count} labar${count === 1 ? 'i' : 'ai'}`;
            if (titleElement) titleElement.textContent = categoryNames[currentCategory] || 'Duka Labarai';

            // Clear grid
            if (articlesGrid) articlesGrid.innerHTML = '';

            // Show no articles message if empty
            const noArticlesElement = document.getElementById('no-articles-message');
            if (count === 0) {
                if (noArticlesElement) noArticlesElement.style.display = 'block';
                return;
            }

            // Hide no articles message
            if (noArticlesElement) noArticlesElement.style.display = 'none';

            // Add articles to grid
            articles.forEach(article => {
                const articleCard = createArticleCard(article);
                if (articlesGrid) articlesGrid.appendChild(articleCard);
            });
        }

        // Create article card
        function createArticleCard(article) {
            const card = document.createElement('div');
            card.className = 'article-card';
            card.dataset.id = article.id;

            card.innerHTML = `
                <div class="article-image">
                    <span>${article.icon}</span>
                </div>
                <div class="article-content">
                    <span class="article-category">${categoryNames[article.category] || article.category}</span>
                    <h4 class="article-title">${article.title}</h4>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">
                            <span>📅</span>
                            <span>${article.date}</span>
                        </span>
                        <span class="article-read-time">
                            <span>⏱️</span>
                            <span>${article.readTime}</span>
                        </span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                showArticleDetail(article);
            });

            return card;
        }

        // Show article detail
        function showArticleDetail(article) {
            if (!articleDetailModal) return;

            // Update modal content
            const titleElement = document.querySelector('.article-detail-title');
            const categoryElement = document.querySelector('.article-category-badge');
            const dateElement = document.querySelector('.article-date');
            const readTimeElement = document.querySelector('.article-read-time');
            const bodyElement = document.querySelector('.article-body');

            if (titleElement) titleElement.textContent = article.title;
            if (categoryElement) categoryElement.textContent = categoryNames[article.category] || article.category;
            if (dateElement) dateElement.textContent = `📅 ${article.date}`;
            if (readTimeElement) readTimeElement.textContent = `⏱️ ${article.readTime}`;
            if (bodyElement) bodyElement.innerHTML = article.content;

            // Show modal
            articleDetailModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        // Close article detail
        function closeArticleDetail() {
            if (articleDetailModal) {
                articleDetailModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }

        // Articles card click (show categories)
        const cardFront = articlesCard.querySelector('.card-front');
        if (cardFront) {
            cardFront.addEventListener('click', function () {
                articlesCard.classList.add('flipped');
                articlesContentSection.style.display = 'block';
                loadArticles();
            });
        }

        // Category selection
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.dataset.category;
                loadArticles();
            });
        });

        // Search functionality
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                currentSearch = searchInput.value;
                loadArticles();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    currentSearch = searchInput.value;
                    loadArticles();
                }
            });
        }

        // Article detail modal close
        const backBtn = document.querySelector('.article-back-btn');
        const modalOverlay = articleDetailModal?.querySelector('.modal-overlay');

        if (backBtn) {
            backBtn.addEventListener('click', closeArticleDetail);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeArticleDetail);
        }

        // Article action buttons
        document.querySelectorAll('.article-action-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const action = this.dataset.action;

                switch (action) {
                    case 'share':
                        showToast("Hanyar haɗin labari an kwafa shi");
                        break;
                    case 'save':
                        showToast("Labari an ajiye shi");
                        break;
                    case 'speak':
                        showToast("Ana karanta labarin...");
                        break;
                }
            });
        });

        // Initialize with some articles
        loadArticles();
    }









    // ============================================
    // PAGE NAVIGATION SYSTEM
    // ============================================
    function initPageNavigation(chatbot) {
        const navItems = document.querySelectorAll('.nav-item');
        const mainContent = document.querySelector('.main-content');

        if (!navItems.length || !mainContent) {
            console.error('Navigation elements not found');
            return;
        }

        // Function to switch pages
        function switchPage(pageId) {
            // Update navigation
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === pageId) {
                    item.classList.add('active');
                }
            });

            // Handle page display
            if (pageId === 'chat') {
                mainContent.style.display = 'none';
                if (chatbot && chatbot.show) chatbot.show();
                document.body.style.overflow = 'hidden';
            } else {
                if (chatbot && chatbot.hide) chatbot.hide();
                mainContent.style.display = 'block';
                document.body.style.overflow = 'auto';

                // Update URL for other pages if needed
                if (pageId === 'home') {
                    window.history.pushState({ page: 'home' }, '', '#');
                } else {
                    window.history.pushState({ page: pageId }, '', `#${pageId}`);
                }
            }
        }

        // Add click event to nav items
        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                const pageId = this.dataset.page;
                switchPage(pageId);
            });
        });

        // Handle back button in chat
        const chatBackBtn = document.getElementById('chat-back-btn');
        if (chatBackBtn) {
            chatBackBtn.addEventListener('click', () => {
                switchPage('home');
            });
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', function (event) {
            const hash = window.location.hash.substring(1) || 'home';
            switchPage(hash);
        });

        // Initialize page based on URL hash
        function initFromUrl() {
            const hash = window.location.hash.substring(1);
            if (hash && hash === 'chat') {
                switchPage('chat');
            } else {
                switchPage('home');
            }
        }

        // Initialize from URL
        initFromUrl();
    }









    // ============================================
    // INITIALIZE APP
    // ============================================
    function initApp() {
        console.log('Initializing Ciki da Raino App...');

        // Initialize theme
        initTheme();

        // Initialize flip cards
        initFlipCards();

        // Initialize ovulation calculator
        initOvulationCalculator();

        // Initialize pregnancy tracker
        initPregnancyTracker();

        // Initialize articles
        initArticles();

        // Initialize chatbot
        const chatbot = initChatbot();
        if (chatbot && chatbot.initialize) {
            chatbot.initialize();
        }

        // Initialize page navigation (pass chatbot instance)
        initPageNavigation(chatbot);

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.calculator-modal, .article-modal').forEach(modal => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            }
        });

        console.log('App initialized successfully!');
    }

    // Start the app
    initApp();
});