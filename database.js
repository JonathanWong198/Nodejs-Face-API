const Pool = require("pg").Pool;


// Configuration 
const pool = new Pool({
    // user : "postgres", 
    // password : "LetMeIn",
    // host : "localhost",
    // port : 5432, 
    // database : "selfiedata"
    connectionString : process.env.DATABASE_URL
});

module.exports = pool; 