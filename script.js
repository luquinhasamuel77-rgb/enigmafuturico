const puzzles = [
  {tag:"ARQUIVO 01",icon:"◈",question:"Quanto mais você compartilha, mais você tem. O que é?",note:"Pense em algo que pode se espalhar sem acabar.",answers:["Energia elétrica","Conhecimento","Combustível","Memória do computador"],correct:1,explain:"Isso mesmo! O conhecimento cresce quando é compartilhado."},
  {tag:"ARQUIVO 02",icon:"⌁",question:"Tenho cidades, mas não tenho casas. Tenho rios, mas não tenho água. O que sou?",note:"Você pode me consultar antes de viajar.",answers:["Um mapa","Um holograma","Um videogame","Uma fotografia"],correct:0,explain:"Correto! Um mapa representa lugares, rios e cidades."},
  {tag:"ARQUIVO 03",icon:"⏣",question:"No futuro, posso aprender com dados e responder perguntas, mas não tenho consciência. O que sou?",note:"Você provavelmente já conversou com uma versão disso.",answers:["Um robô de brinquedo","Uma inteligência artificial","Um satélite","Um chip de memória"],correct:1,explain:"A inteligência artificial identifica padrões e gera respostas, mas não é consciente."},
  {tag:"ARQUIVO 04",icon:"⌘",question:"Sou invisível, viajo pelo ar e conecto celulares, computadores e outros aparelhos à internet. O que sou?",note:"Você provavelmente usa isso todos os dias.",answers:["Bluetooth","Wi-Fi","GPS","Bateria"],correct:1,explain:"Isso mesmo! O Wi-Fi permite conectar aparelhos a uma rede sem fio."},
  {tag:"ARQUIVO 05",icon:"◉",question:"Quanto mais eu sou usado, mais rápido posso ficar. Mas, se muitos programas me ocupam ao mesmo tempo, posso ficar lento. O que sou?",note:"É uma parte importante de computadores e celulares.",answers:["Memória RAM","Tela","Teclado","Câmera"],correct:0,explain:"Correto! A memória RAM ajuda o aparelho a executar tarefas e manter programas em uso."}
];

const screens = [...document.querySelectorAll(".screen")];
const startBtn = document.getElementById("startBtn");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
let current = 0, score = 0, remaining = 90, timerId = null, startedAt = 0, locked = false;

function showScreen(id){ screens.forEach(s=>s.classList.toggle("active",s.id===id)); }
function formatTime(seconds){const m=Math.floor(seconds/60),s=seconds%60;return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;}
function startGame(){
  clearInterval(timerId);current=0;score=0;remaining=90;startedAt=Date.now();timerEl.textContent="01:30";showScreen("game");loadPuzzle();
  timerId=setInterval(()=>{remaining--;timerEl.textContent=formatTime(remaining);if(remaining<=0)finishGame(true);},1000);
}
function loadPuzzle(){
  locked=false;const p=puzzles[current];
  document.getElementById("puzzleTag").textContent=p.tag;
  document.getElementById("puzzleIcon").textContent=p.icon;
  document.getElementById("question").textContent=p.question;
  document.getElementById("puzzleNote").textContent=p.note;
  document.getElementById("progressText").textContent=`0${current+1} / 05`;
  document.getElementById("progressFill").style.width=`${((current+1)/puzzles.length)*100}%`;
  feedbackEl.textContent="";feedbackEl.className="feedback";answersEl.innerHTML="";
  p.answers.forEach((answer,index)=>{const btn=document.createElement("button");btn.className="answer-btn";btn.textContent=`${String.fromCharCode(65+index)}.  ${answer}`;btn.addEventListener("click",()=>chooseAnswer(index));answersEl.appendChild(btn);});
}
function chooseAnswer(index){
  if(locked)return;locked=true;const p=puzzles[current];const buttons=[...answersEl.children];
  buttons.forEach((b,i)=>{b.disabled=true;if(i===p.correct)b.classList.add("correct");if(i===index&&i!==p.correct)b.classList.add("wrong");});
  if(index===p.correct){score++;feedbackEl.textContent="✓ "+p.explain;feedbackEl.className="feedback good";}
  else{feedbackEl.textContent="✕ Não foi dessa vez. "+p.explain;feedbackEl.className="feedback bad";}
  setTimeout(()=>{if(current<puzzles.length-1){current++;loadPuzzle();}else finishGame(false);},1250);
}
function finishGame(outOfTime){
  clearInterval(timerId);const elapsed=Math.min(90,Math.floor((Date.now()-startedAt)/1000));
  document.getElementById("score").textContent=`${score}/${puzzles.length}`;
  document.getElementById("timeUsed").textContent=formatTime(elapsed);
  const title=document.getElementById("resultTitle"),message=document.getElementById("resultMessage"),symbol=document.getElementById("resultSymbol");
  if(score===3){title.textContent="MISSÃO CONCLUÍDA";message.textContent="Impressionante! Você resolveu todos os enigmas e restaurou o sistema do futuro.";symbol.textContent="✧";}
  else if(outOfTime){title.textContent="TEMPO ESGOTADO";message.textContent="O sistema continua bloqueado. Você chegou até aqui — tente novamente e descubra se consegue resolver os três enigmas.";symbol.textContent="⌛";}
  else{title.textContent="BOM TRABALHO!";message.textContent="Você ajudou a recuperar parte dos dados do futuro. Será que consegue acertar os três na próxima tentativa?";symbol.textContent="⌬";}
  showScreen("result");
}
startBtn.addEventListener("click",startGame);
document.getElementById("againBtn").addEventListener("click",startGame);
document.getElementById("quitBtn").addEventListener("click",()=>{clearInterval(timerId);showScreen("intro");});
