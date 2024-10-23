import { response } from "express";
import banco from "../config/dbConnect.js";

class Fornecedores {
    static getFornecedores() {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM fornecedores ORDER BY id DESC",
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
    
    static getFornecedor(id) {
        return new Promise((resolve, reject) => {
            banco.query(
                "SELECT * FROM fornecedores WHERE id = ?",
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
    
    static newFornecedor(nome, telefone = null, email = null, site = null) {
        return new Promise((resolve, reject) => {
            banco.query(
                "INSERT INTO fornecedores (nome, telefone, email, site) VALUES (?, ?, ?, ?)",
                [nome, telefone, email, site],
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
    
    static editFornecedor(id, nome = null, telefone = null, email = null, site = null) {
        return new Promise((resolve, reject) => {
            
            const columns = [
                { name: "nome", value: nome },
                { name: "telefone", value: telefone },
                { name: "email", value: email },
                { name: "site", value: site },
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
                fornecedores 
            SET 
                ${colsAtualizar} 
            WHERE 
                id = ?
            LIMIT 1
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
    
    static deleteFornecedor(id) {
        return new Promise((resolve, reject) => {
            banco.query(
                "DELETE FROM fornecedores WHERE id = ? LIMIT 1",
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

export default Fornecedores;
