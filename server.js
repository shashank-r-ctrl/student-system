const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// 🔥 TEMP DATABASE
let students = [];

// ADD STUDENT
app.post("/add", (req, res) => {
  const { reg_no, name, subject, marks } = req.body;

  students.push({
    reg_no,
    name,
    subject,
    marks: Number(marks)
  });

  console.log("Added:", req.body);

  res.send("Added");
});

// GET ALL STUDENTS (GROUPED)
app.get("/students", (req, res) => {
  const grouped = {};

  students.forEach(s => {
    if (!grouped[s.reg_no]) {
      grouped[s.reg_no] = {
        name: s.name,
        subjects: []
      };
    }

    grouped[s.reg_no].subjects.push({
      subject: s.subject,
      marks: s.marks
    });
  });

  res.json(grouped);
});

// SUBJECT TOPPERS
app.get("/toppers", (req, res) => {
  const subjectMap = {};

  students.forEach(s => {
    if (!subjectMap[s.subject] || subjectMap[s.subject].marks < s.marks) {
      subjectMap[s.subject] = s;
    }
  });

  res.json(subjectMap);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});