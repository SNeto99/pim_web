import banco from "../config/dbConnect.js";

class Cart {
    static addItem(userId, productId, quantity) {
        return new Promise((resolve, reject) => {
            if (quantity <= 0) {
                return this.removeItem(userId, productId)
                    .then(() => resolve())
                    .catch(reject);
            }

            const sql = `
                INSERT INTO carrinho (user_id, product_id, quantidade)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantidade = quantidade + ?;
            `;
            banco.query(sql, [userId, productId, quantity, quantity], (err, results) => {
                if (err) {
                    console.error("Erro ao adicionar item ao carrinho:", err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static removeItem(userId, productId) {
        return new Promise((resolve, reject) => {
            const sql = `
                DELETE FROM carrinho WHERE user_id = ? AND product_id = ?;
            `;
            banco.query(sql, [userId, productId], (err, results) => {
                if (err) {
                    console.error("Erro ao remover item do carrinho:", err);
                    reject(err);
                }
                resolve(results.affectedRows);
            });
        });
    }

    static updateQuantity(userId, productId, quantity) {
        return new Promise((resolve, reject) => {
            if (quantity <= 0) {
                return this.removeItem(userId, productId)
                    .then(() => resolve())
                    .catch(reject);
            }

            const sql = `
                UPDATE carrinho SET quantidade = ? WHERE user_id = ? AND product_id = ?;
            `;
            banco.query(sql, [quantity, userId, productId], (err, results) => {
                if (err) {
                    console.error("Erro ao atualizar quantidade do carrinho:", err);
                    reject(err);
                }
                resolve(results.affectedRows);
            });
        });
    }

    static getItems(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT c.product_id, c.quantidade, p.nome, p.preco, p.linkImg
                FROM carrinho c
                JOIN produtos p ON c.product_id = p.id
                WHERE c.user_id = ?;
            `;
            banco.query(sql, [userId], (err, results) => {
                if (err) {
                    console.error("Erro ao obter itens do carrinho:", err);
                    reject(err);
                }
                const items = results.map(item => ({
                    productId: item.product_id,
                    nome: item.nome,
                    preco: item.preco,
                    linkImg: item.linkImg,
                    quantidade: item.quantidade
                }));
                resolve(items);
            });
        });
    }

    static getItemCount(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT SUM(quantidade) as count
                FROM carrinho
                WHERE user_id = ?;
            `;
            banco.query(sql, [userId], (err, results) => {
                if (err) {
                    console.error("Erro ao obter contagem de itens do carrinho:", err);
                    reject(err);
                }
                resolve(results[0].count || 0);
            });
        });
    }

    static clearCart(userId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM carrinho WHERE user_id = ?;`;
            banco.query(sql, [userId], (err, results) => {
                if (err) {
                    console.error("Erro ao limpar carrinho:", err);
                    reject(err);
                }
                resolve(results.affectedRows);
            });
        });
    }

    static mergeLocalCart(userId, localCart) {
        return new Promise(async (resolve, reject) => {
            try {
                for (const item of localCart) {
                    await this.addItem(userId, item.productId, item.quantidade);
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Cart;
