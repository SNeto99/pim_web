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
        const productId = req.params.id;
        Products.getProduct(productId)
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
        const { nome, qnt } = req.body;

        Products.newProduct(nome, qnt)
            .then((productId) =>
                res.status(200).json({ status: "ok", productId: productId })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static editProductname(req, res) {
        const productId = req.params.id;
        const { nome } = req.body;
        Products.editProductname(idNota, texto)
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
        const productId = req.params.id;
        Products.deleteProduct(productId)
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
