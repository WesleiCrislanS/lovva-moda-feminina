// ==========================================
// 1. MAPEAMENTO DOS ELEMENTOS DO HTML (DOM)
// ==========================================

// Elementos do Carrinho
const btnIconeCarrinho = document.getElementById('cart-icon-btn');
const btnFecharCarrinho = document.getElementById('close-cart-btn');
const lateralCarrinho = document.getElementById('cart-sidebar');
const fundoEscuroOverlay = document.getElementById('cart-overlay');
const containerItensCarrinho = document.getElementById('cart-items-container');
const contadorContadorTopo = document.getElementById('cart-count');
const valorTotalCarrinho = document.getElementById('cart-total-value');
const botoesAdicionar = document.querySelectorAll('.btn-add-cart');

// Elementos do Modal de Detalhes
const modalContainer = document.getElementById('product-modal');
const btnFecharModal = document.getElementById('close-modal-btn');
const botoesSobre = document.querySelectorAll('.btn-sobre');
const modalNome = document.getElementById('modal-nome');
const modalPreco = document.getElementById('modal-preco');
const modalMaterial = document.getElementById('modal-material');
const modalEntrega = document.getElementById('modal-entrega');

// Banco de dados temporário do Carrinho
let carrinho = [];

// ==========================================
// 2. LÓGICA DO CARRINHO LATERAL
// ==========================================

// Função para abrir / fechar o carrinho
function alternarCarrinho() {
    lateralCarrinho.classList.toggle('open');
    fundoEscuroOverlay.classList.toggle('open');
}

// Atribui os eventos de abrir/fechar o carrinho
if (btnIconeCarrinho) btnIconeCarrinho.addEventListener('click', alternarCarrinho);
if (btnFecharCarrinho) btnFecharCarrinho.addEventListener('click', alternarCarrinho);
if (fundoEscuroOverlay) fundoEscuroOverlay.addEventListener('click', alternarCarrinho);

// Função para atualizar o visual do carrinho e recalcular o total
function atualizarInterfaceCarrinho() {
    // Atualiza a bolinha com o número de itens no topo
    if (contadorContadorTopo) contadorContadorTopo.textContent = carrinho.length;

    // Se estiver vazio, exibe mensagem padrão
    if (carrinho.length === 0) {
        if (containerItensCarrinho) containerItensCarrinho.innerHTML = '<p class="empty-message">Seu carrinho está vazio.</p>';
        if (valorTotalCarrinho) valorTotalCarrinho.textContent = 'R$ 0,00';
        return;
    }

    if (containerItensCarrinho) containerItensCarrinho.innerHTML = '';
    let somaTotal = 0;

    // Cria as linhas de produtos dentro do carrinho
    carrinho.forEach((produto, posicao) => {
        somaTotal += produto.preco;

        const linhaProduto = document.createElement('div');
        linhaProduto.style.display = 'flex';
        linhaProduto.style.justifyContent = 'space-between';
        linhaProduto.style.alignItems = 'center';
        linhaProduto.style.marginBottom = '12px';
        linhaProduto.style.paddingBottom = '12px';
        linhaProduto.style.borderBottom = '1px solid #eee';

        linhaProduto.innerHTML = `
            <div>
                <p style="font-weight: 600; margin: 0; color: #222;">${produto.nome}</p>
                <p style="color: #4a154b; font-size: 0.9rem; margin: 4px 0 0 0;">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            </div>
            <button onclick="removerDoCarrinho(${posicao})" style="background: none; border: none; color: #cc0000; cursor: pointer; font-weight: bold;">Remover</button>
        `;
        
        if (containerItensCarrinho) containerItensCarrinho.appendChild(linhaProduto);
    });

    // Atualiza o valor total formatado
    if (valorTotalCarrinho) valorTotalCarrinho.textContent = `R$ ${somaTotal.toFixed(2).replace('.', ',')}`;
}

// Escuta os cliques para adicionar itens ao carrinho
botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const nomeProduto = evento.target.getAttribute('data-name');
        const precoProduto = parseFloat(evento.target.getAttribute('data-price'));

        carrinho.push({ nome: nomeProduto, preco: precoProduto });
        
        atualizarInterfaceCarrinho();

        // Abre o carrinho automaticamente para dar o feedback visual
        if (lateralCarrinho && !lateralCarrinho.classList.contains('open')) {
            alternarCarrinho();
        }
    });
});

// Remove o item da lista e atualiza a tela
window.removerDoCarrinho = function(posicao) {
    carrinho.splice(posicao, 1);
    atualizarInterfaceCarrinho();
};

// ==========================================
// 3. LÓGICA DO MODAL (CARD FLUTUANTE)
// ==========================================

// Função para fechar o modal
function fecharModal() {
    if (modalContainer) modalContainer.classList.remove('open');
}

// Configura os cliques para fechar o modal
if (btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);

// Fecha se clicar no fundo escuro fora do card
if (modalContainer) {
    modalContainer.addEventListener('click', (evento) => {
        if (evento.target === modalContainer) {
            fecharModal();
        }
    });
}

// Lógica para abrir e preencher o card do Modal ao clicar em "Sobre"
botoesSobre.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const clique = evento.currentTarget; 

        // 1. Pega os dados das tags data- do produto clicado
        const nome = clique.getAttribute('data-name');
        const precoRaw = clique.getAttribute('data-price');
        const material = clique.getAttribute('data-material');
        const entrega = clique.getAttribute('data-entrega');

        // Formata o preço de forma puramente matemática
        const precoFormatado = parseFloat(precoRaw).toFixed(2).replace('.', ',');

        // 2. Injeta dinamicamente os textos dentro do Modal flutuante
        if (modalNome) modalNome.textContent = nome;
        if (modalPreco) modalPreco.textContent = `R$ ${precoFormatado}`;
        if (modalMaterial) modalMaterial.textContent = material || "Não informado";
        if (modalEntrega) modalEntrega.textContent = entrega || "Não informado";

        // 3. Mostra o modal adicionando a classe 'open'
        if (modalContainer) {
            modalContainer.classList.add('open');
        }
    });
});