
import nodemailer from 'nodemailer';

const SendEmail = (to, subject, body) => {

    let fecha = new Date()
    const transporder = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html:
            `<div style="background-color: red"> 
                <h1 style="color:white;">${body}</h1>
                <p>ENVIADO, ${fecha.toLocaleDateString('es-CO')}</p>
            </div>`
    }

    transporder.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("ERROR AL ENVIAR EL CORREO", error);
        } else {
            console.log(`CORREO ENVIADO` + info.response);
        }
    })

} 

export {SendEmail} 