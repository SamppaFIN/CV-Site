(function(){
  // Theme toggle
  function applyTheme(theme){ 
    document.documentElement.setAttribute('data-theme', theme); 
    localStorage.setItem('theme', theme); 
    const themeBtn = document.getElementById('themeToggle');
    if(themeBtn) themeBtn.textContent = theme==='light'?'☀️':'🌙'; 
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    applyTheme(localStorage.getItem('theme')||'light');
    const themeBtn = document.getElementById('themeToggle');
    if(themeBtn) {
      themeBtn.addEventListener('click', (e)=>{ 
        e.preventDefault();
        e.stopPropagation();
        const cur = document.documentElement.getAttribute('data-theme'); 
        console.log('Theme toggle clicked, current theme:', cur);
        applyTheme(cur==='light'?'dark':'light'); 
      });
      // Also add touch events for mobile
      themeBtn.addEventListener('touchend', (e)=>{ 
        e.preventDefault();
        e.stopPropagation();
        const cur = document.documentElement.getAttribute('data-theme'); 
        console.log('Theme toggle touched, current theme:', cur);
        applyTheme(cur==='light'?'dark':'light'); 
      });
    } else {
      console.log('Theme toggle button not found!');
    }
    document.getElementById('year').textContent = new Date().getFullYear();

    // Easter-egg: brand name sparks
    const brand = document.getElementById('brandText');
    brand?.addEventListener('click', (e)=> runSparkBurst(e.clientX, e.clientY));
    brand?.addEventListener('dblclick', ()=> runParticlesOnce());

    // SPA effects layer
    const fxLayer = document.getElementById('fxLayer');
    const fxClose = document.getElementById('fxClose');
    const effectsBtn = document.getElementById('effectsShowcase');
    effectsBtn?.addEventListener('click', (e)=>{ e.preventDefault(); openFxOverlay(); });
    function openFxOverlay(){
      const fxContent = document.getElementById('fxContent');
      if (!fxContent || !fxLayer) return;
      fxContent.innerHTML = `
        <div style="padding:16px;height:100%;">
          <h2 style="margin:0 0 16px;">Effects Lab</h2>
          <p class="subtle">Interactive effects showcase with multiple tabs.</p>
          
          <div class="fx-tabs">
            <button class="fx-tab active" data-tab="particles">Particles</button>
            <button class="fx-tab" data-tab="tetris">3D Tetris</button>
            <button class="fx-tab" data-tab="waves">Waves</button>
            <button class="fx-tab" data-tab="fractals">Fractals</button>
          </div>
          
          <div class="fx-tab-content">
            <div id="tab-particles" class="fx-tab-panel active">
              <div class="fx-card" style="margin-bottom:10px;">
                <div class="demo-controls">
                  <button class="control-btn" id="fxBurst">Burst</button>
                  <button class="control-btn" id="fxParticles">Particles</button>
                  <button class="control-btn" id="fxColor">Color Cycle</button>
                  <button class="control-btn" id="fxClear">Clear</button>
                </div>
              </div>
              <div class="fx-canvas-wrap"><canvas id="fxCanvas" width="900" height="540"></canvas></div>
            </div>
            
            <div id="tab-tetris" class="fx-tab-panel">
              <div class="fx-card" style="margin-bottom:10px;">
                <div class="demo-controls">
                  <button class="control-btn" id="tetrisStart">Start Game</button>
                  <button class="control-btn" id="tetrisPause">Pause</button>
                  <button class="control-btn" id="tetrisReset">Reset</button>
                  <button class="control-btn" id="tetrisRotate">Rotate</button>
                </div>
              </div>
              <div class="fx-canvas-wrap"><canvas id="tetrisCanvas" width="900" height="540"></canvas></div>
            </div>
            
            <div id="tab-waves" class="fx-tab-panel">
              <div class="fx-card" style="margin-bottom:10px;">
                <div class="demo-controls">
                  <button class="control-btn" id="waveStart">Start Waves</button>
                  <button class="control-btn" id="waveStop">Stop</button>
                  <button class="control-btn" id="waveFreq">Change Freq</button>
                </div>
              </div>
              <div class="fx-canvas-wrap"><canvas id="waveCanvas" width="900" height="540"></canvas></div>
            </div>
            
            <div id="tab-fractals" class="fx-tab-panel">
              <div class="fx-card" style="margin-bottom:10px;">
                <div class="demo-controls">
                  <button class="control-btn" id="fractalStart">Generate</button>
                  <button class="control-btn" id="fractalZoom">Zoom In</button>
                  <button class="control-btn" id="fractalReset">Reset</button>
                </div>
              </div>
              <div class="fx-canvas-wrap"><canvas id="fractalCanvas" width="900" height="540"></canvas></div>
            </div>
          </div>
        </div>`;
      fxLayer.style.display = 'block';
      requestAnimationFrame(()=> fxLayer.classList.add('show'));
      
      // Tab switching
      initFxTabs();
      
      // Particle effects
      document.getElementById('fxBurst')?.addEventListener('click', ()=>{
        const rect = document.getElementById('fxCanvas').getBoundingClientRect();
        runSparkBurst(rect.left+rect.width/2, rect.top+rect.height/2);
      });
      document.getElementById('fxParticles')?.addEventListener('click', runParticlesOnce);
      document.getElementById('fxColor')?.addEventListener('click', ()=>{ canvasState.hueShift = (canvasState.hueShift+60)%360; });
      document.getElementById('fxClear')?.addEventListener('click', ()=>{ const c=document.getElementById('fxCanvas'); c?.getContext('2d')?.clearRect(0,0,c.width,c.height); });
      
      // Initialize all effects
      initFxCanvas();
      init3DTetris();
      initWaveEffect();
      initFractalEffect();
    }
    fxLayer?.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close-fx')) closeFx(); });
    fxClose?.addEventListener('click', closeFx);
    function closeFx(){ fxLayer.classList.remove('show'); setTimeout(()=>{ fxLayer.style.display='none'; }, 200); }
  });

  // Experience data (from user's CV)
  const experience = [
    { role: 'Ohjelmistokehittäjä', company: 'Solita Oy', period: '09/2014 — 04/2025', items: ['Kesko: Vähittäiskaupan talousratkaisut, Power Platform, Azure','Ramirent: Kalustonhallinta ratkaisut, Power Platform, Azure','Motoral: Autoteollisuuden ratkaisut, C#, Episerver','TLOIK: Liikenteenohjausjärjestelmä, C#'] },
    { role: 'Pääkehittäjä, arkkitehti', company: 'TeamUp Oy', period: '11/2012 — 09/2014', items: ['Sosiaalisen median palvelun suunnittelu ja toteutus (Azure, C#, MVC4, Entity Framework)'] },
    { role: 'Seniori Ohjelmistokehittäjä', company: 'Flander/Symbio Oy', period: '03/2008 — 10/2012', items: ['Sandvik/AutoMine: Kaivosautomaation kehitys (C#, WPF, WCF)','Heikinheimo: Windows Phone ‑peli (C#, XNA)','Neste Oil: Testiautomaatio (C#, ASP.NET)','Patria: UI‑lokalisointi','Fujitsu: Webfront management (C++, C, Java)'] },
    { role: 'Ohjelmistokehittäjä', company: 'E-Bros Oy', period: '08/2000 — 03/2008', items: ['Tuotannonohjaus ja taloushallinto (C++, Oracle, SQL Server, XML)'] }
  ];

  function renderExperience(){
    const tl = document.getElementById('timeline');
    tl.innerHTML = experience.map(e=>`
      <div class="tl-item glass">
        <div class="tl-role">${e.role} — ${e.company}</div>
        <div class="tl-meta">${e.period}</div>
        <ul class="tl-ul">${e.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  // Placeholder image (SVG data URI) used if an image fails to load
  const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#4a9eff" offset="0"/>
          <stop stop-color="#00ff88" offset="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0f1117"/>
      <rect x="20" y="20" width="760" height="460" rx="16" fill="url(#g)" fill-opacity="0.12" stroke="#1d2030"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9aa4b2" font-family="Inter, Arial" font-size="28">Project</text>
    </svg>`);

  // Seeded README content sample for Klitoritari (provided by user)
  const README = {
    Klitoritari: `# 🌌 Eldritch Sanctuary\nA Cosmic Map Exploration Platform for Community Healing and Wisdom Sharing\n\n**License**: MIT  ·  Node.js · Leaflet · Three.js\n\n## ✨ Overview\nEldritch Sanctuary is an immersive cosmic exploration platform that combines infinite scrolling maps, real-time geolocation tracking, base building, RPG combat, and rich storytelling. Built with sacred principles of community healing and wisdom sharing, it transforms exploration into a meaningful journey of discovery and connection.\n\n## 🚀 Features\n- **Infinite Cosmic Maps**: Seamless exploration with WebGL effects and mobile-first UX\n- **Base Building & Territory**: Paint territory via movement; manage stats and growth\n- **Encounter System**: Quest markers, 5 encounter types, dice-based combat, progression\n- **Dynamic NPCs**: Moving entities (Aurora, Zephyr) with proximity interactions\n- **HEVY System**: Legendary encounter with riddle, energy effects, and rewards\n- **Path Painting**: Brush-based journey visualization, export/import trails\n- **Developer Tools**: Unified debug panel, logging, modular architecture\n\n## 🛠️ Tech Stack\nFrontend: Vanilla JS, Leaflet, Three.js, Geolocation API, CSS3\n\nBackend: Node.js, Express, WebSocket, Supabase\n\n## 🚀 Quick Start\n\n\`\`\`bash\ngit clone https://github.com/SamppaFIN/Klitoritari.git\ncd Klitoritari\nnpm install\nnpm start\n# open http://localhost:3000\n\`\`\`\n\n## 🎮 Gameplay Guide\n- Establish base, expand territory, manage resources\n- Engage D20 encounters; progress stats and skills\n- Interact with NPCs; paint and share paths\n\n## 📚 Documentation\nArchitecture, schema, feature plans, setup, tests, and Aurora Log.\n\n## 📄 License\nMIT\n`,
    AngelicWaves: `# Project Status: Angelic Frequency Detector\n\n## ✅ Completed Features\n### Core Functionality\n- Real-time frequency detection and analysis\n- Multiple frequency detection capabilities\n- Frequency visualization with dynamic display\n- Simulation mode\n- Demo mode\n- Adjustable sensitivity and custom range\n\n### User Interface\n- Interactive visualizer\n- Frequency meter panel\n- Angelic frequency presentation with animations\n- Debug mode\n- Sound player for reference\n- Mascot with reactive animations\n\n### Analysis Features\n- AI-powered analysis\n- Historical tracking & reports\n- Detection of angelic frequencies\n- Real-time spectrum analysis\n\n### Technical Implementation\n- WebAudio API + FFT\n- Secure microphone access\n- Client-server architecture\n- Data persistence\n\n## 🔄 In Progress\n- Advanced pattern recognition, extended range, improved filtering\n- Enhanced visualizations & comparisons\n- Mobile perf optimizations, tests, error handling\n\n## 💡 Under Consideration\n- User profiles, collaboration, exports\n- Integrations with sound healing DBs\n- Mobile app, community features\n- Extended historical analysis\n\n## 🔍 Improvements\n- Mobile responsiveness, cross-browser testing, long-session perf, docs, a11y\n`,
    "RAG-Demo": `# 🍭 AI Candy Store - Interactive RAG Demo\n\nSuomi | English\n\n## 🎯 Overview\nAn interactive demo of Retrieval-Augmented Generation explained through a playful candy store theme. Visualizes each RAG step with animations, supports EN/FI, light/dark themes, and works on desktop/mobile.\n\n## 🏗️ Architecture\n**Backend (FastAPI/Python)**: rag_service, embeddings, ChromaDB, API endpoints.\n**Frontend (React/TypeScript)**: components, utils, App.tsx; Framer Motion & Tailwind.\n\n## 🚀 Quick Start\n### Backend\n\`\`\`bash\ncd backend\npython -m venv venv\n# activate venv\npip install -r requirements.txt\npython main.py\n# http://localhost:8000\n\`\`\`\n### Frontend\n\`\`\`bash\ncd frontend\nnpm install\nnpm start\n# http://localhost:3000\n\`\`\`\n\n## 🎮 How to Use\nPick language & theme → ask a candy question → watch: query ▶ embeddings ▶ vector search ▶ context ▶ AI generation.\n\n## 🛠️ Technical Features\nFastAPI, ChromaDB, Sentence Transformers, OpenAI API (with fallbacks). React 18 + TS, Framer Motion, Tailwind, a11y.\n\n## 🌍 i18n & 🎨 Theming\nEN/FI translations; light/dark with smooth transitions.\n\n## 🤝 Contributing & 📄 License\nStandard PR workflow; MIT.\n`
  };

  // Public projects only
  const projects = [
    { 
      id: 'Klitoritari', 
      title: 'Klitoritari', 
      titleFi: 'Klitoritari',
      img: 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=1600&auto=format&fit=crop', 
      md: `Multiplayer online adventure game prototype focused on fast iteration and immersive loops. Built to test networking, state sync and moment‑to‑moment feel.\nRepo: [Klitoritari](https://github.com/SamppaFIN/Klitoritari)  ·  Live: [App](https://klitoritari-a06bceac06e2.herokuapp.com/)`,
      mdFi: `Moninpelimäinen online-seikkailupeli prototyyppi, joka keskittyy nopeaan iteraatioon ja mukaansatempaaviin silmukoihin. Rakennettu testaamaan verkottamista, tilan synkronointia ja hetki-hetkeltä tuntumaa.\nRepo: [Klitoritari](https://github.com/SamppaFIN/Klitoritari)  ·  Live: [Sovellus](https://klitoritari-a06bceac06e2.herokuapp.com/)`
    },
    { 
      id: 'NLP-AI', 
      title: 'NLP-AI', 
      titleFi: 'Luonnollisen Kielen Käsittely',
      img: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1600&auto=format&fit=crop', 
      md: `Natural language processing experiments and agents. Compact playground to evaluate prompts, embeddings and pipelines.\nRepo: [NLP-AI](https://github.com/SamppaFIN/NLP-AI)  ·  Live: [App](https://kotinlp-f2f36174831d.herokuapp.com/)`,
      mdFi: `Luonnollisen kielen käsittelyn kokeilut ja agentit. Kompakti leikkikenttä prompttien, upotusten ja putkien arviointiin.\nRepo: [NLP-AI](https://github.com/SamppaFIN/NLP-AI)  ·  Live: [Sovellus](https://kotinlp-f2f36174831d.herokuapp.com/)`
    },
    { 
      id: 'HealthConnectAI', 
      title: 'HealthConnectAI', 
      titleFi: 'Terveys-AI',
      img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop', 
      md: `Web app to ask health‑related questions via Perplexity AI with a focused UI. TypeScript codebase exploring API orchestration.\nRepo: [HealthConnectAI](https://github.com/SamppaFIN/HealthConnectAI)`,
      mdFi: `Web-sovellus terveysaiheisten kysymysten esittämiseen Perplexity AI:n kautta keskittyneellä käyttöliittymällä. TypeScript-koodikanta API-orchestraation tutkimiseen.\nRepo: [HealthConnectAI](https://github.com/SamppaFIN/HealthConnectAI)`
    },
    { 
      id: 'AngelicWaves', 
      title: 'AngelicWaves', 
      titleFi: 'Enkeliaallot',
      img: 'https://images.unsplash.com/photo-1494233892892-84542a694e22?q=80&w=1600&auto=format&fit=crop', 
      md: `Fun frequency detector/visualizer in TypeScript. A playground for audio APIs and signal UX.\nRepo: [AngelicWaves](https://github.com/SamppaFIN/AngelicWaves)  ·  Live: [Info](https://angelicwaves-25d1c2a5b069.herokuapp.com/)`,
      mdFi: `Hauska taajuusdetektori/visualisaattori TypeScriptissä. Leikkikenttä ääni-API:ille ja signaali-UX:lle.\nRepo: [AngelicWaves](https://github.com/SamppaFIN/AngelicWaves)  ·  Live: [Info](https://angelicwaves-25d1c2a5b069.herokuapp.com/)`
    },
    { 
      id: 'RAG-Demo', 
      title: 'RAG-Demo', 
      titleFi: 'RAG-Demo',
      img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop', 
      md: `Python demo for Retrieval‑Augmented Generation. Shows retrieval, context building and answer synthesis.\nRepo: [RAG-Demo](https://github.com/SamppaFIN/RAG-Demo)`,
      mdFi: `Python-demo Retrieval-Augmented Generationille. Näyttää haku, kontekstin rakentamisen ja vastausten synteesin.\nRepo: [RAG-Demo](https://github.com/SamppaFIN/RAG-Demo)`
    },
    { 
      id: 'MergeMaster', 
      title: 'MergeMaster', 
      titleFi: 'Yhdistä-Mestari',
      img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop', 
      md: `A small browser game built in one hour with my 8‑year‑old son — joyful learning and rapid prototyping. Simple HTML/JS with playful polish.\nRepo: [MergeMaster](https://github.com/SamppaFIN/MergeMaster)`,
      mdFi: `Pieni selainpeli, joka rakennettiin tunnissa 8-vuotiaan poikani kanssa — iloista oppimista ja nopeaa prototyyppien tekemistä. Yksinkertainen HTML/JS leikkisällä viimeistelyllä.\nRepo: [MergeMaster](https://github.com/SamppaFIN/MergeMaster)`
    },
    { 
      id: 'CV', 
      title: 'CV', 
      titleFi: 'Ansioluettelo',
      img: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=1600&auto=format&fit=crop', 
      md: `Personal CV repo that inspired this new bilingual site. Focus on clarity, responsiveness and subtle motion.\nRepo: [CV](https://github.com/SamppaFIN/CV)  ·  Live: [Old site](https://samppafin.github.io/CV/#)`,
      mdFi: `Henkilökohtainen CV-repo, joka inspiroi tätä uutta kaksikielistä sivustoa. Painopiste selkeydessä, responsiivisuudessa ja hienovaraisessa liikkeessä.\nRepo: [CV](https://github.com/SamppaFIN/CV)  ·  Live: [Vanha sivusto](https://samppafin.github.io/CV/#)`
    },
    { 
      id: 'EldrichHorror', 
      title: 'EldrichHorror', 
      titleFi: 'Vanha Kauhu',
      img: 'https://images.unsplash.com/photo-1520975922284-9e0ce9f76ef4?q=80&w=1600&auto=format&fit=crop', 
      md: `TypeScript experiments that later informed Eldritch Sanctuary. Mechanics spikes and rendering tests.\nRepo: [EldrichHorror](https://github.com/SamppaFIN/EldrichHorror)`,
      mdFi: `TypeScript-kokeilut, jotka myöhemmin vaikuttivat Eldritch Sanctuaryyn. Mekaniikka-spikejä ja renderöintitestejä.\nRepo: [EldrichHorror](https://github.com/SamppaFIN/EldrichHorror)`
    }
  ];

  function renderProjects(){
    const grid = document.getElementById('projectsGrid');
    const isFinnish = I18N.state.lang === 'fi';
    grid.innerHTML = projects.map(p=>`
      <article class="project" data-proj-id="${p.id}">
        <img alt="${isFinnish ? p.titleFi : p.title}" src="${p.img}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
        <div class="content">
          <div class="title">${isFinnish ? p.titleFi : p.title}</div>
          <div class="md">${mdToHtml(isFinnish ? p.mdFi : p.md)}</div>
        </div>
      </article>
    `).join('');

    // open modal on click
    grid.querySelectorAll('.project').forEach(card=>{
      card.addEventListener('click', ()=>openProjectModal(card.getAttribute('data-proj-id')));
    });
  }

  // Modal logic
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');
  modal?.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close-modal')) closeProjectModal(); });
  modalClose?.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeProjectModal(); });

  function openProjectModal(id){
    const p = projects.find(x=>x.id===id);
    if(!p) return;
    const isFinnish = I18N.state.lang === 'fi';
    modalTitle.textContent = isFinnish ? p.titleFi : p.title;
    // Use seeded README when available, fallback to card md
    const md = README[p.id] || (isFinnish ? p.mdFi : p.md);
    modalBody.innerHTML = mdToHtml(md);
    modal.style.display = 'block';
    requestAnimationFrame(()=> modal.classList.add('show'));
    modal.setAttribute('aria-hidden','false');
  }
  function closeProjectModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    setTimeout(()=>{ modal.style.display = 'none'; modalBody.innerHTML=''; }, 200);
  }

  // Subtle effects: scroll fade, parallax background
  function initEffects(){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity = 1; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.section, .card, .project, .tl-item').forEach(el=>{
      el.style.opacity = .001; el.style.transform = 'translateY(8px)'; el.style.transition = 'opacity .5s ease, transform .5s ease';
      io.observe(el);
    });
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY; document.querySelector('.bg-cosmos').style.transform = `translateY(${y*-.05}px)`;
    }, { passive: true });

    // Effects showcase: brief particle show
    const btn = document.getElementById('effectsShowcase');
    btn?.addEventListener('click', runParticlesOnce);

    // Init interactive cards
    initTiltCards('.skills-grid .card');
    initTiltCards('.projects-grid .project');
    initMagneticHover('.skills-grid .card');
    initMagneticHover('.projects-grid .project');
  }

  function runParticlesOnce(){
    const cover = document.createElement('canvas');
    cover.width = window.innerWidth; cover.height = window.innerHeight; cover.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(cover);
    const ctx = cover.getContext('2d');
    const particles = Array.from({length: 120}, ()=>({
      x: Math.random()*cover.width,
      y: Math.random()*cover.height,
      vx: (Math.random()-.5)*2,
      vy: (Math.random()-.5)*2,
      r: Math.random()*2+1,
      h: Math.random()*360,
      life: Math.random()*1+0.6
    }));
    let t = 0, raf;
    function step(){
      ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0,0,cover.width,cover.height);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.life-=0.01; if(p.x<0||p.x>cover.width) p.vx*=-1; if(p.y<0||p.y>cover.height) p.vy*=-1;
        ctx.beginPath(); ctx.fillStyle = `hsl(${p.h},70%,60%)`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      t+=1; if(t<240){ raf=requestAnimationFrame(step);} else { cancelAnimationFrame(raf); document.body.removeChild(cover); }
    }
    step();
  }

  // Small spark burst near click position
  function runSparkBurst(x,y){
    const cover = document.createElement('canvas');
    cover.width = window.innerWidth; cover.height = window.innerHeight; cover.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(cover);
    const ctx = cover.getContext('2d');
    const rect = document.body.getBoundingClientRect();
    const px = x; const py = y;
    const particles = Array.from({length: 42}, (_,i)=>({
      x: px, y: py,
      vx: Math.cos((i/42)*Math.PI*2)*(1.5+Math.random()*1.5),
      vy: Math.sin((i/42)*Math.PI*2)*(1.5+Math.random()*1.5),
      r: Math.random()*1.8+0.8,
      h: Math.random()*360,
      life: 1
    }));
    let t = 0, raf;
    function step(){
      ctx.clearRect(0,0,cover.width,cover.height);
      particles.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.vx*=0.98; p.vy*=0.98; p.life-=0.02;
        ctx.globalAlpha = Math.max(p.life,0);
        ctx.beginPath(); ctx.fillStyle = `hsl(${p.h},80%,60%)`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      t++; if(t<60){ raf=requestAnimationFrame(step);} else { cancelAnimationFrame(raf); document.body.removeChild(cover); }
    }
    step();
  }

  // Tab switching functionality
  function initFxTabs() {
    const tabs = document.querySelectorAll('.fx-tab');
    const panels = document.querySelectorAll('.fx-tab-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        
        // Remove active from all tabs and panels
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        // Add active to clicked tab and corresponding panel
        tab.classList.add('active');
        document.getElementById(`tab-${targetTab}`)?.classList.add('active');
      });
    });
  }

  // Embedded FX Canvas (2.5D orbits and trails)
  const canvasState = { hueShift: 0 };
  function initFxCanvas(){
    const canvas = document.getElementById('fxCanvas');
    if(!canvas) return; const ctx = canvas.getContext('2d');
    const stars = Array.from({length: 120}, ()=>({
      a: Math.random()*Math.PI*2,
      r: 40+Math.random()*220,
      z: 0.6+Math.random()*0.8,
      s: 0.002+Math.random()*0.006,
      c: Math.random()*360
    }));
    let raf;
    function step(){
      ctx.fillStyle = 'rgba(10,10,15,.22)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      const cx = canvas.width/2, cy = canvas.height/2;
      stars.forEach(st=>{
        st.a += st.s; const x = cx + Math.cos(st.a)*st.r; const y = cy + Math.sin(st.a)*st.r*0.6; const r = 1.2*st.z;
        ctx.beginPath(); ctx.fillStyle = `hsla(${(st.c+canvasState.hueShift)%360},80%,60%,.9)`; ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      });
      raf = requestAnimationFrame(step);
    }
    cancelAnimationFrame(raf); step();
  }

  // 3D Tetris Game
  let tetrisState = { running: false, paused: false, score: 0, level: 1, lines: 0 };
  let tetrisPieces = [];
  let tetrisBoard = Array(20).fill().map(() => Array(10).fill(0));
  let currentPiece = null;
  let tetrisRaf = null;

  function init3DTetris() {
    const canvas = document.getElementById('tetrisCanvas');
    if (!canvas) return;
    
    // Event listeners for tetris controls
    document.getElementById('tetrisStart')?.addEventListener('click', startTetris);
    document.getElementById('tetrisPause')?.addEventListener('click', pauseTetris);
    document.getElementById('tetrisReset')?.addEventListener('click', resetTetris);
    document.getElementById('tetrisRotate')?.addEventListener('click', rotatePiece);
    
    // Keyboard controls
    document.addEventListener('keydown', handleTetrisKeys);
  }

  function startTetris() {
    if (tetrisState.running) return;
    tetrisState.running = true;
    tetrisState.paused = false;
    spawnNewPiece();
    tetrisRaf = requestAnimationFrame(tetrisGameLoop);
  }

  function pauseTetris() {
    tetrisState.paused = !tetrisState.paused;
    if (!tetrisState.paused && tetrisState.running) {
      tetrisRaf = requestAnimationFrame(tetrisGameLoop);
    }
  }

  function resetTetris() {
    tetrisState = { running: false, paused: false, score: 0, level: 1, lines: 0 };
    tetrisBoard = Array(20).fill().map(() => Array(10).fill(0));
    currentPiece = null;
    if (tetrisRaf) cancelAnimationFrame(tetrisRaf);
    drawTetris();
  }

  function spawnNewPiece() {
    const pieces = [
      { shape: [[1,1,1,1]], color: '#00f5ff' }, // I
      { shape: [[1,1],[1,1]], color: '#ffff00' }, // O
      { shape: [[1,1,1],[0,1,0]], color: '#a000f0' }, // T
      { shape: [[1,1,1],[1,0,0]], color: '#ff7f00' }, // L
      { shape: [[1,1,1],[0,0,1]], color: '#0000ff' }, // J
      { shape: [[1,1,0],[0,1,1]], color: '#00ff00' }, // S
      { shape: [[0,1,1],[1,1,0]], color: '#ff0000' }  // Z
    ];
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = {
      shape: piece.shape,
      color: piece.color,
      x: 4,
      y: 0,
      rotation: 0
    };
  }

  function rotatePiece() {
    if (!currentPiece || !tetrisState.running) return;
    const rotated = currentPiece.shape[0].map((_, i) => 
      currentPiece.shape.map(row => row[i]).reverse()
    );
    const originalShape = currentPiece.shape;
    currentPiece.shape = rotated;
    if (checkCollision()) {
      currentPiece.shape = originalShape;
    }
  }

  function checkCollision() {
    if (!currentPiece) return true;
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const newX = currentPiece.x + x;
          const newY = currentPiece.y + y;
          if (newX < 0 || newX >= 10 || newY >= 20 || 
              (newY >= 0 && tetrisBoard[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function placePiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            tetrisBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
    clearLines();
    spawnNewPiece();
    if (checkCollision()) {
      tetrisState.running = false;
      alert(`Game Over! Score: ${tetrisState.score}`);
    }
  }

  function clearLines() {
    let linesCleared = 0;
    for (let y = 19; y >= 0; y--) {
      if (tetrisBoard[y].every(cell => cell !== 0)) {
        tetrisBoard.splice(y, 1);
        tetrisBoard.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // Check the same line again
      }
    }
    if (linesCleared > 0) {
      tetrisState.lines += linesCleared;
      tetrisState.score += linesCleared * 100 * tetrisState.level;
      tetrisState.level = Math.floor(tetrisState.lines / 10) + 1;
    }
  }

  function movePiece(dx, dy) {
    if (!currentPiece || !tetrisState.running) return;
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (checkCollision()) {
      currentPiece.x -= dx;
      currentPiece.y -= dy;
      if (dy > 0) placePiece();
    }
  }

  function handleTetrisKeys(e) {
    if (!tetrisState.running) return;
    switch(e.key) {
      case 'ArrowLeft': movePiece(-1, 0); break;
      case 'ArrowRight': movePiece(1, 0); break;
      case 'ArrowDown': movePiece(0, 1); break;
      case 'ArrowUp': rotatePiece(); break;
    }
  }

  function tetrisGameLoop() {
    if (!tetrisState.running || tetrisState.paused) return;
    
    // Auto drop
    movePiece(0, 1);
    
    drawTetris();
    
    // Speed based on level
    const speed = Math.max(50, 500 - (tetrisState.level * 50));
    setTimeout(() => {
      if (tetrisState.running) {
        tetrisRaf = requestAnimationFrame(tetrisGameLoop);
      }
    }, speed);
  }

  function drawTetris() {
    const canvas = document.getElementById('tetrisCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const cellSize = 25;
    const offsetX = (canvas.width - 10 * cellSize) / 2;
    const offsetY = (canvas.height - 20 * cellSize) / 2;
    
    // Draw board
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        if (tetrisBoard[y][x]) {
          ctx.fillStyle = tetrisBoard[y][x];
          ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize - 1, cellSize - 1);
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            ctx.fillRect(
              offsetX + (currentPiece.x + x) * cellSize,
              offsetY + (currentPiece.y + y) * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        }
      }
    }
    
    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${tetrisState.score}`, 10, 30);
    ctx.fillText(`Level: ${tetrisState.level}`, 10, 50);
    ctx.fillText(`Lines: ${tetrisState.lines}`, 10, 70);
  }

  // Wave Effect
  function initWaveEffect() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;
    
    let waveState = { running: false, frequency: 0.02, amplitude: 50, phase: 0 };
    
    document.getElementById('waveStart')?.addEventListener('click', () => {
      waveState.running = true;
      animateWaves();
    });
    
    document.getElementById('waveStop')?.addEventListener('click', () => {
      waveState.running = false;
    });
    
    document.getElementById('waveFreq')?.addEventListener('click', () => {
      waveState.frequency = Math.random() * 0.05 + 0.01;
    });
    
    function animateWaves() {
      if (!waveState.running) return;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = `hsl(${(waveState.phase * 10) % 360}, 70%, 60%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 2) {
        const y = canvas.height / 2 + Math.sin(x * waveState.frequency + waveState.phase) * waveState.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      waveState.phase += 0.1;
      requestAnimationFrame(animateWaves);
    }
  }

  // Fractal Effect
  function initFractalEffect() {
    const canvas = document.getElementById('fractalCanvas');
    if (!canvas) return;
    
    let fractalState = { zoom: 1, offsetX: 0, offsetY: 0, maxIter: 100 };
    
    document.getElementById('fractalStart')?.addEventListener('click', () => {
      generateMandelbrot();
    });
    
    document.getElementById('fractalZoom')?.addEventListener('click', () => {
      fractalState.zoom *= 2;
      generateMandelbrot();
    });
    
    document.getElementById('fractalReset')?.addEventListener('click', () => {
      fractalState = { zoom: 1, offsetX: 0, offsetY: 0, maxIter: 100 };
      generateMandelbrot();
    });
    
    function generateMandelbrot() {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const zx = (x - canvas.width / 2) / (canvas.width / 4) / fractalState.zoom + fractalState.offsetX;
          const zy = (y - canvas.height / 2) / (canvas.height / 4) / fractalState.zoom + fractalState.offsetY;
          
          let cx = zx, cy = zy;
          let iter = 0;
          
          while (iter < fractalState.maxIter && cx * cx + cy * cy < 4) {
            const tmp = cx * cx - cy * cy + zx;
            cy = 2 * cx * cy + zy;
            cx = tmp;
            iter++;
          }
          
          const idx = (y * canvas.width + x) * 4;
          const color = iter === fractalState.maxIter ? 0 : (iter / fractalState.maxIter) * 255;
          
          data[idx] = color;     // R
          data[idx + 1] = color * 0.5; // G
          data[idx + 2] = color * 0.8; // B
          data[idx + 3] = 255;   // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Generate initial fractal
    generateMandelbrot();
  }

  // Magnetic buttons removed for simplified demo
  function initTiltCards(selector){
    document.querySelectorAll(selector).forEach(el=>{
      const element = el;
      const maxTilt = 8; // degrees
      function onMove(e){
        const rect = element.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const tiltX = (py - 0.5) * -2 * maxTilt;
        const tiltY = (px - 0.5) * 2 * maxTilt;
        element.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        element.classList.add('tilted');
      }
      function reset(){ element.style.transform='translateZ(0)'; element.classList.remove('tilted'); }
      element.addEventListener('mousemove', onMove);
      element.addEventListener('mouseleave', reset);
      element.addEventListener('blur', reset, true);
    });
  }

  function initMagneticHover(selector){
    document.querySelectorAll(selector).forEach(el=>{
      const element = el;
      // Find focusable children to magnetize; fallback to title
      const targets = element.querySelectorAll('button, a, .title');
      targets.forEach(t=> t.classList.add('magnetic-child'));
      const strength = 12; // px
      function onMove(e){
        const rect = element.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        targets.forEach(t=>{
          t.style.transform = `translate(${dx*strength}px, ${dy*strength}px)`;
        });
      }
      function reset(){ targets.forEach(t=> t.style.transform='translate(0,0)'); }
      element.addEventListener('mousemove', onMove);
      element.addEventListener('mouseleave', reset);
      element.addEventListener('blur', reset, true);
    });
  }

  // Re-render projects when language changes
  function reRenderProjects() {
    renderProjects();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ 
    renderProjects(); 
    renderExperience(); 
    initEffects(); 
    I18N.applyTranslations(); 
    
    // Re-render projects when language changes
    const originalApplyTranslations = I18N.applyTranslations;
    I18N.applyTranslations = function() {
      originalApplyTranslations();
      reRenderProjects();
    };
  });
})();
