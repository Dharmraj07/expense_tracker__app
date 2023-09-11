function showToast(message) {
  const toast = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  
  if (message.trim() === '') {
      return; // Return if the input message is empty or contains only spaces
  }

  toastText.innerText = message;
  toast.classList.add("show");
  
  setTimeout(function () {
      toast.classList.remove("show");
  }, 3000); // Change '3000' to the desired duration (in milliseconds) for the toast to be visible
}

// Constants
const API_URL = "http://localhost:5000";
const leaderboardBtn = document.getElementById("leaderboard-btn");
const leaderboardDiv = document.getElementById("leaderboard");
const totalExpenseTable = document.getElementById("totalExpense");

const totalExpense = async () => {
  try {
    const usersExpense = await axios.get(`${API_URL}/alltransaction`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const users = usersExpense.data;
    totalExpenseTable.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td><b> ${user.username}</b></td>
      <td><b>$ ${user.totalExpense}</b></td>
      <td><b>$ ${user.totalIncome}</b></td>
    `;
      totalExpenseTable.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
};

// leaderboardBtn.addEventListener('click', function () {
//   totalExpense();
//   leaderboardDiv.classList.toggle('d-none');
// });

// Element references
const addExpenseForm = document.querySelector("#add-expense-form");
const expenseList = document.querySelector("#expense-list");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const viewTransactionsForm = document.querySelector("#view-transactions-form");
const logoutBtn = document.querySelector("#logout-btn");

// Initialization
document.querySelector("#date").value = new Date().toISOString().split("T")[0];
let currentPage = 1;

// Logout event listener
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
});

// Event Listener for adding expenses
addExpenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const expense = {
    amount: parseInt(document.querySelector("#amount").value),
    description: document.querySelector("#description").value,
    date: document.querySelector("#date").value,
    category: document.querySelector("#category").value,
    type: document.querySelector("#type").value,
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found.");

    if (
      !isNaN(expense.amount) &&
      expense.description.trim() !== "" &&
      expense.date !== "" &&
      expense.category !== "" &&
      expense.type !== ""
    ) {
      addExpenseForm.reset();
    }

    const response = await axios.post(`${API_URL}/transaction`, expense, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    addExpenseToTable(
      expense.amount,
      expense.description,
      expense.date,
      expense.category,
      expense.type,
      response.data._id
    );
  } catch (err) {
    console.error(err);
  }
});

// Event listener for Pagination - Previous button
prevBtn.addEventListener("click", () => {
  currentPage--;
  updateTransactionList();
});

// Event listener for Pagination - Next button
nextBtn.addEventListener("click", () => {
  currentPage++;
  updateTransactionList();
});

// Event listener for the form submission to view transactions
viewTransactionsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  currentPage = 1;
  updateTransactionList();
});

// Function to fetch and update transactions
const updateTransactionList = async () => {
  const limit = parseInt(document.querySelector("#limit").value);
  const timePeriod = document.querySelector("#time-period").value;

  try {
    const response = await axios.get(
      `${API_URL}/transaction?range=${timePeriod}&page=${currentPage}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Clear the list before appending new transactions
    expenseList.innerHTML = "";

    response.data.transactions.forEach((transaction) => {
      addExpenseToTable(
        transaction.amount,
        transaction.description,
        transaction.date.substring(0, 10),
        transaction.category,
        transaction.type,
        transaction._id
      );
    });

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = response.data.transactions.length < limit;
  } catch (error) {
    console.error(error);
  }
};

// Function to add an expense to the table
function addExpenseToTable(amount, description, date, category, type, id) {
  const expenseRow = document.createElement("tr");
  expenseRow.innerHTML = `
    <td>${date}</td>
    <td>${description}</td>
    <td>$${amount}</td>
    <td>${type}</td>
    <td><button type="button" id=${id} class="btn btn-danger btn-sm delete-btn">Delete</button></td>
  `;

  // Add event listener to the delete button
  expenseRow
    .querySelector(".delete-btn")
    .addEventListener("click", async () => {
      try {
        await axios.delete(`${API_URL}/transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        expenseRow.remove();
      } catch (error) {
        console.error(error);
      }
    });

  expenseList.appendChild(expenseRow);
}

//-----------------download  function-----------

const permiumUser = document.getElementById("permiumUser");
const premiumBtn = document.getElementById("rzp-button1");
if (localStorage.getItem("isPremium") === "true") {
  premiumBtn.style.display = "none";

} else {
  premiumBtn.innerHTML = " Buy Premium";
 
}

// premiumBtn.style.display = "none";
leaderboardBtn.addEventListener("click", function () {

  if (localStorage.getItem("isPremium") === "true") {
    totalExpense();
    leaderboardDiv.classList.toggle("d-none");
    permiumUser.textContent = "You are peremium user";

  } else {
    // premiumBtn.innerHTML = " Buy Premium";
    const words="Upgrade to premium for exclusive access to view and download comprehensive reports of other users' transactions, including expenses and income."
     showToast(words);   
  }
});
// permiumUser.textContent = "You are peremium user";

const downloadBtn = document.getElementById("download-btn");
if (localStorage.getItem("isPremium") === "true") {
  downloadBtn.addEventListener("click", async () => {
    try {
      let userID = localStorage.getItem("id");
      //const id = parseInt(userID);

      window.location.href = `${API_URL}/download/${userID}`;
    } catch (error) {
      console.error(error);
    }
  });
} else {
  downloadBtn.style.display = "none";
}

document.getElementById("rzp-button1").onclick = async function (event) {
  event.preventDefault();

  try {
    const response = await fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount: 50000,
      }),
    });

    const orderData = await response.json();
    console.log(orderData.data);

    const options = {
      key: "rzp_test_7qAFHG386WwU6c",
      amount: "50000",
      currency: "INR",
      order_id: orderData.id,
      handler: handlePaymentSuccess,
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
  }
};

// Handle successful payment
function handlePaymentSuccess(response) {
  alert(response.razorpay_payment_id);
  alert(response.razorpay_order_id);
  alert("Your payment is successful");
  location.reload();

  localStorage.setItem("isPremium", true);

  if (localStorage.getItem("isPremium") === true) {
    premiumBtn.style.display = "none";
  } else {
    premiumBtn.innerHTML = "Premium";
  }
}
