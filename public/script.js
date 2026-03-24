function addStudent() {
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const course = document.getElementById("course").value;
  const marks = document.getElementById("marks").value;

  fetch("/add-student", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, course, marks })
  }).then(() => {
    loadStudents();
    loadToppers();

    // clear fields
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("course").value = "";
    document.getElementById("marks").value = "";

    // focus back to name
    document.getElementById("name").focus();
  });
}

function loadStudents() {
  fetch("/students")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      data.forEach(s => {
        const li = document.createElement("li");
        li.innerHTML = `${s.name} (${s.marks}) 
        <button onclick="deleteStudent(${s.id})">X</button>`;
        list.appendChild(li);
      });
    });
}

function loadToppers() {
  fetch("/toppers")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("toppers");
      list.innerHTML = "";

      data.forEach(s => {
        const li = document.createElement("li");
        li.innerText = `${s.name} - ${s.marks}`;
        list.appendChild(li);
      });
    });
}

function deleteStudent(id) {
  fetch("/delete/" + id, { method: "DELETE" })
    .then(() => {
      loadStudents();
      loadToppers();
    });
}

loadStudents();
loadToppers();