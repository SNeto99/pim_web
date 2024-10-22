class Modal {
    /**
     * Esta classe tem como objetivo facilitar a manipulação de modais simples no DOM.
     *
     * - O Construtor ou o metodo 'setHtml' devem receber o html do modal. Este deve conter um form para que o metodo 'onSubmit' funcione corretamente, retornando em uma função callback um Json com todos os valores dos inputs que estiverem dentro do form.
     *
     *  exemplo de uso:
     *
     *      let modal = new Modal(modalhtml);
     *
     *      modal.render();
     *      modal.onSubmit((response)=>{
     *          console.log(response);
     *      });
     *
     *  -response = json com os nomes dos inputs e seus valores
     *
     * @param {string|null} html - HTML opcional para inicializar o modal.
     */
    constructor(html = null) {
        if (html) {
            this.setHtml(html);
        }
    }

    /**
     * Configura o ID do modal.
     * @param {string} id - ID do modal a ser configurado.
     */
    setId(id) {
        this.idModal = id.startsWith("#") ? id.slice(1) : id;
    }

    /**
     * Retorna o ID do modal.
     * @returns {string} ID do modal.
     */
    getId() {
        return this.idModal;
    }

    /**
     * Define o HTML do modal
     * @param {string} html - HTML para configurar o modal.
     */
    setHtml(html) {
        try {
            this.modal = $(html);
        } catch (error) {
            this.#tratamentoDeErros(error);
            throw new Error(error);
        }

        let id = this.modal.attr("id");

        // console.log(`id: ${id}`);

        if (!id) {
            throw new Error("id do modal não definido");
        }
        this.setId(id);
    }

    /**
     * Adiciona o modal ao corpo do documento HTML.
     */
    append(div_id = null) {
        if (!this.modal) {
            throw new Error("HTML do modal não foi definido");
        }

        try {
            let modalNaTela = $(`#${this.idModal}`);
            modalNaTela.remove();

            $(div_id ?? "body").append(this.modal);

            this.$modalBootstrap = new bootstrap.Modal(
                document.getElementById(this.idModal)
            );
        } catch (error) {
            this.#tratamentoDeErros(error);
            throw new Error(error);
        }
    }

    /**
     * Exibe o modal na tela.
     */
    show() {
        if (!this.$modalBootstrap) {
            throw new Error("modal não está carregado na pagina");
        }

        this.$modalBootstrap.show();
    }

    /**
     * Combinação dos metodos 'append()' e 'show()'
     */
    render(div_id = null) {
        this.append(div_id);
        this.show();
    }

    /**
     * Aceita como parametro uma função para lidar com os dados capturados do envio do formulario (em json)
     *
     *  ex:
     *      onSubmit((response)=>{
     *          console.log(response)
     *      })
     *
     * @param {Function} callBackFunction - Função de callback a ser chamada com os dados do formulário.
     */
    onSubmit(callBackFunction) {
        $(`#${this.idModal} form`).on("submit", (e) => {
            e.preventDefault();

            var formData = $(e.target).serializeArray();

            var dataObj = {};
            $.each(formData, function (index, item) {
                dataObj[item.name] = item.value;
            });

            callBackFunction(dataObj);

            $(`#${this.idModal}`).modal("hide");
        });
    }

    /**
     * Método privado para tratar erros.
     * substitui a '<main>' por um aviso de erro
     * @param {Error} error - Objeto de erro capturado.
     */
    #tratamentoDeErros(error) {
        throw error;
    }
}
