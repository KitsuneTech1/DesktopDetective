// Calendar App - Polished with color-coded categories and better detail view

class CalendarApp {
    constructor(calendarData) {
        this.calendarData = calendarData;
        this.selectedDay = null;
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('calendar', 'Calendar', '📅', html, 800, 550);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    render() {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const eventsByDay = {};

        this.calendarData.events.forEach(event => {
            if (!eventsByDay[event.day]) eventsByDay[event.day] = [];
            eventsByDay[event.day].push(event);
        });

        const startDay = 5; // March 2024 starts on Friday
        const daysInMonth = 31;

        let calendarDays = '';

        // Previous month days
        for (let i = 0; i < startDay; i++) {
            calendarDays += `<div class="calendar-day other-month"><div class="day-number">${28 - startDay + i + 1}</div></div>`;
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = eventsByDay[day] || [];
            calendarDays += `
                <div class="calendar-day ${dayEvents.length > 0 ? 'has-event' : ''}" data-day="${day}">
                    <div class="day-number">${day}</div>
                    <div class="day-events-container">
                        ${dayEvents.map(event => `
                            <div class="calendar-event-pill category-${event.category.toLowerCase()}">
                                ${event.title}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Next month days
        const remaining = 42 - startDay - daysInMonth;
        for (let i = 1; i <= remaining; i++) {
            calendarDays += `<div class="calendar-day other-month"><div class="day-number">${i}</div></div>`;
        }

        return `
            <div class="calendar-container">
                <div class="calendar-main">
                    <div class="calendar-header-bar">
                        <div class="calendar-month-title">${this.calendarData.month}</div>
                        <div class="calendar-legend">
                            <span class="legend-item"><i class="dot work"></i> Work</span>
                            <span class="legend-item"><i class="dot personal"></i> Personal</span>
                            <span class="legend-item"><i class="dot legal"></i> Legal</span>
                        </div>
                    </div>
                    <div class="calendar-grid">
                        ${daysOfWeek.map(d => `<div class="calendar-day-header">${d}</div>`).join('')}
                        ${calendarDays}
                    </div>
                </div>
                <div class="calendar-sidebar">
                    <div class="sidebar-date-header">Select a date</div>
                    <div class="sidebar-events-list">
                        <div class="no-events-placeholder">Click a day to see details</div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents(windowEl) {
        const calendarGrid = windowEl.querySelector('.calendar-grid');

        calendarGrid.addEventListener('click', (e) => {
            const dayCell = e.target.closest('.calendar-day');
            if (!dayCell || dayCell.classList.contains('other-month')) return;

            const day = parseInt(dayCell.dataset.day);
            this.selectedDay = day;

            // Highlight active day
            calendarGrid.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
            dayCell.classList.add('active');

            this.updateSidebar(day, windowEl);
        });
    }

    updateSidebar(day, windowEl) {
        const sidebar = windowEl.querySelector('.calendar-sidebar');
        const header = sidebar.querySelector('.sidebar-date-header');
        const list = sidebar.querySelector('.sidebar-events-list');

        header.textContent = `March ${day}, 2024`;

        const dayEvents = this.calendarData.events.filter(ev => ev.day === day);

        if (dayEvents.length === 0) {
            list.innerHTML = '<div class="no-events-placeholder">No events scheduled</div>';
        } else {
            list.innerHTML = dayEvents.map(event => `
                <div class="sidebar-event-item category-${event.category.toLowerCase()}">
                    <div class="sidebar-event-category">${event.category}</div>
                    <div class="sidebar-event-title">${event.title}</div>
                    <div class="sidebar-event-desc">${event.description}</div>
                </div>
            `).join('');
        }
    }
}
