// Funções de navegação e interatividade
document.addEventListener('DOMContentLoaded', function() {
    // Animações de scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll para links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.padding = '1rem 0';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.padding = '1.5rem 0';
        }
        
        lastScroll = currentScroll;
    });

    // Parallax effect para hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-bg');
        const speed = 0.5;
        
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Counter animation para números
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Observar cards flutuantes para animação de counter
    const floatingCards = document.querySelectorAll('.floating-card');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.querySelector('span').textContent;
                if (text.includes('95%')) {
                    animateCounter(entry.target.querySelector('span'), 0, 95, 2000);
                }
            }
        });
    }, { threshold: 0.5 });

    floatingCards.forEach(card => {
        counterObserver.observe(card);
    });
});

// Funções de navegação
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funções de ação
// Funções de ação
function downloadArticle() {
    // Simular download do artigo
    const link = document.createElement('a');
    link.href = '#download';
    link.download = 'IA-Saude-Publica-Artigo-Klaus.pdf';
    link.click();
    
    // Mostrar mensagem de sucesso
    showNotification('📄 Download iniciado! Seu artigo está sendo baixado.', 'success');
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_article', {
            'article_title': 'IA na Saúde Pública',
            'author': 'Klaus'
        });
    }
}

function subscribeNewsletter() {
    const email = prompt('📧 Digite seu e-mail para ser notificado sobre novos conteúdos:');
    
    if (email && email.includes('@')) {
        showNotification(`✅ Inscrição confirmada! Você receberá notificações em ${email}`, 'success');
        
        // Simular envio para newsletter
        setTimeout(() => {
            showNotification('📧 Verifique seu e-mail para confirmar a inscrição!', 'info');
        }, 2000);
    } else if (email) {
        showNotification('❌ Por favor, insira um e-mail válido.', 'error');
    }
}

function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: 'IA na Saúde Pública: Transformando Diagnósticos e Tratamentos',
            text: 'Descubra como a Inteligência Artificial está revolucionando a saúde pública!',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('IA na Saúde Pública: Transformando Diagnósticos e Tratamentos');
        const text = encodeURIComponent('Descubra como a Inteligência Artificial está revolucionando a saúde pública!');
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        
        // Mostrar opções de compartilhamento
        const choice = confirm('Escolha onde compartilhar:\n\n📱 Twitter\n💼 LinkedIn\n\nClique OK para Twitter ou Cancelar para LinkedIn');
        
        if (choice) {
            window.open(twitterUrl, '_blank');
        } else {
            window.open(linkedinUrl, '_blank');
        }
    }
}

function citeArticle() {
    const citation = `Klaus. (2024). Como a Inteligência Artificial está transformando diagnósticos e tratamentos na saúde pública. 
Instituição de Ensino. Disponível em: ${window.location.href}`;
    
    // Copiar para clipboard
    navigator.clipboard.writeText(citation).then(() => {
        showNotification('📋 Citação copiada para a área de transferência!', 'success');
    }).catch(() => {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 Citação copiada para a área de transferência!', 'success');
    });
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                transform: translateX(400px);
                transition: all 0.3s ease;
                max-width: 350px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Mostrar animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Adicionar listener para quando o vídeo terminar
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.main-video');
    const overlay = document.querySelector('.video-overlay');
    
    if (video && overlay) {
        video.addEventListener('ended', function() {
            overlay.style.display = 'flex';
        });
        
        video.addEventListener('pause', function() {
            if (video.currentTime > 0) {
                overlay.style.display = 'flex';
            }
        });
    }
});

// Efeito de digitação para título (opcional)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Loading animation para video placeholder
document.addEventListener('DOMContentLoaded', function() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            this.innerHTML = `
                <div class="video-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Preparando vídeo institucional...</p>
                </div>
            `;
            
            // Simular carregamento
            setTimeout(() => {
                this.innerHTML = `
                    <div class="video-ready">
                        <i class="fas fa-video"></i>
                        <h3>Vídeo Disponível em Breve!</h3>
                        <p>Estamos preparando conteúdo exclusivo sobre IA na saúde pública.</p>
                        <button class="btn btn-primary" onclick="subscribeNewsletter()">
                            <i class="fas fa-bell"></i>
                            Ser Notificado
                        </button>
                    </div>
                `;
            }, 2000);
        });
    }
});