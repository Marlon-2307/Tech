// ============================================
// ANIMACIÓN DE CONTADORES EN HERO
// ============================================
function animarContadores() {
    const counters = document.querySelectorAll('.counter');
    const velocidad = 2000; // 2 segundos para completar la animación
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animado')) {
                const target = parseInt(entry.target.dataset.target);
                const incremento = target / (velocidad / 50);
                let valor = 0;
                
                entry.target.classList.add('animado');
                
                const intervalo = setInterval(() => {
                    valor += incremento;
                    if (valor >= target) {
                        entry.target.textContent = target;
                        clearInterval(intervalo);
                    } else {
                        entry.target.textContent = Math.floor(valor);
                    }
                }, 50);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animarContadores);
} else {
    animarContadores();
}

// ============================================
// CONFIGURACIÓN
// ============================================
// Configuración de WhatsApp y Correo
const CONFIG = {
    whatsappNumber: '1234567890', // Número de WhatsApp sin el + al inicio
    companyEmail: 'info@techrepair.com', // Correo de la empresa
    emailService: 'https://formspree.io/f/xyzabc123', // Reemplaza con tu formulario de Formspree o similar
};

// Función para enviar WhatsApp
function enviarWhatsApp(tipo) {
    let mensaje = '';
    
    if (tipo === 'movil') {
        mensaje = 'Hola, me gustaría solicitar un servicio de reparación o mantenimiento para mi dispositivo móvil. ¿Cuáles son los pasos a seguir?';
    } else if (tipo === 'pc') {
        mensaje = 'Hola, me gustaría solicitar un servicio de reparación o mantenimiento para mi laptop/PC. ¿Cuáles son los pasos a seguir?';
    }

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear enlace de WhatsApp
    const enlaceWhatsApp = `https://wa.me/${CONFIG.whatsappNumber}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp
    window.open(enlaceWhatsApp, '_blank');
}

// Validar formulario
function validarFormulario(datos) {
    const errores = [];

    if (!datos.nombre.trim()) {
        errores.push('El nombre es requerido');
    }

    if (!datos.email.trim() || !isValidEmail(datos.email)) {
        errores.push('El correo electrónico es inválido');
    }

    if (!datos.telefono.trim()) {
        errores.push('El teléfono es requerido');
    }

    if (!datos['tipo-dispositivo']) {
        errores.push('Selecciona un tipo de dispositivo');
    }

    if (!datos['tipo-servicio']) {
        errores.push('Selecciona un tipo de servicio');
    }

    if (!datos.descripcion.trim()) {
        errores.push('La descripción del problema es requerida');
    }

    return errores;
}

// Validar email
function isValidEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

// Formatear datos para envío
function formatearDatos(datos) {
    return {
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        dispositivo: datos['tipo-dispositivo'],
        servicio: datos['tipo-servicio'],
        descripcion: datos.descripcion,
        presupuesto: datos.presupuesto || 'No especificado',
        fecha: new Date().toLocaleString('es-ES')
    };
}

// Crear contenido del email
function crearContenidoEmail(datos) {
    return `
Nuevo solicitud de servicio de TechRepair
========================================

INFORMACIÓN DEL CLIENTE:
- Nombre: ${datos.nombre}
- Correo: ${datos.email}
- Teléfono: ${datos.telefono}

DETALLES DEL SERVICIO:
- Tipo de Dispositivo: ${datos.dispositivo}
- Tipo de Servicio: ${datos.servicio}
- Presupuesto: ${datos.presupuesto}

DESCRIPCIÓN DEL PROBLEMA:
${datos.descripcion}

Fecha de solicitud: ${datos.fecha}

---
Esta es una solicitud automática desde el formulario de contacto de TechRepair.
Responda directamente al correo de la persona interesada.
    `;
}

// Enviar email usando EmailJS (alternativa: Formspree, Nodemailer, etc.)
async function enviarPorCorreo(datos) {
    try {
        // Opción 1: Usando Fetch API con un servicio backend
        // Descomenta y configura según tu preferencia
        
        /*
        const response = await fetch('/api/enviar-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: CONFIG.companyEmail,
                cc: datos.email,
                subject: `Nueva solicitud de servicio - ${datos.nombre}`,
                html: crearContenidoEmail(datos)
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar el email');
        }
        */

        // Opción 2: Usando Formspree (servicio gratuito)
        // Primero crea una cuenta en https://formspree.io/ y obtén tu endpoint
        const formspreeEndpoint = 'https://formspree.io/f/xyzabc123'; // Reemplaza con tu ID

        const response = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: datos.nombre,
                email: datos.email,
                telefono: datos.telefono,
                dispositivo: datos.dispositivo,
                servicio: datos.servicio,
                presupuesto: datos.presupuesto,
                descripcion: datos.descripcion,
                mensaje: crearContenidoEmail(datos)
            })
        });

        if (response.ok) {
            return { success: true, message: 'Correo enviado exitosamente' };
        } else {
            return { success: false, message: 'Error al enviar el correo' };
        }

    } catch (error) {
        console.error('Error:', error);
        return { success: false, message: 'Error de conexión al enviar el correo' };
    }
}

// Manejar envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioContacto');
    const estatus = document.getElementById('formularioEstatus');

    if (formulario) {
        formulario.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Obtener datos del formulario
            const formData = new FormData(formulario);
            const datos = Object.fromEntries(formData);

            // Validar datos
            const errores = validarFormulario(datos);

            if (errores.length > 0) {
                mostrarEstatus('error', 'Por favor corrige los siguientes errores:\n' + errores.join('\n'));
                return;
            }

            // Mostrar estado de carga
            mostrarEstatus('info', 'Enviando solicitud...');

            // Formatear datos
            const datosFormateados = formatearDatos(datos);

            // Enviar correo
            const resultado = await enviarPorCorreo(datosFormateados);

            if (resultado.success) {
                mostrarEstatus('success', '✓ Solicitud enviada exitosamente. Te contactaremos pronto.');
                formulario.reset();
                
                // Limpiar mensaje después de 5 segundos
                setTimeout(() => {
                    estatus.textContent = '';
                    estatus.classList.remove('success', 'error', 'info');
                }, 5000);
            } else {
                mostrarEstatus('error', '✗ ' + resultado.message + '\n\nIntenta de nuevo más tarde.');
            }
        });
    }
});

// Función para mostrar estatus
function mostrarEstatus(tipo, mensaje) {
    const estatus = document.getElementById('formularioEstatus');
    estatus.textContent = mensaje;
    estatus.className = `formulario-estatus ${tipo}`;
    estatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Suavizar scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animar elementos cuando aparecen en pantalla (opcional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar tarjetas de servicios y ventajas
document.querySelectorAll('.servicio-card, .ventaja-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// FUNCIONALIDAD DE FAQ (Preguntas Frecuentes)
// ============================================
function inicializarFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Cerrar todas las preguntas excepto la actual
            faqItems.forEach(otroItem => {
                if (otroItem !== item) {
                    otroItem.classList.remove('active');
                }
            });
            
            // Toggle la pregunta actual
            item.classList.toggle('active');
        });
    });
}

// Animación de fade-in-up
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .formulario-estatus.info {
        background-color: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
        display: block;
    }
`;
document.head.appendChild(style);

// Funciones de utilidad para debugging
console.log('Landing page cargada correctamente');
console.log('WhatsApp Number:', CONFIG.whatsappNumber);
console.log('Company Email:', CONFIG.companyEmail);

// Inicializar FAQ cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFAQ);
} else {
    inicializarFAQ();
}
