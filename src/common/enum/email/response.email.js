export const responseEmail = {
  success: ({ message = "Éxito",messageId = undefined, mail = undefined }) => ({
    status: 200,
    success: true,
    error: false,
    message,
    messageId,
    mail
  }),
  error: ({ message = "Error", messageId = undefined, mail = undefined }) => ({
    status: 500,
    success: false,
    error: true,
    messageId,
    message,
    mail
  })
};