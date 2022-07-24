const replyPlease=document.getElementById("replyPlease"),reply=document.getElementById("reply"),playPanel=document.getElementById("playPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),startButton=document.getElementById("startButton"),resultNode=document.getElementById("result"),gameTime=180;let typeTimer;const bgm=new Audio("mp3/bgm.mp3");bgm.volume=.1,bgm.loop=!0;let answer="Let's imitate in english!",correctCount=0,errorCount=0;const whiteList=new Map;whiteList.set("mr.",!0),whiteList.set("ms.",!0),whiteList.set("mt.",!0);let problems=[],englishVoices=[];const voiceInput=setVoiceInput();let correctAudio,endAudio;loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark"),localStorage.getItem("bgm")!=1&&(document.getElementById("bgmOn").classList.add("d-none"),document.getElementById("bgmOff").classList.remove("d-none"))}function toggleBGM(){localStorage.getItem("bgm")==1?(document.getElementById("bgmOn").classList.add("d-none"),document.getElementById("bgmOff").classList.remove("d-none"),localStorage.setItem("bgm",0),bgm.pause()):(document.getElementById("bgmOn").classList.remove("d-none"),document.getElementById("bgmOff").classList.add("d-none"),localStorage.setItem("bgm",1),bgm.play())}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("mp3/correct.mp3"),loadAudio("mp3/end.mp3")],Promise.all(promises).then(a=>{correctAudio=a[0],endAudio=a[1]})}function loadVoices(){const a=new Promise(function(b){let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",function(){c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{englishVoices=a.filter(a=>a.lang=="en-US")})}loadVoices();function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);a.onend=()=>{voiceInput.start()},a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang="en-US",voiceInput.stop(),speechSynthesis.speak(a)}function loadProblems(){const a=document.getElementById("courseOption").radio.value;fetch(`data/${a}.tsv`).then(a=>a.text()).then(a=>{problems=a.trimEnd().split("\n").map(a=>{const[b,c]=a.split("	"),d=c.split("|").slice(0,3).join("\n");return{en:b,ja:d}})}).catch(a=>{console.error(a)})}function nextProblem(){const c=problems[getRandomInt(0,problems.length)],b=c.en,d=document.getElementById("sentencesPanel"),e=document.getElementById("sentencesPanel").firstElementChild;e.classList.remove("text-primary");const a=document.createElement("talk-box");d.insertBefore(a,d.firstChild),a.shadowRoot.querySelector(".ja").textContent=c.ja,a.shadowRoot.querySelector(".en").textContent=b,a.classList.add("text-primary"),answer=b,speak(b)}function replay(){for(clearInterval(typeTimer),initTime(),loadProblems(),countdown(),correctCount=errorCount=0,countPanel.hidden=!1,scorePanel.hidden=!0;resultNode.firstChild;)resultNode.removeChild(resultNode.firstChild)}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a))+a}customElements.define("talk-box",class extends HTMLElement{constructor(){super();const a=document.getElementById("talk-box").content.cloneNode(!0);a.querySelector(".voice").onclick=function(){const a=this.nextElementSibling.textContent;speak(a)},this.attachShadow({mode:"open"}).appendChild(a)}});function countdown(){correctCount=errorCount=0,playPanel.classList.add("d-none"),countPanel.hidden=!1,scorePanel.hidden=!0,counter.textContent=3;const a=setInterval(function(){const b=document.getElementById("counter"),c=["skyblue","greenyellow","violet","tomato"];if(parseInt(b.textContent)>1){const a=parseInt(b.textContent)-1;b.style.backgroundColor=c[a],b.textContent=a}else clearInterval(a),countPanel.hidden=!0,scorePanel.hidden=!0,playPanel.classList.remove("d-none"),nextProblem(),startTypeTimer(),localStorage.getItem("bgm")==1&&bgm.play()},1e3)}function skipSentence(){replyPlease.classList.remove("d-none"),reply.classList.add("d-none");const a=document.getElementById("sentencesPanel").firstElementChild;a.id!="guide"&&(errorCount+=1,a.classList.add("text-danger"),nextProblem())}function startGame(){clearInterval(typeTimer),startButton.removeEventListener("click",startGame),startButton.addEventListener("click",replay),initTime(),loadProblems(),countdown()}function startTypeTimer(){const a=document.getElementById("time");typeTimer=setInterval(function(){const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(typeTimer),bgm.pause(),playAudio(endAudio),playPanel.classList.add("d-none"),countPanel.hidden=!0,scorePanel.hidden=!1,scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){document.getElementById("score").textContent=correctCount,document.getElementById("problemCount").textContent=correctCount+errorCount}const abbrevs1={"'m":" am","'re":" are","'ll":" will","'ve":" have"},abbrevs2={"ain't":"am not","isn't":"is not","aren't":"are not","wasn't":"was not","weren't":"was not","don't":"do not","doesn't":"does not","didn't":"did not","won't":"will not","haven't":"have not","hasn't":"has not","can't":"can not","shan't":"shall not","wouldn't":"would not","couldn't":"scould not","shouldn't":"should not","mustn't":"must not"};function formatSentence(a){return a=a.toLowerCase(),/[,.!?]/.test(a.slice(-1))&&(a=a.slice(0,-1)),a=a.replace(/-/g," "),a=a.split(" ").map(a=>{if(/\d+(?:\.\d+)?/.test(a))return numberToWords.toWords(a).replace(/,/g,"").replace(/-/g," ");const b=a.indexOf("'");if(b>=0){const c=a.slice(b);if(a[b-1]=="n"){if(c in abbrevs1)return abbrevs2[c]}else if(c in abbrevs1)return a.slice(0,b)+abbrevs1[c]}return a}).join(" "),document.getElementById("mode").textContent=="EASY"&&(a=a.split(/[,.!?]/).map(a=>{const b=a.split(/\s/);return b.map(a=>whiteList.get(a)?a:"X").join(" ")}).flat().join(" ")),a}function isEqual(c,d){const a=c.split(" "),b=d.split(" ");return!!(b.forEach((b,c)=>{b=="X"&&(a[c]="X")}),console.log([a,b]),a.every((a,c)=>a==b[c]))}function setVoiceInput(){if("webkitSpeechRecognition"in window){const a=new webkitSpeechRecognition;return a.lang="en-US",a.continuous=!0,a.onstart=voiceInputOnStart,a.onend=()=>{speechSynthesis.speaking||a.start()},a.onresult=c=>{const b=c.results[0][0].transcript;document.getElementById("reply").textContent=b;const d=formatSentence(b),e=formatSentence(answer);if(isEqual(d,e)){if(correctCount+=1,navigator.onLine){const a=document.getElementById("cat");a.src="img/cat"+getRandomInt(0,74)+".webp"}playAudio(correctAudio),nextProblem()}replyPlease.classList.add("d-none"),reply.classList.remove("d-none"),a.stop()},a}else document.getElementById("noSTT").classList.remove("d-none")}function voiceInputOnStart(){document.getElementById("startVoiceInput").classList.add("d-none"),document.getElementById("stopVoiceInput").classList.remove("d-none")}function voiceInputOnStop(){document.getElementById("startVoiceInput").classList.remove("d-none"),document.getElementById("stopVoiceInput").classList.add("d-none")}function startVoiceInput(){voiceInput.stop()}function stopVoiceInput(){voiceInputOnStop(),voiceInput.stop()}function changeMode(){this.textContent=="EASY"?this.textContent="HARD":this.textContent="EASY"}function loadWhiteList(){fetch(`words.lst`).then(a=>a.text()).then(a=>{a.trimEnd().split("\n").forEach(a=>{whiteList.set(a,!0)})})}loadWhiteList(),[...document.getElementsByClassName("voice")].forEach(a=>{a.onclick=function(){const a=this.nextElementSibling.textContent;speak(a)}}),startButton.addEventListener("click",startGame),skipButton.addEventListener("click",skipSentence),document.getElementById("mode").onclick=changeMode,document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("toggleBGM").onclick=toggleBGM,document.getElementById("startVoiceInput").onclick=startVoiceInput,document.getElementById("stopVoiceInput").onclick=stopVoiceInput,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})