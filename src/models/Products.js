import { response } from "express";
import banco from "../config/dbConnect.js";

class Products {
    static getProducts() {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM produtos",
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

    static newProduct(nome, qnt = 0, linkImg = null) {
        return new Promise((resolve, reject) => {
            banco.query(
                "INSERT INTO produtos (nome, quantidade, linkImg) VALUES (?, ?, ?)",
                [nome, qnt, linkImg],
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

    static editProduct(id, nome, qnt, linkImg) {
        return new Promise((resolve, reject) => {
            
            const columns = [
                { name: "nome", value: nome },
                { name: "quantidade", value: qnt },
                { name: "linkImg", value: linkImg },
            ].filter((col) => col.value != null); 

            
            if (columns.length === 0) {
                return reject(new Error("Nenhum dado a ser atualizado."));
            }

            
            const colsAtualizar = columns
                .map((col) => `${col.name} = ?`)
                .join(", ");

            
            const values = columns.map((col) => col.value);

            
            const sql = `
            UPDATE 
                produtos 
            SET 
                ${colsAtualizar} 
            WHERE 
                id = ?
        `;

            
            values.push(id);

            
            banco.query(sql, values, (err, results, fields) => {
                if (err) {
                    console.error("Erro ao atualizar dados:", err);
                    reject(err);
                }
                resolve(results.affectedRows);
            });
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
