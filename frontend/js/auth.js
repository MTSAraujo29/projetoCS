const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

function toggleForms() {
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    errorMessage.textContent = '';
}

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    try {
        const response = await fetch('/smartutilities/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/smartutilities';
        } else {
            errorMessage.textContent = data.error;
        }
    } catch (error) {
        errorMessage.textContent = 'Erro ao fazer login';
    }
});

registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    try {
        const response = await fetch('/smartutilities/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = '/smartutilities';
        } else {
            errorMessage.textContent = data.error || 'Erro ao cadastrar usuário';
        }
    } catch (error) {
        errorMessage.textContent = 'Erro ao fazer cadastro';
    }
});