// ==========================================
// CONEXÃO COM O FIREBASE
// ==========================================

// ==========================================
// 🔥 CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyC8hgwgOXHNdw4poG_aoGScuEhwQcWIkvM",
    authDomain: "sistema-de-pedidos-8fdd3.firebaseapp.com",
    projectId: "sistema-de-pedidos-8fdd3",
    storageBucket: "sistema-de-pedidos-8fdd3.firebasestorage.app",
    messagingSenderId: "284081834213",
    appId: "1:284081834213:web:c828727a521d2a8999ec0c",
    measurementId: "G-VPQFXSWVVD"
};
// ==========================================

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// REFERÊNCIAS DAS COLLECTIONS
// ==========================================
const mesasRef = db.collection('mesas');
const produtosRef = db.collection('produtos');
const contasRef = db.collection('contas');
const itensContaRef = db.collection('itensConta');
const pedidosRef = db.collection('pedidos');

// ==========================================
// VARIÁVEIS DE ESTADO
// ==========================================
let mesaSelecionada = null;
let contaAtual = null;
let carrinho = [];
let produtos = [];
let mesaIdSelecionada = null;

// ==========================================
// ELEMENTOS DOM
// ==========================================
const telaMesas = document.getElementById('telaMesas');
const telaPedido = document.getElementById('telaPedido');
const listaMesas = document.getElementById('listaMesas');
const listaProdutos = document.getElementById('listaProdutos');
const carrinhoItens = document.getElementById('carrinhoItens');
const totalValor = document.getElementById('totalValor');
const totalItens = document.getElementById('totalItens');
const tituloMesa = document.getElementById('tituloMesa');
const statusMesa = document.getElementById('statusMesa');
const btnVoltarMesas = document.getElementById('btnVoltarMesas');
const btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
const horaAtual = document.getElementById('horaAtual');

// ==========================================
// MODAL
// ==========================================
const modalConfirmacao = document.getElementById('modalConfirmacao');
const modalMensagem = document.getElementById('modalMensagem');
const mensagemModal = document.getElementById('mensagemModal');
const mensagemTexto = document.getElementById('mensagemTexto');
const modalCancelar = document.getElementById('modalCancelar');
const modalConfirmar = document.getElementById('modalConfirmar');
const modalMensagemOk = document.getElementById('modalMensagemOk');

let modalCallback = null;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

function atualizarRelogio() {
    const now = new Date();
    horaAtual.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
atualizarRelogio();
setInterval(atualizarRelogio, 30000);

// ==========================================
// FUNÇÕES DE INICIALIZAÇÃO DAS MESAS
// ==========================================

async function inicializarMesas() {
    try {
        const snapshot = await mesasRef.get();
        if (snapshot.empty) {
            const batch = db.batch();
            for (let i = 1; i <= 20; i++) {
                const numero = i.toString().padStart(2, '0');
                const docRef = mesasRef.doc(`mesa_${numero}`);
                batch.set(docRef, {
                    numero: numero,
                    status: 'disponivel',
                    contaAbertaId: null
                });
            }
            await batch.commit();
            console.log('✅ Mesas criadas automaticamente');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar mesas:', error);
        mostrarMensagem('Erro ao inicializar mesas. Verifique sua conexão.');
    }
}

// ==========================================
// CARREGAR DADOS
// ==========================================

async function carregarProdutos() {
    try {
        const snapshot = await produtosRef.where('ativo', '==', true).get();
        produtos = [];
        snapshot.forEach(doc => {
            produtos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        console.log(`✅ ${produtos.length} produtos carregados`);
        return produtos;
    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        mostrarMensagem('Erro ao carregar produtos. Verifique sua conexão.');
        return [];
    }
}

// ==========================================
// RENDERIZAR MESAS
// ==========================================

function renderizarMesas(snapshot) {
    listaMesas.innerHTML = '';
    
    if (snapshot.empty) {
        listaMesas.innerHTML = '<p class="texto-vazio">Nenhuma mesa encontrada.</p>';
        return;
    }
    
    const mesas = [];
    snapshot.forEach(doc => {
        mesas.push({ id: doc.id, ...doc.data() });
    });
    mesas.sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
    
    mesas.forEach(mesa => {
        const card = document.createElement('div');
        card.className = `card-mesa ${mesa.status}`;
        
        const statusText = mesa.status === 'disponivel' ? 'DISPONÍVEL' : 'OCUPADA';
        
        card.innerHTML = `
            <span class="numero">${mesa.numero}</span>
            <span class="status">${statusText}</span>
            ${mesa.status === 'ocupada' ? '<span class="badge-pedidos">●</span>' : ''}
        `;
        
        card.addEventListener('click', () => {
            selecionarMesa(mesa, mesa.id);
        });
        
        listaMesas.appendChild(card);
    });
}

// ==========================================
// SELECIONAR MESA
// ==========================================

async function selecionarMesa(mesa, id) {
    mesaSelecionada = mesa;
    mesaIdSelecionada = id;
    
    tituloMesa.textContent = `Mesa ${mesa.numero}`;
    statusMesa.textContent = mesa.status === 'disponivel' ? 'DISPONÍVEL' : 'OCUPADA';
    statusMesa.className = `status-badge ${mesa.status}`;
    
    carrinho = [];
    atualizarCarrinho();
    
    if (mesa.status === 'ocupada' && mesa.contaAbertaId) {
        contaAtual = mesa.contaAbertaId;
        await carregarItensConta(contaAtual);
    } else {
        contaAtual = null;
    }
    
    telaMesas.style.display = 'none';
    telaPedido.style.display = 'block';
    
    await carregarProdutos();
    renderizarProdutos();
}

// ==========================================
// CARREGAR ITENS DA CONTA EXISTENTE
// ==========================================

async function carregarItensConta(contaId) {
    try {
        const snapshot = await itensContaRef.where('contaId', '==', contaId).get();
        carrinho = [];
        snapshot.forEach(doc => {
            const item = doc.data();
            carrinho.push({
                id: doc.id,
                produtoId: item.produtoId,
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade,
                subtotal: item.subtotal
            });
        });
        atualizarCarrinho();
        console.log(`✅ ${carrinho.length} itens carregados da conta`);
    } catch (error) {
        console.error('❌ Erro ao carregar itens da conta:', error);
        mostrarMensagem('Erro ao carregar itens da conta.');
    }
}

// ==========================================
// RENDERIZAR PRODUTOS
// ==========================================

function renderizarProdutos() {
    listaProdutos.innerHTML = '';
    
    if (produtos.length === 0) {
        listaProdutos.innerHTML = '<p class="texto-vazio">Nenhum produto disponível.</p>';
        return;
    }
    
    produtos.forEach(produto => {
        const btn = document.createElement('button');
        btn.className = 'btn-produto';
        btn.innerHTML = `
            <span class="nome">${produto.nome}</span>
            <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
        `;
        
        btn.addEventListener('click', () => {
            adicionarAoCarrinho(produto);
        });
        
        listaProdutos.appendChild(btn);
    });
}

// ==========================================
// CARRINHO - FUNÇÕES
// ==========================================

function adicionarAoCarrinho(produto) {
    const itemExistente = carrinho.find(item => item.produtoId === produto.id);
    
    if (itemExistente) {
        itemExistente.quantidade++;
        itemExistente.subtotal = itemExistente.quantidade * itemExistente.preco;
    } else {
        carrinho.push({
            id: null,
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            subtotal: produto.preco
        });
    }
    
    atualizarCarrinho();
}

function atualizarQuantidade(index, delta) {
    const item = carrinho[index];
    if (!item) return;
    
    const novaQtd = item.quantidade + delta;
    if (novaQtd < 1) return;
    
    item.quantidade = novaQtd;
    item.subtotal = item.quantidade * item.preco;
    atualizarCarrinho();
}

function removerItemCarrinho(index) {
    mostrarConfirmacao('Deseja realmente remover este item?', () => {
        carrinho.splice(index, 1);
        atualizarCarrinho();
    });
}

function atualizarCarrinho() {
    carrinhoItens.innerHTML = '';
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = '<p class="texto-vazio">Nenhum item adicionado.</p>';
        totalValor.textContent = 'R$ 0,00';
        totalItens.textContent = '0 itens';
        btnFinalizarPedido.disabled = true;
        return;
    }
    
    let total = 0;
    let qtdTotal = 0;
    
    carrinho.forEach((item, index) => {
        total += item.subtotal;
        qtdTotal += item.quantidade;
        
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <div class="info">
                <div class="nome-item">${item.nome}</div>
                <div class="preco-item">R$ ${item.preco.toFixed(2)}</div>
            </div>
            <div class="controles">
                <button onclick="window.atualizarQuantidade(${index}, -1)">−</button>
                <span class="qtd">${item.quantidade}</span>
                <button onclick="window.atualizarQuantidade(${index}, 1)">+</button>
            </div>
            <span class="subtotal">R$ ${item.subtotal.toFixed(2)}</span>
            <button class="btn-excluir-item" onclick="window.removerItemCarrinho(${index})">✕</button>
        `;
        carrinhoItens.appendChild(div);
    });
    
    totalValor.textContent = `R$ ${total.toFixed(2)}`;
    totalItens.textContent = `${qtdTotal} itens`;
    btnFinalizarPedido.disabled = false;
}

window.atualizarQuantidade = atualizarQuantidade;
window.removerItemCarrinho = removerItemCarrinho;

// ==========================================
// FINALIZAR PEDIDO
// ==========================================

btnFinalizarPedido.addEventListener('click', async () => {
    if (carrinho.length === 0) {
        mostrarMensagem('Adicione pelo menos um item ao pedido.');
        return;
    }
    
    try {
        if (!contaAtual) {
            const contaData = {
                mesaId: mesaIdSelecionada,
                mesaNumero: parseInt(mesaSelecionada.numero),
                status: 'aberta',
                total: 0,
                criadaEm: firebase.firestore.FieldValue.serverTimestamp(),
                fechadaEm: null
            };
            
            const docRef = await contasRef.add(contaData);
            contaAtual = docRef.id;
            
            await mesasRef.doc(mesaIdSelecionada).update({
                status: 'ocupada',
                contaAbertaId: contaAtual
            });
            
            statusMesa.textContent = 'OCUPADA';
            statusMesa.className = 'status-badge ocupada';
        }
        
        const batch = db.batch();
        const itensParaSalvar = [];
        
        for (const item of carrinho) {
            if (item.id) {
                const itemRef = itensContaRef.doc(item.id);
                batch.update(itemRef, {
                    quantidade: item.quantidade,
                    subtotal: item.subtotal
                });
            } else {
                const itemData = {
                    contaId: contaAtual,
                    produtoId: item.produtoId,
                    nome: item.nome,
                    preco: item.preco,
                    quantidade: item.quantidade,
                    subtotal: item.subtotal
                };
                const newRef = itensContaRef.doc();
                batch.set(newRef, itemData);
                item.id = newRef.id;
            }
            itensParaSalvar.push(item);
        }
        
        const pedidoData = {
            contaId: contaAtual,
            mesaNumero: parseInt(mesaSelecionada.numero),
            itens: carrinho.map(item => ({
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            status: 'aguardando',
            criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
            prontoEm: null
        };
        
        await pedidosRef.add(pedidoData);
        
        let totalConta = 0;
        for (const item of itensParaSalvar) {
            totalConta += item.subtotal;
        }
        
        await contasRef.doc(contaAtual).update({
            total: totalConta
        });
        
        await batch.commit();
        
        carrinho = [];
        atualizarCarrinho();
        
        await carregarItensConta(contaAtual);
        
        mostrarMensagem('✅ Pedido enviado para a cozinha!');
        
    } catch (error) {
        console.error('❌ Erro ao finalizar pedido:', error);
        mostrarMensagem('Erro ao salvar pedido. Verifique sua conexão.');
    }
});

// ==========================================
// NAVEGAÇÃO
// ==========================================

btnVoltarMesas.addEventListener('click', voltarParaMesas);

function voltarParaMesas() {
    telaPedido.style.display = 'none';
    telaMesas.style.display = 'block';
    mesaSelecionada = null;
    contaAtual = null;
    carrinho = [];
    atualizarCarrinho();
    carregarMesas();
}

// ==========================================
// CARREGAR MESAS EM TEMPO REAL
// ==========================================

function carregarMesas() {
    mesasRef.onSnapshot((snapshot) => {
        renderizarMesas(snapshot);
    }, (error) => {
        console.error('❌ Erro ao carregar mesas:', error);
        mostrarMensagem('Erro ao carregar mesas. Verifique sua conexão.');
    });
}

// ==========================================
// MODAIS
// ==========================================

function mostrarConfirmacao(mensagem, callback) {
    mensagemModal.textContent = mensagem;
    modalConfirmacao.style.display = 'flex';
    modalCancelar.style.display = 'block';
    modalConfirmar.style.display = 'block';
    modalCallback = callback;
}

function mostrarMensagem(mensagem) {
    mensagemTexto.textContent = mensagem;
    modalMensagem.style.display = 'flex';
    modalCancelar.style.display = 'none';
    modalConfirmar.style.display = 'none';
}

modalCancelar.addEventListener('click', () => {
    modalConfirmacao.style.display = 'none';
    modalCallback = null;
});

modalConfirmar.addEventListener('click', () => {
    modalConfirmacao.style.display = 'none';
    if (modalCallback) {
        modalCallback();
        modalCallback = null;
    }
});

modalMensagemOk.addEventListener('click', () => {
    modalMensagem.style.display = 'none';
});

modalConfirmacao.addEventListener('click', (e) => {
    if (e.target === modalConfirmacao) {
        modalConfirmacao.style.display = 'none';
        modalCallback = null;
    }
});

modalMensagem.addEventListener('click', (e) => {
    if (e.target === modalMensagem) {
        modalMensagem.style.display = 'none';
    }
});

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

async function iniciarSistema() {
    try {
        await db.collection('_').get().catch(() => {
            throw new Error('Falha ao conectar ao Firebase');
        });
        
        await inicializarMesas();
        carregarMesas();
        await carregarProdutos();
        
        console.log('🚀 Sistema do Garçom inicializado com sucesso!');
        console.log('📝 Garçom: apenas faz pedidos. Caixa finaliza as contas.');
    } catch (error) {
        console.error('❌ Erro ao iniciar sistema:', error);
        mostrarMensagem('Erro ao conectar ao Firebase. Verifique sua configuração.');
    }
}

document.addEventListener('DOMContentLoaded', iniciarSistema);
