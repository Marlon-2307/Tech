# 🔧 Tech - Landing Page de Servicios Técnicos

Landing page profesional para servicios de reparación y mantenimiento de móviles, laptops y PCs con formulario de contacto integrado.

## 📋 Características

✅ **Diseño Responsivo** - Optimizado para escritorio, tablet y móvil
✅ **Formulario de Contacto** - Con validación completa
✅ **Integración WhatsApp** - Botones predefinidos con mensajes automáticos
✅ **Envío de Correos** - Notificaciones automáticas
✅ **Animaciones Suaves** - Transiciones profesionales
✅ **Sección de Servicios** - Móviles, Laptops y PCs
✅ **Información de Contacto** - Teléfono, email, ubicación
✅ **Ventajas Destacadas** - Por qué elegir nuestro servicio
✅ **Iconos Profesionales** - Font Awesome integrado
✅ **Footer con Redes Sociales** - Enlaces a redes sociales

---

## 📁 Estructura de Archivos

```
Services/
├── index.html          # Archivo HTML principal
├── styles.css          # Estilos CSS (responsive)
├── script.js           # JavaScript con funcionalidades
└── README.md           # Este archivo
```

---

## 🚀 Cómo Usar

### 1. **Abrir localmente**

- Abre `index.html` en tu navegador web
- O copia todos los archivos a un servidor web

### 2. **Configurar WhatsApp**

En `script.js`, busca la sección de configuración:

```javascript
const CONFIG = {
  whatsappNumber: "3006052169", 
  companyEmail: "marloncolon23@gmail.com",
  emailService: "https://formspree.io/f/xyzabc123",
};
```

#### **Opción A: Formspree (Recomendado - Gratuito)**

1. Ve a https://formspree.io/
2. Crea una cuenta
3. Crea un formulario nuevo
4. Copia tu endpoint (ej: `https://formspree.io/f/xyzabc123`)
5. En `script.js`, línea ~80, reemplaza el endpoint:
   ```javascript
   const formspreeEndpoint = "https://formspree.io/f/xyzabc123";
   ```

#### **Opción B: Backend Propio (Node.js + Nodemailer)**

1. Descomenta la sección de Fetch API en `script.js`
2. Crea un endpoint `/api/enviar-email` en tu servidor
3. Implementa el envío con Nodemailer o similar

#### **Opción C: EmailJS**

1. Ve a https://www.emailjs.com/
2. Crea una cuenta y obtén tu Service ID
3. Integra EmailJS en el HTML:
   ```html
   <script
     type="text/javascript"
     src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js"
   ></script>
   ```

---

## ⚙️ Personalización

### Cambiar Colores

En `styles.css`, modifica las variables CSS:

```css
:root {
  --color-primary: #007bff; /* Azul principal */
  --color-secondary: #28a745; /* Verde secundario */
  --color-whatsapp: #25d366; /* Verde WhatsApp */
  /* ... más colores */
}
```

### Cambiar Información de Contacto

En `index.html`, busca la sección "Contáctanos" y actualiza:

- Teléfono
- Email
- Dirección

### Cambiar Servicios

Modifica las tarjetas en la sección de servicios con tus propios servicios.

### Cambiar Texto y Descripciones

Edita directamente en `index.html` el contenido que desees.


**¡Gracias por usar Tech** 🚀
