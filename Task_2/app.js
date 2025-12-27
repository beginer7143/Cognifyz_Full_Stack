// Run this file with: node app.js
// Make sure you have express and body-parser installed using:
// npm install express body-parser

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Temporary in-memory storage
let submittedData = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form directly
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Complex Form</title>
      <style>
          body { font-family: Arial; margin: 40px; background: #f9f9f9; }
          form { background: white; padding: 20px; border-radius: 8px; width: 350px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          input, select { width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: 1px solid #ccc; }
          button { background: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; }
          button:hover { background: #0056b3; }
          .error { color: red; margin-bottom: 10px; }
      </style>
  </head>
  <body>
      <h2>Registration Form</h2>
      <form id="userForm" method="POST" action="/submit" onsubmit="return validateForm()">
          <input type="text" id="name" name="name" placeholder="Full Name">
          <input type="email" id="email" name="email" placeholder="Email Address">
          <input type="number" id="age" name="age" placeholder="Age">
          <input type="password" id="password" name="password" placeholder="Password">
          <select name="gender" id="gender">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
          </select>
          <div id="errorMessages" class="error"></div>
          <button type="submit">Submit</button>
      </form>

      <script>
          function validateForm() {
              const errors = [];
              const name = document.getElementById('name').value.trim();
              const email = document.getElementById('email').value.trim();
              const age = parseInt(document.getElementById('age').value);
              const password = document.getElementById('password').value;
              const gender = document.getElementById('gender').value;

              if (name.length < 3) errors.push("Name must be at least 3 characters long.");
              if (!email.includes("@")) errors.push("Invalid email address.");
              if (!age || age < 18) errors.push("Age must be 18 or older.");
              if (password.length < 6) errors.push("Password must be at least 6 characters long.");
              if (gender === "") errors.push("Please select your gender.");

              const errorDiv = document.getElementById("errorMessages");
              if (errors.length > 0) {
                  errorDiv.innerHTML = errors.join("<br>");
                  return false;
              }

              errorDiv.innerHTML = "";
              return true;
          }
      </script>
  </body>
  </html>
  `);
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, age, password, gender } = req.body;
  const errors = [];

  // Server-side validation
  if (!name || name.length < 3) errors.push('Name must be at least 3 characters.');
  if (!email || !email.includes('@')) errors.push('Invalid email address.');
  if (!age || isNaN(age) || age < 18) errors.push('Age must be 18 or older.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (!gender) errors.push('Please select gender.');

  if (errors.length > 0) {
    res.send(`
      <h3>Validation Errors:</h3>
      <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
      <a href="/">Go Back</a>
    `);
  } else {
    // Store validated data temporarily
    submittedData.push({ name, email, age, gender });

    res.send(`
      <h2>Form submitted successfully!</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <a href="/">Submit Another</a> | <a href="/data">View All Submissions</a>
    `);
  }
});

// Display all submitted data
app.get('/data', (req, res) => {
  res.send(`
    <h2>Submitted User Data</h2>
    <pre>${JSON.stringify(submittedData, null, 2)}</pre>
    <a href="/">Go Back</a>
  `);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
