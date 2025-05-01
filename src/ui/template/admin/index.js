export const htmlTemplateAdmin = (club, name, email, rol, token) => {
  return `
    <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Registro Admin</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f8f9fa;
            }

            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .header {
              background-image: url("https://landing-page-d10.s3.sa-east-1.amazonaws.com/images/fondo_nav.png");
              color: #ffc702;
              text-align: center;
              padding: 20px;
            }

            .header h1 {
              margin: 0;
              font-size: 24px;
            }

            .content {
              padding: 20px;
              color: #444444;
              text-align: left;
            }

            .content p {
              margin: 15px 0;
              line-height: 1.6;
            }

            .button {
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

            .footer {
              background-color: #f8f9fa;
              color: #777777;
              text-align: center;
              padding: 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Solicitud de ingreso</h1>
            </div>
            <div class="content">
              <p>Hola <b>${club}</b>,</p>
              <p>
                Te informamos que hay un entrenador de tu club que desea ingresar a la
                plataforma, su información es la siguiente:
              </p>
              <ul>
                <li>
                  <p><b>Nombre: </b>${name}</p>
                </li>
                <li>
                  <p><b>Email: </b>${email}</p>
                </li>
                <li>
                  <p><b>Rol: </b>${rol}</p>
                </li>
              </ul>
              <p>
                Recuerda que, si confirmas que el usuario <b>SÍ</b> pertenece al club,
                Sele dara acceso a la plataform y esto permitirá redirigir al usuario
                al siguiente paso. En caso de que determines que el usuario <b>NO</b>
                corresponde al club, ka solicitud sera denegada y se le notificara
                al usuario para finalizar el proceso.
              </p>
              <div>
                <a href="https://academia.d10mas.com/#/club/solitudes?CwcfFzgQ50HM=${token}" class="button"
                  >Lista de usuarios</a
                >
              </div>
            </div>
            <div class="footer">
              &copy; 2025 D10+. Todos los derechos reservados.
            </div>
          </div>
        </body>
      </html>

  `
}
