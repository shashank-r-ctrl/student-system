function addStudent() {
  const reg_no = document.getElementById("reg_no").value;
  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value;
  const marks = document.getElementById("marks").value;

  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reg_no, name, subject, marks })
  }).then(() => {
    loadStudents();
    loadToppers();

    document.getElementById("reg_no").value = "";
    document.getElementById("name").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("marks").value = "";
  });
}

// LOAD STUDENTS (GROUPED)
function loadStudents() {
  fetch("/students")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      for (let reg in data) {
        const box = document.createElement("div");

        box.innerHTML = `<h3>${data[reg].name} (Reg: ${reg})</h3>`;

        data[reg].subjects.forEach(s => {
          const p = document.createElement("p");
          p.innerText = `${s.subject} - ${s.marks}`;
          box.appendChild(p);
        });

        list.appendChild(box);
      }
    });
}

// LOAD TOPPERS
function loadToppers() {
  fetch("/toppers")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("toppers");
      list.innerHTML = "";

      for (let sub in data) {
        const li = document.createElement("li");
        li.innerText = `${sub}: ${data[sub].name} (${data[sub].marks})`;
        list.appendChild(li);
      }
    });
}

loadStudents();
loadToppers();