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
    if (err.stack) console.error('Stack:', err.stack);
    if (err.code) console.error('Code:', err.code);
    if (err.name) console.error('Name:', err.name);
    return {
      error: err.message || 'Azure SQL connection error',
      stack: err.stack,
      code: err.code,
      name: err.name,
      details: err
    };
  }
}

async function getBooksFromDb() {
  try {
    const connectionResult = await connectToAzureSql();
    if (connectionResult !== true) {
      // If connectToAzureSql returned an error object, return it
      return connectionResult;
    }

    console.log("Connected to Azure SQL, querying books...");
    // Query all books
    const result = await sql.query('SELECT * FROM [dbo].[Books]');
    return result.recordset;

  } catch (err) {
    if (err.stack) console.error('Stack:', err.stack);
    if (err.code) console.error('Code:', err.code);
    if (err.name) console.error('Name:', err.name);
    // Return full error object
    return {
      error: err.message || 'Azure SQL query error',
      stack: err.stack,
      code: err.code,
      name: err.name,
      details: err
    };
  }
}

module.exports = { getBooksFromDb, connectToAzureSql };
