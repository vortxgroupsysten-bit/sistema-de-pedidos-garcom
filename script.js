/* ========================================== */
/* RESET E BASE                               */
/* ========================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #e74c3c;
    --primary-dark: #c0392b;
    --success: #27ae60;
    --success-dark: #1e8449;
    --warning: #f39c12;
    --gray: #95a5a6;
    --gray-light: #ecf0f1;
    --gray-dark: #2c3e50;
    --white: #ffffff;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --radius: 12px;
    --radius-sm: 8px;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--gray-light);
    color: var(--gray-dark);
    min-height: 100vh;
    padding: 16px;
    max-width: 480px;
    margin: 0 auto;
    padding-bottom: 100px;
}

/* ========================================== */
/* HEADER                                     */
/* ========================================== */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    margin-bottom: 16px;
    gap: 8px;
    flex-wrap: wrap;
}

.header h1 {
    font-size: 22px;
    font-weight: 800;
    color: var(--gray-dark);
    letter-spacing: -0.5px;
}

.header-actions {
    font-size: 14px;
    color: var(--gray);
}

.btn-voltar {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    padding: 4px 8px;
    color: var(--gray-dark);
    transition: transform 0.2s;
}

.btn-voltar:active {
    transform: scale(0.9);
}

.status-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    background: var(--success);
    color: white;
}

.status-badge.ocupada {
    background: var(--primary);
}

/* ========================================== */
/* MESAS                                      */
/* ========================================== */
.grid-mesas {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.card-mesa {
    background: var(--white);
    border-radius: var(--radius);
    padding: 16px 8px;
    text-align: center;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    border: 3px solid transparent;
    position: relative;
}

.card-mesa:active {
    transform: scale(0.95);
}

.card-mesa .numero {
    font-size: 20px;
    font-weight: 700;
    display: block;
}

.card-mesa .status {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 12px;
    display: inline-block;
    margin-top: 4px;
}

.card-mesa.disponivel {
    border-color: var(--success);
}

.card-mesa.disponivel .status {
    background: var(--success);
    color: white;
}

.card-mesa.ocupada {
    border-color: var(--primary);
}

.card-mesa.ocupada .status {
    background: var(--primary);
    color: white;
}

.card-mesa .badge-pedidos {
    position: absolute;
    top: -6px;
    right: -6px;
    background: var(--warning);
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ========================================== */
/* TELAS                                      */
/* ========================================== */
.tela {
    display: block;
}

.tela[style*="display: none"] {
    display: none !important;
}

/* ========================================== */
/* SEÇÕES                                     */
/* ========================================== */
.secao {
    background: var(--white);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: var(--shadow);
}

.secao h2 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
    color: var(--gray-dark);
}

/* ========================================== */
/* PRODUTOS                                   */
/* ========================================== */
.lista-produtos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.btn-produto {
    background: var(--gray-light);
    border: none;
    border-radius: var(--radius-sm);
    padding: 12px 8px;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
}

.btn-produto:active {
    transform: scale(0.95);
}

.btn-produto .nome {
    font-size: 14px;
    font-weight: 600;
    display: block;
}

.btn-produto .preco {
    font-size: 12px;
    color: var(--gray);
    display: block;
    margin-top: 2px;
}

/* ========================================== */
/* CARRINHO                                   */
/* ========================================== */
.carrinho-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.badge-itens {
    background: var(--gray-light);
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.lista-carrinho {
    max-height: 300px;
    overflow-y: auto;
}

/* ========================================== */
/* ITEM DO CARRINHO                          */
/* ========================================== */
.item-carrinho {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid var(--gray-light);
}

.item-carrinho:last-child {
    border-bottom: none;
}

.item-carrinho .info {
    flex: 1;
    min-width: 0;
}

.item-carrinho .nome-item {
    font-size: 14px;
    font-weight: 600;
}

.item-carrinho .preco-item {
    font-size: 12px;
    color: var(--gray);
}

.item-carrinho .controles {
    display: flex;
    align-items: center;
    gap: 4px;
}

.item-carrinho .controles button {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    background: var(--gray-light);
    color: var(--gray-dark);
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-carrinho .controles button:active {
    background: var(--gray);
}

.item-carrinho .controles .qtd {
    font-weight: 700;
    font-size: 16px;
    min-width: 24px;
    text-align: center;
}

.item-carrinho .subtotal {
    font-size: 13px;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
}

.btn-excluir-item {
    background: none;
    border: none;
    color: var(--primary);
    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
    font-weight: 700;
}

/* ========================================== */
/* CARRINHO TOTAL                            */
/* ========================================== */
.carrinho-total {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-top: 2px solid var(--gray-light);
    margin-top: 8px;
    font-size: 18px;
    font-weight: 700;
}

.total-valor {
    color: var(--primary);
}

/* ========================================== */
/* BOTÕES                                     */
/* ========================================== */
.btn-principal {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: var(--radius);
    background: var(--primary);
    color: white;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
}

.btn-principal:active {
    transform: scale(0.98);
}

.btn-principal:disabled {
    background: var(--gray);
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-secundario {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: var(--radius);
    background: var(--success);
    color: white;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    margin-top: 8px;
}

.btn-secundario:active {
    transform: scale(0.98);
}

.carrinho-actions {
    margin-top: 8px;
}

/* ========================================== */
/* MODAL                                      */
/* ========================================== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: var(--radius);
    padding: 24px;
    max-width: 340px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-mensagem {
    font-size: 16px;
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    gap: 8px;
}

.modal-actions button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-modal-cancelar {
    background: var(--gray-light);
    color: var(--gray-dark);
}

.btn-modal-confirmar {
    background: var(--primary);
    color: white;
}

#modalMensagemOk {
    background: var(--primary);
    color: white;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

/* ========================================== */
/* RESPONSIVO                                 */
/* ========================================== */
@media (max-width: 400px) {
    .grid-mesas {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    }
    
    .lista-produtos {
        grid-template-columns: 1fr 1fr;
    }
    
    .card-mesa .numero {
        font-size: 16px;
    }
    
    .header h1 {
        font-size: 18px;
    }
}

@media (min-width: 481px) {
    body {
        max-width: 600px;
        padding: 24px;
    }
    
    .grid-mesas {
        grid-template-columns: repeat(5, 1fr);
    }
    
    .lista-produtos {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 768px) {
    body {
        max-width: 800px;
    }
    
    .grid-mesas {
        grid-template-columns: repeat(5, 1fr);
    }
    
    .lista-produtos {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* ========================================== */
/* UTILITÁRIOS                                */
/* ========================================== */
.texto-vazio {
    text-align: center;
    color: var(--gray);
    padding: 20px 0;
    font-size: 14px;
}

.oculto {
    display: none !important;
}
