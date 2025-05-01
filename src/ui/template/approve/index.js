export const htmlTemplateApproved = (name, username, password, role_user, token) => {
  return `
    <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Registro Aprovado</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }

            .email-register {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .header__email-register {
              background-image: url("https://landing-page-d10.s3.sa-east-1.amazonaws.com/images/fondo_nav.png");
              color: #ffc702;
              text-align: center;
              padding: 20px;
            }

            .header__email-register .title__email-register {
              margin: 0;
              font-size: 24px;
            }

            .content__email-register {
              padding: 20px;
              color: #333333;
            }

            .content__email-register .text__email-register {
              margin: 15px 0;
              line-height: 1.6;
            }

            .button__email-register {
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
              margin: 20px 0;
              font-weight: bold;
            }

            .footer__email-register {
              background-color: #f4f4f4;
              color: #666666;
              text-align: center;
              padding: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="email-register">
            <div class="header__email-register">
              <h1 class="title__email-register">¡Bienvenido, ${name}!</h1>
            </div>
            <div class="content__email-register">
              <p class="text__email-register">
                Gracias por registrarte en nuestra
                plataforma. Estamos encantados de tenerte con nosotros.
              </p>
              <p class="text__email-register">
                A continuación, te compartimos los datos de tu cuenta:
              </p>
              <p class="text__email-register"><b>Usuario: </b>${username}</p>
              <p class="text__email-register"><b>Contraseña: </b>${password}</p>
              <p class="text__email-register">
                Puedes iniciar sesión haciendo clic en el botón de abajo:
              </p>
              <a href="https://academia.d10mas.com/#/login?CwcfFzgQ50HM=${token}" class="button__email-register">Iniciar sesión</a>
              <p class="text__email-register">
                ¡Esperamos que disfrutes de nuestra plataforma y le saques el mayor
                provecho!
              </p>
            </div>
            <div class="footer__email-register">
              &copy; 2025 D10+. Todos los derechos reservados.
            </div>
          </div>
        </body>
      </html>
  `
}
