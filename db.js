const { Client } = require('pg');
dotenv.config();

const port = process.env.PORT || 3000;
 let dbClient = new Client({
     user: process.env.USER,
     host: process.env.HOST,
     database: process.env.DATABASE,
     password: process.env.PASSWORD,
     port: process.env.DBPORT
 });
//開発環境用DB
/*
let dbClient = new Client({
    user: process.env.DEVELOPMENTUSER,
    host: process.env.DEVELOPMENTHOST,
    database: process.env.DEVELOPMENTDATABASE,
    password: process.env.DEVELOPMENTPASSWORD,
    port: process.env.DEVELOPMENTDBPORT
});
*/

dbClient.connect().then(() => console.log('DB Connected successfully'));

/*
dbClient.query(query, (err, res) => {
    console.log(err, res);
});
*/
/*
  dbClient.end();
*/
