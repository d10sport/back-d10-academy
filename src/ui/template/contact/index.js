export const htmlTemplateContact = (name, email, message) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registro Denegado</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
          }

          .email-contact {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .header__email-contact {
            background-color: #000000;
            color: white;
            text-align: center;
            padding: 20px;
          }

          .header__email-contact .title__email-contact {
            margin: 0;
            font-size: 24px;
          }

          .content__email-contact {
            padding: 20px;
            color: #444444;
            text-align: left;
          }

          .content__email-contact .text__email-contact {
            margin: 15px 0;
            line-height: 1.6;
          }

          .footer__email-contact {
            background-color: #f8f9fa;
            color: #777777;
            text-align: center;
            padding: 10px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="email-contact">
          <div class="header__email-contact">
            <h1 class="title__email-contact">Contacto</h1>
          </div>
          <div class="content__email-contact">
            <p class="text__email-contact">
              Has recibido un nuevo mensaje desde tu sitio web <b>D10</b>,
            </p>
            <p class="text__email-contact"><b>Nombre del usuario: </b>${name}</p>
            <p class="text__email-contact"><b>Correo electrónico: </b>${email}</p>
            <p class="text__email-contact"><b>Mensaje: </b>${message}</p>
          </div>
          <div class="footer__email-contact">
            &copy; 2025 D10+. Todos los derechos reservados.
          </div>
        </div>
      </body>
    </html>
  `
}
