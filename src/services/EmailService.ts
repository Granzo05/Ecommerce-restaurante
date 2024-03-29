import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "pediloyaContact@gmail.com",
        pass: 'pediloya123456789'
    }
});

export function enviarCorreoRechazo(emailCliente: string, motivoRechazo: string) {
    const mailOptions = {
        from: "pediloyaContact@gmail.com",
        to: emailCliente,
        subject: 'Rechazo de Pedido',
        text: `Lamentablemente, su pedido ha sido rechazado. \nMotivo: ${motivoRechazo}`
    };

    transporter.sendMail(mailOptions, (error: Error, info: string) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info);
        }
    });
}  

export function enviarCorreoExitoso(emailCliente: string) {
    const mailOptions = {
        from: "pediloyaContact@gmail.com",
        to: emailCliente,
        subject: 'Pedido aceptado',
        text: `El restaurante aceptó el pedido`
    };

    transporter.sendMail(mailOptions, (error: Error, info: string) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado: ' + info);
        }
    });
}