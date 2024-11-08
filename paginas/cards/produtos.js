$(document).ready(async () => {
    // Carrega os produtos antes de montar a tabela e adicionar ao DOM
    await carregarProdutos();
});

async function carregarProdutos() {
    // Mostra o loading
    Swal.fire({
        title: 'Carregando produtos...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        // Faz a requisição AJAX para obter os produtos
        const response = await $.ajax({
            type: "GET",
            url: `${host}/products/getProducts`,
            dataType: "json",
        });

        // Fecha o loading
        Swal.close();

        console.log(response);

        if (!response.error) {
            // Inicializa a tabela com os dados recebidos
            dataTable_produtos(response.produtos);
        } else {
            console.error("Erro na resposta: ", response.message);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao carregar produtos'
            });
        }
    } catch (error) {
        console.error("Erro ao carregar produtos: ", error);
        
        // Fecha o loading e mostra erro
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Não foi possível carregar os produtos'
        });

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
    let tabelaHtml = /*html*/ `
        <table id="table-produtos" class="display">
            <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Preço</th>
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

    $("#div-tabela-produtos").html(tabelaHtml);

    const isMobile = window.innerWidth <= 768;

    $("#table-produtos").DataTable({
        data: produtos,
        responsive: true,
        paging: !isMobile,
        scrollY: isMobile ? "400px" : false,
        scrollCollapse: isMobile,
        info: !isMobile,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json",
        },
        columns: [
            {
                data: "linkImg",
                orderable: false,
                render: function (data) {
                    return data
                        ? `<img src="${data}" alt="Imagem do Produto" style="width: 50px; height: 50px;">`
                        : `<span class="fa-regular fa-image fa-xl" style="padding-left:12px"></span>`;
                },
            },
            { 
                data: null,
                render: function(data) {
                    const temDescricao = data.descricao && data.descricao.trim() !== '';
                    return /*html*/`
                        ${data.nome}
                        <i class="fas fa-info-circle ms-2" 
                           style="cursor: ${temDescricao ? 'pointer' : 'not-allowed'}; opacity: ${temDescricao ? '1' : '0.5'};"
                           ${temDescricao ? `onclick="mostrarDescricao('${data.nome}', '${data.descricao.replace(/'/g, "\\'")}')"` : ''}
                        ></i>
                    `;
                }
            },
            { 
                data: "preco",
                render: function(data) {
                    return data ? `R$ ${parseFloat(data).toFixed(2).replace('.', ',')}` : '-';
                }
            },
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
    console.log(produto);
    Swal.fire({
        title: `Voce tem certeza que deseja deletar este item?`,
        text: "Essa ação não é reversivel",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Deletar",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "DELETE",
                url: `${host}/products/deleteProduct/${produto.id}`,
                contentType: "application/json",
            })
                .done(function (response) {
                    console.log(response);
                    carregarProdutos();
                })
                .fail(function (error) {
                    console.error(error);
                });
        }
    });
}

// Função para abrir o modal e preencher os dados
function abrirModalProduto(produto = {}) {
    var modalInstance = bootstrap.Modal.getInstance($("#modalProduto")[0]);
    if (modalInstance) {
        modalInstance.dispose();
    }

    const isEdit = produto && produto.id;
    $("#modalProdutoLabel").text(isEdit ? "Editar Produto" : "Adicionar Produto");

    // Preencher os campos com valores formatados
    $("#produtoId").val(produto.id || "");
    $("#produtoNome").val(produto.nome || "");
    $("#produtoPreco").val(produto.preco ? produto.preco.toString() : "");
    $("#produtoQuantidade").val(produto.quantidade ? produto.quantidade.toString() : "");
    $("#produtoDescricao").val(produto.descricao || "");
    $("#produtoLinkImg").val(produto.linkImg || "");

    // Atualizar contador de caracteres
    const textarea = document.getElementById('produtoDescricao');
    atualizarContador(textarea);

    // Exibir o modal
    const modal = new bootstrap.Modal(document.getElementById("modalProduto"));
    modal.show();
}

// Evento de clique para salvar o produto
$("#salvarProduto").on("click", function () {
    // Validar campos obrigatórios
    if (!$("#produtoNome").val().trim()) {
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "O nome do produto é obrigatório"
        });
        return;
    }

    const produto = {
        idProduto: $("#produtoId").val(),
        nome: $("#produtoNome").val().trim(),
        preco: $("#produtoPreco").val() ? parseFloat($("#produtoPreco").val()) : 0,
        qnt: $("#produtoQuantidade").val() ? parseInt($("#produtoQuantidade").val()) : 0,
        descricao: $("#produtoDescricao").val().trim(),
        linkImg: $("#produtoLinkImg").val().trim()
    };

    let type = produto.idProduto ? "PUT" : "POST";
    let url = produto.idProduto 
        ? `${host}/products/editProduct/${produto.idProduto}`
        : `${host}/products/newProduct`;

    // Garantir que todos os campos sejam enviados
    const dadosParaEnviar = {
        nome: produto.nome,
        qnt: produto.qnt,
        descricao: produto.descricao,
        linkImg: produto.linkImg,
        preco: produto.preco
    };

    $.ajax({
        type: type,
        url: url,
        data: JSON.stringify(dadosParaEnviar),
        contentType: "application/json",
    })
    .done(function (response) {
        // Primeiro fechar o modal
        const modalElement = document.getElementById("modalProduto");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();

        // Limpar o formulário
        $("#formProduto")[0].reset();
        
        // Recarregar os dados
        carregarProdutos();

        // Mostrar mensagem de sucesso
        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: produto.idProduto ? "Produto atualizado com sucesso!" : "Produto adicionado com sucesso!",
            timer: 1500,
            showConfirmButton: false
        });
    })
    .fail(function (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Não foi possível salvar o produto"
        });
    });
});

// Adicionar função para contar caracteres
function atualizarContador(textarea) {
    const maxLength = textarea.maxLength;
    const currentLength = textarea.value.length;
    const remaining = maxLength - currentLength;
    document.getElementById('caracteresRestantes').textContent = remaining;
}

// Adicionar função para mostrar a descrição em um modal
function mostrarDescricao(nome, descricao) {
    Swal.fire({
        title: nome,
        html: `
            <div class="p-3">
                <div class="form-control text-start" 
                     style="min-height: 100px; background-color: #f8f9fa; resize: none; cursor: default;">
                    ${descricao}
                </div>
            </div>
        `,
        showClass: {
            popup: 'animate__animated animate__fadeIn'
        },
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#6c757d'
    });
}
