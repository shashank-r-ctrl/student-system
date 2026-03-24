const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ADD student
app.post("/add-student", (req, res) => {
  const { name, age, course, marks } = req.body;

  const sql = "INSERT INTO students (name, age, course, marks) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, age, course, marks], (err) => {
    if (err) return res.send(err);
    res.send("Student Added");
  });
});

// GET all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// GET toppers
app.get("/toppers", (req, res) => {
  db.query("SELECT * FROM students WHERE marks >= 80", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
});

// DELETE student
app.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM students WHERE id=?", [req.params.id], () => {
    res.send("Deleted");
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});