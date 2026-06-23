// ==========================================================================
// 1. CORAÇÕES INTERATIVOS
// ==========================================================================
const botoesCoracao = document.querySelectorAll('.btn-coracao');
const mensagens = {
    dourado: document.getElementById('mensagem-dourado'),
    preto: document.getElementById('mensagem-preto'),
    vermelho: document.getElementById('mensagem-vermelho'),
    branco: document.getElementById('mensagem-branco'),
    verde: document.getElementById('mensagem-verde')
};

Object.values(mensagens).forEach(msg => msg.classList.remove('visivel'));

botoesCoracao.forEach(botao => {
    botao.addEventListener('click', () => {
        const cor = botao.dataset.cor;
        
        botoesCoracao.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        
        Object.values(mensagens).forEach(msg => msg.classList.remove('visivel'));
        
        if (mensagens[cor]) {
            mensagens[cor].classList.add('visivel');
        }
    });

    botao.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            botao.click();
        }
    });
});

// Mostra a primeira mensagem automaticamente
setTimeout(() => {
    document.querySelector('.btn-coracao.dourado').click();
}, 500);

// ==========================================================================
// 2. MENU MOBILE
// ==========================================================================
const btnMenu = document.getElementById('btn-menu');
const menuPrincipal = document.getElementById('menu-principal');
const header = document.getElementById('header');

function toggleMenu() {
    const isOpen = menuPrincipal.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', isOpen);
    btnMenu.innerHTML = isOpen ? '<i class="fa-solid fa-times"></i>' : '<i class="fa-solid fa-bars"></i>';
}

btnMenu.addEventListener('click', toggleMenu);

document.querySelectorAll('.nav-link, .btn-ChamaFesta').forEach(l => {
    l.addEventListener('click', () => {
        if (menuPrincipal.classList.contains('aberto')) toggleMenu();
    });
});

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ==========================================================================
// 3. CONTADORES
// ==========================================================================
function animarPlaca(id, alvo) {
    let elemento = document.getElementById(id);
    if (!elemento) return;
    let atual = 0;
    let passo = Math.max(1, alvo / 30);
    let rodar = setInterval(() => {
        atual += passo;
        if(atual >= alvo) {
            elemento.textContent = "+" + alvo;
            clearInterval(rodar);
        } else {
            elemento.textContent = "+" + Math.ceil(atual);
        }
    }, 40);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.contado) {
            entry.target.dataset.contado = 'true';
            animarPlaca('num1', 1000);
            animarPlaca('num2', 150);
            animarPlaca('num3', 50);
        }
    });
}, { threshold: 0.3 });

const placas = document.querySelector('.placas-gincana');
if (placas) observer.observe(placas);

// ==========================================================================
// 4. TICKETS DE DOAÇÃO
// ==========================================================================
const tickets = document.querySelectorAll('.btn-ticket-valor');
const btnDoar = document.getElementById('btn-doacao-ludica');

tickets.forEach(ticket => {
    ticket.addEventListener('click', () => {
        tickets.forEach(t => {
            t.classList.remove('ativo');
            t.setAttribute('aria-checked', 'false');
        });
        ticket.classList.add('ativo');
        ticket.setAttribute('aria-checked', 'true');
    });
});

// ==========================================================================
// 5. FORMULÁRIO
// ==========================================================================
const form = document.getElementById('formulario-fofo');
const btnEnviar = document.getElementById('btn-enviar');
const btnTexto = document.getElementById('btn-texto');
const spinner = document.getElementById('spinner');
const notificacao = document.getElementById('notificacao');
const fecharNotif = document.getElementById('fechar-notificacao');

// Máscara de telefone
const zapInput = document.getElementById('zap');
function mascaraTelefone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 2) return '(' + value;
    if (value.length <= 6) return '(' + value.slice(0, 2) + ') ' + value.slice(2);
    if (value.length <= 10) return '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
    return '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
}

if (zapInput) {
    zapInput.addEventListener('input', (e) => {
        e.target.value = mascaraTelefone(e.target.value);
    });
}

// Validação
function validarCampo(input, erroId, validator) {
    const erro = document.getElementById(erroId);
    const isValid = validator(input.value);
    input.classList.toggle('error', !isValid);
    if (erro) erro.classList.toggle('visible', !isValid);
    return isValid;
}

const validadores = {
    nome: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    zap: (v) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v),
    festa: (v) => v !== '',
    texto: (v) => v.trim().length >= 5
};

document.querySelectorAll('.campo-fofo').forEach(input => {
    input.addEventListener('blur', () => {
        const id = input.id;
        const erroId = `erro-${id}`;
        if (validadores[id]) {
            validarCampo(input, erroId, validadores[id]);
        }
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let valido = true;
    document.querySelectorAll('.campo-fofo').forEach(campo => {
        const id = campo.id;
        const erroId = `erro-${id}`;
        if (validadores[id]) {
            const isValid = validarCampo(campo, erroId, validadores[id]);
            if (!isValid) valido = false;
        }
    });

    if (!valido) return;

    btnEnviar.disabled = true;
    btnTexto.style.display = 'none';
    spinner.classList.add('visible');

    await new Promise(resolve => setTimeout(resolve, 2000));

    btnEnviar.disabled = false;
    btnTexto.style.display = 'inline';
    spinner.classList.remove('visible');

    notificacao.classList.add('visible');
    form.reset();
    document.querySelectorAll('.campo-fofo.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.mensagem-erro.visible').forEach(el => el.classList.remove('visible'));
});

fecharNotif.addEventListener('click', () => notificacao.classList.remove('visible'));
setTimeout(() => notificacao.classList.remove('visible'), 8000);