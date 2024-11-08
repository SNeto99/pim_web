import express from "express";
import CarrinhoController from "../controllers/CarrinhoController.js";

const cartRoutes = express.Router();

cartRoutes.post("/addItem", CarrinhoController.addItem);
cartRoutes.delete("/removeItem", CarrinhoController.removeItem);
cartRoutes.put("/updateQuantity", CarrinhoController.updateQuantity);
cartRoutes.get("/getItems/:userId", CarrinhoController.getItems);
cartRoutes.get("/getItemCount/:userId", CarrinhoController.getItemCount);
cartRoutes.post("/mergeCart", CarrinhoController.mergeCart);

export default cartRoutes;
