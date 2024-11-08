import Products from "../models/Products.js";

class ProductsController {
    static getProducts(req, res) {
        Products.getProducts()
            .then((results) => {

                const response = {
                    error:false,
                    produtos: results
                }

                res.status(200).json(response)
            })
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static getProduct(req, res) {
        const idProduto = req.params.id;
        Products.getProduct(idProduto)
            .then((result) =>
                result
                    ? res.status(200).json(result)
                    : res.status(404).json({ message: "Produto não encontrado" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }


    static newProduct(req, res) {
        const { nome, qnt, descricao, linkImg, preco } = req.body;

        console.log(nome, qnt, descricao, linkImg, preco);
        
        Products.newProduct(nome, qnt, descricao, linkImg, preco)
            .then((idProduto) =>
                res.status(200).json({ status: "ok", idProduto: idProduto })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static editProduct(req, res) {
        const idProduto = req.params.id;
        const { nome, qnt, descricao, linkImg, preco } = req.body;

        Products.editProduct(idProduto, nome, qnt, descricao, linkImg, preco)
            .then((affectedRows) => {
                affectedRows
                ? res.status(200).json({ status: "ok" })
                : res.status(404).json({ message: "Produto não encontrado" })
            })
            .catch((error) => {
                res
                .status(500)
                .json({ message: `Falha na requisição: ${error.message}` })
            });
    }

    static deleteProduct(req, res) {
        const idProduto = req.params.id;
        Products.deleteProduct(idProduto)
            .then((affectedRows) =>
                affectedRows
                    ? res.status(200).json({ status: "ok" })
                    : res.status(404).json({ message: "Produto não encontrado" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }
}

export default ProductsController;
