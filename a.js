// ===== DATA — LocalStorage se load karo =====
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ===== DOM Elements =====
const addBtn = document.getElementById('add-btn');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');

// ===== ADD TRANSACTION =====
addBtn.addEventListener('click', function() {

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  // Validation
  if (desc === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter valid description and amount!');
    return;
  }

  const transaction = {
    id: Date.now(),
    desc: desc,
    amount: amount,
    type: type
  };

  transactions.push(transaction);

  saveToLocalStorage();

  descInput.value = '';
  amountInput.value = '';

  updateUI();
});

// ===== DELETE TRANSACTION =====
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToLocalStorage();
  updateUI();
}

// ===== LOCALSTORAGE SAVE =====
function saveToLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== UPDATE UI =====
function updateUI() {

  transactionList.innerHTML = '';

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(function(t) {

    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${t.desc}</span>
      <span class="${t.type === 'income' ? 'amount-green' : 'amount-red'}">
        ${t.type === 'income' ? '+' : '-'}₹${t.amount}
      </span>
      <button onclick="deleteTransaction(${t.id})">🗑️</button>
    `;

    transactionList.appendChild(li);
  });

  // ← Ye line pehle missing thi — yahi bug tha
  const balance = totalIncome - totalExpense;

  balanceEl.textContent = '₹' + balance;
  totalIncomeEl.textContent = '₹' + totalIncome;
  totalExpenseEl.textContent = '₹' + totalExpense;
  balanceEl.style.color = balance < 0 ? '#ff6b6b' : 'white';

  updateChart(totalIncome, totalExpense);
}

// ===== PAGE LOAD PE UI UPDATE =====
updateUI();

// ===== CHART =====
let myChart = null;

function updateChart(income, expense) {
  const ctx = document.getElementById('myChart').getContext('2d');

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}