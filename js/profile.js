document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;
    
    // Elementos do DOM
    const profileForm = document.getElementById('profileForm');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePassword = document.getElementById('profilePassword');
    const historyList = document.getElementById('historyList');
    
    // Carregar dados do usuário
    profileName.value = currentUser.name;
    profileEmail.value = currentUser.email;
    
    // Carregar histórico de agendamentos
    loadAppointmentHistory();
    
    // Atualizar perfil
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = profileName.value;
        const email = profileEmail.value;
        const password = profilePassword.value;
        
        // Verificar se o e-mail já está em uso por outro usuário
        if (email !== currentUser.email && users.some(u => u.email === email)) {
            alert('Este e-mail já está cadastrado por outro usuário!');
            return;
        }
        
        // Atualizar usuário
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = name;
            users[userIndex].email = email;
            
            if (password) {
                users[userIndex].password = password;
            }
            
            localStorage.setItem('barbearia_users', JSON.stringify(users));
            
            // Atualizar usuário atual
            currentUser = users[userIndex];
            sessionStorage.setItem('current_user', JSON.stringify(currentUser));
            
            alert('Perfil atualizado com sucesso!');
        }
    });
    
    function loadAppointmentHistory() {
        const userAppointments = appointments
            .filter(app => app.userId === currentUser.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (userAppointments.length === 0) {
            historyList.innerHTML = '<p>Você ainda não possui agendamentos.</p>';
            return;
        }
        
        historyList.innerHTML = '';
        
        userAppointments.forEach(app => {
            const appDate = new Date(app.date);
            const appElement = document.createElement('div');
            appElement.className = 'appointment-item';
            
            appElement.innerHTML = `
                <div class="appointment-info">
                    <span class="appointment-date">${appDate.toLocaleString('pt-BR')}</span>
                    <span class="appointment-status ${app.status}">${app.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}</span>
                </div>
                ${app.status === 'confirmed' ? 
                    `<button class="cancel-appointment" data-id="${app.id}">Cancelar</button>` : ''}
            `;
            
            historyList.appendChild(appElement);
        });
        
        // Adicionar eventos de cancelamento
        document.querySelectorAll('.cancel-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const appointmentId = e.target.getAttribute('data-id');
                cancelAppointment(appointmentId);
            });
        });
    }
    
    function cancelAppointment(appointmentId) {
        if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
        
        const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('barbearia_appointments', JSON.stringify(appointments));
            loadAppointmentHistory();
        }
    }
});