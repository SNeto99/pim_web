const navbarItems = [
    {
        nome: "Início",
        tipo: "item",
        funcao: async function () {
            const html = await getHtml("teste.html")
            $("#principal").html(html)
        },
    },
    {
        nome: "Produtos",
        tipo: "menu",
        itens: [
            {
                nome: "Adicionar Produto",
                tipo: "item",
                funcao: function () {
                    console.log("Adicionar Produto clicado");
                },
            },
            {
                nome: "Listar Produtos",
                tipo: "item",
                funcao: function () {
                    console.log("Listar Produtos clicado");
                },
            },
        ],
        funcao: async function () {
            const html = await getHtml("cards/funcionarios.html")
            $("#principal").html(html)
        },
    },
    {
        nome: "Fornecedores",
        tipo: "menu",
        itens: [
            {
                nome: "Adicionar Fornecedor",
                tipo: "item",
                funcao: function () {
                    console.log("Adicionar Fornecedor clicado");
                },
            },
            {
                nome: "Listar Fornecedores",
                tipo: "item",
                funcao: function () {
                    console.log("Listar Fornecedores clicado");
                },
            },
        ],
    },
    {
        nome: "Usuários",
        tipo: "item",
        funcao: function () {
            console.log("Usuários clicado");
        },
    },
    {
        nome: "Sair",
        tipo: "item",
        funcao: function () {
            console.log("Sair clicado");
        },
    },
];
