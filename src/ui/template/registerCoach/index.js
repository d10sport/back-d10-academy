export const htmlTemplateRegisterCoach = (name) => {
  return `
    <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content__email-approve="width=device-width, initial-scale=1.0"
          />
          <title>¡Registro realizado</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f3f4f6;
            }

            .email-approve {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .header__email-approve {
              background-image: url("https://landing-page-d10.s3.sa-east-1.amazonaws.com/images/fondo_nav.png");
              color: #ffc702;
              text-align: center;
              padding: 20px;
            }

            .header__email-approve .title__email-approve {
              margin: 0;
              font-size: 26px;
            }

            .content__email-approve {
              padding: 20px;
              color: #444444;
              text-align: left;
            }
            .content__email-approve .text__email-approve {
              margin: 15px 0;
              line-height: 1.6;
            }

            .button__email-approve {
              display: inline-block;
              background: linear-gradient(
                135deg,
                rgba(24, 24, 24, 1) 0%,
                rgba(61, 61, 61, 1) 100%
              );
              color: #ffc702 !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin-top: 20px;
              font-weight: bold;
            }

            .footer__email-approve {
              background-color: #f3f4f6;
              color: #777777;
              text-align: center;
              padding: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="email-approve">
            <div class="header__email-approve">
              <h1 class="title__email-approve">¡Tu registro ha sido realizado!</h1>
            </div>
            <div class="content__email-approve">
              <p class="text__email-approve">Hola <b>${name}</b>,</p>
              <p class="text__email-approve">
                ¡Felicitaciones! Nos complace informarte que tu registro fue realizado
                correctamente. Ahora debes esperar que tu club complete la solicitud y
                seras completamente bienvenido a nuestro sitio web. Una vez esto se
                haga correctamente se te avisara nuevamente por correo. ¡Quédate
                atento!
              </p>
              <p class="text__email-approve">
                Si tienes alguna pregunta o necesitas asistencia, no dudes en
                contactarnos. ¡Estamos aquí para ayudarte!
              </p>
              <a class="button__email-approve">Contactar Soporte</a>
            </div>
            <div class="footer__email-approve">
              &copy; 2025 D10+. Todos los derechos reservados.
            </div>
          </div>
        </body>
      </html>
  `
}
