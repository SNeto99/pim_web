import { response } from "express";
import banco from "../config/dbConnect.js";

class Products {
    static getProducts() {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM produtos ORDER BY id DESC",
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
    
    static newProduct(nome, qnt, descricao, linkImg, preco) {
        return new Promise((resolve, reject) => {
            banco.query(
                "INSERT INTO produtos (nome, quantidade, descricao, linkImg, preco) VALUES (?, ?, ?, ?, ?)",
                [nome, qnt, descricao, linkImg, preco],
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
    
    static editProduct(id, nome, qnt, descricao, linkImg, preco) {
        return new Promise((resolve, reject) => {
            // Converter e validar os dados
            const precoNumerico = preco !== undefined ? parseFloat(preco) : null;
            const quantidadeNumerica = qnt !== undefined ? parseInt(qnt) : null;
            
            // Query SQL direta com todos os campos
            const sql = `
                UPDATE produtos 
                SET 
                    nome = ?,
                    quantidade = ?,
                    descricao = ?,
                    linkImg = ?,
                    preco = ?
                WHERE id = ?
            `;
            
            // Array de valores na ordem correta
            const values = [
                nome || null,
                quantidadeNumerica,
                descricao || null,
                linkImg || null,
                precoNumerico,
                id
            ];

            // Debug para verificar os valores
            console.log('Valores sendo atualizados:', {
                nome: nome || null,
                quantidade: quantidadeNumerica,
                descricao: descricao || null,
                linkImg: linkImg || null,
                preco: precoNumerico,
                id: id
            });
            
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
