const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB
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

// ADD
app.post("/add", async (req,res)=>{
  const {reg,name,marks} = req.body;

  const safe = {
    math:+marks.math||0,
    science:+marks.science||0,
    english:+marks.english||0,
    social:+marks.social||0,
    computer:+marks.computer||0
  };

  let s = await Student.findOne({reg});
  if(!s) s = new Student({reg,name,marks:safe});
  else { s.name=name; s.marks=safe; }

  await s.save();
  res.json({msg:"saved"});
});

// DELETE
app.delete("/delete/:id", async (req,res)=>{
  await Student.findByIdAndDelete(req.params.id);
  res.json({msg:"deleted"});
});

// GET
app.get("/students", async (req,res)=>{
  const data = await Student.find();
  res.json(data);
});

// 🤖 SMART LOCAL AI
app.post("/chat", async (req,res)=>{
  const {question} = req.body;
  const students = await Student.find();
  const q = question.toLowerCase();

  const getTotal = (m)=> (m.math||0)+(m.science||0)+(m.english||0)+(m.social||0)+(m.computer||0);

  const student = students.find(s=> q.includes(s.reg.toLowerCase()));

  if(student && q.includes("total")){
    return res.json({answer:`Total of ${student.name} = ${getTotal(student.marks)}`});
  }

  if(student && q.includes("average")){
    const avg = (getTotal(student.marks)/5).toFixed(2);
    return res.json({answer:`Average of ${student.name} = ${avg}`});
  }

  if(student && q.includes("math")){
    return res.json({answer:`Math marks of ${student.name} = ${student.marks.math}`});
  }

  if(q.includes("topper")){
    let top=null,max=0;
    students.forEach(s=>{
      const t=getTotal(s.marks);
      if(t>max){max=t; top=s;}
    });
    return res.json({answer:`Topper is ${top?.name} (${max})`});
  }

  if(q.includes("average")){
    let total=0;
    students.forEach(s=> total+=getTotal(s.marks));
    const avg = students.length ? (total/students.length).toFixed(2):0;
    return res.json({answer:`Average marks = ${avg}`});
  }

  if(q.includes("compare")){
    if(students.length<2) return res.json({answer:"Need 2 students"});
    const a=students[0], b=students[1];
    const t1=getTotal(a.marks), t2=getTotal(b.marks);
    return res.json({answer:t1>t2?`${a.name} better (${t1})`:`${b.name} better (${t2})`});
  }

  if(q.includes("highest")){
    let max=0;
    students.forEach(s=>{
      const t=getTotal(s.marks);
      if(t>max) max=t;
    });
    return res.json({answer:`Highest = ${max}`});
  }

  if(q.includes("lowest")){
    let min=9999;
    students.forEach(s=>{
      const t=getTotal(s.marks);
      if(t<min) min=t;
    });
    return res.json({answer:`Lowest = ${min}`});
  }

  res.json({
    answer:`Try:
• topper
• average
• compare
• total of REG1
• average of REG1`
  });
});

// START
app.listen(PORT, ()=>{
  console.log(`🚀 http://localhost:${PORT}`);
});