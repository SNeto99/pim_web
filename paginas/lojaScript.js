const HOST = "."; // Atualize conforme a configuração do servidor

let produtos = [];
let produtosFiltrados = [];
let filtrosAtivos = {
    precoMin: null,
    precoMax: null,
    apenasDisponiveis: false,
    termoBusca: ''
};

$(document).ready(function () {
  buscarProdutos();
  atualizarContadorCarrinho();

  // Adicionar verificação inicial para sincronização
  const userId = localStorage.getItem("userId");
  const carrinhoLocal = JSON.parse(localStorage.getItem("carrinho")) || [];
  
  if (userId && carrinhoLocal.length > 0) {
    sincronizarCarrinho();
  }

  $("#cartIcon").click(function (event) {
    event.preventDefault();
    abrirCarrinho();
  });
});

function buscarProdutos() {
  $.ajax({
    url: `${HOST}/products/getProducts`, // Certifique-se de que esta rota existe no backend
    method: "GET",
    success: function (response) {
      if (!response.error) {
        produtos = response.produtos;
        produtosFiltrados = [...produtos];
        aplicarFiltros();
      } else {
        console.error("Erro ao carregar produtos:", response.message);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível carregar os produtos.",
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Erro na requisição AJAX:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
      });
    },
  });
}

function gerarCardProduto(product) {
  const foraDeEstoque = !product.preco || product.quantidade <= 0;
  
  return /*html*/ `
    <div class="col-md-4 product-card">
        <div class="card ${foraDeEstoque ? 'out-of-stock' : ''}">
            <div class="card-img-wrapper">
                <img src="${product.linkImg || "./assets/default.png"}" 
                     class="card-img-top ${foraDeEstoque ? 'grayscale' : ''}" 
                     alt="${product.nome}">
            </div>
            <div class="card-body">
                <h5 class="product-title">${product.nome}</h5>
                <p class="product-description">${product.descricao || ""}</p>
                ${
                  !foraDeEstoque
                    ? `<p class='product-price'>R$ ${parseFloat(product.preco)
                        .toFixed(2)
                        .replace(".", ",")}</p>`
                    : `<p class='product-price text-danger fw-bold'>Fora de estoque</p>`
                }
                <button 
                    ${foraDeEstoque ? "disabled" : ""} 
                    class="btn btn-primary ${foraDeEstoque ? 'disabled' : ''}" 
                    onclick="adicionarAoCarrinho(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> 
                    ${foraDeEstoque ? 'Indisponível' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        </div>
    </div>
    `;
}

function adicionarAoCarrinho(productId) {
  const userId = localStorage.getItem("userId");
  const quantidade = 1;

  if (!userId) {
    adicionarAoLocalStorage(productId, quantidade);
    return;
  }

  $.ajax({
    url: `${HOST}/cart/addItem`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ userId, productId, quantidade }),
    success: function (response) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Produto adicionado ao carrinho!",
        showConfirmButton: false,
        timer: 1500,
      });
      atualizarContadorCarrinho();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao adicionar ao carrinho no servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível adicionar o produto ao carrinho no servidor.",
      });
    },
  });
}

function adicionarAoLocalStorage(productId, quantidade) {
  try {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const itemIndex = carrinho.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      carrinho[itemIndex].quantidade += quantidade;
    } else {
      const produto = produtos.find((p) => p.id === productId);
      if (!produto) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Produto não encontrado.",
        });
        return;
      }
      carrinho.push({
        productId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        linkImg: produto.linkImg || "./assets/default.png",
        quantidade: quantidade,
      });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Produto adicionado ao carrinho!",
      showConfirmButton: false,
      timer: 1500,
    });

    atualizarContadorCarrinho();
  } catch (error) {
    console.error("Erro ao adicionar ao localStorage:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível adicionar o produto ao carrinho localmente.",
    });
  }
}

function atualizarContadorCarrinho() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    const carrinhoLocal = JSON.parse(localStorage.getItem("carrinho")) || [];
    const totalQuantidade = carrinhoLocal.reduce(
      (total, item) => total + item.quantidade,
      0
    );
    $("#cartItemCount").text(totalQuantidade);
    return;
  }

  $.ajax({
    url: `${HOST}/cart/getItemCount/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.count !== undefined) {
        $("#cartItemCount").text(response.count);
      } else {
        $("#cartItemCount").text("0");
      }
    },
    error: function (xhr, status, error) {
      console.error("Erro ao obter contagem de itens do carrinho:", error);
      $("#cartItemCount").text("0");
    },
  });
}

function abrirCarrinho() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    abrirCarrinhoLocal();
    return;
  }

  $.ajax({
    url: `${HOST}/cart/getItems/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.items) {
        mostrarCarrinhoHtml(response.items, true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Não foi possível carregar o carrinho.",
        });
      }
    },
    error: function (xhr, status, error) {
      console.error("Erro ao obter itens do carrinho no servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível carregar o carrinho.",
      });
    },
  });
}

function abrirCarrinhoLocal() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  mostrarCarrinhoHtml(carrinho, false);
}

function mostrarCarrinhoHtml(carrinho, isServidor) {
  let itemsHtml = carrinho
    .map(
      (item) => `
        <div class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
            <div class="d-flex align-items-center">
                <img src="${item.linkImg}" alt="${
        item.nome
      }" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                <div>
                    <h5 class="mb-0">${item.nome}</h5>
                    <p class="mb-0">R$ ${parseFloat(item.preco)
                      .toFixed(2)
                      .replace(".", ",")}</p>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="btn btn-sm btn-secondary" onclick="alterarQuantidade(${
                  item.productId
                }, -1)">-</button>
                <input type="text" value="${item.quantidade}" readonly>
                <button class="btn btn-sm btn-secondary" onclick="alterarQuantidade(${
                  item.productId
                }, 1)">+</button>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${
              item.productId
            })">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    )
    .join("");

  if (!itemsHtml) {
    itemsHtml = "<p>O carrinho está vazio.</p>";
  }

  // Calcula o total
  const total = carrinho
    .reduce((sum, item) => sum + parseFloat(item.preco) * item.quantidade, 0)
    .toFixed(2)
    .replace(".", ",");

  if (carrinho.length > 0) {
    itemsHtml += `
            <div class="mt-4 d-flex justify-content-between align-items-center">
                <h4>Total: R$ ${total}</h4>
                <button class="btn btn-success" onclick="finalizarCompra()">Finalizar Compra</button>
            </div>
        `;
  }

  Swal.fire({
    title: "Carrinho de Compras",
    html: itemsHtml,
    showCloseButton: true,
    showConfirmButton: false,
    width: "600px",
  });
}

function alterarQuantidade(productId, delta) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Atualizar no localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const itemIndex = carrinho.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      carrinho[itemIndex].quantidade += delta;
      if (carrinho[itemIndex].quantidade <= 0) {
        carrinho.splice(itemIndex, 1);
      }
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      mostrarCarrinhoHtml(carrinho, false);
      atualizarContadorCarrinho();
    }
    return;
  }

  // Atualizar no servidor
  $.ajax({
    url: `${HOST}/cart/getItems/${userId}`,
    method: "GET",
    success: function (response) {
      if (response.items) {
        const item = response.items.find((i) => i.productId === productId);
        if (item) {
          const novaQuantidade = item.quantidade + delta;
          if (novaQuantidade <= 0) {
            removerDoCarrinho(productId);
          } else {
            atualizarQuantidadeServidor(userId, productId, novaQuantidade);
          }
        }
      }
    },
    error: function (xhr, status, error) {
      console.error(
        "Erro ao obter itens do carrinho para alterar quantidade:",
        error
      );
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível alterar a quantidade do item.",
      });
    },
  });
}

function atualizarQuantidadeServidor(userId, productId, quantidade) {
  $.ajax({
    url: `${HOST}/cart/updateQuantity`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ userId, productId, quantidade }),
    success: function (response) {
      atualizarContadorCarrinho();
      abrirCarrinho();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao atualizar quantidade no servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível atualizar a quantidade do item no servidor.",
      });
    },
  });
}

function removerDoCarrinho(productId) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    removerDoLocalStorage(productId);
    return;
  }

  $.ajax({
    url: `${HOST}/cart/removeItem`,
    method: "DELETE",
    contentType: "application/json",
    data: JSON.stringify({ userId, productId }),
    success: function (response) {
      Swal.fire({
        icon: "success",
        title: "Item removido do carrinho!",
        showConfirmButton: false,
        timer: 1500,
      });
      atualizarContadorCarrinho();
      abrirCarrinho();
    },
    error: function (xhr, status, error) {
      console.error("Erro ao remover item do carrinho no servidor:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível remover o item do carrinho.",
      });
    },
  });
}

function removerDoLocalStorage(productId) {
  try {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter((item) => item.productId !== productId);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    Swal.fire({
      icon: "success",
      title: "Item removido do carrinho!",
      showConfirmButton: false,
      timer: 1500,
    });
    atualizarContadorCarrinho();
    abrirCarrinhoLocal();
  } catch (error) {
    console.error("Erro ao remover do localStorage:", error);
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Não foi possível remover o item do carrinho localmente.",
    });
  }
}

function finalizarCompra() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Salva a página atual antes de redirecionar
    localStorage.setItem("returnTo", window.location.pathname);

    Swal.fire({
      icon: "info",
      title: "Login Necessário",
      text: "Por favor, faça login para finalizar a compra",
      confirmButtonText: "Ir para Login",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  // Implementar lógica para finalizar a compra no backend
  // Por exemplo, redirecionar para uma página de checkout
  window.location.href = "/carrinho"; // Ajuste conforme necessário
}

function sincronizarCarrinho() {
  const userId = localStorage.getItem("userId");
  const carrinhoLocal = JSON.parse(localStorage.getItem("carrinho")) || [];

  if (carrinhoLocal.length === 0) {
    atualizarContadorCarrinho();
    return;
  }

  $.ajax({
    url: `${HOST}/cart/mergeCart`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ userId, localCart: carrinhoLocal }),
    success: function (response) {
      localStorage.removeItem("carrinho");
      atualizarContadorCarrinho();
      Swal.fire({
        icon: "success",
        title: "Carrinho sincronizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    error: function (xhr, status, error) {
      console.error("Erro ao sincronizar carrinho:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível sincronizar o carrinho.",
      });
    },
  });
}

function aplicarFiltros() {
    // Mostra o loading
    Swal.fire({
        title: 'Aplicando filtros...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Atualiza os valores dos filtros
    filtrosAtivos.precoMin = $("#precoMin").val() ? parseFloat($("#precoMin").val()) : null;
    filtrosAtivos.precoMax = $("#precoMax").val() ? parseFloat($("#precoMax").val()) : null;
    filtrosAtivos.apenasDisponiveis = $("#mostrarDisponiveis").prop("checked");
    filtrosAtivos.termoBusca = $("#buscarProduto").val().toLowerCase().trim();

    // Aplica os filtros
    produtosFiltrados = produtos.filter(produto => {
        const preco = parseFloat(produto.preco);
        const disponivel = produto.quantidade > 0 && produto.preco > 0;
        const nome = produto.nome.toLowerCase();

        // Filtro de preço mínimo
        if (filtrosAtivos.precoMin !== null && preco < filtrosAtivos.precoMin) return false;

        // Filtro de preço máximo
        if (filtrosAtivos.precoMax !== null && preco > filtrosAtivos.precoMax) return false;

        // Filtro de disponibilidade
        if (filtrosAtivos.apenasDisponiveis && !disponivel) return false;

        // Filtro de busca por nome
        if (filtrosAtivos.termoBusca && !nome.includes(filtrosAtivos.termoBusca)) return false;

        return true;
    });

    // Atualiza a exibição
    atualizarExibicaoProdutos();

    // Fecha o loading após atualizar a exibição
    setTimeout(() => {
        Swal.close();
    }, 500);
}

function limparFiltros() {
    // Limpa os campos
    $("#precoMin").val('');
    $("#precoMax").val('');
    $("#mostrarDisponiveis").prop("checked", false);
    $("#buscarProduto").val('');

    // Reseta os filtros ativos
    filtrosAtivos = {
        precoMin: null,
        precoMax: null,
        apenasDisponiveis: false,
        termoBusca: ''
    };

    // Restaura todos os produtos
    produtosFiltrados = [...produtos];
    atualizarExibicaoProdutos();
}

function atualizarExibicaoProdutos() {
    const productsContainer = $("#productsContainer").empty();
    
    if (produtosFiltrados.length === 0) {
        productsContainer.html(`
            <div class="col-12 text-center">
                <p class="alert alert-info">Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
        `);
        return;
    }

    // Ordena os produtos: disponíveis primeiro, fora de estoque por último
    const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
        const aForaEstoque = !a.preco || a.quantidade <= 0;
        const bForaEstoque = !b.preco || b.quantidade <= 0;
        
        if (aForaEstoque && !bForaEstoque) return 1;
        if (!aForaEstoque && bForaEstoque) return -1;
        return 0;
    });

    produtosOrdenados.forEach(product => {
        const productCard = gerarCardProduto(product);
        productsContainer.append(productCard);
    });
}
