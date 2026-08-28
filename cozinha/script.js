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
const pedidosRef = db.collection('pedidos');

// ==========================================
// ELEMENTOS DOM
// ==========================================
const listaPedidos = document.getElementById('listaPedidos');
const estadoVazio = document.getElementById('estadoVazio');
const qtdPedidos = document.getElementById('qtdPedidos');
const horaAtual = document.getElementById('horaAtual');

// ==========================================
// MODAL DE MENSAGEM
// ==========================================
const modalMensagem = document.getElementById('modalMensagem');
const mensagemTexto = document.getElementById('mensagemTexto');
const modalMensagemOk = document.getElementById('modalMensagemOk');

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Atualiza o relógio
function atualizarRelogio() {
    const now = new Date();
    horaAtual.textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
atualizarRelogio();
setInterval(atualizarRelogio, 30000);

// ==========================================
// CARREGAR PEDIDOS EM TEMPO REAL
// ==========================================

function carregarPedidos() {
    // ==========================================
    // Escuta apenas pedidos com status "aguardando"
    // Ordena por data de criação (mais antigos primeiro)
    // ==========================================
    pedidosRef
        .where('status', '==', 'aguardando')
        .orderBy('criadoEm', 'asc')
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                // Nenhum pedido aguardando
                listaPedidos.innerHTML = '';
                estadoVazio.style.display = 'block';
                qtdPedidos.textContent = '0';
                return;
            }
            
            estadoVazio.style.display = 'none';
            qtdPedidos.textContent = snapshot.size;
            
            // Limpa a lista antes de renderizar
            listaPedidos.innerHTML = '';
            
            // ==========================================
            // Renderiza cada pedido
            // ==========================================
            snapshot.forEach(doc => {
                const pedido = { id: doc.id, ...doc.data() };
                renderizarPedido(pedido);
            });
            
        }, (error) => {
            console.error('❌ Erro ao carregar pedidos:', error);
            mostrarMensagem('Erro ao carregar pedidos. Verifique sua conexão.');
        });
}

// ==========================================
// RENDERIZAR PEDIDO
// ==========================================

function renderizarPedido(pedido) {
    const card = document.createElement('div');
    card.className = 'card-pedido';
    
    // ==========================================
    // Formata a hora do pedido
    // ==========================================
    let horaPedido = '--:--';
    if (pedido.criadoEm) {
        const data = pedido.criadoEm.toDate ? pedido.criadoEm.toDate() : new Date(pedido.criadoEm);
        horaPedido = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    
    // ==========================================
    // Monta a lista de itens
    // ==========================================
    let itensHTML = '';
    pedido.itens.forEach(item => {
        itensHTML += `
            <div class="item">
                <span class="qtd">${item.quantidade}x</span>
                <span class="nome">${item.nome}</span>
            </div>
        `;
    });
    
    // ==========================================
    // Monta o card
    // ==========================================
    card.innerHTML = `
        <div class="cabecalho">
            <span class="mesa">🍽️ Mesa ${pedido.mesaNumero}</span>
            <span class="hora">⏱️ ${horaPedido}</span>
        </div>
        <div class="itens">
            ${itensHTML}
        </div>
        <div class="acoes">
            <button class="btn-pronto" data-id="${pedido.id}">
                ✅ MARCAR COMO PRONTO
            </button>
        </div>
    `;
    
    // ==========================================
    // Adiciona evento para marcar como pronto
    // ==========================================
    const btnPronto = card.querySelector('.btn-pronto');
    btnPronto.addEventListener('click', async () => {
        try {
            // Atualiza o status do pedido para "pronto"
            await pedidosRef.doc(pedido.id).update({
                status: 'pronto',
                prontoEm: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log(`✅ Pedido ${pedido.id} marcado como pronto`);
            
            // O pedido desaparecerá automaticamente devido ao onSnapshot
            
        } catch (error) {
            console.error('❌ Erro ao marcar pedido como pronto:', error);
            mostrarMensagem('Erro ao marcar pedido como pronto. Verifique sua conexão.');
        }
    });
    
    listaPedidos.appendChild(card);
}

// ==========================================
// MODAL DE MENSAGEM
// ==========================================

function mostrarMensagem(mensagem) {
    mensagemTexto.textContent = mensagem;
    modalMensagem.style.display = 'flex';
}

modalMensagemOk.addEventListener('click', () => {
    modalMensagem.style.display = 'none';
});

modalMensagem.addEventListener('click', (e) => {
    if (e.target === modalMensagem) {
        modalMensagem.style.display = 'none';
    }
});

// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================

function iniciarSistema() {
    try {
        // Verifica conexão com Firebase
        db.collection('_').get().catch(() => {
            throw new Error('Falha ao conectar ao Firebase');
        });
        
        // Carrega pedidos em tempo real
        carregarPedidos();
        
        console.log('🚀 Sistema da Cozinha inicializado com sucesso!');
        console.log('⏳ Aguardando pedidos...');
    } catch (error) {
        console.error('❌ Erro ao iniciar sistema:', error);
        mostrarMensagem('Erro ao conectar ao Firebase. Verifique sua configuração.');
    }
}

// Inicia o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', iniciarSistema);