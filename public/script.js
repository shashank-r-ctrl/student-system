console.log("JS LOADED 🔥");

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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reg, name, marks })
  });

  loadStudents();
  loadToppers();
}

// DELETE
async function deleteStudent(reg) {
  await fetch(`/delete/${reg}`, {
    method: "DELETE"
  });

  loadStudents();
  loadToppers();
}

// LOAD STUDENTS
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
        <br>
        <button onclick="deleteStudent('${s.reg}')">Delete</button>
      </div>
    `;
  });
}

// TOPPERS
async function loadToppers() {
  const res = await fetch("/students");
  const data = await res.json();

  const subjects = ["math", "science", "english", "social", "computer"];

  const box = document.getElementById("toppers");
  box.innerHTML = "";

  subjects.forEach(sub => {
    let top = { name: "-", marks: -1 };

    data.forEach(s => {
      if (s.marks[sub] > top.marks) {
        top = {
          name: s.name,
          marks: s.marks[sub]
        };
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

// INIT
loadStudents();
loadToppers();