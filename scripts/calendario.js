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
    
    // Inicializar calendário
    renderCalendar();
    
    // Navegação do mês
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Renderizar calendário
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        currentMonthEl.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        }).replace(/^\w/, c => c.toUpperCase());
        
        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1);
        // Último dia do mês
        const lastDay = new Date(year, month + 1, 0);
        // Dias do mês anterior para completar a semana
        const prevMonthDays = firstDay.getDay();
        // Dias do próximo mês para completar a semana
        const nextMonthDays = 6 - lastDay.getDay();
        // Total de dias para exibir
        const totalDays = prevMonthDays + lastDay.getDate() + nextMonthDays;
        
        calendarGrid.innerHTML = '';
        
        // Cabeçalhos dos dias da semana
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);
            createDayCell(date, true);
        }
        
        // Dias do mês atual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            createDayCell(date);
        }
        
        // Dias do próximo mês
        for (let day = 1; day <= nextMonthDays; day++) {
            const date = new Date(year, month + 1, day);
            createDayCell(date, true);
        }
    }
    
    function createDayCell(date, isInactive = false) {
        const dayCell = document.createElement('div');
        dayCell.className = day-cell ${isInactive ? 'inactive' : ''};
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayCell.appendChild(dayNumber);
        
        if (!isInactive) {
            dayCell.addEventListener('click', () => selectDate(date));
        }
        
        calendarGrid.appendChild(dayCell);
    }
    
    function selectDate(date) {
        selectedDate = date;
        selectedTime = null;
        
        // Atualizar seleção visual
        document.querySelectorAll('.day-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        event.target.classList.add('selected');
        
        // Mostrar horários disponíveis
        showTimeSlots(date);
    }
    
    function showTimeSlots(date) {
        selectedDateEl.textContent = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).replace(/^\w/, c => c.toUpperCase());
        
        timeSlots.innerHTML = '';
        
        // Gerar horários das 07:00 às 19:00
        for (let hour = 7; hour <= 19; hour++) {
            const time = ${hour.toString().padStart(2, '0')}:00;
            const dateTime = new Date(date);
            dateTime.setHours(hour, 0, 0, 0);
            
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            
            // Verificar se o horário está disponível
            const isBooked = agendamentos.some(app => {
                const appDate = new Date(app.date);
                return appDate.getTime() === dateTime.getTime();
            });
            
            if (isBooked) {
                timeSlot.classList.add('booked');
            } else {
                timeSlot.classList.add('available');
                timeSlot.addEventListener('click', () => selectTime(timeSlot, time, dateTime));
            }
            
            timeSlots.appendChild(timeSlot);
        }
        
        timeSlotsContainer.style.display = 'block';
        confirmBtn.disabled = true;
    }
    
    function selectTime(timeSlot, time, dateTime) {
        selectedTime = dateTime;
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        timeSlot.classList.add('selected');
        confirmBtn.disabled = false;
    }
    
    confirmBtn.addEventListener('click', () => {
        if (!selectedDate || !selectedTime) return;
        
        const newAppointment = {
            id: Date.now().toString(),
            userId: currentUser.id,
            date: selectedTime.toISOString(),
            status: 'confirmed'
        };
        
        agendamentos.push(newAppointment);
        localStorage.setItem('barbearia_appointments', JSON.stringify(agendamentos));
        
        alert(Agendamento confirmado para ${selectedTime.toLocaleString('pt-BR')});
        showTimeSlots(selectedDate);
    });
    
    // Link para o perfil
    document.getElementById('profileLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'profile.html';
    });
});