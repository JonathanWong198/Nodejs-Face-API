const Pool = require("pg").Pool;
const pg = require('pg');


// Configuration 
const pool = new Pool({
    // user : "postgres", 
    // password : "LetMeIn",
    // host : "localhost",
    // port : 5432, 
    // database : "selfiedata"
    connectionString : process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? true : false
});

module.exports = pool; 