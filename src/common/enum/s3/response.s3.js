export const responseS3File = {
  success: ({ message = "Éxito", status = 200, url = null }) => ({
    status: status,
    success: true,
    error: false,
    message,
    url
  }),
  error: ({ message = "Error", status = 500, url = null }) => ({
    status: status,
    success: false,
    error: true,
    message,
    url
  })
};