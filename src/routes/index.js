import express from "express";
import userRoutes from "./userRoutes.js";
import productsRoutes from "./productsRoutes.js";
import fornecedoresRoutes from "./fornecedoresRoutes.js";
import pagesRoutes from "./pagesRoutes.js" 
import cartRoutes from "./cartRoutes.js"; 


const routes = (app) => {

    if (process.env.ENVIRONMENT == "dev") app.use(express.static("paginas"));

    app.get("/hello", (req, res) => {
        res.status(200).send("Hello World!!!");
    });

    app.use("/", express.json(), pagesRoutes);
    app.use("/products", express.json(), productsRoutes);
    app.use("/fornecedores", express.json(), fornecedoresRoutes);
    app.use("/users", express.json(), userRoutes);
    app.use("/cart", express.json(), cartRoutes);

};

export default routes;