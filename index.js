import express from "express";
import routes from "./src/routes/index.js";
import "dotenv/config";
import cors from "cors";


const PORT = process.env.PORT;

const app = express();

if (process.env.ENVIRONMENT == "dev")
{
    app.use(
        cors({
            origin: ["http://127.0.0.1:5500", "http://localhost:3005"],
        })
    );
}

app.use(express.json());


routes(app);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Escutando na porta ${PORT}`);
});
