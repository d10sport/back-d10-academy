import connectionMysql from "../config/database.js";

let pool = null;

const getConnection = async () => {
  try {
    if (pool) return pool; // Reusar la conexión existente

    pool = await connectionMysql(); // Solo se ejecuta una vez
    const ping = await pool.ping();
    if (!ping) {
      pool = null;
      return false;
    }
    return pool;
  } catch (error) {
    console.error("\n*****************************");
    console.error("Error conectando la base de datos");
    console.error("*****************************\n");
    console.log("");
    console.error(error);
    console.log("");
    pool = null;
    return false;
  }
};

export default getConnection;