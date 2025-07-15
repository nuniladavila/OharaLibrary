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

    console.log("Was able to connect to Azure SQL");

    await sql.connect(config);
    return true;
  } catch (err) {
    console.log("Error connecting to Azure SQL", err);
    console.warn("Error connecting to Azure SQL", err);
    console.error('Azure SQL connection error:', err);
    return false;
  }
}

async function getBooksFromDb() {
  try {
    console.log("Fetching books from Azure SQL...");
    // Ensure connection is established
    const connected = await connectToAzureSql();
    if (!connected) {
      throw new Error('Failed to connect to Azure SQL');
    }
    console.log("Connected to Azure SQL, querying books...");
    // Query all books
    const result = await sql.query('SELECT * FROM [dbo].[Books]');
    return result.recordset;
  } catch (err) {
    console.log("Error querying books from Azure SQL", err);
    console.warn("Error querying books from Azure SQL", err);
    console.error('Azure SQL query error:', err);
    // Return error object for controller to handle
    return { error: err.message || 'Azure SQL query error', details: err };
  }
}

module.exports = { getBooksFromDb, connectToAzureSql };
