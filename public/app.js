// Get references to key elements in the HTML for later use.
const grid = document.querySelector("#grid tbody"); // The table body where rows will be inserted
const form = document.querySelector("#newLead"); // The 'Add lead' form
const q = document.querySelector("#q"); // The search input field
const statusSel = document.querySelector("#status"); // The status dropdown/select

// Attach an event listener to the "Apply" filter button, making it call 'load()' when clicked.
document.querySelector("#applyFilters").addEventListener("click", load);

// Attach an event listener to the form's 'submit' event.
// 'async(e)' means this function can use 'await' for network requests.
form.addEventListener("submit", async (e) => {
  // Stop the form from doing a default page reload, which is the browser's default behavior.
  e.preventDefault();
  // Create a FormData object from the form, then convert it to a plain JS object.
  const data = Object.fromEntries(new FormData(form).entries());

  // Send the data to the server's POST endpoint using 'fetch'. 'await' pauses the function until the server responds.
  const res = await fetch("/api/leads/", {
    method: "POST", // Specify the HTTP method for creating data.
    headers: { "Content-type": "application/json" }, // Tell the server we are sending JSON data.
    body: JSON.stringify(data), // Convert the JS object to a JSON string for sending.
  });
  // If the server responded with an error (e.g., 400 validation error), show an alert.
  if (!res.ok) {
    alert("Validation failed");
    return;
  }

  form.reset(); // Clear the form fields for the next entry.
  await load(); // Reload the grid to show the newly added lead.
});

// This is the main function to fetch and display all leads from the server.
async function load() {
  // Create a URLSearchParams object to easily build the query string (e.g., ?q=test&status=New).
  const params = new URLSearchParams();
  // If the search box has a value, add it to the query parameters.
  if (q.value) params.set("q", q.value);
  // If the status dropdown has a value, add it.
  if (statusSel.value) params.set("status", statusSel.value);
  // Fetch the leads from the API, appending the query parameters string.
  const res = await fetch("/api/leads?" + params.toString());
  const leads = await res.json();

  // For each lead object in the array, call the 'row' function to get its HTML string.
  // Then, join all the HTML strings together into one big string and update the grid.
  grid.innerHTML = leads.map(row).join("");

  // After creating the new rows and buttons, we must attach event listeners to them.
  bindActions();
}

// This function is a template. It takes a lead object 'l' and returns an HTML string for its table row.
function row(l) {
  // Use a template literal (backticks) for easy multi-line HTML and variable insertion.
  return `<tr>
    <td>${l.name}</td>
    <td>${l.email}</td>
    <td>${l.company || ""}</td> <!-- Show empty string if company is null/undefined -->
    <td>${l.status}</td>
    <td>
      <!-- Use 'data-id' to store the lead's ID on the button -->
      <!-- Use 'data-s' to store the new status this button will set -->
      <button class="link" data-id="${l.id}" data-s="Contacted">Mark contacted</button>
      <button class="link" data-id="${l.id}" data-s="Qualified">Mark qualified</button>
      <button class="link" data-id="${l.id}" data-s="Lost">Mark lost</button>
    </td>
  </tr>`;
}
// This function attaches click listeners to all action buttons currently in the grid.
function bindActions() {
      // Find all buttons with class "link" inside the grid.
      document.querySelectorAll("#grid button.link").forEach(b => {
        // Add a click listener to each button.
        b.addEventListener("click", async () => {
      // When clicked, send a PATCH request to the server to update the status.
        await fetch("/api/leads/"+ b.dataset.id, {// Use the ID from the button's data-id
        method: "PATCH", // Use PATCH for partial updates
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ status: b.dataset.s}) // Send the new status from data-s
      });
      load(); // Reload the grid to show the change.
        });
        });
}


// Initial load of data when the script first runs.
load();
