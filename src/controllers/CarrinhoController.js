import Cart from "../models/Cart.js";

class CarrinhoController {
    static addItem(req, res) {
        const { userId, productId, quantidade } = req.body;
        if (!userId || !productId || typeof quantidade !== 'number') {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        Cart.addItem(userId, productId, quantidade)
            .then(() => {
                res.status(200).json({ status: "ok" });
            })
            .catch((error) => {
                console.error(`addItem Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao adicionar item: ${error.message}` });
            });
    }

    static removeItem(req, res) {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        Cart.removeItem(userId, productId)
            .then(() => {
                res.status(200).json({ status: "ok" });
            })
            .catch((error) => {
                console.error(`removeItem Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao remover item: ${error.message}` });
            });
    }

    static updateQuantity(req, res) {
        const { userId, productId, quantidade } = req.body;
        if (!userId || !productId || typeof quantidade !== 'number') {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        Cart.updateQuantity(userId, productId, quantidade)
            .then(() => {
                res.status(200).json({ status: "ok" });
            })
            .catch((error) => {
                console.error(`updateQuantity Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao atualizar quantidade: ${error.message}` });
            });
    }

    static getItems(req, res) {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "ID de usuário é necessário" });
        }

        Cart.getItems(userId)
            .then((items) => {
                res.status(200).json({ items });
            })
            .catch((error) => {
                console.error(`getItems Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao obter itens: ${error.message}` });
            });
    }

    static getItemCount(req, res) {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "ID de usuário é necessário" });
        }

        Cart.getItemCount(userId)
            .then((count) => {
                res.status(200).json({ count });
            })
            .catch((error) => {
                console.error(`getItemCount Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao obter contagem de itens: ${error.message}` });
            });
    }

    static mergeCart(req, res) {
        const { userId, localCart } = req.body;
        if (!userId || !Array.isArray(localCart)) {
            return res.status(400).json({ message: "Dados inválidos" });
        }

        Cart.mergeLocalCart(userId, localCart)
            .then(() => {
                res.status(200).json({ status: "Carrinho sincronizado com sucesso" });
            })
            .catch((error) => {
                console.error(`mergeCart Controller - Erro: ${error.message}`);
                res.status(500).json({ message: `Erro ao sincronizar carrinho: ${error.message}` });
            });
    }
}

export default CarrinhoController;
