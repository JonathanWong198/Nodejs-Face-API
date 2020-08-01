const Pool = require("pg").Pool;


// Configuration 
const pool = new Pool({
    user : "postgres", 
    password : "LetMeIn",
    host : "localhost",
    port : 5432, 
    database : "selfiedata"
});

module.exports = pool; 