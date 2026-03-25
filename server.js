const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// 🔥 TEMP DATABASE (array)
let students = [];
let id = 1;

// ADD student
app.post("/add-student", (req, res) => {
  const { name, age, course, marks } = req.body;

  const newStudent = {
    id: id++,
    name,
    age,
    course,
    marks: Number(marks)
  };

  students.push(newStudent);
  res.send("Student Added");
});

// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// GET toppers
app.get("/toppers", (req, res) => {
  const toppers = students.filter(s => s.marks >= 80);
  res.json(toppers);
});

// DELETE
app.delete("/delete/:id", (req, res) => {
  const studentId = parseInt(req.params.id);
  students = students.filter(s => s.id !== studentId);
  res.send("Deleted");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});