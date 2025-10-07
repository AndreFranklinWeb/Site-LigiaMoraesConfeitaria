// === Lista de produtos ===
const produtos = [
  { nome: "Bolo de Chocolate", preco: 35.00, categoria: "bolos", imagem: "imagens/bolo.jpg" },
  { nome: "Bolo de Morango", preco: 40.00, categoria: "bolos", imagem: "imagens/bolo.jpg" },
  { nome: "Brigadeiro", preco: 2.50, categoria: "doces", imagem: "imagens/doce.jpg" },
  { nome: "Beijinho", preco: 2.00, categoria: "doces", imagem: "imagens/doce.jpg" },
  { nome: "Coxinha", preco: 4.50, categoria: "salgados", imagem: "imagens/salgado.jpg" },
  { nome: "Empadinha", preco: 5.00, categoria: "salgados", imagem: "imagens/salgado.jpg" },
];

let carrinho = [];

// === Renderizar produtos ===
function renderizarProdutos(categoria = "all") {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  const filtrados = categoria === "all" ? produtos : produtos.filter(p => p.categoria === categoria);

  filtrados.forEach((item, index) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");
    card.innerHTML = `
      <div class="card shadow-sm">
        <img src="${item.imagem}" class="card-img-top" alt="${item.nome}">
        <div class="card-body text-center">
          <h5 class="card-title">${item.nome}</h5>
          <p class="card-text">R$ ${item.preco.toFixed(2)}</p>
          <button class="btn btn-pink" onclick="adicionarAoCarrinho(${index})">Adicionar</button>
        </div>
      </div>`;
    menu.appendChild(card);
  });
}

// === Adicionar ao carrinho ===
function adicionarAoCarrinho(index) {
  const produto = produtos[index];
  const item = carrinho.find(i => i.nome === produto.nome);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }

  atualizarCarrinho();
}

// === Atualizar carrinho ===
function atualizarCarrinho() {
  const lista = document.getElementById("carrinho");
  const totalEl = document.getElementById("total");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    total += item.preco * item.qtd;
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      ${item.qtd}x ${item.nome} - R$ ${(item.preco * item.qtd).toFixed(2)}
      <div>
        <button class="btn btn-sm btn-outline-pink me-1" onclick="alterarQtd(${i}, 1)">+</button>
        <button class="btn btn-sm btn-outline-pink" onclick="alterarQtd(${i}, -1)">-</button>
      </div>`;
    lista.appendChild(li);
  });

  totalEl.textContent = total.toFixed(2);
}

// === Alterar quantidade ===
function alterarQtd(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) carrinho.splice(index, 1);
  atualizarCarrinho();
}

// === Filtro de categorias ===
document.querySelectorAll("[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderizarProdutos(btn.dataset.category);
  });
});

// === Confirmação do pedido ===
document.getElementById("confirmarPedido").addEventListener("click", () => {
  const nome = document.getElementById("nomeCliente").value.trim();
  const endereco = document.getElementById("enderecoCliente").value.trim();
  const pagamento = document.getElementById("pagamento").value;
  const observacoes = document.getElementById("observacoes").value.trim();
  const dataEntrega = document.getElementById("dataEntrega").value;
  const horaEntrega = document.getElementById("horaEntrega").value;

  if (!nome || !endereco || !pagamento || carrinho.length === 0) {
    alert("Por favor, preencha todos os campos obrigatórios e adicione itens ao carrinho.");
    return;
  }

  const resumo = carrinho.map(i => `${i.qtd}x ${i.nome} (R$ ${(i.preco * i.qtd).toFixed(2)})`).join("<br>");
  const total = document.getElementById("total").textContent;

  document.getElementById("resumoPedido").innerHTML = `
    <p><strong>Cliente:</strong> ${nome}</p>
    <p><strong>Endereço:</strong> ${endereco}</p>
    <p><strong>Pagamento:</strong> ${pagamento}</p>
    ${dataEntrega || horaEntrega ? `<p><strong>Entrega:</strong> ${dataEntrega || ""} ${horaEntrega || ""}</p>` : ""}
    ${observacoes ? `<p><strong>Observações:</strong> ${observacoes}</p>` : ""}
    <hr>
    <p>${resumo}</p>
    <h5>Total: R$ ${total}</h5>`;

  new bootstrap.Modal(document.getElementById("modalConfirmacao")).show();
});

// === Enviar para WhatsApp ===
document.getElementById("enviarWhatsApp").addEventListener("click", () => {
  const nome = document.getElementById("nomeCliente").value.trim();
  const endereco = document.getElementById("enderecoCliente").value.trim();
  const pagamento = document.getElementById("pagamento").value;
  const observacoes = document.getElementById("observacoes").value.trim();
  const dataEntrega = document.getElementById("dataEntrega").value;
  const horaEntrega = document.getElementById("horaEntrega").value;
  const total = document.getElementById("total").textContent;

  const textoPedido = carrinho
    .map(i => `${i.qtd}x ${i.nome} - R$ ${(i.preco * i.qtd).toFixed(2)}`)
    .join("\n");

  const mensagem =
`🍰 *Novo Pedido - Confeitaria Delícia* 🍰
👤 Cliente: ${nome}
📍 Endereço: ${endereco}
💳 Pagamento: ${pagamento}
📅 Entrega: ${dataEntrega || "não informada"} às ${horaEntrega || "sem hora definida"}
${observacoes ? "📝 Observações: " + observacoes + "\n" : ""}

📦 Itens:
${textoPedido}

💰 Total: R$ ${total}`;

  const numero = "5599999999999"; // <-- Coloque aqui o número do WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});

// === Inicializa o cardápio ===
renderizarProdutos();
