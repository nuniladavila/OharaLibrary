// Azure SQL connection setup
const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');

async function connectToAzureSql() {
  try {
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken('https://database.windows.net/.default');

    const config = {
      server: process.env.AZURE_SQL_SERVER || 'your-server.database.windows.net',
      database: process.env.AZURE_SQL_DATABASE || 'your-database',
      authentication: {
        type: 'azure-active-directory-access-token',
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
  // Return mock list of 5 books

}

module.exports = { getBooksFromDb, connectToAzureSql };
