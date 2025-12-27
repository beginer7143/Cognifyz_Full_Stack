// ====== app.js ======
// A single Node.js + Express + Frontend app

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory user data
let users = [
  { id: 1, name: "Rachit", email: "rachit@example.com" },
  { id: 2, name: "Priya", email: "priya@example.com" }
];

// ---------------------------
// RESTful API Endpoints
// ---------------------------

// GET all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// POST create user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email required" });

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.find((u) => u.id == id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name || user.name;
  user.email = email || user.email;
  res.json(user);
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id != id);
  res.json({ message: "User deleted successfully" });
});

// ---------------------------
// Serve Frontend HTML
// ---------------------------

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Management | Full Stack App</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>

<body class="bg-light">
  <div class="container mt-5">
    <h1 class="text-center mb-4">User Management (Full Stack App)</h1>

    <!-- Add User Form -->
    <div class="card p-4 mb-4">
      <h4>Add New User</h4>
      <form id="userForm">
        <div class="row g-3">
          <div class="col-md-5">
            <input type="text" id="name" class="form-control" placeholder="Enter name" required />
          </div>
          <div class="col-md-5">
            <input type="email" id="email" class="form-control" placeholder="Enter email" required />
          </div>
          <div class="col-md-2">
            <button class="btn btn-primary w-100" type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Display Users -->
    <div class="card p-4">
      <h4>All Users</h4>
      <table class="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody id="userTable"></tbody>
      </table>
    </div>
  </div>

  <script>
    const API_URL = "/api/users";
    const userTable = document.getElementById("userTable");
    const userForm = document.getElementById("userForm");

    // Fetch & display all users
    async function fetchUsers() {
      const res = await fetch(API_URL);
      const data = await res.json();
      userTable.innerHTML = "";
      data.forEach((u) => {
        userTable.innerHTML += \`
          <tr>
            <td>\${u.id}</td>
            <td><input type="text" value="\${u.name}" class="form-control form-control-sm" id="name-\${u.id}"></td>
            <td><input type="email" value="\${u.email}" class="form-control form-control-sm" id="email-\${u.id}"></td>
            <td>
              <button class="btn btn-success btn-sm me-1" onclick="updateUser(\${u.id})">Update</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(\${u.id})">Delete</button>
            </td>
          </tr>\`;
      });
    }

    // Add user
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      userForm.reset();
      fetchUsers();
    });

    // Update user
    async function updateUser(id) {
      const name = document.getElementById(\`name-\${id}\`).value;
      const email = document.getElementById(\`email-\${id}\`).value;
      await fetch(\`\${API_URL}/\${id}\`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      fetchUsers();
    }

    // Delete user
    async function deleteUser(id) {
      await fetch(\`\${API_URL}/\${id}\`, { method: "DELETE" });
      fetchUsers();
    }

    // Load users initially
    fetchUsers();
  </script>
</body>
</html>
  `);
});

// ---------------------------
// Start the Server
// ---------------------------
app.listen(port, () => {
  console.log(`🚀 Full stack app running at http://localhost:${port}`);
});
