// Import built-in Node.js modules
const path = require("path"); // For handling file paths
const fs = require("fs"); // For reading/writing files (File System)

// Import third-party module (from 'npm i express')
const express = require("express");
const app = express(); // Initialise the Express application

// Set up port. Use cloud's port if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;
// Define the absolute path to our JSON data file. '__dirname' is the current folder.
const DATA = path.join(__dirname, "leads.json");

// --- 3. Middleware Configuration ---
// 'app.use()' adds middleware. Middleware runs on *every* request before our routes.
// This middleware parses incoming request bodies with URL-encoded payloads (like HTML forms).
app.use(express.urlencoded({ extended: true }));
// This middleware parses incoming request bodies with JSON payloads (e.g., from 'fetch' in our app.js).
app.use(express.json());
// This middleware serves static files (HTML, CSS, JS) from the 'public' directory automatically.
app.use(express.static(path.join(__dirname, "public")));

// --- 4. Data Helper Functions ---
// This function safely reads the leads from 'leads.json'.
function readLeads() {
  // Check if the 'leads.json' file exists.
  if (!fs.existsSync(DATA)) return []; // If not, return an empty array to prevent errors.
  // Read the file's content (synchronously), parse the JSON string into an object, and return it.
  return JSON.parse(fs.readFileSync(DATA, "UTF-8"));
}

// This function safely writes the leads array back to 'leads.json'.
function writeLeads(leads) {
  // Write the 'leads' array to the file as a pretty-printed JSON string (null, 2 for indentation).
  fs.writeFileSync(DATA, JSON.stringify(leads, null, 2));
}

/* --- 5. API Routes (The server's brain) --- */

// [R]ead: Handle GET requests to '/api/leads' to read and filter all leads.
app.get("/api/leads", (req, res) => {
  // Get the 'q' (search query) from the URL (e.g., ?q=test), or default to "".
  const q = (req.query.q || "").toLowerCase();
  // Get the 'status' from the URL (e.g., ?status=New), or default to "".
  const status = (req.query.status || "").toLowerCase();
  let list = readLeads(); // Read all leads from the JSON file.
  // Filter by search query 'q' if it exists.
  if (q)
    list = list.filter((l) => (l.name + l.company).toLowerCase().includes(q));
  // Filter by 'status' if it exists.
  if (status) list = list.filter((l) => l.status.toLowerCase() === status);
  res.json(list); // Send the final list as a JSON response
});

// [C]reate: Handle POST requests to '/api/leads' to create a new lead.
app.post(
  "/api/leads",
  (req,res) => {
    // Get the lead data from the JSON body sent by the client.
    const { name, email, company, source, notes } = req.body;
    // Simple validation: check if required fields are missing.
    if (!name || !email)
      return res.status(400).json({ error: "Name and email are required." });
    const leads = readLeads();
    // Create a new lead object with defaults
    const lead = {
      id: Date.now().toString(),
      name,
      email,
      company: company || "",
      source: source || "",
      notes: notes || "",
      status: "New",
      createdAt: new Date().toISOString(),
    };
    leads.push(lead); // Add to the array
    writeLeads(leads); // Save to the file
    res.status(201).json(lead); // Respond with "201 Created" and the new lead.
  })


// [U]pdate: Handle PATCH requests to '/api/leads/:id' to update a lead.
app.patch("/api/leads/:id", (req, res) => {
  const leads = readLeads();
  // Find the index of the lead with the matching ID from the URL parameter.
  const idx = leads.findIndex((l) => l.id === req.params.id);
  // If not found, send a 404 "Not Found" error.
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  // Only allow 'status' and 'notes' fields to be updated for safety.
  const allowed = ["status", "notes"];
  for (const k of allowed) {
    // If the incoming request body has a key that is in the 'allowed' list...
    if (req.body[k] !== undefined) {
      // ...update that key on the lead object.
      leads[idx][k] = req.body[k];
    }
  }
  writeLeads(leads); // Save changes
  res.json(leads[idx]); // Respond with the updated lead.
});


// --- 6. Root Route ---
// Handle GET requests to the root URL (e.g., http://localhost:3000/)
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));


// --- 7. Server Start ---
// Start the server and listen for connections on the defined PORT.
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));