  const buttons = document.querySelectorAll('.btn-add');
    const cart = document.getElementById('cart');
    const totalEl = document.getElementById('total');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let total = 0;

    // Adicionar itens ao carrinho
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const product = this.closest('.card');
        const name = product.querySelector('.card-title').textContent;
        const price = parseFloat(product.querySelector('.fw-bold').dataset.price);

        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = name + " - R$ " + price.toFixed(2);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remover";
        removeBtn.className = "btn btn-sm btn-danger ms-2";
        removeBtn.onclick = () => {
          li.remove();
          total -= price;
          atualizarTotal();
        };

        li.appendChild(removeBtn);
        cart.appendChild(li);

        total += price;
        atualizarTotal();
      });
    });

    // Atualizar total
    function atualizarTotal() {
      totalEl.textContent = "R$ " + total.toFixed(2);
    }

    // Filtro de categorias
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const category = this.dataset.category;
        document.querySelectorAll('.produto').forEach(produto => {
          if (category === "all" || produto.dataset.category === category) {
            produto.style.display = "block";
          } else {
            produto.style.display = "none";
          }
        });
      });
    });

    // Botão WhatsApp
    document.getElementById('confirmarPedido').addEventListener('click', function() {
      let itens = [];
      document.querySelectorAll('#cart li').forEach(li => {
        itens.push(li.textContent.replace("Remover", "").trim());
      });

      if(itens.length === 0) {
        alert("Adicione itens ao carrinho antes de confirmar o pedido!");
        return;
      }

      const numero = "+5585988578589"; // <-- coloque o número do WhatsApp com DDI + DDD
      let mensagem = "Olá! Gostaria de fazer um pedido:%0A%0A";
      itens.forEach(item => {
        mensagem += "• " + item + "%0A";
      });
      mensagem += "%0ATotal: R$ " + total.toFixed(2);

      const url = "https://wa.me/" + numero + "?text=" + mensagem;
      window.open(url, "_blank");
    });