const salaryInput =
  document.getElementById("salaryInput");

const saveSalaryBtn =
  document.getElementById("saveSalaryBtn");

const expenseName =
  document.getElementById("expenseName");

const expenseAmount =
  document.getElementById("expenseAmount");

const addExpenseBtn =
  document.getElementById("addExpenseBtn");

const salaryDisplay =
  document.getElementById("salaryDisplay");

const expenseDisplay =
  document.getElementById("expenseDisplay");

const balanceDisplay =
  document.getElementById("balanceDisplay");

const expenseList =
  document.getElementById("expenseList");

const warningText =
  document.getElementById("warningText");

const currencySelect =
  document.getElementById("currencySelect");

const themeToggle =
  document.getElementById("themeToggle");

const downloadPdfBtn =
  document.getElementById("downloadPdfBtn");

const resetBtn =
  document.getElementById("resetBtn");

let salary =
  Number(localStorage.getItem("salary")) || 0;

let expenses =
  JSON.parse(
    localStorage.getItem("expenses")
  ) || [];

let theme =
  localStorage.getItem("theme") || "light";

let currency = "INR";

let chart;

const currencySymbols = {

  INR: "₹",

  USD: "$",

  EUR: "€",

  GBP: "£",

  JPY: "¥",

  AUD: "A$",

  CAD: "C$",

  SGD: "S$",

  AED: "د.إ"
};

const exchangeRates = {

  INR: 1,

  USD: 0.012,

  EUR: 0.011,

  GBP: 0.0095,

  JPY: 1.79,

  AUD: 0.018,

  CAD: 0.016,

  SGD: 0.016,

  AED: 0.044
};

if (theme === "dark") {

  document.body.classList.add("dark");

  themeToggle.innerHTML = `
    <i class="ri-sun-line"></i>
  `;
}

themeToggle.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "dark"
    );

    if (
      document.body.classList.contains(
        "dark"
      )
    ) {

      localStorage.setItem(
        "theme",
        "dark"
      );

      themeToggle.innerHTML = `
        <i class="ri-sun-line"></i>
      `;

    } else {

      localStorage.setItem(
        "theme",
        "light"
      );

      themeToggle.innerHTML = `
        <i class="ri-moon-clear-line"></i>
      `;
    }

    updateChart();
  }
);

resetBtn.addEventListener(
  "click",
  () => {

    const confirmReset =
      confirm(
        "Reset all data?"
      );

    if (!confirmReset) return;

    salary = 0;

    expenses = [];

    localStorage.removeItem(
      "salary"
    );

    localStorage.removeItem(
      "expenses"
    );

    updateUI();
  }
);

saveSalaryBtn.addEventListener(
  "click",
  () => {

    const value =
      Number(salaryInput.value);

    if (value <= 0) {

      alert(
        "Please enter valid salary"
      );

      return;
    }

    salary = value;

    localStorage.setItem(
      "salary",
      salary
    );

    salaryInput.value = "";

    updateUI();
  }
);

addExpenseBtn.addEventListener(
  "click",
  () => {

    const name =
      expenseName.value.trim();

    const amount =
      Number(expenseAmount.value);

    if (
      name === "" ||
      amount <= 0
    ) {

      alert(
        "Please enter valid expense"
      );

      return;
    }

    const expense = {

      id: Date.now(),

      name,

      amount
    };

    expenses.push(expense);

    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

    expenseName.value = "";
    expenseAmount.value = "";

    updateUI();
  }
);

function deleteExpense(id) {

  expenses = expenses.filter(
    expense => expense.id !== id
  );

  localStorage.setItem(
    "expenses",
    JSON.stringify(expenses)
  );

  updateUI();
}

currencySelect.addEventListener(
  "change",
  () => {

    currency =
      currencySelect.value;

    updateUI();
  }
);

function calculateExpenses() {

  return expenses.reduce(

    (total, expense) =>

      total + expense.amount,

    0
  );
}

function formatCurrency(amount) {

  const convertedAmount =

    amount *
    exchangeRates[currency];

  return `
    ${currencySymbols[currency]}
    ${convertedAmount.toFixed(2)}
  `;
}

function updateUI() {

  const totalExpenses =
    calculateExpenses();

  const balance =
    salary - totalExpenses;

  salaryDisplay.textContent =
    formatCurrency(salary);

  expenseDisplay.textContent =
    formatCurrency(totalExpenses);

  balanceDisplay.textContent =
    formatCurrency(balance);

  // WARNING

  if (
    salary > 0 &&
    balance < salary * 0.1
  ) {

    balanceDisplay.classList.add(
      "low-balance"
    );

    warningText.textContent =
      "Low Balance Warning";

  } else {

    balanceDisplay.classList.remove(
      "low-balance"
    );

    warningText.textContent = "";
  }

  // EXPENSE LIST

  expenseList.innerHTML = "";

  expenses.forEach(expense => {

    const li =
      document.createElement("li");

    li.classList.add("expense-item");

    li.innerHTML = `

      <div class="expense-info">

        <h4>${expense.name}</h4>

        <p>
          ${formatCurrency(expense.amount)}
        </p>

      </div>

      <button
        class="delete-btn"
        onclick="deleteExpense(${expense.id})"
      >
        <i class="ri-delete-bin-line"></i>
      </button>
    `;

    expenseList.appendChild(li);
  });

  updateChart();
}

function updateChart() {

  const ctx =
    document.getElementById(
      "expenseChart"
    );

  if (chart) {

    chart.destroy();
  }

  if (expenses.length === 0) {

    chart = new Chart(ctx, {

      type: "doughnut",

      data: {

        labels: ["No Expenses"],

        datasets: [{

          data: [1],

          backgroundColor: [
            "#94a3b8"
          ],

          borderWidth: 0
        }]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            position: "bottom",

            labels: {

              color:
                getComputedStyle(
                  document.body
                ).getPropertyValue(
                  "--text-color"
                )
            }
          }
        }
      }
    });

    return;
  }

  const labels =
    expenses.map(
      expense => expense.name
    );

  const data =
    expenses.map(
      expense => expense.amount
    );

  const colors = [

    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
    "#f97316"
  ];

  chart = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels,

      datasets: [{

        data,

        backgroundColor:
          colors,

        hoverOffset: 12,

        borderWidth: 0
      }]
    },

    options: {

      responsive: true,

      cutout: "68%",

      animation: {

        animateRotate: true,

        duration: 1200
      },

      plugins: {

        legend: {

          position: "bottom",

          labels: {

            padding: 20,

            usePointStyle: true,

            color:
              getComputedStyle(
                document.body
              ).getPropertyValue(
                "--text-color"
              )
          }
        }
      }
    }
  });
}

downloadPdfBtn.addEventListener(
  "click",
  () => {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "Cash Flow Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Salary:
      ${formatCurrency(salary)}`,
      20,
      40
    );

    let y = 60;

    expenses.forEach(expense => {

      doc.text(

        `${expense.name}
        -
        ${formatCurrency(expense.amount)}`,

        20,

        y
      );

      y += 10;
    });

    const totalExpenses =
      calculateExpenses();

    const balance =
      salary - totalExpenses;

    doc.text(

      `Remaining Balance:
      ${formatCurrency(balance)}`,

      20,

      y + 20
    );

    doc.save(
      "cash-flow-report.pdf"
    );
  }
);

updateUI();