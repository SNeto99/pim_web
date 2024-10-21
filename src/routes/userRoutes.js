import express from "express";
import UserController from "../controllers/UserController.js";


const userRoutes = express.Router();




userRoutes.get("/getUsers", UserController.getUsers);
userRoutes.get("/getUser/:id", UserController.getUser);
userRoutes.post("/login", UserController.login);
userRoutes.post("/newUser", UserController.newUser);
userRoutes.put("/editUsername/:id", UserController.editUsername);
userRoutes.delete("/deleteUser/:id", UserController.deleteUser);






export default userRoutes