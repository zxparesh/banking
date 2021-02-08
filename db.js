var sql = require("mssql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const dbConfig = {
    server: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
}

function executeQuery(query) {
    console.log("executeQuery", query)
    return new Promise((resolve, reject) => {
        sql.connect(dbConfig, (error) => {
            if (error) {
                reject(error);
                console.log("Error connecting to Database!")
            } else {
                var request = new sql.Request();
                request.query(query, (error, resultSet) => {
                    if (error) {
                        reject(error);
                        console.log("Error in query execution...", query)
                    } else {
                        console.log("Query result:", resultSet.recordset);
                        resolve(resultSet.recordset);
                    }
                })
            }
        })
    });
}

module.exports = {
    executeQuery,
}