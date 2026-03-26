const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔥 OpenAI (USE ENV VARIABLE)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔥 MongoDB
mongoose.connect("mongodb://shashank233_db_user:1234@ac-l0ucolh-shard-00-00.oum1lrt.mongodb.net:27017,ac-l0ucolh-shard-00-01.oum1lrt.mongodb.net:27017,ac-l0ucolh-shard-00-02.oum1lrt.mongodb.net:27017/studentDB?ssl=true&replicaSet=atlas-hyzgrf-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(()=>console.log("🔥 MongoDB Connected"))
.catch(err=>console.log(err));

// Schema
const studentSchema = new mongoose.Schema({
  reg:String,
  name:String,
  marks:{
    math:Number,
    science:Number,
    english:Number,
    social:Number,
    computer:Number
  }
});

const Student = mongoose.model("Student", studentSchema);

// ADD / UPDATE
app.post("/add", async (req,res)=>{
  const {reg,name,marks} = req.body;

  let s = await Student.findOne({reg});
  if(!s) s = new Student({reg,name,marks});
  else s.marks = marks;

  await s.save();
  res.send("Saved");
});

// DELETE
app.delete("/delete/:id", async (req,res)=>{
  await Student.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// GET
app.get("/students", async (req,res)=>{
  const data = await Student.find().sort({_id:-1});
  res.json(data);
});

// 🤖 AI CHAT
app.post("/chat", async (req,res)=>{
  const {question} = req.body;

  const students = await Student.find();

  const prompt = `
You are a smart AI assistant for a student management system.

Student Data:
${JSON.stringify(students)}

Answer clearly and correctly based on the data.
Question: ${question}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role:"user", content: prompt }]
  });

  res.json({answer: response.choices[0].message.content});
});

// START
app.listen(PORT, ()=>{
  console.log("🚀 Server running on http://localhost:" + PORT);
});