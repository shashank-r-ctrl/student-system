const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// READ
function readData() {
  if (!fs.existsSync("data.json")) return [];
  return JSON.parse(fs.readFileSync("data.json"));
}

// WRITE
function writeData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// ADD
app.post("/add", (req, res) => {
  const { reg, name, marks } = req.body;

  let data = readData();

  let student = data.find(s => s.reg === reg);

  if (!student) {
    student = { reg, name, marks: {} };
    data.push(student);
  }

  student.marks = marks;

  writeData(data);
  res.send("Saved");
});

// DELETE
app.delete("/delete/:reg", (req, res) => {
  let data = readData();
  data = data.filter(s => s.reg !== req.params.reg);
  writeData(data);
  res.send("Deleted");
});

// GET
app.get("/students", (req, res) => {
  res.json(readData());
});

// START SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});