

// const host = "http://192.168.50.99:3005"
// const host = "http://192.168.0.16:3005";
const host = "";



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
    // console.log(link);
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error(
                `Erro na requisição: ${response.status} ${response.statusText}`
            );
        }
        const html = response.text();
        return html;
    } catch (error) {
        console.error("Erro ao obter o HTML:", error);
    }
}
