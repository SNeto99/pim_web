
$(document).ready(async () => {
    // Carrega os produtos antes de montar a tabela e adicionar ao DOM
    await carregarProdutos();
});

async function carregarProdutos() {
    try {
        // Faz a requisição AJAX para obter os produtos
        const response = await $.ajax({
            type: "GET",
            url: `${host}/products/getProducts`,
            dataType: "json",
        });

        console.log(response);

        if (!response.error) {
            // Inicializa a tabela com os dados recebidos
            dataTable_produtos(response.produtos);
        } else {
            console.error("Erro na resposta: ", response.message);
        }
    } catch (error) {
        console.error("Erro ao carregar produtos: ", error);
        $("#principal").html(
            $(`
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Produtos não Encontrados</h4>
                <p>Se voce está vendo essa mensagem, por favor entre em contato com o suporte</p>
                <hr />
                <p class="mb-0"><a href="mailto:suporte@urbanFarm.com">suporte@urbanFarm.com</a></p>
            </div>
        `)
        );
    }
}

function dataTable_produtos(produtos) {
    // Cria o HTML da tabela
    let tabelaHtml = /*html*/ `
        <table id="table-produtos" class="display">
            <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>
                        <span class="full-label">Quantidade</span>
                        <span class="mobile-label">Qntd</span>
                    </th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
            
    `;

    // Adiciona o HTML da tabela ao container principal antes de inicializar o DataTable
    $("#div-tabela-produtos").html(tabelaHtml);

    const isMobile = window.innerWidth <= 768;

    // Inicializa o DataTable com os produtos
    $("#table-produtos").DataTable({
        data: produtos,
        responsive: true,
        paging: !isMobile,
        scrollY: isMobile ? "400px" : false,
        scrollCollapse: isMobile,
        info: !isMobile,
        language: {
            url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json", // URL para o arquivo de tradução para português
        },
        columns: [
            {
                data: "linkImg", // Supondo que exista uma propriedade 'imagem' nos produtos
                render: function (data) {
                    return `<img src="${data}" alt="Imagem do Produto" style="width: 50px; height: 50px;">`;
                },
            },
            { data: "nome" },
            { data: "quantidade" },
            {
                data: null,
                orderable: false,
                render: function () {
                    return /*html*/ `
                        <button class='btn m-1 btn-sm btn-warning btn-editar'>
                            <span class='fa fa-pen'></span>
                            <span class="full-label"> Editar</span>
                        </button>
                        <button class='btn m-1 btn-sm btn-danger btn-deletar'>
                            <span class='fa fa-trash'></span>
                            <span class="full-label"> Deletar</span>
                        </button>
                    `;
                },
            },
        ],
    });

    // Delegação de eventos para os botões de editar e deletar
    $("#div-tabela-produtos").on("click", ".btn-editar", function () {
        const data = $("#table-produtos")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
        editarProduto(data);
    });

    $("#div-tabela-produtos").on("click", ".btn-deletar", function () {
        const data = $("#table-produtos")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
        deletarProduto(data);
    });
}

function editarProduto(produto) {
    // Lógica para editar o produto
    console.log("Editar produto:", produto);
    abrirModalProduto(produto);
}

function deletarProduto(produto) {
    // Lógica para deletar o produto
    console.log("Deletar produto:", produto);
}

// Função para abrir o modal e preencher os dados
function abrirModalProduto(produto = {}) {
    // Se o produto estiver vazio, estamos adicionando um novo item
    const isEdit = produto && produto.id;

    // Ajustar o título do modal
    const modalTitle = isEdit ? "Editar Produto" : "Adicionar Produto";
    $("#modalProdutoLabel").text(modalTitle);

    // Preencher os campos do modal
    $("#produtoId").val(produto.id || "");
    $("#produtoNome").val(produto.nome || "");
    $("#produtoQuantidade").val(produto.quantidade || "");
    $("#produtoLinkImg").val(produto.linkImg || "");

    // Exibir o modal
    const modal = new bootstrap.Modal(document.getElementById("modalProduto"));
    modal.show();
}

// Evento de clique para salvar o produto
$("#salvarProduto").on("click", function () {
    const produto = {
        idProduto: $("#produtoId").val(),
        nome: $("#produtoNome").val(),
        qnt: $("#produtoQuantidade").val(),
        linkImg: $("#produtoLinkImg").val(),
    };

    let type = "";
    let url = "";
    if (produto.id) {
        type = "PUT";
        url = `${host}/products/editProductName/${produto.id}`;
    } else {
        type = "POST";
        url = `${host}/products/newProduct`;
    }
    $.ajax({
        type: type,
        url: url,
        data: produto,
        dataType: "json",
    })
        .done(function (response) {
            console.log(response);
            alert("foi");
        })
        .fail(function (error) {
            console.error(error);
        });
    console.log("Produto atualizado:", produto);

    // Fechar o modal após salvar
    $("#modalProduto").modal("hide");
});
