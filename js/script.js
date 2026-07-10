/* =========================================================
   To My Forever Fairytale — script.js
   Handles: scene navigation, particles, all interactions
========================================================= */

(function(){
  "use strict";

  /* ---------------- SCENE NAVIGATION ---------------- */
  const scenes = Array.from(document.querySelectorAll('.scene'));
  let current = 0;

  const dotsWrap = document.getElementById('progress-dots');
  scenes.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot';
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index){
    if(index < 0 || index >= scenes.length) return;
    scenes[current].classList.remove('active');
    current = index;
    scenes[current].classList.add('active');
    dots.forEach((d,i)=> d.classList.toggle('active', i===current));
    onSceneEnter(current);
  }

  function next(){ goTo(current+1); }

  document.querySelectorAll('.next-btn').forEach(btn=>{
    btn.addEventListener('click', next);
  });

  document.getElementById('begin-heart').addEventListener('click', next);

  goTo(0); // init

  /* ---------------- SCENE-SPECIFIC TRIGGERS ---------------- */
  function onSceneEnter(i){
    if(i===2 || i===3 || i===5 || i===7) revealStoryLines(scenes[i]);
    if(i===4) initReasons();
    if(i===6) initMemoryWall();
    if(i===9) initCountdown();
    if(i===10) initHouse();
    if(i===11) revealPromises();
    if(i===12) initGame();
    if(i===14) revealEnding();
  }

  function revealStoryLines(scene){
    const lines = scene.querySelectorAll('.story-line');
    lines.forEach((line, idx) => {
      line.classList.remove('in');
      setTimeout(()=> line.classList.add('in'), 200 + idx*650);
    });
  }

  /* ---------------- REASONS GRID (scene 4) ---------------- */
  const reasons = [
    "Your smile.", "Your kindness.", "Your stubbornness.",
    "You make me a complete chutiya bacha 😂", "You never judge me.",
    "You smile with your whole face.", "You make ordinary days unforgettable.",
    "You are my safest place.", "The way you say my name."
  ];
  let reasonsBuilt = false;
  function initReasons(){
    if(reasonsBuilt) return;
    reasonsBuilt = true;
    const grid = document.getElementById('reason-grid');
    reasons.forEach(text=>{
      const card = document.createElement('div');
      card.className = 'reason-card';
      card.innerHTML = `<span class="reason-emoji">💜</span><span class="reason-text">${text}</span>`;
      card.addEventListener('click', ()=> card.classList.toggle('flipped'));
      grid.appendChild(card);
    });
  }

  /* ---------------- MEMORY WALL (scene 6) ---------------- */
  const memories = [
    { file: 'memory1.jpg', caption: 'This laugh became my addiction.' },
    { file: 'memory2.jpg', caption: 'Us, being unbothered together.' },
    { file: 'memory3.jpg', caption: 'A completely ordinary, perfect day.' },
    { file: 'memory4.jpg', caption: 'My favourite kind of quiet.' },
    { file: 'memory5.jpg', caption: 'This was the day I realised.' },
    { file: 'memory6.jpg', caption: 'This smile made my whole week.' },
    { file: 'memory7.jpg', caption: 'Just us, being us.' },
    { file: 'memory8.jpg', caption: 'The way you look at me, right there.' },
    { file: 'memory9.jpg', caption: 'The moment that started forever.' }
  ];
  let wallBuilt = false;
  function initMemoryWall(){
    if(wallBuilt) return;
    wallBuilt = true;
    const wall = document.getElementById('memory-wall');
    memories.forEach((m, idx)=>{
      const item = document.createElement('div');
      item.className = 'memory-item';
      item.style.setProperty('--r', (Math.random()*10-5)+'deg');
      item.innerHTML = `
        <img src="assets/photos/${m.file}" alt="memory" onerror="this.parentElement.classList.add('no-photo')">
        <div class="mem-fallback">💜</div>
        <div class="mem-caption">tap to open</div>`;
      item.addEventListener('click', ()=> openMemoryModal(m.caption));
      wall.appendChild(item);
    });
  }
  function openMemoryModal(caption){
    const modal = document.createElement('div');
    modal.className = 'memory-modal';
    modal.innerHTML = `<div class="memory-modal-inner"><p>${caption}</p><button class="ghost-btn">close</button></div>`;
    modal.addEventListener('click', (e)=>{ if(e.target===modal || e.target.tagName==='BUTTON') modal.remove(); });
    document.body.appendChild(modal);
  }

  /* ---------------- FAIRYTALE SONG (scene 5) ---------------- */
  const songAudio = new Audio('assets/music/fairytale.mp3');
  document.getElementById('play-fairytale').addEventListener('click', function(){
    if(songAudio.paused){ songAudio.play().catch(()=>{}); this.textContent = '⏸ playing our song'; }
    else { songAudio.pause(); this.textContent = '▶ play our song'; }
  });

  /* ---------------- PROMISE (scene 7) ---------------- */
  document.getElementById('promise-btn').addEventListener('click', function(){
    this.disabled = true;
    this.textContent = '🤝 Promised';
    document.getElementById('promise-confirmed').classList.remove('hidden');
    try{ localStorage.setItem('uppu_morning_walk_promise', 'true'); }catch(e){}
    burstConfetti();
  });

  /* ---------------- CAKE / CANDLES (scene 8) ---------------- */
  const blowBtn = document.getElementById('blow-btn');
  const candles = document.querySelectorAll('.candle');
  let candlesOut = false;
  function blowOutCandles(){
    if(candlesOut) return;
    candlesOut = true;
    candles.forEach((c,i)=> setTimeout(()=> c.classList.add('out'), i*180));
    blowBtn.textContent = '🎉 Happy Birthday!';
    burstConfetti();
  }
  blowBtn.addEventListener('click', blowOutCandles);

  // optional mic-based blowing detection
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    let micTried = false;
    scenes[8] && scenes[8].addEventListener('transitionend', ()=>{}, {once:true});
    document.getElementById('scene-8').addEventListener('click', function tryMic(){
      if(micTried) return; micTried = true;
      navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
        const ctx = new (window.AudioContext||window.webkitAudioContext)();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        (function check(){
          if(candlesOut){ stream.getTracks().forEach(t=>t.stop()); return; }
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a,b)=>a+b,0)/data.length;
          if(avg > 55) blowOutCandles();
          requestAnimationFrame(check);
        })();
      }).catch(()=>{ /* mic denied, button still works */ });
    }, {once:true});
  }

  /* ---------------- COUNTDOWN (scene 9) ---------------- */
  let countdownTimer = null;
  function initCountdown(){
    if(countdownTimer) return;
    const weddingDate = new Date('2026-11-26T00:00:00');
    function tick(){
      const now = new Date();
      let diff = weddingDate - now;
      if(diff < 0) diff = 0;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days').textContent = d;
      document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
      document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
      document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  /* ---------------- DREAM HOUSE (scene 10) ---------------- */
  const rooms = [
    { name: 'Kitchen', dream: "Let's make terrible tea together." },
    { name: 'Living Room', dream: "Movie nights, every lazy weekend." },
    { name: 'Bedroom', dream: "Every morning I'll remind you how beautiful you are." },
    { name: 'Balcony', dream: "Morning walks may pause, but evening chai never will." },
    { name: 'Garden', dream: "We'll fill it with flowers, because you love every single one." },
  ];
  let houseBuilt = false;
  function initHouse(){
    if(houseBuilt) return;
    houseBuilt = true;
    const grid = document.getElementById('house-grid');
    rooms.forEach(r=>{
      const card = document.createElement('div');
      card.className = 'room-card';
      card.innerHTML = `<div class="room-name">${r.name}</div><div class="room-dream">${r.dream}</div>`;
      card.addEventListener('click', ()=> card.classList.toggle('open'));
      grid.appendChild(card);
    });
  }

  /* ---------------- PROMISES LIST (scene 11) ---------------- */
  const promiseLines = [
    "I'll respect you.", "I'll listen, even in silence.",
    "I'll protect your smile.", "I'll choose you.", "Every single day."
  ];
  let promisesBuilt = false;
  function revealPromises(){
    const list = document.getElementById('promise-list');
    if(!promisesBuilt){
      promisesBuilt = true;
      promiseLines.forEach(text=>{
        const p = document.createElement('p');
        p.className = 'promise-item';
        p.textContent = text;
        list.appendChild(p);
      });
    }
    Array.from(list.children).forEach((el, idx)=>{
      el.classList.remove('in');
      setTimeout(()=> el.classList.add('in'), 200 + idx*550);
    });
  }

  /* ---------------- CATCH THE HEARTS GAME (scene 12) ---------------- */
  let gameInterval = null, gameScore = 0;
  function initGame(){
    const wrap = document.getElementById('game-wrap');
    if(gameInterval) return;
    gameScore = 0;
    document.getElementById('game-score').textContent = gameScore;
    const emojis = ['💜','💗','✨','🦋'];
    gameInterval = setInterval(()=>{
      if(!scenes[12].classList.contains('active')){
        clearInterval(gameInterval); gameInterval = null; return;
      }
      const h = document.createElement('div');
      h.className = 'game-heart';
      h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      h.style.left = (Math.random()*85)+'%';
      h.style.animationDuration = (2.5 + Math.random()*1.5)+'s';
      h.addEventListener('click', ()=>{
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        h.remove();
      });
      h.addEventListener('animationend', ()=> h.remove());
      wrap.appendChild(h);
    }, 550);
  }

  /* ---------------- ENVELOPE + LETTER (scene 13) ---------------- */
  const letterParagraphs = [
    "Dear Shaksi,",
    "Happy Birthday, my love. Today is one of the most beautiful days of the year, because it's the day the world was blessed with someone as amazing as you.",
    "From the moment you became part of my life, everything started to feel brighter. Your smile has the power to make my worries disappear, and your presence makes every ordinary moment extraordinary.",
    "This year feels even more special, because we are standing on the threshold of the most exciting chapter of our lives. On 26th November, we will finally get married.",
    "I dream about the little moments after — waking up beside you, making tea together, our silly selfies, our evening walks. I want our home filled with warmth, laughter, and unconditional love.",
    "No matter what life brings, I will always stand beside you. I will respect your dreams, support your ambitions, and hold your hand through every difficult moment. You will never have to face anything alone.",
    "Thank you for trusting me with your heart and your future. You are the most precious gift I have ever received.",
    "This is the last birthday we'll celebrate before our wedding — next year, we'll celebrate as husband and wife.",
    "Happy Birthday, my beautiful Shaksi. My heart belongs to you today, tomorrow, and forever."
  ];
  const envelope = document.getElementById('envelope');
  envelope.addEventListener('click', function(){
    if(envelope.classList.contains('opened')) return;
    envelope.classList.add('opened');
    setTimeout(()=>{
      document.getElementById('letter-paper').classList.remove('hidden');
      typeLetter();
    }, 500);
  });

  let letterTyped = false;
  function typeLetter(){
    if(letterTyped) return;
    letterTyped = true;
    const container = document.getElementById('letter-text');
    let pIdx = 0;
    function typeParagraph(){
      if(pIdx >= letterParagraphs.length){
        document.getElementById('letter-signoff').classList.remove('hidden');
        return;
      }
      const p = document.createElement('p');
      container.appendChild(p);
      const text = letterParagraphs[pIdx];
      let cIdx = 0;
      const speed = 16;
      (function typeChar(){
        if(cIdx <= text.length){
          p.textContent = text.slice(0, cIdx);
          cIdx++;
          setTimeout(typeChar, speed);
        } else {
          pIdx++;
          setTimeout(typeParagraph, 350);
        }
      })();
    }
    typeParagraph();
  }

  /* ---------------- ENDING (scene 14) ---------------- */
  let endingRevealed = false;
  function revealEnding(){
    if(endingRevealed) return;
    endingRevealed = true;
    ['end-line-1','end-line-2','end-line-3'].forEach((id, idx)=>{
      setTimeout(()=> document.getElementById(id).classList.add('in'), 400 + idx*1400);
    });
  }
  document.getElementById('voice-btn').addEventListener('click', function(){
    const audio = document.getElementById('voice-audio');
    audio.play().catch(()=>{
      this.textContent = "Add your voice note at assets/voice/message.mp3 💜";
    });
    burstConfetti();
  });

  /* ---------------- MUSIC TOGGLE (ambient) ---------------- */
  const bgMusic = new Audio('assets/music/ambient.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.35;
  let musicPlaying = false;
  document.getElementById('music-toggle').addEventListener('click', function(){
    if(musicPlaying){ bgMusic.pause(); this.classList.remove('playing'); }
    else { bgMusic.play().catch(()=>{}); this.classList.add('playing'); }
    musicPlaying = !musicPlaying;
  });

  /* ---------------- SECRET MOON ---------------- */
  const moon = document.getElementById('secret-moon');
  const secretPanel = document.getElementById('secret-message');
  moon.addEventListener('click', ()=> secretPanel.classList.remove('hidden'));
  document.getElementById('close-secret').addEventListener('click', ()=> secretPanel.classList.add('hidden'));

  /* ---------------- CURSOR GLOW ---------------- */
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e)=>{
    glow.classList.add('active');
    glow.style.left = e.clientX+'px';
    glow.style.top = e.clientY+'px';
  });

  /* ---------------- CONFETTI / PETALS BURST ---------------- */
  function burstConfetti(){
    const colors = ['#a78bfa','#e8c874','#c084fc','#fdf9ff','#8b5cf6'];
    for(let i=0;i<40;i++){
      const el = document.createElement('div');
      const size = 6 + Math.random()*6;
      el.style.cssText = `
        position:fixed; z-index:60; top:-20px; left:${Math.random()*100}vw;
        width:${size}px; height:${size}px; background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>0.5?'50%':'2px'}; opacity:${0.7+Math.random()*0.3};
        transform: rotate(${Math.random()*360}deg); pointer-events:none;`;
      document.body.appendChild(el);
      const duration = 2200 + Math.random()*1800;
      const drift = (Math.random()-0.5)*200;
      el.animate([
        { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${drift}px, 100vh) rotate(720deg)`, opacity: 0 }
      ], { duration, easing: 'cubic-bezier(.2,.6,.4,1)' });
      setTimeout(()=> el.remove(), duration);
    }
  }

  /* =========================================================
     AMBIENT CANVAS — stars + drifting hearts/petals
  ========================================================= */
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({length: 90}, ()=> ({
    x: Math.random(), y: Math.random(), r: Math.random()*1.4+0.3,
    tw: Math.random()*Math.PI*2, speed: 0.3+Math.random()*0.6
  }));

  const petals = Array.from({length: 14}, ()=> spawnPetal());
  function spawnPetal(){
    return {
      x: Math.random()*1, y: -0.1 - Math.random()*0.5,
      size: 6+Math.random()*8, speed: 0.05+Math.random()*0.06,
      drift: (Math.random()-0.5)*0.4, rot: Math.random()*360, rotSpeed: (Math.random()-0.5)*2
    };
  }

  let t = 0;
  function draw(){
    t += 0.016;
    ctx.clearRect(0,0,W,H);

    // stars
    stars.forEach(s=>{
      const alpha = 0.4 + Math.sin(t*s.speed + s.tw)*0.35;
      ctx.beginPath();
      ctx.fillStyle = `rgba(230,220,255,${Math.max(0,alpha)})`;
      ctx.arc(s.x*W, s.y*H, s.r, 0, Math.PI*2);
      ctx.fill();
    });

    // petals / floating hearts
    petals.forEach(p=>{
      p.y += p.speed*0.01;
      p.x += p.drift*0.001;
      p.rot += p.rotSpeed;
      if(p.y > 1.15){ Object.assign(p, spawnPetal()); p.y = -0.1; }
      ctx.save();
      ctx.translate(p.x*W, p.y*H);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.font = `${p.size}px serif`;
      ctx.fillStyle = 'rgba(196,164,255,0.55)';
      ctx.textAlign = 'center';
      ctx.fillText('❀', 0, 0);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();

})();
