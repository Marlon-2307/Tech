
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'tu_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'tu_contraseña_app'
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

app.post('/api/enviar-email', async (req, res) => {
    try {
        const { to, cc, subject, html } = req.body;

        // Validar datos
        if (!to || !subject || !html) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }

        // Opciones de correo
        const mailOptions = {
            from: process.env.EMAIL_USER || 'info@techrepair.com',
            to: to,
            cc: cc || null,
            subject: subject,
            html: html,
            replyTo: cc || null
        };

        // Enviar correo
        const info = await transporter.sendMail(mailOptions);

        console.log('Correo enviado:', info.response);

        res.json({
            success: true,
            message: 'Correo enviado exitosamente',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error al enviar correo:', error);

        res.status(500).json({
            success: false,
            message: 'Error al enviar el correo: ' + error.message
        });
    }
});

/**
 * Endpoint para verificar que el servidor está funcionando
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor TechRepair funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

/**
 * Endpoint para recibir datos del formulario (opcional, para logging)
 */
app.post('/api/contacto', async (req, res) => {
    try {
        const datos = req.body;

        console.log('Nueva solicitud de contacto:', datos);

        // Aquí podrías guardar en base de datos
        // await guardarEnBD(datos);

        // Enviar correo a la empresa
        const htmlEmpresa = `
            <h2>Nueva Solicitud de Servicio</h2>
            <p><strong>Cliente:</strong> ${datos.nombre}</p>
            <p><strong>Email:</strong> ${datos.email}</p>
            <p><strong>Teléfono:</strong> ${datos.telefono}</p>
            <p><strong>Dispositivo:</strong> ${datos.dispositivo}</p>
            <p><strong>Servicio:</strong> ${datos.servicio}</p>
            <p><strong>Presupuesto:</strong> ${datos.presupuesto || 'No especificado'}</p>
            <h3>Descripción:</h3>
            <p>${datos.descripcion.replace(/\n/g, '<br>')}</p>
            <p><small>Fecha: ${new Date().toLocaleString('es-ES')}</small></p>
        `;

        // Enviar correo de confirmación al cliente
        const htmlCliente = `
            <h2>¡Gracias por contactarnos!</h2>
            <p>Hola ${datos.nombre},</p>
            <p>Hemos recibido tu solicitud de servicio correctamente.</p>
            <p>Nos pondremos en contacto contigo en las próximas 24 horas.</p>
            <hr>
            <p><strong>Detalles de tu solicitud:</strong></p>
            <ul>
                <li>Dispositivo: ${datos.dispositivo}</li>
                <li>Servicio: ${datos.servicio}</li>
                <li>Descripción: ${datos.descripcion}</li>
            </ul>
            <hr>
            <p>También puedes contactarnos por WhatsApp para consultas rápidas.</p>
            <p>¡Gracias!</p>
        `;

        // Enviar a la empresa
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.COMPANY_EMAIL || 'info@techrepair.com',
            subject: `Nueva solicitud de servicio - ${datos.nombre}`,
            html: htmlEmpresa
        });

        // Enviar confirmación al cliente
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: datos.email,
            subject: 'Solicitud de servicio recibida - TechRepair',
            html: htmlCliente
        });

        res.json({
            success: true,
            message: 'Solicitud recibida. Verifica tu correo de confirmación.'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud'
        });
    }
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ═══════════════════════════════════════════════════════
    🔧 TechRepair Server
    ═══════════════════════════════════════════════════════
    📍 Servidor corriendo en http://localhost:${PORT}
    📧 Email configurado: ${process.env.EMAIL_USER || 'No configurado'}
    🏢 Email empresa: ${process.env.COMPANY_EMAIL || 'info@techrepair.com'}
    ═══════════════════════════════════════════════════════
    
    Endpoints disponibles:
    - GET  / → Cargar página principal
    - GET  /api/health → Estado del servidor
    - POST /api/enviar-email → Enviar correo personalizado
    - POST /api/contacto → Procesar formulario de contacto
    
    Presiona CTRL+C para detener el servidor
    ═══════════════════════════════════════════════════════
    `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo no manejado en:', promise, 'razón:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    process.exit(1);
});
