// app.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Route to show form
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>User Form</title>
      <style>
        body { font-family: Arial; margin: 50px; }
        input, textarea { width: 300px; padding: 8px; margin: 5px 0; }
        button { background: #007bff; color: white; padding: 8px 16px; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <h1>Contact Form</h1>
      <form action="/submit" method="POST">
        <label>Name:</label><br>
        <input type="text" name="name" required><br>

        <label>Email:</label><br>
        <input type="email" name="email" required><br>

        <label>Message:</label><br>
        <textarea name="message" required></textarea><br>

        <button type="submit">Submit</button>
      </form>
    </body>
    </html>
  `);
});

// Route to handle form submission
app.post("/submit", (req, res) => {
  const { name, email, message } = req.body;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Result</title>
      <style>
        body { font-family: Arial; margin: 50px; }
        p { font-size: 18px; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>Form Submitted Successfully!</h1>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      <a href="/">Go Back</a>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
