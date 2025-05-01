import connectionMysql from "../config/database.js";

// Obtener respuesta de la conexion a la base de datos
const getConnection = async () => {
  try {
    const pool = await connectionMysql();
    const ping = await pool.ping();
    if (!ping) {
      return false;
    }
    return pool;
  } catch (error) {
    console.error("\n*****************************");
    console.error("Error conectando la base de datos");
    console.error("*****************************\n");
    return false;
  }
}

export default getConnection;