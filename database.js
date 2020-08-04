// const Pool = require("pg").Pool;
const Client = require('pg').Client;


// Configuration 
// const pool = new Pool({
//     connectionString : process.env.DATABASE_URL || "postgresql://postgres:LetMeIn@localhost:5432/selfiedata",
//     ssl: process.env.DATABASE_URL ? true : false
// });


const client = new Client({
    connectionString : process.env.DATABASE_URL || "postgresql://postgres:LetMeIn@localhost:5432/selfiedata",
    ssl: process.env.DATABASE_URL ? true : false
});


module.exports = client; 
