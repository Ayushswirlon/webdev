document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseName = document.getElementById("expensee-name");
  const expenseAmount = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expense = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal();
  renderList();
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value.trim());
    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(),
        name: name,
        amount: amount,
      };
      expense.push(newExpense);
      saveExpensesTolocal();
      renderList();
      updateTotal();
      expenseName.value = "";
      expenseAmount.value = "";
    }
  });

  expenseList.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      expense = expense.filter((expense) => expense.id != expenseId);
      renderList();
      saveExpensesTolocal();
      updateTotal();
    }
  });

  function renderList() {
    expenseList.innerHTML = "";
    expense.forEach((exp) => {
      const newItem = document.createElement("li");
      newItem.innerHTML = `
        <span>${exp.name} - $${exp.amount}</span>
        <button data-id="${exp.id}">X</button>
        `;
      expenseList.appendChild(newItem);
    });
  }

  function calculateTotal() {
    return expense.reduce((sum, expense) => sum + expense.amount, 0);
  }
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }
  function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expense));
  }
});
