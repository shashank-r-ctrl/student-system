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

// LOAD STUDENTS
function loadStudents() {
  fetch("/students")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      for (let reg in data) {
        const box = document.createElement("div");
        box.className = "card";

        box.innerHTML = `<h3>${data[reg].name} (Reg: ${reg})</h3>`;

        data[reg].subjects.forEach(s => {
          const p = document.createElement("p");

          p.innerHTML = `
            ${s.subject} - ${s.marks}
            <button class="edit-btn" onclick="editEntry('${reg}', '${s.subject}', '${data[reg].name}', ${s.marks})">Edit</button>
            <button class="delete-btn" onclick="deleteEntry('${reg}', '${s.subject}')">Delete</button>
          `;

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
      const container = document.getElementById("toppers");
      container.innerHTML = "";

      for (let sub in data) {
        const box = document.createElement("div");
        box.className = "topper-box";

        box.innerHTML = `
          <h3>${sub}</h3>
          <p><b>${data[sub].name}</b></p>
          <p>Marks: ${data[sub].marks}</p>
        `;

        container.appendChild(box);
      }
    });
}

// DELETE
function deleteEntry(reg_no, subject) {
  fetch("/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reg_no, subject })
  }).then(() => {
    loadStudents();
    loadToppers();
  });
}

// EDIT
function editEntry(reg_no, subject, currentName, currentMarks) {
  const name = prompt("Enter name:", currentName);
  const marks = prompt("Enter marks:", currentMarks);

  fetch("/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reg_no, subject, name, marks })
  }).then(() => {
    loadStudents();
    loadToppers();
  });
}

// INIT
loadStudents();
loadToppers();