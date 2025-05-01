import mysql2 from 'mysql2';

// Connects to the Mysql database
const connectionMysql = async () => {
  try {
    const connection = await mysql2.createConnection({
      host: process.env.MYSQL_HOST || '',
      user: process.env.MYSQL_USER || '',
      port: process.env.MYSQL_PORT || '',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || ''
    }).promise();
    return connection;
  } catch (error) {
    console.error("Error conectando a MySQL:", error);
  }
}

export default connectionMysql;

