import express from "express";
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





const appRoutes = express.Router();



appRoutes.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/loja.html"));
});

appRoutes.get("/login", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/login.html"));
});

appRoutes.get("/cadastro", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/cadastro.html"));
});

appRoutes.get("/configs", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/configs.html"));
});

export default appRoutes;
