import mysql from "mysql";
import "dotenv/config";

const host = process.env.DATABASE_HOST
const user = process.env.DATABASE_USER
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

const dadosBanco = {
    host: host,
    user: user,
    password: password,
    database: database,
    
    connectionLimit: 10,
};

    const banco = mysql.createPool(dadosBanco);
    
    banco.on("connection", function (connection) {
        console.log("Conectado ao banco de dados MySQL!");
    });

    banco.on("error", function (err) {
        console.error("Erro ao conectar: " + err.message);
        return;
    });

    
    
    export default banco;