// Simulação de banco de dados
let users = JSON.parse(localStorage.getItem('barbearia_users')) || [];
let appointments = JSON.parse(localStorage.getItem('barbearia_appointments')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('current_user')) || null;

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutLink = document.getElementById('logoutLink');

// Verificar se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('appointments.html') || 
        window.location.pathname.includes('profile.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
});

// Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            sessionStorage.setItem('current_user', JSON.stringify(user));
            window.location.href = 'appointments.html';
        } else {
            alert('E-mail ou senha incorretos!');
        }
    });
}

// Registro
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        // Verificar se o usuário já existe
        if (users.some(u => u.email === email)) {
            alert('Este e-mail já está cadastrado!');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };
        
        users.push(newUser);
        localStorage.setItem('barbearia_users', JSON.stringify(users));
        
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        document.getElementById('signIn').click();
    });
}

// Logout
if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('current_user');
        currentUser = null;
        window.location.href = 'index.html';
    });
}