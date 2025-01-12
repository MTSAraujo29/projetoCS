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
    window.location.href = '/smartutilities/conteudo';
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para verificar se usuário está logado e gerenciar botão de conteúdo
function updateNavButtons() {
    const token = localStorage.getItem('token');
    const navButtons = document.querySelector('.nav-buttons');

    // Limpa todos os botões existentes
    navButtons.innerHTML = '';

    if (token) {
        // Se estiver logado, mostra Conteúdo, Sobre, Assinatura e Logout
        navButtons.innerHTML = `
            <button onclick="openConteudo()">Conteúdo</button>
            <button onclick="scrollToSection('sobre')">Sobre</button>
            <button onclick="scrollToSection('assinatura')">Assinatura</button>
            <button onclick="logout()">Sair</button>
        `;
    } else {
        // Se não estiver logado, mostra apenas Sobre, Assinatura e Login
        navButtons.innerHTML = `
            <button onclick="scrollToSection('sobre')">Sobre</button>
            <button onclick="scrollToSection('assinatura')">Assinatura</button>
            <button onclick="openLogin()">Login</button>
        `;
    }
}

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', updateNavButtons);