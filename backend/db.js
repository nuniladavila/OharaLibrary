// Azure SQL connection setup
const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');

async function connectToAzureSql() {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken('https://database.windows.net/.default');

    const config = {
      server: process.env.AZURE_SQL_SERVER,
      database: process.env.AZURE_SQL_DATABASE,
      authentication: {
        type: "azure-active-directory-access-token",
        options: {
          token: tokenResponse.token
        }
      },
      options: {
        encrypt: true
      }
    };

    await sql.connect(config);
    return true;
  } catch (err) {
    console.error('Azure SQL connection error:', err);
    return false;
  }
}

async function getBooksFromDb() {
  try {
    console.log("Fetching books from Azure SQL...");
    // Ensure connection is established
    await connectToAzureSql();

    // Query all books
    const result = await sql.query('SELECT * FROM [dbo].[Books]');
    return result.recordset;
  } catch (err) {
    console.error('Azure SQL query error:', err);
    return null;
  }
}

module.exports = { getBooksFromDb, connectToAzureSql };
