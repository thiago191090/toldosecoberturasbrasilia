// Ativar menu mobile
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em um link (mobile)
const links = document.querySelectorAll('.nav-links li a');
links.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Rolagem suave para as seções (Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Lógica do Slider Automático
const slides = document.querySelectorAll('.slider-backgrounds .slide');
let currentSlide = 0;
const slideInterval = 4000; // Tempo de cada slide em milissegundos (4 segundos)

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length > 0) {
    setInterval(nextSlide, slideInterval);
}

// Animação de entrada suave dos Produtos (Fade-in e Slide-up)
const observerOptions = {
    threshold: 0.1 // A animação dispara quando 10% do card aparece na tela
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Adiciona a classe 'show' que faz o card aparecer
            entry.target.classList.add('show');
            
            // Faz a animação acontecer apenas uma vez (para não piscar ao subir e descer a página)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Pega todos os cards de produtos e começa a observar o scroll
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    observer.observe(card);
});

// ==========================================
// Slider Escuro de Portfólio (Auto-Scroll)
// ==========================================
const portfolioTrack = document.querySelector('.portfolio-track');
let isHovered = false;

if (portfolioTrack) {
    // Pausa o carrossel se o mouse estiver em cima
    portfolioTrack.addEventListener('mouseenter', () => isHovered = true);
    portfolioTrack.addEventListener('mouseleave', () => isHovered = false);

    // Pausa também se o usuário tocar na tela do celular
    portfolioTrack.addEventListener('touchstart', () => isHovered = true);
    portfolioTrack.addEventListener('touchend', () => {
        setTimeout(() => isHovered = false, 1500); // Volta a rodar 1.5s após o toque
    });

    // Função que desliza a barra 1 pixel por vez
    setInterval(() => {
        if (!isHovered) {
            portfolioTrack.scrollLeft += 1;
            
            // Se chegar no final da rolagem, volta para o começo de forma invisível
            if (portfolioTrack.scrollLeft >= (portfolioTrack.scrollWidth - portfolioTrack.clientWidth - 1)) {
                portfolioTrack.scrollLeft = 0;
            }
        }
    }, 25); // Velocidade do carrossel (quanto menor o número, mais rápido)
}
// ==========================================
// Formulário de orçamento (envio por e-mail via FormSubmit)
// ==========================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit');
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        statusEl.className = 'form-status';
        statusEl.textContent = '';
        try {
            const resp = await fetch(contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            });
            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || String(data.success) === 'false') throw new Error(data.message || 'erro');
            contactForm.reset();
            statusEl.classList.add('ok');
            statusEl.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
            if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: 'formulario' });
        } catch (err) {
            statusEl.classList.add('erro');
            statusEl.textContent = 'Não foi possível enviar agora. Chame a gente no WhatsApp: (61) 98143-4486.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar por E-mail';
        }
    });
}
