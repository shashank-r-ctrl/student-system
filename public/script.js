if(localStorage.getItem("auth")!=="true"){
  location.href="/login.html";
}

function logout(){
  localStorage.removeItem("auth");
  location.href="/login.html";
}

function toggleChat(){
  chatPopup.style.display =
  chatPopup.style.display==="flex"?"none":"flex";
}

function fill(text){
  q.value=text;
}

async function load(){
  const data = await fetch("/students").then(r=>r.json());

  list.innerHTML="";
  topper.innerHTML="";

  let subs={
    math:{name:"",marks:0},
    science:{name:"",marks:0},
    english:{name:"",marks:0},
    social:{name:"",marks:0},
    computer:{name:"",marks:0}
  };

  data.forEach(s=>{
    const m=s.marks||{};

    list.innerHTML+=`
    <div class="student">
    <b>${s.name}</b> (${s.reg})<br>
    Math: ${m.math||0} | Science: ${m.science||0} | English: ${m.english||0} | Social: ${m.social||0} | Computer: ${m.computer||0}
    <br><button onclick="del('${s._id}')">Delete</button>
    </div>`;

    for(let sub in subs){
      if((m[sub]||0)>subs[sub].marks){
        subs[sub]={name:s.name,marks:m[sub]};
      }
    }
  });

  for(let sub in subs){
    topper.innerHTML+=`
    <tr>
    <td>${sub.toUpperCase()}</td>
    <td>${subs[sub].name}</td>
    <td>${subs[sub].marks}</td>
    </tr>`;
  }
}

async function addStudent(){
  await fetch("/add",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      reg:reg.value,
      name:name.value,
      marks:{
        math:math.value,
        science:science.value,
        english:english.value,
        social:social.value,
        computer:computer.value
      }
    })
  });
  load();
}

async function del(id){
  await fetch("/delete/"+id,{method:"DELETE"});
  load();
}

async function ask(){
  const qVal=q.value;
  chat.innerHTML+=`<div class="user">${qVal}</div>`;

  const res = await fetch("/chat",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({question:qVal})
  });

  const data = await res.json();
  chat.innerHTML+=`<div class="bot">${data.answer}</div>`;
  chat.scrollTop=chat.scrollHeight;
  q.value="";
}

load();