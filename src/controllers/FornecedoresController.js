import Fornecedores from "../models/Fornecedores.js";

class FornecedoresController {
    static getFornecedores(req, res) {
        Fornecedores.getFornecedores()
            .then((results) => {

                const response = {
                    error:false,
                    fornecedores: results
                }

                res.status(200).json(response)
            })
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static getFornecedor(req, res) {
        const idFornecedor = req.params.id;
        Fornecedores.getFornecedor(idFornecedor)
            .then((result) =>
                result
                    ? res.status(200).json(result)
                    : res.status(404).json({ message: "Fornecedor não encontrado" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }


    static newFornecedor(req, res) {
        const { nome, telefone, email, site } = req.body;

        Fornecedores.newFornecedor(nome, telefone, email, site)
            .then((idFornecedor) =>
                res.status(200).json({ status: "ok", idFornecedor: idFornecedor })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static editFornecedor(req, res) {
        const idFornecedor = req.params.id;
        const { nome, telefone, email, site } = req.body;

        Fornecedores.editFornecedor(idFornecedor, nome, telefone, email, site)
            .then((affectedRows) => {
                affectedRows
                ? res.status(200).json({ status: "ok" })
                : res.status(404).json({ message: "Fornecedor não encontrado" })
            })
            .catch((error) => {
                res
                .status(500)
                .json({ message: `Falha na requisição: ${error.message}` })
            });
    }

    static deleteFornecedor(req, res) {
        const idFornecedor = req.params.id;
        Fornecedores.deleteFornecedor(idFornecedor)
            .then((affectedRows) =>
                affectedRows
                    ? res.status(200).json({ status: "ok" })
                    : res.status(404).json({ message: "Fornecedor não encontrado" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }
}

export default FornecedoresController;
