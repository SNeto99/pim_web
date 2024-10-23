$(document).ready(async () => {
    // Carrega os fornecedores antes de montar a tabela e adicionar ao DOM
    await carregarFornecedores();
});

async function carregarFornecedores() {
    try {
        // Faz a requisição AJAX para obter os fornecedores
        const response = await $.ajax({
            type: "GET",
            url: `${host}/fornecedores/getFornecedores`,
            dataType: "json",
        });

        console.log(response);

        if (!response.error) {
            // Inicializa a tabela com os dados recebidos
            dataTable_fornecedores(response.fornecedores);
        } else {
            console.error("Erro na resposta: ", response.message);
        }
    } catch (error) {
        console.error("Erro ao carregar fornecedores: ", error);
        $("#principal").html(
            $(`
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Fornecedores não Encontrados</h4>
                <p>Se voce está vendo essa mensagem, por favor entre em contato com o suporte</p>
                <hr />
                <p class="mb-0"><a href="mailto:suporte@urbanFarm.com">suporte@urbanFarm.com</a></p>
            </div>
        `)
        );
    }
}

function dataTable_fornecedores(fornecedores) {
    // Cria o HTML da tabela
    let tabelaHtml = /*html*/ `
        <table id="table-fornecedores" class="display">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>
                        <span class="full-label">Telefone</span>
                        <span class="mobile-label">Tel.</span>
                    </th>
                    <th>Email</th>
                    <th>Site</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
            
    `;

    // Adiciona o HTML da tabela ao container principal antes de inicializar o DataTable
    $("#div-tabela-fornecedores").html(tabelaHtml);

    const isMobile = window.innerWidth <= 768;

    // Inicializa o DataTable com os fornecedores
    $("#table-fornecedores").DataTable({
        data: fornecedores,
        responsive: true,
        paging: !isMobile,
        scrollY: isMobile ? "400px" : false,
        scrollCollapse: isMobile,
        info: !isMobile,
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/pt-BR.json", // URL para o arquivo de tradução para português
        },
        columns: [
            { data: "nome" },
            { data: "telefone" },
            { 
                data: "email",
                render: function (data) {
                    return `<a href="mailto:${data}">${data}</a>`
                }
            },
            { 
                data: "site",
                render: function (data) {
                    return `<a href="https://${data}" target="blank">${data}</a>`
                }
            },
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
    $("#div-tabela-fornecedores").on("click", ".btn-editar", function () {
        const data = $("#table-fornecedores")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
        editarFornecedor(data);
    });

    $("#div-tabela-fornecedores").on("click", ".btn-deletar", function () {
        const data = $("#table-fornecedores")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
        deletarFornecedor(data);
    });
}

function editarFornecedor(fornecedor) {
    // Lógica para editar o fornecedor
    console.log("Editar fornecedor:", fornecedor);
    abrirModalFornecedor(fornecedor);
}

function deletarFornecedor(fornecedor) {
    // Lógica para deletar o fornecedor
    console.log(fornecedor);
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
                url: `${host}/fornecedores/deleteFornecedor/${fornecedor.id}`,
                contentType: "application/json",
            })
                .done(function (response) {
                    console.log(response);
                    carregarFornecedores();
                })
                .fail(function (error) {
                    console.error(error);
                });
        }
    });
}

// Função para abrir o modal e preencher os dados
function abrirModalFornecedor(fornecedor = {}) {

    var modalInstance = bootstrap.Modal.getInstance($("#modalFornecedor")[0]);

    // Verifica se já existe uma instância do modal e a descarta
    if (modalInstance) {
        modalInstance.dispose();
    }


    // Se o fornecedor estiver vazio, estamos adicionando um novo item
    const isEdit = fornecedor && fornecedor.id;

    // Ajustar o título do modal
    const modalTitle = isEdit ? "Editar Fornecedor" : "Adicionar Fornecedor";
    $("#modalFornecedorLabel").text(modalTitle);

    // Preencher os campos do modal
    $("#fornecedorId").val(fornecedor.id || "");
    $("#fornecedorNome").val(fornecedor.nome || "");
    $("#fornecedorTelefone").val(fornecedor.telefone || "");
    $("#fornecedorEmail").val(fornecedor.email || "");
    $("#fornecedorSite").val(fornecedor.site || "");

    // Exibir o modal
    const modal = new bootstrap.Modal(document.getElementById("modalFornecedor"));
    modal.show();
}

// Evento de clique para salvar o fornecedor
$("#salvarFornecedor").on("click", function () {
    const fornecedor = {
        idFornecedor: $("#fornecedorId").val(),
        nome: $("#fornecedorNome").val(),
        telefone: $("#fornecedorTelefone").val(),
        email: $("#fornecedorEmail").val(),
        site: $("#fornecedorSite").val(),
    };

    let type = "";
    let url = "";
    if (fornecedor.idFornecedor) {
        type = "PUT";
        url = `${host}/fornecedores/editFornecedor/${fornecedor.idFornecedor}`;
    } else {
        type = "POST";
        url = `${host}/fornecedores/newFornecedor`;
    }
    $.ajax({
        type: type,
        url: url,
        data: JSON.stringify(fornecedor),
        contentType: "application/json",
    })
        .done(function (response) {
            console.log(response);
            carregarFornecedores();
        })
        .fail(function (error) {
            console.error(error);
        });
    console.log("Fornecedor atualizado:", fornecedor);

    // Fechar o modal após salvar
    $("#modalFornecedor").modal("hide");
});
