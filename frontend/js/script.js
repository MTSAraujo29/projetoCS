function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

function openLogin() {
    window.location.href = '/smartutilities/login';
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/smartutilities';
}

function openConteudo() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/smartutilities/login';
        return;
    }
    window.location.href = '/smartutilities/conteudo';
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function voltarInicio() {
    window.location.href = '/smartutilities';
}

// Função para verificar se usuário está logado e gerenciar botão de conteúdo
function updateNavButtons() {
    const token = localStorage.getItem('token');
    const navButtons = document.querySelector('.nav-buttons');
    const assinarButton = document.querySelector('.assinar-button');

    navButtons.innerHTML = '';

    if (token) {
        navButtons.innerHTML = `
            <button onclick="openConteudo()">Conteúdo</button>
            <button onclick="scrollToSection('sobre')">Sobre</button>
            <button onclick="scrollToSection('assinatura')">Assinatura</button>
            <button onclick="logout()">Sair</button>
        `;
        if (assinarButton) {
            assinarButton.textContent = 'Assinar Agora';
        }
    } else {
        navButtons.innerHTML = `
            <button onclick="scrollToSection('sobre')">Sobre</button>
            <button onclick="scrollToSection('assinatura')">Assinatura</button>
            <button onclick="openLogin()">Login</button>
        `;
        if (assinarButton) {
            assinarButton.textContent = 'Faça Login para Assinar';
        }
    }
}

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', updateNavButtons);

// Inicialize o Stripe
const stripe = Stripe('pk_live_51QgTXDG1FvoiJ1rioJp8pc9UcPAvyZLj0FRLRcNpfFY8s3wMvzBcspEHa6ESGLtIqY5nbIwAhtw7Bg3l20uzASZ500ytv9lwY6');

async function handleCheckout() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/smartutilities/login';
            return;
        }

        console.log('Iniciando checkout...');

        const response = await fetch('/smartutilities/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Resposta do servidor:', response.status);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.details || data.error || 'Erro no servidor');
        }

        if (data.url) {
            console.log('Redirecionando para:', data.url);
            window.location.href = data.url;
        } else {
            throw new Error('URL de checkout não recebida');
        }
    } catch (error) {
        console.error('Erro detalhado:', error);
        if (error.message === 'Token não fornecido' || error.message === 'Token inválido') {
            window.location.href = '/smartutilities/login';
        } else {
            alert('Erro ao processar pagamento: ' + error.message);
        }
    }
}

// Adicione o evento quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector('.assinar-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});