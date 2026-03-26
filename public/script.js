if (!localStorage.getItem("auth")) {
  location.href="/login.html";
}

function logout(){
  localStorage.removeItem("auth");
  location.href="/login.html";
}

// LOAD
async function load(){
  const data = await fetch("/students").then(r=>r.json());
  list.innerHTML="";

  data.forEach(s=>{
    list.innerHTML+=`
    <div class="student">
      ${s.name} (${s.reg})<br>
      M:${s.marks.math} S:${s.marks.science} E:${s.marks.english}
      <br>
      <button onclick="del('${s._id}')">Delete</button>
    </div>`;
  });
}

// ADD
async function addStudent(){
  await fetch("/add",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      reg:reg.value,
      name:name.value,
      marks:{
        math:+math.value,
        science:+science.value,
        english:+english.value,
        social:+social.value,
        computer:+computer.value
      }
    })
  });

  load();
}

// DELETE
async function del(id){
  await fetch("/delete/"+id,{method:"DELETE"});
  load();
}

// 🤖 AI CHAT
async function ask(){
  const qVal=q.value;
  chat.innerHTML+=`<div class="msg user">${qVal}</div>`;

  const res = await fetch("/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({question:qVal})
  });

  const data = await res.json();

  chat.innerHTML+=`<div class="msg bot">${data.answer}</div>`;
  chat.scrollTop = chat.scrollHeight;

  q.value="";
}

load();