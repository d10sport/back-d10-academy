import getConnection from "../database/connection.mysql.js";

export const ConexionVerify = async (req, res, next) => {
  const conn = await getConnection();
  if (!conn) {
    console.error("\n*****************************");
    console.error("Error obteniendo los datos");
    console.error("*****************************\n");
    return res.json({
      status: 500,
      message: 'Error obteniendo los datos'
    });
  }
  next()
}