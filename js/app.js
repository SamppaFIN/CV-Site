(function(){
  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  function applyTheme(theme){ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); themeBtn.textContent = theme==='light'?'☀️':'🌙'; }
  document.addEventListener('DOMContentLoaded', ()=>{
    applyTheme(localStorage.getItem('theme')||'light');
    themeBtn?.addEventListener('click', ()=>{ const cur = document.documentElement.getAttribute('data-theme'); applyTheme(cur==='light'?'dark':'light'); });
    document.getElementById('year').textContent = new Date().getFullYear();

    // Easter-egg: brand name sparks
    const brand = document.getElementById('brandText');
    brand?.addEventListener('click', (e)=> runSparkBurst(e.clientX, e.clientY));
    brand?.addEventListener('dblclick', ()=> runParticlesOnce());
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
    { id: 'Klitoritari', title: 'Klitoritari', img: 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?q=80&w=1600&auto=format&fit=crop', md: `Multiplayer online adventure game prototype focused on fast iteration and immersive loops. Built to test networking, state sync and moment‑to‑moment feel.\nRepo: [Klitoritari](https://github.com/SamppaFIN/Klitoritari)  ·  Live: [App](https://klitoritari-a06bceac06e2.herokuapp.com/)` },
    { id: 'NLP-AI', title: 'NLP-AI', img: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1600&auto=format&fit=crop', md: `Natural language processing experiments and agents. Compact playground to evaluate prompts, embeddings and pipelines.\nRepo: [NLP-AI](https://github.com/SamppaFIN/NLP-AI)  ·  Live: [App](https://kotinlp-f2f36174831d.herokuapp.com/)` },
    { id: 'HealthConnectAI', title: 'HealthConnectAI', img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop', md: `Web app to ask health‑related questions via Perplexity AI with a focused UI. TypeScript codebase exploring API orchestration.\nRepo: [HealthConnectAI](https://github.com/SamppaFIN/HealthConnectAI)` },
    { id: 'AngelicWaves', title: 'AngelicWaves', img: 'https://images.unsplash.com/photo-1494233892892-84542a694e22?q=80&w=1600&auto=format&fit=crop', md: `Fun frequency detector/visualizer in TypeScript. A playground for audio APIs and signal UX.\nRepo: [AngelicWaves](https://github.com/SamppaFIN/AngelicWaves)  ·  Live: [Info](https://angelicwaves-25d1c2a5b069.herokuapp.com/)` },
    { id: 'RAG-Demo', title: 'RAG-Demo', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop', md: `Python demo for Retrieval‑Augmented Generation. Shows retrieval, context building and answer synthesis.\nRepo: [RAG-Demo](https://github.com/SamppaFIN/RAG-Demo)` },
    { id: 'MergeMaster', title: 'MergeMaster', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop', md: `A small browser game built in one hour with my 8‑year‑old son — joyful learning and rapid prototyping. Simple HTML/JS with playful polish.\nRepo: [MergeMaster](https://github.com/SamppaFIN/MergeMaster)` },
    { id: 'CV', title: 'CV', img: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=1600&auto=format&fit=crop', md: `Personal CV repo that inspired this new bilingual site. Focus on clarity, responsiveness and subtle motion.\nRepo: [CV](https://github.com/SamppaFIN/CV)  ·  Live: [Old site](https://samppafin.github.io/CV/#)` },
    { id: 'EldrichHorror', title: 'EldrichHorror', img: 'https://images.unsplash.com/photo-1520975922284-9e0ce9f76ef4?q=80&w=1600&auto=format&fit=crop', md: `TypeScript experiments that later informed Eldritch Sanctuary. Mechanics spikes and rendering tests.\nRepo: [EldrichHorror](https://github.com/SamppaFIN/EldrichHorror)` }
  ];

  function renderProjects(){
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = projects.map(p=>`
      <article class="project" data-proj-id="${p.id}">
        <img alt="${p.title}" src="${p.img}" loading="lazy" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';"/>
        <div class="content">
          <div class="title">${p.title}</div>
          <div class="md">${mdToHtml(p.md)}</div>
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
    modalTitle.textContent = p.title;
    // Use seeded README when available, fallback to card md
    const md = README[p.id] || p.md;
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

  document.addEventListener('DOMContentLoaded', ()=>{ renderProjects(); renderExperience(); initEffects(); I18N.applyTranslations(); });
})();
