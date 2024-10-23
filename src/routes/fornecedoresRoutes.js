import express from "express";
import FornecedoresController from "../controllers/FornecedoresController.js";


const fornecedoresRoutes = express.Router();




fornecedoresRoutes.get("/getFornecedores", FornecedoresController.getFornecedores);
fornecedoresRoutes.get("/getFornecedor/:id", FornecedoresController.getFornecedor);
fornecedoresRoutes.post("/newFornecedor", FornecedoresController.newFornecedor);
fornecedoresRoutes.put("/editFornecedor/:id", FornecedoresController.editFornecedor);
fornecedoresRoutes.delete("/deleteFornecedor/:id", FornecedoresController.deleteFornecedor);


    



export default fornecedoresRoutes