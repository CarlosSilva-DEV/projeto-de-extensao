document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    // Elementos do DOM
    const calendarGrid = document.getElementById('calendarGrid');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    const timeSlots = document.getElementById('timeSlots');
    const selectedDateEl = document.getElementById('selectedDate');
    const confirmBtn = document.getElementById('confirmAppointment');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthEl = document.getElementById('currentMonth');

    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;

    // Inicializa lista de agendamentos
    let appointments = getAppointmentsFromStorage();

    // Inicialização da interface
    init();

    function init() {
        renderCalendar();
        prevMonthBtn.addEventListener('click', () => changeMonth(-1));
        nextMonthBtn.addEventListener('click', () => changeMonth(1));
        confirmBtn.addEventListener('click', confirmAppointment);
        document.getElementById('profileLink').addEventListener('click', e => {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }

    function getAppointmentsFromStorage() {
        return JSON.parse(localStorage.getItem('barbearia_appointments')) || [];
    }

    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        renderCalendar();
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevMonthDays = firstDay.getDay();
        const nextMonthDays = 6 - lastDay.getDay();

        currentMonthEl.textContent = firstDay.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());

        calendarGrid.innerHTML = '';

        renderDayHeaders();

        fillDays(prevMonthDays, -1, year, month);
        fillDays(lastDay.getDate(), 0, year, month);
        fillDays(nextMonthDays, 1, year, month);
    }

    function renderDayHeaders() {
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            const header = document.createElement('div');
            header.className = 'day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });
    }

    function fillDays(count, offset, year, month) {
        const startDay = offset === -1
            ? new Date(year, month, 0).getDate() - count + 1
            : 1;

        for (let i = 0; i < count; i++) {
            const day = startDay + i;
            const date = new Date(year, month + offset, day);
            createDayCell(date, offset !== 0);
        }
    }

    function createDayCell(date, isInactive = false) {
        const dayCell = document.createElement('div');
        dayCell.className = `day-cell ${isInactive ? 'inactive' : ''}`;

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayCell.appendChild(dayNumber);

        if (!isInactive) {
            dayCell.addEventListener('click', () => selectDate(date, dayCell));
        }

        calendarGrid.appendChild(dayCell);
    }

    function selectDate(date, clickedCell) {
        selectedDate = date;
        selectedTime = null;

        document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('selected'));
        clickedCell.classList.add('selected');

        showTimeSlots(date);
    }

    function showTimeSlots(date) {
        // Atualizar agendamentos salvos
        appointments = getAppointmentsFromStorage();

        selectedDateEl.textContent = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).replace(/^\w/, c => c.toUpperCase());

        timeSlots.innerHTML = '';
        confirmBtn.disabled = true;

        for (let hour = 7; hour <= 19; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            const dateTime = new Date(date);
            dateTime.setHours(hour, 0, 0, 0);

            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;

            const isBooked = appointments.some(app =>
                app.status === 'confirmed' &&
                new Date(app.date).getTime() === dateTime.getTime()
            );

            if (isBooked) {
                timeSlot.classList.add('booked');
            } else {
                timeSlot.classList.add('available');
                timeSlot.addEventListener('click', () => selectTime(timeSlot, dateTime));
            }

            timeSlots.appendChild(timeSlot);
        }

        timeSlotsContainer.style.display = 'block';
    }

    function selectTime(timeSlot, dateTime) {
        selectedTime = dateTime;

        document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
        timeSlot.classList.add('selected');
        confirmBtn.disabled = false;
    }

    function confirmAppointment() {
        if (!selectedDate || !selectedTime) return;

        const newAppointment = {
            id: Date.now().toString(),
            userId: currentUser.id,
            date: selectedTime.toISOString(),
            status: 'confirmed'
        };

        appointments.push(newAppointment);
        localStorage.setItem('barbearia_appointments', JSON.stringify(appointments));

        alert(`Agendamento confirmado para ${selectedTime.toLocaleString('pt-BR')}`);
        showTimeSlots(selectedDate); // Recarrega horários atualizados
    }
});