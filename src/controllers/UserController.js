import User from "../models/User.js";

class UserController {
    static getUsers(req, res) {
        User.getUsers()
            .then((results) => res.status(200).json(results))
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static getUser(req, res) {
        const idUser = req.params.id;
        User.getUser(idNota)
            .then((result) =>
                result
                    ? res.status(200).json(result)
                    : res.status(404).json({ message: "Usuário não encontrado" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static login(req, res){

        const login = req.body.userInput;
        const password = req.body.passwordInput;

        console.log(login, password)

        User.login(login, password)
            .then((result) =>{
                console.log(result);

                result.isValid
                    ? res.status(200).json({ status: "ok", id: result.idUser })
                    : res.status(404).json({ message: "Usuário não encontrado" })

            }).catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static newUser(req, res) {
        const { username, email, password } = req.body;

        User.newUser(username, email, password)
            .then((idUser) =>
                res.status(200).json({ status: "ok", id: idUser })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static editUsername(req, res) {
        const idNota = req.params.id;
        const { texto } = req.body;
        User.editUsername(idNota, texto)
            .then((affectedRows) =>
                affectedRows
                    ? res.status(200).json({ status: "ok" })
                    : res.status(404).json({ message: "User não encontrada" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }

    static deleteUser(req, res) {
        const idNota = req.params.id;
        User.deleteUser(idNota)
            .then((affectedRows) =>
                affectedRows
                    ? res.status(200).json({ status: "ok" })
                    : res.status(404).json({ message: "User não encontrada" })
            )
            .catch((error) =>
                res
                    .status(500)
                    .json({ message: `Falha na requisição: ${error.message}` })
            );
    }
}

export default UserController;
