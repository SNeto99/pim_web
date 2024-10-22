import express from "express";
import ProductsController from "../controllers/ProductsController.js";


const productsRoutes = express.Router();




productsRoutes.get("/getProducts", ProductsController.getProducts);
productsRoutes.get("/getProduct/:id", ProductsController.getProduct);
productsRoutes.post("/newProduct", ProductsController.newProduct);
productsRoutes.put("/editProduct/:id", ProductsController.editProduct);
productsRoutes.delete("/deleteProduct/:id", ProductsController.deleteProduct);






export default productsRoutes