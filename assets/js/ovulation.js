

// Ovulation Calculator with 3 Slides - COMPLETE FIXED VERSION
function initOvulationCalculator() {
    const ovulationCard = document.getElementById('ovulation-benefit-card');
    const ovulationForm = document.getElementById('ovulation-form');
    const lmpInput = document.getElementById('lmp-date');
    const cycleSelect = document.getElementById('cycle-length');
    const modal = document.getElementById('ovulation-results-modal');

    if (!ovulationForm || !modal) {
        console.error('Ovulation calculator elements not found');
        return;
    }

    // Set default date (today - 14 days)
    if (lmpInput) {
        const today = new Date();
        const defaultDate = new Date(today);
        defaultDate.setDate(today.getDate() - 14);

        const year = defaultDate.getFullYear();
        const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
        const day = String(defaultDate.getDate()).padStart(2, '0');

        lmpInput.value = `${year}-${month}-${day}`;
        lmpInput.max = new Date().toISOString().split('T')[0];
    }

    // Set default cycle length
    if (cycleSelect) {
        cycleSelect.value = '28';
    }

    // Form submission
    ovulationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const lmpDate = new Date(lmpInput.value);
        const cycleLength = parseInt(cycleSelect.value);

        // Validate
        if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
            showToast("Ranar da ka shigar ba ta da inganci");
            return;
        }

        if (cycleLength < 21 || cycleLength > 45) {
            showToast("Tsawon lokacin haila bai kamata ya kasance ƙasa da kwanaki 21 ko fiye da 45 ba");
            return;
        }

        // Calculate ovulation dates
        const results = calculateOvulationDates(lmpDate, cycleLength);

        // Update modal with results
        updateOvulationModal(results);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Initialize modal functionality
        initOvulationModalFunctionality(results);

        // Flip card back if exists
        if (ovulationCard) {
            ovulationCard.classList.remove('flipped');
        }
    });

    // Initialize the calculator
    initOvulationModalClose();
}

// Calculate ovulation dates
function calculateOvulationDates(lmpDate, cycleLength) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lmp = new Date(lmpDate);
    lmp.setHours(0, 0, 0, 0);

    // Calculate ovulation day (14 days before next period)
    const ovulationDay = new Date(lmp);
    ovulationDay.setDate(lmp.getDate() + (cycleLength - 14));

    // Fertile window (3 days before to 3 days after ovulation)
    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 3);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 3);

    // Next period
    const nextPeriod = new Date(lmp);
    nextPeriod.setDate(lmp.getDate() + cycleLength);

    // Days until ovulation
    const daysUntilOvulation = Math.max(0, Math.ceil((ovulationDay - today) / (1000 * 60 * 60 * 24)));

    // Determine current phase
    let currentPhase = "Farkon Cycle";
    let cycleProgress = 0;

    if (today < fertileStart) {
        currentPhase = "Farkon Cycle";
        const daysInPhase = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
        cycleProgress = Math.min(33, (daysInPhase / cycleLength) * 100);
    } else if (today >= fertileStart && today <= fertileEnd) {
        currentPhase = "Fertile Window";
        const daysInFertile = Math.floor((today - fertileStart) / (1000 * 60 * 60 * 24)) + 1;
        cycleProgress = 33 + (daysInFertile / 7) * 33;
    } else if (today > fertileEnd && today < nextPeriod) {
        currentPhase = "Ƙarshen Cycle";
        const daysInLuteal = Math.floor((today - fertileEnd) / (1000 * 60 * 60 * 24));
        const lutealLength = 14; // Typical luteal phase length
        cycleProgress = 66 + (daysInLuteal / lutealLength) * 34;
    }

    // Probability data
    const probabilityData = {
        '-3': 20,
        '-2': 40,
        '-1': 60,
        '0': 90,
        '+1': 70
    };

    return {
        lmpDate: lmp,
        cycleLength: cycleLength,
        ovulationDay: ovulationDay,
        fertileStart: fertileStart,
        fertileEnd: fertileEnd,
        nextPeriod: nextPeriod,
        today: today,
        daysUntilOvulation: daysUntilOvulation,
        currentPhase: currentPhase,
        cycleProgress: Math.min(100, Math.round(cycleProgress)),
        probabilityData: probabilityData,
        fertileWindowDays: 7 // 6 days + ovulation day
    };
}

// Update ovulation modal with results
function updateOvulationModal(results) {
    // Update Slide 1
    const currentDateElement = document.getElementById('ovulation-current-date');
    if (currentDateElement) {
        currentDateElement.textContent = formatDateHausa(results.today, 'full');
    }

    // Ovulation date display
    document.getElementById('ovulation-month').textContent = getMonthAbbreviation(results.ovulationDay.getMonth());
    document.getElementById('ovulation-day').textContent = results.ovulationDay.getDate();
    document.getElementById('ovulation-year').textContent = results.ovulationDay.getFullYear();

    document.getElementById('ovulation-days-left').textContent = results.daysUntilOvulation;
    document.getElementById('cycle-length-display').textContent = results.cycleLength;
    document.getElementById('lmp-date-display').textContent =
        `${getMonthAbbreviation(results.lmpDate.getMonth())} ${results.lmpDate.getDate()}`;

    document.getElementById('current-phase').textContent = results.currentPhase;

    // Update progress bar
    const progressFill = document.getElementById('cycle-progress-fill');
    if (progressFill) {
        progressFill.style.width = `${results.cycleProgress}%`;
    }

    // Update notification
    const notification = document.getElementById('ovulation-notification');
    if (notification) {
        if (results.daysUntilOvulation === 0) {
            notification.textContent = "Ranar ovulation ta yi! Mafi kyawun lokacin haihuwa";
        } else if (results.daysUntilOvulation <= 3) {
            notification.textContent = `Ovulation nan da kwanaki ${results.daysUntilOvulation}! Shirya`;
        } else {
            notification.textContent = "Mafi kyawun lokacin haihuwa";
        }
    }

    // Fertile window dates
    document.getElementById('fertile-start-date').textContent =
        `${getMonthAbbreviation(results.fertileStart.getMonth())} ${results.fertileStart.getDate()}`;
    document.getElementById('fertile-end-date').textContent =
        `${getMonthAbbreviation(results.fertileEnd.getMonth())} ${results.fertileEnd.getDate()}`;

    document.getElementById('fertile-days').textContent = results.fertileWindowDays;

    // Update probability bars
    updateProbabilityBars(results);

    // Update fertile status
    const fertileStatus = document.getElementById('fertile-status');
    if (fertileStatus) {
        if (results.today >= results.fertileStart && results.today <= results.fertileEnd) {
            fertileStatus.textContent = "Fertile Window Active";
        } else if (results.today < results.fertileStart) {
            fertileStatus.textContent = `Fertile Window nan da kwanaki ${results.daysUntilOvulation - 3}`;
        } else {
            fertileStatus.textContent = "Fertile Window ya ƙare";
        }
    }

    // Update Slide 2: Calendar
    updateOvulationCalendar(results);

    // Update Slide 3: Symptoms
    updateSymptomsSlide(results);
}

// Update probability bars
function updateProbabilityBars(results) {
    const probabilityGrid = document.querySelector('.probability-grid');
    if (!probabilityGrid) return;

    probabilityGrid.innerHTML = '';

    Object.entries(results.probabilityData).forEach(([day, probability]) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'probability-day';
        if (parseInt(day) === 0) dayEl.classList.add('highlight');

        dayEl.innerHTML = `
                <span class="day-label">${day}</span>
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${probability}%"></div>
                </div>
                <span class="probability-value">${probability}%</span>
            `;

        probabilityGrid.appendChild(dayEl);
    });
}

// Update ovulation calendar
function updateOvulationCalendar(results) {
    const container = document.getElementById('calendar-days-container');
    const monthYear = document.getElementById('calendar-month-year');
    if (!container || !monthYear) return;

    // Set calendar to ovulation month
    const displayDate = new Date(results.ovulationDay);
    monthYear.textContent = `${getMonthAbbreviation(displayDate.getMonth())} ${displayDate.getFullYear()}`;

    // Get first day of month
    const firstDay = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const lastDay = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);

    // Get starting day (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();

    // Clear container
    container.innerHTML = '';

    // Add empty days for starting
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        emptyDay.textContent = '';
        container.appendChild(emptyDay);
    }

    // Add days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        dayDate.setHours(0, 0, 0, 0);

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        // Check if today
        if (dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }

        // Check if ovulation day
        if (dayDate.getTime() === results.ovulationDay.getTime()) {
            dayEl.classList.add('ovulation-day');
            dayEl.title = "Ranar Ovulation";
        }

        // Check if in fertile window
        if (dayDate >= results.fertileStart && dayDate <= results.fertileEnd) {
            dayEl.classList.add('fertile-window');
            dayEl.title = "Fertile Window";
        }

        // Check if period day (LMP or next period)
        if (dayDate.getTime() === results.lmpDate.getTime() ||
            dayDate.getTime() === results.nextPeriod.getTime()) {
            dayEl.classList.add('period-day');
            dayEl.title = "Lokacin Haila";
        }

        // Add click event
        dayEl.addEventListener('click', function () {
            showDayDetails(dayDate, results);
        });

        container.appendChild(dayEl);
    }
}

// Update symptoms slide
function updateSymptomsSlide(results) {
    // Update phase
    const symptomsPhase = document.getElementById('symptoms-phase');
    if (symptomsPhase) {
        symptomsPhase.textContent = results.currentPhase;
    }

    // Update next period prediction
    const nextPeriodDate = document.getElementById('next-period-date');
    const nextPeriodDays = document.getElementById('next-period-days');

    if (nextPeriodDate) {
        nextPeriodDate.textContent = formatDateHausa(results.nextPeriod, 'short');
    }

    if (nextPeriodDays) {
        const daysDiff = Math.max(0, Math.ceil((results.nextPeriod - results.today) / (1000 * 60 * 60 * 24)));
        nextPeriodDays.textContent = daysDiff === 0 ? 'Yau' : `Nan da kwanaki ${daysDiff}`;
    }
}

// Show day details
function showDayDetails(date, results) {
    const dayStr = formatDateHausa(date, 'full');
    let description = "";

    if (date.getTime() === results.ovulationDay.getTime()) {
        description = "RANAR OVULATION - Mafi kyawun lokacin haihuwa (90% damar ciki)";
    } else if (date >= results.fertileStart && date <= results.fertileEnd) {
        const diff = Math.floor((date - results.fertileStart) / (1000 * 60 * 60 * 24));
        const probability = results.probabilityData[diff - 3] || 30;
        description = `Fertile Window - ${probability}% damar samun ciki`;
    } else if (date.getTime() === results.lmpDate.getTime()) {
        description = "Ranar Farkon Haila (LMP)";
    } else if (date.getTime() === results.nextPeriod.getTime()) {
        description = "Ranar Hailar Gaba";
    } else {
        description = "Lokacin ba tare da haihuwa ba";
    }

    showToast(`${dayStr}: ${description}`, 3000);
}

// Ovulation Slide Navigation - FIXED
let currentOvulationSlide = 1;
const totalOvulationSlides = 3;

function goToPreviousOvulationSlide() {
    if (currentOvulationSlide > 1) {
        goToOvulationSlide(currentOvulationSlide - 1);
    }
}

function goToNextOvulationSlide() {
    if (currentOvulationSlide < totalOvulationSlides) {
        goToOvulationSlide(currentOvulationSlide + 1);
    }
}

function goToOvulationSlide(slideNumber) {
    console.log(`Navigating to slide ${slideNumber}`);

    // Get all slides
    const slides = document.querySelectorAll('#ovulation-results-modal .slides-container .slide');

    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('slide-active');
        slide.style.display = 'none';
    });

    // Show the target slide (slideNumber is 1-based, array is 0-based)
    const targetIndex = slideNumber - 1;
    if (slides[targetIndex]) {
        slides[targetIndex].classList.add('slide-active');
        slides[targetIndex].style.display = 'block';
        currentOvulationSlide = slideNumber;
        console.log(`Successfully showed slide ${slideNumber}`);
    } else {
        console.error(`Slide ${slideNumber} not found!`);
        return;
    }

    // Update top navigation
    updateOvulationTopNavigation();
}

function updateOvulationTopNavigation() {
    const activeSlide = document.querySelector('#ovulation-results-modal .slide.slide-active');
    if (!activeSlide) return;

    const slideTitle = activeSlide.getAttribute('data-title') || `Slide ${currentOvulationSlide}`;

    // Update title and slide number
    const slideTitleElement = document.getElementById('current-ovulation-slide-title');
    const slideNumberElement = document.getElementById('current-ovulation-slide-number');

    if (slideTitleElement) {
        slideTitleElement.textContent = slideTitle;
    }

    if (slideNumberElement) {
        slideNumberElement.textContent = currentOvulationSlide;
    }

    // Update arrow states
    const leftArrow = document.querySelector('#ovulation-results-modal .left-arrow');
    const rightArrow = document.querySelector('#ovulation-results-modal .right-arrow');

    if (leftArrow) {
        leftArrow.style.opacity = currentOvulationSlide === 1 ? '0.5' : '1';
        leftArrow.style.cursor = currentOvulationSlide === 1 ? 'not-allowed' : 'pointer';
    }

    if (rightArrow) {
        rightArrow.style.opacity = currentOvulationSlide === totalOvulationSlides ? '0.5' : '1';
        rightArrow.style.cursor = currentOvulationSlide === totalOvulationSlides ? 'not-allowed' : 'pointer';
    }
}

// Initialize ovulation modal functionality
function initOvulationModalFunctionality(results) {
    console.log("Initializing modal functionality");

    // Force show slide 1 first
    goToOvulationSlide(1);

    // Initialize top navigation
    updateOvulationTopNavigation();

    // Initialize checklist
    initOvulationChecklist();

    // Initialize calendar navigation
    initCalendarNavigation(results);

    // Add keyboard navigation
    document.addEventListener('keydown', handleOvulationKeyboardNavigation);
}

// Handle keyboard navigation
function handleOvulationKeyboardNavigation(e) {
    const modal = document.getElementById('ovulation-results-modal');
    if (!modal || modal.style.display !== 'flex') return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            goToPreviousOvulationSlide();
            break;
        case 'ArrowRight':
            e.preventDefault();
            goToNextOvulationSlide();
            break;
        case 'Escape':
            closeOvulationModal();
            break;
    }
}

// Initialize ovulation checklist
function initOvulationChecklist() {
    const checklistItems = document.querySelectorAll('#ovulation-results-modal .checklist-item');

    checklistItems.forEach(item => {
        item.addEventListener('click', function () {
            this.classList.toggle('checked');

            // Save to localStorage
            const checklistId = this.dataset.id;
            const isChecked = this.classList.contains('checked');
            const checklistState = JSON.parse(localStorage.getItem('ovulation_checklist') || '{}');
            checklistState[checklistId] = isChecked;
            localStorage.setItem('ovulation_checklist', JSON.stringify(checklistState));
        });
    });

    // Load saved checklist state
    const savedChecklist = JSON.parse(localStorage.getItem('ovulation_checklist') || '{}');
    Object.entries(savedChecklist).forEach(([id, isChecked]) => {
        const item = document.querySelector(`#ovulation-results-modal .checklist-item[data-id="${id}"]`);
        if (item && isChecked) {
            item.classList.add('checked');
        }
    });
}

// Initialize calendar navigation
function initCalendarNavigation(results) {
    const prevBtn = document.querySelector('#ovulation-results-modal .prev-month');
    const nextBtn = document.querySelector('#ovulation-results-modal .next-month');

    if (!prevBtn || !nextBtn) return;

    let currentCalendarDate = new Date(results.ovulationDay);

    prevBtn.addEventListener('click', function () {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        updateOvulationCalendarForMonth(currentCalendarDate, results);
        updateCalendarMonthYear(currentCalendarDate);
    });

    nextBtn.addEventListener('click', function () {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        updateOvulationCalendarForMonth(currentCalendarDate, results);
        updateCalendarMonthYear(currentCalendarDate);
    });
}

// Update calendar for specific month
function updateOvulationCalendarForMonth(monthDate, results) {
    const container = document.getElementById('calendar-days-container');
    const monthYear = document.getElementById('calendar-month-year');
    if (!container || !monthYear) return;

    // Update month year display
    monthYear.textContent = `${getMonthAbbreviation(monthDate.getMonth())} ${monthDate.getFullYear()}`;

    // Get month info
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    // Clear container
    container.innerHTML = '';

    // Add empty days for starting
    for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        emptyDay.textContent = '';
        container.appendChild(emptyDay);
    }

    // Add days of month
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayDate = new Date(year, month, day);
        dayDate.setHours(0, 0, 0, 0);

        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;

        // Check if today
        if (dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }

        // Check if ovulation day
        if (dayDate.getTime() === results.ovulationDay.getTime()) {
            dayEl.classList.add('ovulation-day');
            dayEl.title = "Ranar Ovulation";
        }

        // Check if in fertile window
        if (dayDate >= results.fertileStart && dayDate <= results.fertileEnd) {
            dayEl.classList.add('fertile-window');
            dayEl.title = "Fertile Window";
        }

        // Check if period day
        if (dayDate.getTime() === results.lmpDate.getTime() ||
            dayDate.getTime() === results.nextPeriod.getTime()) {
            dayEl.classList.add('period-day');
            dayEl.title = "Lokacin Haila";
        }

        // Add click event
        dayEl.addEventListener('click', function () {
            showDayDetails(dayDate, results);
        });

        container.appendChild(dayEl);
    }
}

// Update calendar month year display
function updateCalendarMonthYear(date) {
    const monthYear = document.getElementById('calendar-month-year');
    if (monthYear) {
        monthYear.textContent = `${getMonthAbbreviation(date.getMonth())} ${date.getFullYear()}`;
    }
}

// Initialize modal close
function initOvulationModalClose() {
    const modal = document.getElementById('ovulation-results-modal');
    const modalClose = document.getElementById('ovulation-modal-close-btn');
    const modalOverlay = modal?.querySelector('.modal-overlay');

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleOvulationKeyboardNavigation);
    }

    function closeOvulationModal() {
        closeModal();
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    window.closeOvulationModal = closeOvulationModal;
}

// Helper function for month abbreviation
function getMonthAbbreviation(monthIndex) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'YUN', 'YUL', 'AUG', 'SAT', 'OKT', 'NUW', 'DIS'];
    return months[monthIndex] || 'DIS';
}

// Helper function to format date in Hausa
function formatDateHausa(date, format = 'short') {
    const hausaFullMonths = [
        'Janairu', 'Faburairu', 'Maris', 'Afrilu', 'Mayu', 'Yuni',
        'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'
    ];

    const day = date.getDate();
    const month = hausaFullMonths[date.getMonth()];
    const year = date.getFullYear();

    if (format === 'short') {
        return `${day} ${month.substring(0, 3)} ${year}`;
    }

    return `${day} ${month}, ${year}`;
}

// Toast notification function
if (typeof showToast === 'undefined') {
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

        document.body.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// Add essential CSS for slides - CRITICAL FIX
function addEssentialCSS() {
    if (!document.getElementById('ovulation-slide-fix')) {
        const style = document.createElement('style');
        style.id = 'ovulation-slide-fix';
        style.textContent = `
                
                .calendar-day.ovulation-day {
                    background-color: #f59e0b !important;
                    color: white !important;
                    font-weight: bold;
                    border-color: #d81b60;
                }
                
              
                
               
            `;
        document.head.appendChild(style);
        console.log("Essential CSS added for ovulation slides");
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM loaded, initializing ovulation calculator");

    // Add essential CSS first
    addEssentialCSS();

    // Initialize calculator
    initOvulationCalculator();

    // Add event listeners for top navigation arrows
    const leftArrow = document.querySelector('#ovulation-results-modal .left-arrow');
    const rightArrow = document.querySelector('#ovulation-results-modal .right-arrow');

    if (leftArrow) {
        // Remove existing onclick and add new event listener
        leftArrow.removeAttribute('onclick');
        leftArrow.addEventListener('click', goToPreviousOvulationSlide);
    }

    if (rightArrow) {
        // Remove existing onclick and add new event listener
        rightArrow.removeAttribute('onclick');
        rightArrow.addEventListener('click', goToNextOvulationSlide);
    }

    // Remove inline onclick handlers from HTML if they exist
    setTimeout(() => {
        const modal = document.getElementById('ovulation-results-modal');
        if (modal) {
            const arrows = modal.querySelectorAll('[onclick*="OvulationSlide"]');
            arrows.forEach(arrow => {
                arrow.removeAttribute('onclick');
            });
        }
    }, 100);
});

// Make functions globally available
window.initOvulationCalculator = initOvulationCalculator;
window.goToPreviousOvulationSlide = goToPreviousOvulationSlide;
window.goToNextOvulationSlide = goToNextOvulationSlide;
window.goToOvulationSlide = goToOvulationSlide;
