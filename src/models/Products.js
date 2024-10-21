import { response } from "express";
import banco from "../config/dbConnect.js";

class Products {
    static getProducts() {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM produtos ORDER BY nome",
                (err, results, fields) => {
                    if (err) {
                        console.error("Erro ao consultar banco de dados:", err);
                        reject(err);
                    }
                    resolve(results);
                }
            );
        });
    }

    static getProduct(id) {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM produtos WHERE id = ?",
                [id],
                (err, results, fields) => {
                    if (err) {
                        console.error("Erro ao consultar banco de dados:", err);
                        reject(err);
                    }
                    resolve(results.length ? results[0] : null);
                }
            );
        });
    }

    static newProduct(nome, qnt, linkImg = null) {
        return new Promise((resolve, reject) => {
            banco.query(
                "INSERT INTO produtos (nome, qnt) VALUES (?, ?)",
                [nome, qnt],
                (err, results, fields) => {
                    if (err) {
                        console.error("Erro ao inserir dados:", err);
                        reject(err);
                    }
                    resolve(results.insertId);
                }
            );
        });
    }

    static editProductname(id, nome) {
        return new Promise((resolve, reject) => {
            banco.query(
                "UPDATE produtos SET nome = ? WHERE id = ?",
                [nome, id],
                (err, results, fields) => {
                    if (err) {
                        console.error("Erro ao atualizar dados:", err);
                        reject(err);
                    }
                    resolve(results.affectedRows);
                }
            );
        });
    }

    static deleteProduct(id) {
        return new Promise((resolve, reject) => {
            banco.query(
                "DELETE FROM produtos WHERE id = ? LIMIT 1",
                [id],
                (err, results, fields) => {
                    if (err) {
                        console.error("Erro ao deletar dados:", err);
                        reject(err);
                    }
                    resolve(results.affectedRows);
                }
            );
        });
    }
}

export default Products;
