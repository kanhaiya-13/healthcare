const express = require("express");
const connection = require("./db");

const app = express();
app.use(express.json()); // To parse JSON request bodies

// CRUD Routes for Doctors (as an example)
app.get("/doctors", (req, res) => {
  connection.query("SELECT * FROM doctors", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/doctors", (req, res) => {
  const { name, specialty } = req.body;
  const query = "INSERT INTO doctors (name, specialty) VALUES (?, ?)";
  connection.query(query, [name, specialty], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(201)
        .json({ message: "Doctor added successfully", id: results.insertId });
    }
  });
});

app.put("/doctors/:id", (req, res) => {
  const { id } = req.params;
  const { name, specialty } = req.body;
  const query = "UPDATE doctors SET name = ?, specialty = ? WHERE id = ?";
  connection.query(query, [name, specialty, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Doctor updated successfully" });
    }
  });
});

app.delete("/doctors/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM doctors WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Doctor deleted successfully" });
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
