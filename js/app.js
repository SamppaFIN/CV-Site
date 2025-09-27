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
        applyTheme(cur==='light'?'dark':'light'); 
      });
      // Also add touch events for mobile
      themeBtn.addEventListener('touchend', (e)=>{ 
        e.preventDefault();
        e.stopPropagation();
        const cur = document.documentElement.getAttribute('data-theme'); 
        applyTheme(cur==='light'?'dark':'light'); 
      });
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
      
      // Defer heavy DOM operations to avoid forced reflow
      requestAnimationFrame(() => {
      fxContent.innerHTML = `
        <div style="padding:16px;height:100%;">
          <h2 style="margin:0 0 16px;">Effects Lab</h2>
          <p class="subtle">Interactive effects showcase with multiple tabs.</p>
          
          <div class="fx-tabs">
            <button class="fx-tab active" data-tab="particles">Particles</button>
            <button class="fx-tab" data-tab="tetris">3D Tetris</button>
            <button class="fx-tab" data-tab="waves">Waves</button>
            <button class="fx-tab" data-tab="fractals">Fractals</button>
            <button class="fx-tab" data-tab="rendering">Rendering System</button>
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
            
            <div id="tab-rendering" class="fx-tab-panel">
              <div class="fx-card" style="text-align:center; padding:40px;">
                <h3 style="margin-bottom:20px; color:var(--text-primary);">🌟 Sacred Geometry Rendering System</h3>
                <p style="margin-bottom:30px; color:var(--text-muted);">Click the button below to open the fullscreen particle playground with sacred geometry symbols and interactive effects.</p>
                <button class="control-btn" id="openRenderingSystem" style="font-size:16px; padding:12px 24px; background:linear-gradient(45deg, #667eea 0%, #764ba2 100%); border:none; color:white;">
                  🚀 Launch Rendering System
                </button>
              </div>
            </div>
          </div>
        </div>`;
      fxLayer.style.display = 'block';
      requestAnimationFrame(()=> fxLayer.classList.add('show'));
      
      // Tab switching
      initFxTabs();
      
      // Particle effects
      const fxCanvas = document.getElementById('fxCanvas');
      document.getElementById('fxBurst')?.addEventListener('click', ()=>{
        const rect = fxCanvas.getBoundingClientRect();
        runSparkBurst(rect.left+rect.width/2, rect.top+rect.height/2);
      });
      document.getElementById('fxParticles')?.addEventListener('click', runParticlesOnce);
      document.getElementById('fxColor')?.addEventListener('click', ()=>{ canvasState.hueShift = (canvasState.hueShift+60)%360; });
      document.getElementById('fxClear')?.addEventListener('click', ()=>{ fxCanvas?.getContext('2d')?.clearRect(0,0,fxCanvas.width,fxCanvas.height); });
      
      // Initialize all effects
      initFxCanvas();
      init3DTetris();
      initWaveEffect();
      initFractalEffect();
      // initRenderingSystem(); // Will be called when tab is clicked
      });
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
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop', 
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
      img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop', 
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
        
        // Initialize rendering system when rendering tab is clicked
        if (targetTab === 'rendering') {
          // Wait a bit for the HTML to be fully rendered
          setTimeout(() => {
            initRenderingSystem();
          }, 50);
        }
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

  // ShadowComments Rendering System for Effects Lab
  let renderingSystemInitialized = false;
  
  function initRenderingSystem() {
    if (renderingSystemInitialized) {
      return;
    }
    
    // Create fullscreen canvas overlay
    const overlay = document.createElement('div');
    overlay.id = 'renderingOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `;
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'renderingFullscreenCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: grab;
    `;
    
    // Create controls panel
    const controls = document.createElement('div');
    controls.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.8);
      padding: 20px;
      border-radius: 10px;
      color: white;
      z-index: 10001;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      max-width: 80vw;
    `;
    
    // Add control buttons
    const effects = [
      {name: 'Explosion', emoji: '💥', effect: 'explosion'},
      {name: 'Cosmic', emoji: '🌌', effect: 'cosmic'},
      {name: 'Snow', emoji: '❄️', effect: 'snow'},
      {name: 'Fire', emoji: '🔥', effect: 'fire'},
      {name: 'Spiral', emoji: '🌀', effect: 'spiral'},
      {name: 'Rainbow', emoji: '🌈', effect: 'rainbow'},
      {name: 'Magnetic', emoji: '🧲', effect: 'magnetic'},
      {name: 'Lightning', emoji: '⚡', effect: 'lightning'},
      {name: 'Wave', emoji: '🌊', effect: 'wave'},
      {name: 'Water', emoji: '💧', effect: 'water'},
      {name: 'Smoke', emoji: '💨', effect: 'smoke'},
      {name: 'Bubbles', emoji: '🫧', effect: 'bubbles'},
      {name: 'Reset View', emoji: '🎯', action: 'resetView'},
      {name: 'Reset', emoji: '🔄', action: 'reset'},
      {name: 'Close', emoji: '❌', action: 'close'}
    ];
    
    effects.forEach(effect => {
      const btn = document.createElement('button');
      btn.textContent = `${effect.emoji} ${effect.name}`;
      btn.style.cssText = `
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 5px;
        color: white;
        cursor: pointer;
        font-size: 12px;
      `;
      
        btn.addEventListener('click', () => {
          if (effect.action === 'reset') {
            resetParticles();
          } else if (effect.action === 'resetView') {
            zoomLevel = 1;
            panX = 0;
            panY = 0;
          } else if (effect.action === 'close') {
            closeRenderingSystem();
          } else {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            triggerBurst(centerX, centerY, getRandomColor(), 'high', effect.effect);
          }
        });
      
      controls.appendChild(btn);
    });
    
    overlay.appendChild(canvas);
    overlay.appendChild(controls);
    document.body.appendChild(overlay);
    
    // Initialize rendering system
    startFullscreenRenderingSystem(canvas);
    renderingSystemInitialized = true;
    
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeRenderingSystem();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
  
  function closeRenderingSystem() {
    const overlay = document.getElementById('renderingOverlay');
    if (overlay) {
      overlay.remove();
    }
    renderingSystemInitialized = false;
  }
  
  function getRandomColor() {
    const colors = ['#4a9eff', '#ff6b6b', '#4ecdc4', '#ff9ff3', '#8b5cf6', '#fbbf24'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function startFullscreenRenderingSystem(canvas) {
    const ctx = canvas.getContext('2d');
    
    // Particle systems
    let particles = [];
    let burstParticles = [];
    let animationId = null;
    
    // Configuration
    let config = {
      particleCount: 100,
      animationSpeed: 1,
      particleType: 'cosmic'
    };
    
    // Generate particles with different behaviors
    function generateParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        const behavior = Math.random();
        let particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.6 + 0.4,
          color: getRandomColor(),
          life: 1,
          behavior: behavior < 0.2 ? 'orbit' : behavior < 0.4 ? 'pulse' : behavior < 0.6 ? 'drift' : behavior < 0.8 ? 'spiral' : 'float',
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 50 + 20,
          centerX: Math.random() * canvas.width,
          centerY: Math.random() * canvas.height,
          pulsePhase: Math.random() * Math.PI * 2,
          spiralPhase: Math.random() * Math.PI * 2
        };
        particles.push(particle);
      }
    }
    
    // Geometry symbols with magnetic movement
    let geometrySymbols = [
      { name: 'flower', x: 0.2, y: 0.3, targetX: 0.2, targetY: 0.3, color: 'rgba(255, 255, 255, 0.8)' },
      { name: 'metatron', x: 0.8, y: 0.2, targetX: 0.8, targetY: 0.2, color: 'rgba(138, 92, 246, 0.8)' },
      { name: 'sri', x: 0.5, y: 0.7, targetX: 0.5, targetY: 0.7, color: 'rgba(255, 107, 107, 0.8)' },
      { name: 'vesica', x: 0.1, y: 0.8, targetX: 0.1, targetY: 0.8, color: 'rgba(6, 182, 212, 0.8)' },
      { name: 'seed', x: 0.9, y: 0.6, targetX: 0.9, targetY: 0.6, color: 'rgba(245, 158, 11, 0.8)' },
      { name: 'spiral', x: 0.3, y: 0.9, targetX: 0.3, targetY: 0.9, color: 'rgba(255, 159, 243, 0.8)' }
    ];
    
    let magneticMode = false;
    let magneticTimer = 0;
    let magneticField = null; // {x, y, strength, duration, startTime}
    
    // Snowflake patterns (SVG-like paths)
    function drawSnowflake(ctx, x, y, size, type, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 20, size / 20); // Scale to size
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2; // Make lines thicker for visibility
      ctx.lineCap = 'round';
      
      switch (type) {
        case 0: // Simple 6-pointed star
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
            ctx.stroke();
          }
          break;
          
        case 1: // Complex 6-pointed with branches
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
            // Add side branches
            const branchAngle1 = angle + Math.PI / 6;
            const branchAngle2 = angle - Math.PI / 6;
            ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
            ctx.lineTo(Math.cos(branchAngle1) * 4, Math.sin(branchAngle1) * 4);
            ctx.moveTo(Math.cos(angle) * 6, Math.sin(angle) * 6);
            ctx.lineTo(Math.cos(branchAngle2) * 4, Math.sin(branchAngle2) * 4);
            ctx.stroke();
          }
          break;
          
        case 2: // Dendritic (tree-like)
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
            // Add dendritic branches
            for (let j = 1; j <= 3; j++) {
              const branchX = Math.cos(angle) * j * 2.5;
              const branchY = Math.sin(angle) * j * 2.5;
              const branchAngle1 = angle + Math.PI / 4;
              const branchAngle2 = angle - Math.PI / 4;
              ctx.moveTo(branchX, branchY);
              ctx.lineTo(branchX + Math.cos(branchAngle1) * 2, branchY + Math.sin(branchAngle1) * 2);
              ctx.moveTo(branchX, branchY);
              ctx.lineTo(branchX + Math.cos(branchAngle2) * 2, branchY + Math.sin(branchAngle2) * 2);
            }
            ctx.stroke();
          }
          break;
          
        case 3: // Plate-like with hexagonal center
          // Hexagonal center
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const x = Math.cos(angle) * 3;
            const y = Math.sin(angle) * 3;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          
          // 6 main arms
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
            ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
            ctx.stroke();
          }
          break;
          
        case 4: // Needle-like
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 12, Math.sin(angle) * 12);
            // Add needle details
            for (let j = 2; j <= 10; j += 2) {
              const needleX = Math.cos(angle) * j;
              const needleY = Math.sin(angle) * j;
              const perpAngle = angle + Math.PI / 2;
              ctx.moveTo(needleX, needleY);
              ctx.lineTo(needleX + Math.cos(perpAngle) * 1.5, needleY + Math.sin(perpAngle) * 1.5);
              ctx.moveTo(needleX, needleY);
              ctx.lineTo(needleX - Math.cos(perpAngle) * 1.5, needleY - Math.sin(perpAngle) * 1.5);
            }
            ctx.stroke();
          }
          break;
          
        case 5: // Stellar dendrite (most complex)
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
            
            // Add multiple levels of branches
            for (let level = 1; level <= 3; level++) {
              const branchX = Math.cos(angle) * level * 3;
              const branchY = Math.sin(angle) * level * 3;
              const branchAngle1 = angle + Math.PI / 6;
              const branchAngle2 = angle - Math.PI / 6;
              const branchLength = 2 - level * 0.5;
              
              ctx.moveTo(branchX, branchY);
              ctx.lineTo(branchX + Math.cos(branchAngle1) * branchLength, branchY + Math.sin(branchAngle1) * branchLength);
              ctx.moveTo(branchX, branchY);
              ctx.lineTo(branchX + Math.cos(branchAngle2) * branchLength, branchY + Math.sin(branchAngle2) * branchLength);
            }
            ctx.stroke();
          }
          break;
      }
      
      ctx.restore();
    }
    
    // Draw sacred geometry with magnetic movement
    function drawSacredGeometry() {
      const time = Date.now() * 0.001;
      
      // Update geometry positions for magnetic field effect
      if (magneticField) {
        const currentTime = Date.now();
        const elapsed = currentTime - magneticField.startTime;
        
        // Check if magnetic field is still active
        if (elapsed < magneticField.duration) {
          // Calculate exponential strength increase over time
          const progress = elapsed / magneticField.duration;
          const exponentialStrength = magneticField.strength * Math.pow(2, progress * 1.5); // Slower exponential growth
          const currentStrength = Math.min(exponentialStrength, magneticField.maxStrength);
          
          // Move all symbols towards magnetic field with exponential acceleration
          geometrySymbols.forEach(symbol => {
            const fieldX = magneticField.x / canvas.width;
            const fieldY = magneticField.y / canvas.height;
            
            // Calculate distance to magnetic field
            const dx = fieldX - symbol.x;
            const dy = fieldY - symbol.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Exponential attraction based on distance (closer = stronger pull)
            const attractionStrength = currentStrength * (1 + 1 / (distance + 0.1));
            
            // Apply exponential acceleration
            symbol.x += dx * attractionStrength;
            symbol.y += dy * attractionStrength;
            
            // Add some oscillation for mystical effect
            const oscillation = Math.sin(time * 3 + symbol.x * 10) * 0.02 * currentStrength;
            symbol.x += oscillation;
            symbol.y += oscillation;
          });
        } else {
          // Magnetic field expired, return to original positions
          geometrySymbols.forEach(symbol => {
            symbol.x += (symbol.targetX - symbol.x) * 0.05;
            symbol.y += (symbol.targetY - symbol.y) * 0.05;
          });
          
          // Clear magnetic field when all symbols are back
          const allBack = geometrySymbols.every(symbol => 
            Math.abs(symbol.x - symbol.targetX) < 0.01 && 
            Math.abs(symbol.y - symbol.targetY) < 0.01
          );
          if (allBack) {
            magneticField = null;
          }
        }
      } else {
        // No magnetic field, return to original positions
        geometrySymbols.forEach(symbol => {
          symbol.x += (symbol.targetX - symbol.x) * 0.05;
          symbol.y += (symbol.targetY - symbol.y) * 0.05;
        });
      }
      
      // Draw magnetic field indicator
      if (magneticField) {
        const currentTime = Date.now();
        const elapsed = currentTime - magneticField.startTime;
        
        if (elapsed < magneticField.duration) {
          const progress = elapsed / magneticField.duration;
          const exponentialStrength = magneticField.strength * Math.pow(2, progress * 3);
          const currentStrength = Math.min(exponentialStrength, magneticField.maxStrength);
          
          // Draw pulsing magnetic field indicator
          ctx.save();
          ctx.strokeStyle = `rgba(138, 92, 246, ${0.3 + currentStrength * 2})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          
          const pulseSize = 20 + Math.sin(time * 5) * 10;
          const fieldX = magneticField.x;
          const fieldY = magneticField.y;
          
          // Draw pulsing circle
          ctx.beginPath();
          ctx.arc(fieldX, fieldY, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
          
          // Draw inner core
          ctx.strokeStyle = `rgba(138, 92, 246, ${0.8 + currentStrength})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(fieldX, fieldY, 5, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.restore();
        }
      }
      
      // Draw Flower of Life
      const flowerX = canvas.width * geometrySymbols[0].x;
      const flowerY = canvas.height * geometrySymbols[0].y;
      const flowerRadius = 60;
      
      ctx.strokeStyle = geometrySymbols[0].color;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(flowerX - flowerRadius, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(flowerX + flowerRadius, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw Metatron's Cube
      const metatronX = canvas.width * geometrySymbols[1].x;
      const metatronY = canvas.height * geometrySymbols[1].y;
      const metatronSize = 80;
      
      ctx.strokeStyle = geometrySymbols[1].color;
      ctx.beginPath();
      ctx.arc(metatronX, metatronY, metatronSize/3, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(metatronX - metatronSize/2, metatronY, metatronSize/6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(metatronX + metatronSize/2, metatronY, metatronSize/6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw Sri Yantra
      const sriX = canvas.width * geometrySymbols[2].x;
      const sriY = canvas.height * geometrySymbols[2].y;
      const sriSize = 100;
      
      ctx.strokeStyle = geometrySymbols[2].color;
      ctx.beginPath();
      ctx.moveTo(sriX, sriY - sriSize/2);
      ctx.lineTo(sriX - sriSize/2, sriY + sriSize/2);
      ctx.lineTo(sriX + sriSize/2, sriY + sriSize/2);
      ctx.closePath();
      ctx.stroke();
      
      // Draw Vesica Piscis
      const vesicaX = canvas.width * geometrySymbols[3].x;
      const vesicaY = canvas.height * geometrySymbols[3].y;
      const vesicaRadius = 70;
      
      ctx.strokeStyle = geometrySymbols[3].color;
      ctx.beginPath();
      ctx.arc(vesicaX - vesicaRadius/2, vesicaY, vesicaRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(vesicaX + vesicaRadius/2, vesicaY, vesicaRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw Seed of Life
      const seedX = canvas.width * geometrySymbols[4].x;
      const seedY = canvas.height * geometrySymbols[4].y;
      const seedRadius = 40;
      
      ctx.strokeStyle = geometrySymbols[4].color;
      ctx.beginPath();
      ctx.arc(seedX, seedY, seedRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const circleX = seedX + Math.cos(angle) * seedRadius;
        const circleY = seedY + Math.sin(angle) * seedRadius;
        
        ctx.beginPath();
        ctx.arc(circleX, circleY, seedRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Draw Golden Spiral
      const spiralX = canvas.width * geometrySymbols[5].x;
      const spiralY = canvas.height * geometrySymbols[5].y;
      const spiralMaxRadius = 80;
      
      ctx.strokeStyle = geometrySymbols[5].color;
      ctx.beginPath();
      
      let radius = 2;
      let angle = 0;
      const goldenRatio = 1.618;
      
      while (radius < spiralMaxRadius) {
        const spiralXPos = spiralX + Math.cos(angle) * radius;
        const spiralYPos = spiralY + Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(spiralXPos, spiralYPos);
        } else {
          ctx.lineTo(spiralXPos, spiralYPos);
        }
        
        angle += 0.2;
        radius = Math.pow(goldenRatio, angle / (Math.PI * 2)) * 4;
      }
      
      ctx.stroke();
    }
    
    // Trigger burst effect
    function triggerBurst(x, y, color, intensity, effect = 'explosion') {
      const particleCount = intensity === 'low' ? 15 : intensity === 'medium' ? 40 : 80;
      
      for (let i = 0; i < particleCount; i++) {
        let vx, vy, particleColor = color, size = Math.random() * 8 + 3;
        
        switch (effect) {
          case 'explosion':
            // Realistic confetti explosion with curved paths and rotation
            const angle = (Math.PI * 2 * i) / particleCount;
            const initialSpeed = Math.random() * 20 + 10; // Initial burst speed
            const horizontalSpread = Math.random() * 400 - 200; // -200 to +200 spread
            const verticalRise = Math.random() * 200 + 50; // 50 to 250 upward
            
            // Initial velocity (upward burst)
            vx = Math.cos(angle) * initialSpeed + (Math.random() - 0.5) * 10;
            vy = Math.sin(angle) * initialSpeed - Math.random() * 15 - 5; // Upward bias
            
            // Confetti colors (bright and varied)
            const confettiColors = [
              '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
              '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
              '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
              '#FF5722', '#795548'
            ];
            particleColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            
            // Varied sizes for confetti pieces
            size = Math.random() * 12 + 4;
            
            // Add rotation and curved path properties
            burstParticles.push({
              x: x + (Math.random() - 0.5) * 10,
              y: y + (Math.random() - 0.5) * 10,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.9 + Math.random() * 0.1,
              color: particleColor,
              life: 1,
              decay: 0.008,
              effect: effect,
              behavior: 'confetti',
              rotation: 0,
              rotationSpeed: (Math.random() - 0.5) * 0.3, // Rotation speed
              gravity: 0.3, // Gravity effect
              airResistance: 0.98, // Air resistance
              horizontalSpread: horizontalSpread,
              verticalRise: verticalRise,
              phase: 0 // For curved path calculation
            });
            continue; // Skip normal particle creation
            
          case 'cosmic':
            const cosmicAngle = (Math.PI * 2 * i) / particleCount;
            const cosmicSpeed = Math.random() * 10 + 3;
            vx = Math.cos(cosmicAngle) * cosmicSpeed;
            vy = Math.sin(cosmicAngle) * cosmicSpeed;
            particleColor = `hsl(${i * 360 / particleCount}, 100%, 50%)`;
            size = Math.random() * 6 + 2;
            break;
            
          case 'snow':
            // Snow falls from top down
            vx = (Math.random() - 0.5) * 1; // Slower horizontal drift
            vy = Math.random() * 2 + 1; // Slower fall
            particleColor = '#ffffff';
            size = Math.random() * 15 + 10; // Much larger for snowflake detail
            // Start from top of screen across entire width
            const snowflake = {
              x: Math.random() * canvas.width, // Full width coverage
              y: -20, // Start above screen
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.9 + Math.random() * 0.1, // Higher opacity for visibility
              color: particleColor,
              life: 1,
              decay: 0.002, // Slower decay for longer visibility
              effect: effect,
              behavior: 'snowflake',
              rotation: 0,
              rotationSpeed: (Math.random() - 0.5) * 0.1, // Slow rotation
              snowflakeType: Math.floor(Math.random() * 6) // 6 different snowflake patterns
            };
            burstParticles.push(snowflake);
            continue; // Skip normal particle creation
            
          case 'fire':
            // Bonfire effect - flames rise up
            vx = (Math.random() - 0.5) * 4; // Slight horizontal movement
            vy = -Math.random() * 8 - 4; // Rises up
            particleColor = `hsl(${Math.random() * 30 + 15}, 100%, ${Math.random() * 30 + 50}%)`; // Orange-red range
            size = Math.random() * 8 + 3;
            break;
            
          case 'spiral':
            const spiralAngle = (Math.PI * 2 * i) / particleCount + Date.now() * 0.01;
            const spiralSpeed = Math.random() * 8 + 2;
            const spiralRadius = (i / particleCount) * 60;
            vx = Math.cos(spiralAngle) * spiralSpeed + Math.cos(spiralAngle) * spiralRadius * 0.1;
            vy = Math.sin(spiralAngle) * spiralSpeed + Math.sin(spiralAngle) * spiralRadius * 0.1;
            particleColor = `hsl(${spiralAngle * 180 / Math.PI + 180}, 80%, 60%)`;
            size = Math.random() * 4 + 2;
            break;
            
          case 'rainbow':
            // Create a rainbow arc
            const rainbowAngle = (Math.PI * i) / (particleCount - 1); // Half circle (0 to π)
            const rainbowRadius = 100; // Radius of the rainbow arc
            const rainbowCenterX = x;
            const rainbowCenterY = y + 50; // Center below the click point
            
            // Calculate position on the arc
            const arcX = rainbowCenterX + Math.cos(rainbowAngle) * rainbowRadius;
            const arcY = rainbowCenterY + Math.sin(rainbowAngle) * rainbowRadius;
            
            // Set velocity to move along the arc
            vx = (arcX - x) * 0.1;
            vy = (arcY - y) * 0.1;
            
            // Rainbow colors in order: red, orange, yellow, green, blue, indigo, violet
            const rainbowHues = [0, 30, 60, 120, 240, 260, 300];
            const hueIndex = Math.floor((i / particleCount) * rainbowHues.length);
            const hue = rainbowHues[Math.min(hueIndex, rainbowHues.length - 1)];
            
            particleColor = `hsl(${hue}, 100%, 50%)`;
            size = Math.random() * 8 + 4; // Larger particles for rainbow
            
            // Position particles on the arc
            burstParticles.push({
              x: arcX,
              y: arcY,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.9 + Math.random() * 0.1,
              color: particleColor,
              life: 1,
              decay: 0.01,
              effect: effect,
              behavior: 'float'
            });
            continue; // Skip normal particle creation
            
          case 'magnetic':
            // Create magnetic field at random location
            magneticField = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              strength: 0.005, // Slower base attraction strength
              duration: 10000, // 10 seconds in milliseconds
              startTime: Date.now(),
              maxStrength: 0.03 // Slower maximum attraction strength
            };
            
            // Create particles that orbit around the magnetic field
            const magneticAngle = (Math.PI * 2 * i) / particleCount;
            const magneticSpeed = Math.random() * 8 + 4;
            vx = Math.cos(magneticAngle) * magneticSpeed;
            vy = Math.sin(magneticAngle) * magneticSpeed;
            particleColor = `hsl(${Math.random() * 60 + 200}, 80%, 60%)`; // Blue-purple range
            size = Math.random() * 6 + 2;
            break;
            
          case 'lightning':
            const lightningAngle = Math.random() * Math.PI * 2;
            const lightningSpeed = Math.random() * 20 + 10;
            vx = Math.cos(lightningAngle) * lightningSpeed;
            vy = Math.sin(lightningAngle) * lightningSpeed;
            particleColor = '#00ffff';
            size = Math.random() * 3 + 1;
            break;
            
          case 'wave':
            // Wave effect across entire width
            const waveX = Math.random() * canvas.width; // Full width coverage
            const waveY = canvas.height * 0.8; // Start from 80% down the screen
            const waveAngle = (Math.PI * 2 * i) / particleCount;
            const waveSpeed = Math.random() * 6 + 2;
            const waveOffset = Math.sin(i * 0.5) * 30;
            vx = Math.cos(waveAngle) * waveSpeed;
            vy = Math.sin(waveAngle) * waveSpeed + waveOffset * 0.1;
            particleColor = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
            size = Math.random() * 5 + 2;
            
            // Create wave particles across full width
            burstParticles.push({
              x: waveX,
              y: waveY,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.8 + Math.random() * 0.2,
              color: particleColor,
              life: 1,
              decay: 0.01,
              effect: effect,
              behavior: 'wave',
              phase: Math.random() * Math.PI * 2
            });
            continue; // Skip normal particle creation
            
          case 'water':
            // Advanced water effect with ripples and distortions
            const waterX = Math.random() * canvas.width; // Full width coverage
            const waterY = -20; // Start above screen
            vx = (Math.random() - 0.5) * 4; // Slower horizontal spread
            vy = Math.random() * 6 + 3; // Falls down
            particleColor = `hsl(${Math.random() * 30 + 200}, 90%, 70%)`; // Blue-cyan range
            size = Math.random() * 8 + 4; // Larger water droplets
            
            // Create water particles with ripple physics
            burstParticles.push({
              x: waterX,
              y: waterY,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.7 + Math.random() * 0.3,
              color: particleColor,
              life: 1,
              decay: 0.005, // Slower decay for longer effect
              effect: effect,
              behavior: 'water',
              rippleRadius: 0, // For ripple effect
              rippleSpeed: 0.5 + Math.random() * 0.5, // Ripple expansion speed
              splashIntensity: Math.random() * 0.5 + 0.5, // How strong the splash is
              phase: Math.random() * Math.PI * 2, // For wave motion
              hasSplashed: false // Track if particle has hit bottom
            });
            continue; // Skip normal particle creation
            
          case 'smoke':
            // Smoke fills whole screen, rises slowly, lasts 5 seconds
            const smokeX = Math.random() * canvas.width; // Random X across whole screen
            const smokeY = canvas.height + Math.random() * 100; // Start from bottom + some below screen
            
            vx = (Math.random() - 0.5) * 1; // Slower horizontal drift
            vy = -Math.random() * 2 - 1; // Slower upward movement
            particleColor = `hsla(0, 0%, ${Math.random() * 20 + 40}%, 0.4)`; // Darker gray, more transparent
            size = Math.random() * 15 + 8; // Larger smoke particles
            
            // Create smoke particles across whole screen
            burstParticles.push({
              x: smokeX,
              y: smokeY,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.4 + Math.random() * 0.3,
              color: particleColor,
              life: 1,
              decay: 0.002, // Much slower decay for 5-second duration
              effect: effect,
              behavior: 'smoke',
              rotation: 0,
              rotationSpeed: (Math.random() - 0.5) * 0.1, // Slow rotation
              phase: Math.random() * Math.PI * 2 // For gentle swaying
            });
            continue; // Skip normal particle creation
            
          case 'bubbles':
            // See-through bubbles that distort the background
            const bubbleX = Math.random() * canvas.width; // Full width coverage
            const bubbleY = canvas.height + Math.random() * 50; // Start from bottom
            vx = (Math.random() - 0.5) * 2; // Slow horizontal drift
            vy = -Math.random() * 3 - 2; // Rises up slowly
            particleColor = `rgba(255, 255, 255, 0.1)`; // Very transparent white
            size = Math.random() * 40 + 20; // Large bubbles
            
            // Create bubble particles with distortion effects
            burstParticles.push({
              x: bubbleX,
              y: bubbleY,
              vx: vx,
              vy: vy,
              size: size,
              opacity: 0.1 + Math.random() * 0.2, // Very transparent
              color: particleColor,
              life: 1,
              decay: 0.003, // Slow decay for long-lasting bubbles
              effect: effect,
              behavior: 'bubble',
              distortion: 0.3 + Math.random() * 0.4, // Distortion strength
              reflection: Math.random() * 0.3 + 0.1, // Reflection strength
              phase: Math.random() * Math.PI * 2, // For gentle movement
              wobble: Math.random() * 0.2 + 0.1 // Wobble intensity
            });
            continue; // Skip normal particle creation
            
          default:
            vx = (Math.random() - 0.5) * 12;
            vy = (Math.random() - 0.5) * 12;
        }
        
        burstParticles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: vx,
          vy: vy,
          size: size,
          opacity: 0.9 + Math.random() * 0.1,
          color: particleColor,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          effect: effect,
          behavior: effect === 'spiral' ? 'spiral' : effect === 'magnetic' ? 'orbit' : 'float',
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 30 + 10,
          centerX: x,
          centerY: y,
          pulsePhase: Math.random() * Math.PI * 2,
          spiralPhase: Math.random() * Math.PI * 2
        });
      }
    }
    
    // Reset particles and randomize sacred geometry
    function resetParticles() {
      particles = [];
      burstParticles = [];
      generateParticles();
      
      // Randomize sacred geometry positions
      geometrySymbols.forEach(symbol => {
        symbol.targetX = Math.random() * 0.8 + 0.1; // Keep within 10%-90% of canvas width
        symbol.targetY = Math.random() * 0.8 + 0.1; // Keep within 10%-90% of canvas height
        symbol.x = symbol.targetX; // Set current position to target immediately
        symbol.y = symbol.targetY;
      });
      
      // Clear any active magnetic field
      magneticField = null;
    }
    
    // Render function
    function render() {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply zoom and pan transformations
      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoomLevel, zoomLevel);
      
      // Draw sacred geometry
      drawSacredGeometry();
      
      // Update and render particles with different behaviors
      particles.forEach(particle => {
        const time = Date.now() * 0.001;
        
        switch (particle.behavior) {
          case 'orbit':
            particle.angle += 0.02 * config.animationSpeed;
            particle.x = particle.centerX + Math.cos(particle.angle) * particle.radius;
            particle.y = particle.centerY + Math.sin(particle.angle) * particle.radius;
            break;
            
          case 'pulse':
            particle.pulsePhase += 0.05 * config.animationSpeed;
            const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.5;
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            particle.size = (Math.random() * 4 + 2) * pulseScale;
            break;
            
          case 'drift':
            particle.x += particle.vx * config.animationSpeed * 0.5;
            particle.y += particle.vy * config.animationSpeed * 0.5;
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
            break;
            
          case 'spiral':
            particle.spiralPhase += 0.03 * config.animationSpeed;
            const spiralRadius = particle.radius * (1 + Math.sin(particle.spiralPhase) * 0.3);
            particle.x = particle.centerX + Math.cos(particle.spiralPhase) * spiralRadius;
            particle.y = particle.centerY + Math.sin(particle.spiralPhase) * spiralRadius;
            particle.radius += 0.1;
            break;
            
          case 'float':
          default:
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            break;
        }
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      // Update and render burst particles with behaviors
      burstParticles.forEach((particle, index) => {
        const time = Date.now() * 0.001;
        
        // Apply behavior-specific movement
        switch (particle.behavior) {
          case 'confetti':
            // Realistic confetti physics with gravity and air resistance
            particle.phase += 0.02 * config.animationSpeed;
            
            // Apply gravity (increases downward velocity over time)
            particle.vy += particle.gravity * config.animationSpeed;
            
            // Apply air resistance (slows down over time)
            particle.vx *= particle.airResistance;
            particle.vy *= particle.airResistance;
            
            // Add curved path using sine wave for horizontal movement
            const curveOffset = Math.sin(particle.phase) * 2;
            particle.x += (particle.vx + curveOffset) * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * config.animationSpeed;
            break;
            
          case 'orbit':
            particle.angle += 0.1 * config.animationSpeed;
            particle.x = particle.centerX + Math.cos(particle.angle) * particle.radius;
            particle.y = particle.centerY + Math.sin(particle.angle) * particle.radius;
            break;
            
          case 'spiral':
            particle.spiralPhase += 0.15 * config.animationSpeed;
            const spiralRadius = particle.radius * (1 + Math.sin(particle.spiralPhase) * 0.5);
            particle.x = particle.centerX + Math.cos(particle.spiralPhase) * spiralRadius;
            particle.y = particle.centerY + Math.sin(particle.spiralPhase) * spiralRadius;
            particle.radius += 0.5;
            break;
            
          case 'smoke':
            // Slow, gentle smoke movement with swaying
            particle.phase += 0.01 * config.animationSpeed;
            particle.x += particle.vx * config.animationSpeed * 0.5; // Slower horizontal
            particle.y += particle.vy * config.animationSpeed * 0.5; // Slower vertical
            
            // Add gentle swaying motion
            const swayOffset = Math.sin(particle.phase) * 0.5;
            particle.x += swayOffset;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * config.animationSpeed;
            break;
            
          case 'wave':
            // Wave movement with oscillating motion
            particle.phase += 0.05 * config.animationSpeed;
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            
            // Add wave-like oscillation
            const waveOffset = Math.sin(particle.phase) * 2;
            particle.y += waveOffset;
            break;
            
          case 'water':
            // Advanced water physics with ripples and splash effects
            particle.phase += 0.08 * config.animationSpeed;
            
            // Check if particle hits bottom (splash effect)
            if (particle.y >= canvas.height - 50 && !particle.hasSplashed) {
              particle.hasSplashed = true;
              particle.rippleRadius = 0; // Start ripple
              particle.vy = -particle.vy * 0.3; // Bounce back up slightly
              particle.vx += (Math.random() - 0.5) * 4; // Add horizontal splash
            }
            
            // Update position
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            
            // Add gravity
            particle.vy += 0.2 * config.animationSpeed;
            
            // Add wave motion while falling
            if (!particle.hasSplashed) {
              const waveMotion = Math.sin(particle.phase) * 1;
              particle.x += waveMotion;
            }
            
            // Update ripple effect
            if (particle.hasSplashed) {
              particle.rippleRadius += particle.rippleSpeed * config.animationSpeed;
            }
            
            // Add slight horizontal drift
            particle.vx *= 0.98; // Air resistance
            break;
            
          case 'bubble':
            // Gentle bubble movement with wobble
            particle.phase += 0.02 * config.animationSpeed;
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            
            // Add gentle wobble motion
            const wobbleX = Math.sin(particle.phase) * particle.wobble;
            const wobbleY = Math.cos(particle.phase * 1.3) * particle.wobble * 0.5;
            particle.x += wobbleX;
            particle.y += wobbleY;
            
            // Add slight upward drift
            particle.vy -= 0.01 * config.animationSpeed;
            break;
            
          case 'snowflake':
            // Snowflake movement with gentle rotation
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            particle.rotation += particle.rotationSpeed * config.animationSpeed;
            break;
            
          case 'float':
          default:
            particle.x += particle.vx * config.animationSpeed;
            particle.y += particle.vy * config.animationSpeed;
            break;
        }
        
        particle.life -= particle.decay || 0.02;
        particle.opacity = particle.life;
        
        if (particle.life > 0) {
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          
          // Draw different particle shapes based on behavior
          if (particle.behavior === 'confetti') {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            
            // Draw rectangular confetti pieces
            const width = particle.size * particle.life;
            const height = width * 0.6; // Make them rectangular
            ctx.fillRect(-width/2, -height/2, width, height);
          } else if (particle.behavior === 'smoke') {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            
            // Draw rectangular smoke clouds
            const width = particle.size * particle.life;
            const height = width * 0.8; // Slightly rectangular smoke
            ctx.fillRect(-width/2, -height/2, width, height);
          } else if (particle.behavior === 'water') {
            // Draw water droplets with ripple effects
            const dropletSize = particle.size * particle.life;
            
            // Draw main water droplet
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, dropletSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw ripple effect if particle has splashed
            if (particle.hasSplashed && particle.rippleRadius > 0) {
              const rippleOpacity = (1 - particle.rippleRadius / 100) * particle.opacity * 0.5;
              if (rippleOpacity > 0) {
                ctx.strokeStyle = `rgba(135, 206, 235, ${rippleOpacity})`; // Light blue ripple
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.rippleRadius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Draw second ripple ring
                if (particle.rippleRadius > 20) {
                  const innerRipple = particle.rippleRadius - 20;
                  const innerOpacity = (1 - innerRipple / 80) * particle.opacity * 0.3;
                  if (innerOpacity > 0) {
                    ctx.strokeStyle = `rgba(135, 206, 235, ${innerOpacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, innerRipple, 0, Math.PI * 2);
                    ctx.stroke();
                  }
                }
              }
            }
          } else if (particle.behavior === 'bubble') {
            // Draw see-through bubbles with background distortion
            const bubbleSize = particle.size * particle.life;
            const centerX = particle.x;
            const centerY = particle.y;
            
            // Create bubble with distortion effect
            ctx.save();
            
            // Create circular clipping path for the bubble
            ctx.beginPath();
            ctx.arc(centerX, centerY, bubbleSize, 0, Math.PI * 2);
            ctx.clip();
            
            // Draw distorted background within the bubble
            const distortion = particle.distortion;
            const gridSize = 8;
            
            for (let i = -bubbleSize; i <= bubbleSize; i += gridSize) {
              for (let j = -bubbleSize; j <= bubbleSize; j += gridSize) {
                const distance = Math.sqrt(i * i + j * j);
                if (distance <= bubbleSize) {
                  // Calculate distortion based on distance from center
                  const distortionFactor = 1 - (distance / bubbleSize) * distortion;
                  const distortedX = centerX + i * distortionFactor;
                  const distortedY = centerY + j * distortionFactor;
                  
                  // Sample background color (simplified - in real implementation would sample actual background)
                  const alpha = (1 - distance / bubbleSize) * particle.opacity * 0.3;
                  ctx.fillStyle = `rgba(135, 206, 235, ${alpha})`; // Light blue tint
                  ctx.fillRect(distortedX - gridSize/2, distortedY - gridSize/2, gridSize, gridSize);
                }
              }
            }
            
            // Draw bubble rim with reflection
            ctx.restore();
            ctx.save();
            
            // Draw outer rim
            const rimOpacity = particle.reflection * particle.opacity;
            ctx.strokeStyle = `rgba(255, 255, 255, ${rimOpacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, bubbleSize, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw highlight
            const highlightSize = bubbleSize * 0.3;
            const highlightX = centerX - bubbleSize * 0.3;
            const highlightY = centerY - bubbleSize * 0.3;
            
            const gradient = ctx.createRadialGradient(
              highlightX, highlightY, 0,
              highlightX, highlightY, highlightSize
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${rimOpacity * 0.8})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
          } else if (particle.behavior === 'snowflake') {
            // Draw SVG-style snowflakes
            drawSnowflake(ctx, particle.x, particle.y, particle.size * particle.life, particle.snowflakeType, particle.rotation);
          } else {
            // Draw circular particles for other effects
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            ctx.fill();
          }
          
          ctx.restore();
        } else {
          burstParticles.splice(index, 1);
        }
      });
      
      // Restore transformations
      ctx.restore();
    }
    
    // Animation loop
    function animate() {
      render();
      animationId = requestAnimationFrame(animate);
    }
    
    // Mouse interaction
    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const effects = ['explosion', 'spiral', 'wave', 'rainbow', 'lightning'];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      const randomColor = getRandomColor();
      
      triggerBurst(x, y, randomColor, 'high', randomEffect);
    });

    // Zoom and pan variables
    let zoomLevel = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoomLevel * zoomFactor));
      
      // Zoom towards mouse position
      panX = mouseX - (mouseX - panX) * (newZoom / zoomLevel);
      panY = mouseY - (mouseY - panY) * (newZoom / zoomLevel);
      zoomLevel = newZoom;
    });

    // Mouse drag to pan
    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        panX += deltaX;
        panY += deltaY;
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    });
    
    // Initialize
    generateParticles();
    animate();
    
    // Store functions globally for button access
    window.triggerBurst = triggerBurst;
    window.resetParticles = resetParticles;
  }
  
    function startRenderingSystem(ambientCanvas, burstCanvas) {
      // Set canvas size to match container
      const container = ambientCanvas.parentElement;
      const rect = container.getBoundingClientRect();
      
      ambientCanvas.width = rect.width;
      ambientCanvas.height = rect.height;
      burstCanvas.width = rect.width;
      burstCanvas.height = rect.height;
    
    const ambientCtx = ambientCanvas.getContext('2d');
    const burstCtx = burstCanvas.getContext('2d');
    
    // Particle systems
    let ambientParticles = [];
    let burstParticles = [];
    let animationId = null;
    
    // Zoom and geometry systems
    let zoomLevel = 1;
    let zoomTarget = 1;
    let panX = 0;
    let panY = 0;
    let panTargetX = 0;
    let panTargetY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let geometrySymbols = [];
    let showGeometry = true;
    let lastFrameTime = 0;
    
    // Configuration
    let config = {
      particleCount: 100,
      animationSpeed: 1,
      particleType: 'cosmic'
    };
    
    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    
    // Initialize particles
    function generateAmbientParticles() {
      ambientParticles = [];
      for (let i = 0; i < config.particleCount; i++) {
        ambientParticles.push({
          x: Math.random() * ambientCanvas.width,
          y: Math.random() * ambientCanvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 6 + 3, // Bigger particles
          opacity: Math.random() * 0.4 + 0.6, // More opaque
          color: getParticleColor(),
          life: 1
        });
      }
    }
    
    function getParticleColor() {
      const colors = {
        cosmic: ['#4a9eff', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
        sparkle: ['#ffffff', '#fbbf24', '#f59e0b', '#ef4444'],
        fire: ['#ef4444', '#f97316', '#fbbf24', '#fef3c7'],
        snow: ['#ffffff', '#f1f5f9', '#e2e8f0', '#cbd5e1']
      };
      const colorSet = colors[config.particleType] || colors.cosmic;
      return colorSet[Math.floor(Math.random() * colorSet.length)];
    }
    
    // Sacred Geometry Drawing Functions
    function drawFlowerOfLife(ctx, x, y, radius, scale = 1) {
      const scaledRadius = radius * scale;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Draw 7 circles in Flower of Life pattern
      const centers = [
        {x: x, y: y}, // Center
        {x: x - scaledRadius, y: y}, // Left
        {x: x + scaledRadius, y: y}, // Right
        {x: x - scaledRadius/2, y: y - scaledRadius * Math.sin(Math.PI/3)}, // Top left
        {x: x + scaledRadius/2, y: y - scaledRadius * Math.sin(Math.PI/3)}, // Top right
        {x: x - scaledRadius/2, y: y + scaledRadius * Math.sin(Math.PI/3)}, // Bottom left
        {x: x + scaledRadius/2, y: y + scaledRadius * Math.sin(Math.PI/3)} // Bottom right
      ];
      
      centers.forEach(center => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, scaledRadius, 0, Math.PI * 2);
        ctx.stroke();
      });
    }
    
    function drawMetatronsCube(ctx, x, y, size, scale = 1) {
      const scaledSize = size * scale;
      ctx.strokeStyle = 'rgba(138, 92, 246, 0.8)';
      ctx.lineWidth = 2;
      
      // 13 circles in Metatron's Cube pattern
      const radius = scaledSize / 6;
      const centers = [
        {x: x, y: y}, // Center
        {x: x - scaledSize/3, y: y - scaledSize/3}, {x: x + scaledSize/3, y: y - scaledSize/3},
        {x: x - scaledSize/3, y: y + scaledSize/3}, {x: x + scaledSize/3, y: y + scaledSize/3},
        {x: x - scaledSize/2, y: y}, {x: x + scaledSize/2, y: y},
        {x: x, y: y - scaledSize/2}, {x: x, y: y + scaledSize/2},
        {x: x - scaledSize/6, y: y - scaledSize/6}, {x: x + scaledSize/6, y: y - scaledSize/6},
        {x: x - scaledSize/6, y: y + scaledSize/6}, {x: x + scaledSize/6, y: y + scaledSize/6}
      ];
      
      // Draw circles
      centers.forEach(center => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      
      // Draw connecting lines
      ctx.beginPath();
      for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
          const dx = centers[i].x - centers[j].x;
          const dy = centers[i].y - centers[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < scaledSize/2) {
            ctx.moveTo(centers[i].x, centers[i].y);
            ctx.lineTo(centers[j].x, centers[j].y);
          }
        }
      }
      ctx.stroke();
    }
    
    function drawSriYantra(ctx, x, y, size, scale = 1) {
      const scaledSize = size * scale;
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.8)';
      ctx.lineWidth = 2;
      
      // Draw concentric triangles
      for (let i = 0; i < 4; i++) {
        const triangleSize = scaledSize * (1 - i * 0.2);
        const rotation = i * Math.PI / 3;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, -triangleSize/2);
        ctx.lineTo(-triangleSize/2 * Math.cos(Math.PI/3), triangleSize/2 * Math.sin(Math.PI/3));
        ctx.lineTo(triangleSize/2 * Math.cos(Math.PI/3), triangleSize/2 * Math.sin(Math.PI/3));
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
      
      // Draw lotus petals
      const petalCount = 8;
      for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 * i) / petalCount;
        const petalX = x + Math.cos(angle) * scaledSize * 0.6;
        const petalY = y + Math.sin(angle) * scaledSize * 0.6;
        
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, scaledSize * 0.1, scaledSize * 0.05, angle, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    function drawVesicaPiscis(ctx, x, y, size, scale = 1) {
      const scaledSize = size * scale;
      const radius = scaledSize / 2;
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 2;
      
      // Draw two overlapping circles
      ctx.beginPath();
      ctx.arc(x - radius/2, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(x + radius/2, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw the vesica piscis outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x - radius/2, y, radius, -Math.PI/3, Math.PI/3);
      ctx.arc(x + radius/2, y, radius, 2*Math.PI/3, 4*Math.PI/3);
      ctx.stroke();
    }
    
    function drawSeedOfLife(ctx, x, y, size, scale = 1) {
      const scaledSize = size * scale;
      const radius = scaledSize / 6;
      
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 2;
      
      // Center circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // 6 surrounding circles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const circleX = x + Math.cos(angle) * radius;
        const circleY = y + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    
    function drawGoldenSpiral(ctx, x, y, size, scale = 1) {
      const scaledSize = size * scale;
      const goldenRatio = 1.618;
      const maxRadius = scaledSize / 2;
      
      ctx.strokeStyle = 'rgba(255, 159, 243, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let radius = 1;
      let angle = 0;
      const centerX = x;
      const centerY = y;
      
      while (radius < maxRadius) {
        const spiralX = centerX + Math.cos(angle) * radius;
        const spiralY = centerY + Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(spiralX, spiralY);
        } else {
          ctx.lineTo(spiralX, spiralY);
        }
        
        angle += 0.1;
        radius = Math.pow(goldenRatio, angle / (Math.PI * 2)) * 2;
      }
      
      ctx.stroke();
    }
    
    function drawSacredGeometry(ctx) {
      if (!showGeometry) return;
      
      const canvasWidth = ambientCanvas.width;
      const canvasHeight = ambientCanvas.height;
      
      // Debug: Draw a test circle to verify drawing is working
      ctx.strokeStyle = 'rgba(255, 0, 0, 1)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw a simple test pattern first
      ctx.strokeStyle = 'rgba(0, 255, 0, 1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(100, 100, 100, 100);
      ctx.stroke();
      
      // Draw simple geometry patterns directly
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      
      // Flower of Life - simple version
      const flowerX = canvasWidth * 0.2;
      const flowerY = canvasHeight * 0.3;
      const flowerRadius = 40;
      
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(flowerX - flowerRadius, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(flowerX + flowerRadius, flowerY, flowerRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Metatron's Cube - simple version
      const metatronX = canvasWidth * 0.8;
      const metatronY = canvasHeight * 0.2;
      const metatronSize = 60;
      
      ctx.strokeStyle = 'rgba(138, 92, 246, 0.8)';
      ctx.beginPath();
      ctx.arc(metatronX, metatronY, metatronSize/3, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(metatronX - metatronSize/2, metatronY, metatronSize/6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(metatronX + metatronSize/2, metatronY, metatronSize/6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Sri Yantra - simple triangle
      const sriX = canvasWidth * 0.5;
      const sriY = canvasHeight * 0.7;
      const sriSize = 80;
      
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.8)';
      ctx.beginPath();
      ctx.moveTo(sriX, sriY - sriSize/2);
      ctx.lineTo(sriX - sriSize/2, sriY + sriSize/2);
      ctx.lineTo(sriX + sriSize/2, sriY + sriSize/2);
      ctx.closePath();
      ctx.stroke();
      
      // Vesica Piscis
      const vesicaX = canvasWidth * 0.1;
      const vesicaY = canvasHeight * 0.8;
      const vesicaRadius = 50;
      
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.beginPath();
      ctx.arc(vesicaX - vesicaRadius/2, vesicaY, vesicaRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(vesicaX + vesicaRadius/2, vesicaY, vesicaRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Seed of Life
      const seedX = canvasWidth * 0.9;
      const seedY = canvasHeight * 0.6;
      const seedRadius = 30;
      
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.beginPath();
      ctx.arc(seedX, seedY, seedRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const circleX = seedX + Math.cos(angle) * seedRadius;
        const circleY = seedY + Math.sin(angle) * seedRadius;
        
        ctx.beginPath();
        ctx.arc(circleX, circleY, seedRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Golden Spiral
      const spiralX = canvasWidth * 0.3;
      const spiralY = canvasHeight * 0.9;
      const spiralMaxRadius = 60;
      
      ctx.strokeStyle = 'rgba(255, 159, 243, 0.8)';
      ctx.beginPath();
      
      let radius = 2;
      let angle = 0;
      const goldenRatio = 1.618;
      
      while (radius < spiralMaxRadius) {
        const spiralXPos = spiralX + Math.cos(angle) * radius;
        const spiralYPos = spiralY + Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(spiralXPos, spiralYPos);
        } else {
          ctx.lineTo(spiralXPos, spiralYPos);
        }
        
        angle += 0.2;
        radius = Math.pow(goldenRatio, angle / (Math.PI * 2)) * 3;
      }
      
      ctx.stroke();
    }
    
    function startRenderLoop() {
      if (animationId) return;
      
      function animate(currentTime) {
        const deltaTime = currentTime - lastFrameTime;
        
        if (deltaTime >= 1000 / 60) {
          render();
          lastFrameTime = currentTime;
        }
        
        animationId = requestAnimationFrame(animate);
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    function render() {
      // Update zoom and pan smoothly
      zoomLevel += (zoomTarget - zoomLevel) * 0.1;
      panX += (panTargetX - panX) * 0.1;
      panY += (panTargetY - panY) * 0.1;
      
      // Render ambient particles
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      
      // Add a dark background to make particles visible
      ambientCtx.fillStyle = '#0a0a1a';
      ambientCtx.fillRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      
      // Draw sacred geometry
      drawSacredGeometry(ambientCtx);
      
      // Render particles with zoom and pan
      ambientCtx.save();
      ambientCtx.translate(panX, panY);
      ambientCtx.scale(zoomLevel, zoomLevel);
      
      ambientParticles.forEach(particle => {
        particle.x += particle.vx * config.animationSpeed;
        particle.y += particle.vy * config.animationSpeed;
        
        if (particle.x < 0) particle.x = ambientCanvas.width;
        if (particle.x > ambientCanvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = ambientCanvas.height;
        if (particle.y > ambientCanvas.height) particle.y = 0;
        
        ambientCtx.save();
        ambientCtx.globalAlpha = particle.opacity;
        ambientCtx.fillStyle = particle.color;
        ambientCtx.beginPath();
        ambientCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ambientCtx.fill();
        ambientCtx.restore();
      });
      
      ambientCtx.restore();
      
      // Render burst particles
      burstCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
      
      burstCtx.save();
      burstCtx.translate(panX, panY);
      burstCtx.scale(zoomLevel, zoomLevel);
      
      burstParticles.forEach((particle, index) => {
        particle.x += particle.vx * config.animationSpeed;
        particle.y += particle.vy * config.animationSpeed;
        particle.life -= 0.02;
        
        if (particle.life <= 0) {
          burstParticles.splice(index, 1);
          return;
        }
        
        burstCtx.save();
        burstCtx.globalAlpha = particle.opacity * particle.life;
        burstCtx.fillStyle = particle.color;
        burstCtx.beginPath();
        burstCtx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        burstCtx.fill();
        burstCtx.restore();
      });
      
      burstCtx.restore();
    }
    
    function triggerBurst(x, y, color, intensity, effect = 'explosion') {
      const particleCount = intensity === 'low' ? 15 : intensity === 'medium' ? 40 : 80;
      
      for (let i = 0; i < particleCount; i++) {
        let vx, vy, particleColor = color, size = Math.random() * 8 + 3;
        
        switch (effect) {
          case 'explosion':
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 12 + 3;
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;
            break;
            
          case 'spiral':
            const spiralAngle = (Math.PI * 2 * i) / particleCount + Date.now() * 0.01;
            const spiralSpeed = Math.random() * 8 + 2;
            const spiralRadius = (i / particleCount) * 60;
            vx = Math.cos(spiralAngle) * spiralSpeed + Math.cos(spiralAngle) * spiralRadius * 0.1;
            vy = Math.sin(spiralAngle) * spiralSpeed + Math.sin(spiralAngle) * spiralRadius * 0.1;
            break;
            
          case 'wave':
            const waveAngle = (Math.PI * 2 * i) / particleCount;
            const waveSpeed = Math.random() * 6 + 2;
            const waveOffset = Math.sin(i * 0.5) * 30;
            vx = Math.cos(waveAngle) * waveSpeed;
            vy = Math.sin(waveAngle) * waveSpeed + waveOffset * 0.1;
            break;
            
          case 'firework':
            const fireworkAngle = (Math.PI * 2 * i) / particleCount;
            const fireworkSpeed = Math.random() * 15 + 5;
            vx = Math.cos(fireworkAngle) * fireworkSpeed;
            vy = Math.sin(fireworkAngle) * fireworkSpeed - Math.random() * 8; // Upward bias
            particleColor = `hsl(${Math.random() * 60 + 15}, 100%, 50%)`; // Orange to red
            size = Math.random() * 12 + 4;
            break;
            
          case 'magnetic':
            const centerX = ambientCanvas.width / 2;
            const centerY = ambientCanvas.height / 2;
            const dx = centerX - x;
            const dy = centerY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = Math.min(distance * 0.1, 8);
            vx = (dx / distance) * force + (Math.random() - 0.5) * 4;
            vy = (dy / distance) * force + (Math.random() - 0.5) * 4;
            particleColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            break;
            
          case 'rainbow':
            const rainbowAngle = (Math.PI * 2 * i) / particleCount;
            const rainbowSpeed = Math.random() * 10 + 3;
            vx = Math.cos(rainbowAngle) * rainbowSpeed;
            vy = Math.sin(rainbowAngle) * rainbowSpeed;
            particleColor = `hsl(${(i / particleCount) * 360}, 100%, 50%)`;
            break;
            
          case 'lightning':
            const lightningAngle = Math.random() * Math.PI * 2;
            const lightningSpeed = Math.random() * 20 + 10;
            vx = Math.cos(lightningAngle) * lightningSpeed;
            vy = Math.sin(lightningAngle) * lightningSpeed;
            particleColor = '#00ffff';
            size = Math.random() * 3 + 1;
            break;
            
          default:
            vx = (Math.random() - 0.5) * 12;
            vy = (Math.random() - 0.5) * 12;
        }
        
        burstParticles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: vx,
          vy: vy,
          size: size,
          opacity: 0.9 + Math.random() * 0.1,
          color: particleColor,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          effect: effect,
          behavior: effect === 'spiral' ? 'spiral' : effect === 'magnetic' ? 'orbit' : 'float',
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 30 + 10,
          centerX: x,
          centerY: y,
          pulsePhase: Math.random() * Math.PI * 2,
          spiralPhase: Math.random() * Math.PI * 2
        });
      }
    }
    
    function triggerCosmicExplosion() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#4a9eff', 'high', 'rainbow');
      
      // Add multiple waves
      setTimeout(() => triggerBurst(centerX, centerY, '#ff6b6b', 'medium', 'spiral'), 200);
      setTimeout(() => triggerBurst(centerX, centerY, '#4ecdc4', 'medium', 'wave'), 400);
    }
    
    function triggerSnowStorm() {
      // Create multiple snow bursts across the top
      for (let i = 0; i < 5; i++) {
        const x = (ambientCanvas.width / 5) * i + Math.random() * (ambientCanvas.width / 5);
        triggerBurst(x, -20, '#ffffff', 'medium', 'wave');
      }
      
      // Add some random snowflakes
      for (let i = 0; i < 20; i++) {
        burstParticles.push({
          x: Math.random() * ambientCanvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 2,
          size: Math.random() * 6 + 3,
          opacity: 0.9,
          color: '#ffffff',
          life: 1,
          decay: 0.005
        });
      }
    }
    
    function triggerFireBurst() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      
      // Main firework burst
      triggerBurst(centerX, centerY, '#ff6b35', 'high', 'firework');
      
      // Add secondary bursts
      setTimeout(() => {
        triggerBurst(centerX + 50, centerY + 30, '#ff4757', 'medium', 'explosion');
        triggerBurst(centerX - 50, centerY + 30, '#ffa502', 'medium', 'explosion');
      }, 300);
      
      // Add some random fire particles
      for (let i = 0; i < 30; i++) {
        burstParticles.push({
          x: centerX + (Math.random() - 0.5) * 40,
          y: centerY + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 10 - 3,
          size: Math.random() * 10 + 5,
          opacity: 0.9,
          color: ['#ef4444', '#f97316', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 4)],
          life: 1,
          decay: 0.02
        });
      }
    }
    
    function triggerSpiral() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#8b5cf6', 'high', 'spiral');
    }
    
    function triggerRainbow() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#ff6b6b', 'high', 'rainbow');
    }
    
    function triggerMagnetic() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#4ecdc4', 'high', 'magnetic');
    }
    
    function triggerLightning() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#00ffff', 'high', 'lightning');
    }
    
    function triggerWave() {
      const centerX = ambientCanvas.width / 2;
      const centerY = ambientCanvas.height / 2;
      triggerBurst(centerX, centerY, '#ff9ff3', 'high', 'wave');
    }
    
    function resetParticles() {
      ambientParticles = [];
      burstParticles = [];
      generateAmbientParticles();
    }
    
    // Event listeners
    document.getElementById('renderingBurst')?.addEventListener('click', () => {
      const rect = ambientCanvas.getBoundingClientRect();
      triggerBurst(rect.left + rect.width/2, rect.top + rect.height/2, '#4a9eff', 'high');
    });
    
    document.getElementById('renderingCosmic')?.addEventListener('click', triggerCosmicExplosion);
    document.getElementById('renderingSnow')?.addEventListener('click', triggerSnowStorm);
    document.getElementById('renderingFire')?.addEventListener('click', triggerFireBurst);
    document.getElementById('renderingSpiral')?.addEventListener('click', triggerSpiral);
    document.getElementById('renderingRainbow')?.addEventListener('click', triggerRainbow);
    document.getElementById('renderingMagnetic')?.addEventListener('click', triggerMagnetic);
    document.getElementById('renderingLightning')?.addEventListener('click', triggerLightning);
    document.getElementById('renderingWave')?.addEventListener('click', triggerWave);
    // Launch button for fullscreen rendering system
    document.getElementById('openRenderingSystem')?.addEventListener('click', initRenderingSystem);
    
    // Control sliders
    const particleSlider = document.getElementById('renderingParticleCount');
    const speedSlider = document.getElementById('renderingSpeed');
    const zoomSlider = document.getElementById('renderingZoom');
    const particleValue = document.getElementById('renderingParticleValue');
    const speedValue = document.getElementById('renderingSpeedValue');
    const zoomValue = document.getElementById('renderingZoomValue');
    
    particleSlider?.addEventListener('input', (e) => {
      config.particleCount = parseInt(e.target.value);
      particleValue.textContent = e.target.value;
      generateAmbientParticles();
    });
    
    speedSlider?.addEventListener('input', (e) => {
      config.animationSpeed = parseFloat(e.target.value);
      speedValue.textContent = e.target.value;
    });
    
    zoomSlider?.addEventListener('input', (e) => {
      zoomTarget = parseFloat(e.target.value);
      zoomValue.textContent = e.target.value;
    });
    
    // Mouse events for interactive bursts
    ambientCanvas.addEventListener('mousemove', (e) => {
      const rect = ambientCanvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    
    ambientCanvas.addEventListener('click', (e) => {
      const rect = ambientCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const effects = ['explosion', 'spiral', 'wave', 'rainbow', 'lightning'];
      const colors = ['#4a9eff', '#ff6b6b', '#4ecdc4', '#ff9ff3', '#8b5cf6', '#fbbf24'];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      triggerBurst(x, y, randomColor, 'high', randomEffect);
    });
    
    // Mouse wheel zoom
    ambientCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      zoomTarget = Math.max(0.5, Math.min(3, zoomTarget * zoomFactor));
      zoomSlider.value = zoomTarget;
      zoomValue.textContent = zoomTarget.toFixed(1);
    });
    
    // Mouse drag pan
    ambientCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      ambientCanvas.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        panTargetX += deltaX;
        panTargetY += deltaY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      ambientCanvas.style.cursor = 'grab';
    });
    
    // Initialize
    generateAmbientParticles();
    startRenderLoop();
  }
})();
