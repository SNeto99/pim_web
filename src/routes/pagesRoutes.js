import express from "express";
import path from "path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





const pagesRoutes = express.Router();



pagesRoutes.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/loja.html"));
});

pagesRoutes.get("/login", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/login.html"));
});

pagesRoutes.get("/cadastro", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/cadastro.html"));
});

pagesRoutes.get("/configs", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/configs.html"));
});

pagesRoutes.get("/carrinho", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../../paginas/carrinho.html"));
});

export default pagesRoutes;
