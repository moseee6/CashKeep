/*  */

// 
let transactions = JSON.parse(localStorage.getItem('vault_data')) || [];

// 
const balanceDisplay = document.getElementById('sum');
const inflowDisplay = document.getElementById('in');
const outflowDisplay = document.getElementById('out');
const transactionForm = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const emptyMessage = document.getElementById('emptyMessage');

// 
function updateValues() {
    const amounts = transactions.map(t => t.type === 'income' ? Number(t.amount) : -Number(t.amount));
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    if (balanceDisplay) balanceDisplay.innerText = `Ksh ${total}`;
    if (inflowDisplay) inflowDisplay.innerText = `${income}`;
    if (outflowDisplay) outflowDisplay.innerText = `${expense}`;
}

// 4. Add Transaction (For add.html)
if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const type = document.getElementById('type').value;

        const newTransaction = {
            id: Date.now(),
            name,
            amount,
            category,
            type,
            date: new Date().toLocaleDateString()
        };

        transactions.push(newTransaction);
        updateLocalStorage();
        alert("VAULT AUTHORIZED: Entry Recorded.");
        window.location.href = 'index.html'; // Redirect to dashboard
    });
}

// 5. Build Audit History (For history.html)
function renderHistory() {
    if (!transactionList) return;

    transactionList.innerHTML = '';
    
    if (transactions.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }

    transactions.sort((a, b) => b.id - a.id).forEach(t => {
        const row = document.createElement('tr');
        const color = t.type === 'income' ? '#10b981' : '#ef4444';
        const prefix = t.type === 'income' ? '+' : '-';

        row.innerHTML = `
            <td style="padding: 20px; color: #fff; font-size: 13px;">
                ${t.name}<br>
                <small style="color: #475569;">${t.date} | ID: ${t.id}</small>
            </td>
            <td style="color: #94a3b8; font-size: 12px;">${t.category}</td>
            <td style="color: ${color}; font-weight: 800;">${prefix} Ksh ${t.amount}</td>
            <td style="text-align: right; padding: 20px;">
                <button onclick="removeTransaction(${t.id})" style="background: none; border: none; color: #334155; cursor: pointer; font-size: 10px; font-weight: 700;">DELETE</button>
            </td>
        `;
        transactionList.appendChild(row);
    });
}

// 6. Security Functions
function removeTransaction(id) {
    if (confirm("Permanently delete this record?")) {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    }
}

function clearVault() {
    if (confirm("DANGER: This will wipe all historical logs. Proceed?")) {
        transactions = [];
        updateLocalStorage();
        init();
    }
}

// 7. System Sync
function updateLocalStorage() {
    localStorage.setItem('vault_data', JSON.stringify(transactions));
}

function init() {
    updateValues();
    renderHistory();
}

init();