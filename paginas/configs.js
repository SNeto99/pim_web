

// const url = "http://localhost:3001"
const url = "";



function criarItem(item) {
    const $item = $(/*html*/ `
        <li class="nav-item">
            <a class="nav-link" href="#">${item.nome}</a>
        </li>
    `);

    if (item.funcao) {
        $item.find("a").on("click", function (e) {
            e.preventDefault();
            item.funcao();
        });
    }

    return $item;
}

function criarMenu(menuItem, isMobile) {
    const submenuId =
        "submenu-" +
        menuItem.nome.replace(/\s+/g, "") +
        (isMobile ? "Mobile" : "");

    const $menu = $(/*html*/ `
        <li class="nav-item">
            <a class="nav-link" href="#" data-bs-toggle="collapse" data-bs-target="#${submenuId}" aria-expanded="false" aria-controls="${submenuId}">
                ${menuItem.nome}
            </a>
            <div class="collapse" id="${submenuId}">
                <ul class="nav flex-column ms-3">
                    <!-- Subitens serão inseridos aqui -->
                </ul>
            </div>
        </li>
    `);

    if (menuItem.funcao) {
        $menu.find("a").on("click", function (e) {
            e.preventDefault();
            menuItem.funcao();
        });
    }
    
    const $submenu = $menu.find("ul");

    menuItem.itens.forEach((subitem) => {
        const $subItem = criarItem(subitem);
        $submenu.append($subItem);
    });

    return $menu;
}

function adicionarItensNavbar(listaDeItens) {
    const $navbarMenuDesktop = $("#sidebarMenu");
    const $navbarMenuMobile = $("#sidebarMenuMobile");

    listaDeItens.forEach((item) => {
        let $menuItemDesktop;
        let $menuItemMobile;

        if (item.tipo === "item") {
            $menuItemDesktop = criarItem(item);
            $menuItemMobile = criarItem(item);
        } else if (item.tipo === "menu") {
            $menuItemDesktop = criarMenu(item, false);
            $menuItemMobile = criarMenu(item, true);
        }

        $navbarMenuDesktop.append($menuItemDesktop);
        $navbarMenuMobile.append($menuItemMobile);
    });
}


async function getHtml(link) {
    console.log(link);
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(
                `Erro na requisição: ${response.status} ${response.statusText}`
            );
        }
        const html = await response.text();
        $("#principal").html(html);
    } catch (error) {
        console.error("Erro ao obter o HTML:", error);
    }
}
async function carregarProdutos() {
    console.log("teste");
    try {
        const response = await $.ajax({
            type: "GET",
            url: `${url}/products/getProducts`,
            dataType: "json",
        });

        console.log(response);

        if (!response.error) {
            montarCardProdutos(response.produtos);
        } else {
            console.error("Erro na resposta: ", response.message);
        }
    } catch (error) {
        console.error("Erro ao carregar produtos: ", error);
    }
}

function montarCardProdutos(produtos) {
    const html = /*html*/`
        <div class="card">
            <div class='card-header'>Produtos cadastrados</div>
            <div class='card-body'>
                <table id="table-produtos" class="display">
                    <thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;

    // Adiciona o HTML ao container principal
    $("#principal").html(html);

    // Inicializa o DataTable com os produtos
    $("#table-produtos").DataTable({
        data: produtos,
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
                    return /*html*/`
                        <button class='btn btn-warning btn-editar'><span class='fa fa-pen'></span> Editar</button>
                        <button class='btn btn-danger btn-deletar'><span class='fa fa-trash'></span> Deletar</button>
                    `;
                },
            },
        ],
    });

    // Adiciona eventos aos botões de ação
    $("#table-produtos").on("click", ".btn-editar", function () {
        const data = $("#table-produtos")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
        editarProduto(data);
    });

    $("#table-produtos").on("click", ".btn-deletar", function () {
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
}

function deletarProduto(produto) {
    // Lógica para deletar o produto
    console.log("Deletar produto:", produto);
}
