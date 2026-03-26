// LOGIN CHECK
if (!localStorage.getItem("auth")) {
  window.location.href = "/login.html";
}

// LOGOUT
function logout() {
  localStorage.removeItem("auth");
  window.location.href = "/login.html";
}

// ADD
async function addStudent() {
  const reg = document.getElementById("reg").value;
  const name = document.getElementById("name").value;

  const marks = {
    math: Number(document.getElementById("math").value),
    science: Number(document.getElementById("science").value),
    english: Number(document.getElementById("english").value),
    social: Number(document.getElementById("social").value),
    computer: Number(document.getElementById("computer").value)
  };

  await fetch("/add", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ reg, name, marks })
  });

  loadStudents();
  loadToppers();
}

// DELETE
async function deleteStudent(id) {
  await fetch(`/delete/${id}`, { method: "DELETE" });
  loadStudents();
  loadToppers();
}

// LOAD
async function loadStudents() {
  const res = await fetch("/students");
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(s => {
    list.innerHTML += `
      <div class="card">
        <b>${s.name} (${s.reg})</b><br>
        Math: ${s.marks.math} |
        Science: ${s.marks.science} |
        English: ${s.marks.english} |
        Social: ${s.marks.social} |
        Computer: ${s.marks.computer}
        <br><br>
        <button onclick="deleteStudent('${s._id}')">Delete</button>
      </div>
    `;
  });
}

// TOPPERS
async function loadToppers() {
  const res = await fetch("/students");
  const data = await res.json();

  const subjects = ["math","science","english","social","computer"];
  const box = document.getElementById("toppers");
  box.innerHTML = "";

  subjects.forEach(sub => {
    let top = { name: "-", marks: -1 };

    data.forEach(s => {
      if (s.marks[sub] > top.marks) {
        top = { name: s.name, marks: s.marks[sub] };
      }
    });

    box.innerHTML += `
      <tr>
        <td>${sub.toUpperCase()}</td>
        <td>${top.name}</td>
        <td>${top.marks}</td>
      </tr>
    `;
  });
}

// CHATBOT
function ask() {
  const q = document.getElementById("question").value.toLowerCase();

  fetch("/students")
    .then(res => res.json())
    .then(data => {
      let answer = "Not understood";

      if (q.includes("highest in math")) {
        let top = data.reduce((a,b)=>a.marks.math>b.marks.math?a:b);
        answer = `${top.name} has highest in Math (${top.marks.math})`;
      }

      else if (q.includes("average in english")) {
        let avg = data.reduce((sum,s)=>sum+s.marks.english,0)/data.length;
        answer = `Average English: ${avg.toFixed(2)}`;
      }

      else if (q.includes("average of")) {
        const name = q.split("average of ")[1];
        const s = data.find(x=>x.name.toLowerCase()===name);

        if (s) {
          const m = s.marks;
          const avg = (m.math+m.science+m.english+m.social+m.computer)/5;
          answer = `${s.name}'s average: ${avg}`;
        }
      }

      document.getElementById("answer").innerText = answer;
    });
}

// INIT
loadStudents();
loadToppers();