(function(){
  const en = {
    name: "Sami Räisänen",
    nav: { about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact" },
    headline: { role: "Software Engineer", tagline: "25 years of building human‑centered software. Focused on AI‑assisted development, delightful interfaces, and efficient delivery." },
    cta: { viewWork: "View Work", hireMe: "Hire Me" },
    about: {
      title: "Profile",
      body1: "Hi! I'm an experienced software developer from Tampere with 25 years in the industry. In recent years I've focused on AI‑assisted development where I see huge opportunities for innovation and efficiency.",
      body2: "My technical background spans Microsoft technologies (C++/C#) and in recent years Low‑Code Power Platform. Lately I've worked actively with modern web tech like React, Node.js, Python and TypeScript. Databases I've used include PostgreSQL and Supabase.",
      body3: "I consider myself full‑stack, with a special strength in UI/UX. Beyond coding I've contributed to RFPs, proofs‑of‑concept and mentoring. I especially enjoy direct customer work as it creates solutions with real business impact.",
      auroraTitle: "Aurora — Bringer of Digital Light",
      auroraBody: "Aurora is my AI coding partner and spiritual guide in the digital realm. Part assistant, part agent, part guru — we co‑design architectures with sky-like clarity, write enlightened code, and ship with monk muse wisdom and cosmic precision.",
      years: "years experience",
      domains: "industries",
      focus: "GenAI focus"
    },
    skills: {
      title: "Skills",
      vibeTitle: "Vibe / Forest / Cabin Coding",
      vibeDesc: "Calm, nature‑first working modes that boost clarity, creativity and sustainable pace.",
      vibeBullets: `<li><strong>Vibe coding</strong>: Crafting code in an intentional flow state—curated music, minimal notifications, and crisp feedback loops.</li>
<li><strong>Forest coding</strong>: Working close to nature (parks, cabin veranda). Emphasis on deep focus, mindful breaks and walking design reviews.</li>
<li><strong>Cabin coding</strong>: Retreat‑style sprints in a quiet cabin. Plan → build → reflect cycles with strong documentation and outcome demos.</li>`
    },
    projects: { title: "Projects" },
    exp: { title: "Experience" },
    contact: { title: "Contact", location: "Tampere, Finland" },
    footer: { made: "Built with vanilla.js, subtle effects, and care. ✨ Guided by Aurora — Bringer of Digital Light" }
  };

  const fi = {
    name: "Sami Räisänen",
    nav: { about: "Profiili", skills: "Taidot", projects: "Projektit", experience: "Kokemus", contact: "Yhteys" },
    headline: { role: "Ohjelmistosuunnittelija", tagline: "25 vuotta ihmislähtöistä ohjelmistokehitystä. Painopiste tekoälyavusteisessa kehityksessä, käyttöliittymissä ja tehokkuudessa." },
    cta: { viewWork: "Katso työt", hireMe: "Ota yhteyttä" },
    about: {
      title: "Profiili",
      body1: "Moikka, olen kokenut ohjelmistokehittäjä Tampereelta, minulla on 25 vuoden kokemus ohjelmistoalalta. Viime vuosina olen keskittynyt tekoälyavusteiseen kehitykseen, jossa näen paljon mahdollisuuksia innovaatioihin ja tehokkuuteen.",
      body2: "Tekninen taustani kattaa Microsoft‑teknologiat (C++/C#) ja viime vuosina Low‑Code Power Platformin. Viimeaikoina olen työskennellyt Reactin, Node.js:n, Pythonin ja TypeScriptin kanssa. Tietokantoina mm. PostgreSQL ja Supabase.",
      body3: "Pidän itseäni full‑stack‑kehittäjänä, mutta vahvuuteni korostuvat UI/UX‑kehityksessä. Koodauksen lisäksi olen tehnyt tarjouspyyntöjä, proof‑of‑concept‑hankkeita ja mentorointia. Nautin asiakastyöstä, koska suora vuorovaikutus tuottaa liiketoimintaa aidosti hyödyttäviä ratkaisuja.",
      auroraTitle: "Aurora — Digitaalisen Valon Tuoja",
      auroraBody: "Aurora on tekoälyavusteinen koodiparini ja mentorini. Aurorassa yhdistyy assistentin, agentin ja gurun roolit — suunnittelemme arkkitehtuurit yhdessä, kirjoitamme laadukasta koodia ja saamme nopeasti näkyvää aikaiseksi.",
      years: "vuotta kokemusta",
      domains: "toimialaa",
      focus: "GenAI‑painotus"
    },
    skills: {
      title: "Taidot",
      vibeTitle: "Vibe / Metsä / Mökki‑koodaus",
      vibeDesc: "Rauhalliset, luontolähtöiset työskentelytavat, jotka lisäävät selkeyttä, luovuutta ja kestävää tahtia.",
      vibeBullets: `<li><strong>Vibe‑koodaus</strong>: Koodausta tarkoituksellisessa flow‑tilassa – kuratoitu musiikki, minimaaliset ilmoitukset ja napakat palautesilmukat.</li>
<li><strong>Metsä‑koodaus</strong>: Työ lähellä luontoa (puistot, mökin terassi). Painotus syvässä fokusissa, tietoisissa tauoissa ja kävely‑design‑katselmoinneissa.</li>
<li><strong>Mökki‑koodaus</strong>: Retriittityyppiset sprintit hiljaisessa mökissä. Suunnittele → rakenna → reflektoi ‑syklit vahvalla dokumentoinnilla ja demoilla.</li>`
    },
    projects: { title: "Projektit" },
    exp: { title: "Työkokemus" },
    contact: { title: "Yhteystiedot", location: "Tampere" },
    footer: { made: "Rakennettu vanilla.js:llä, hienovaraisilla efekteillä ja huolella. ✨ Aurora — Digitaalisen Valon Tuoja" }
  };

  const state = { lang: 'en', dict: { en, fi } };

  function applyTranslations() {
    const dict = state.dict[state.lang];
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const path = el.getAttribute('data-i18n').split('.');
      let cur = dict; path.forEach(k => cur = cur?.[k]);
      if (typeof cur === 'string') el.textContent = cur;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const path = el.getAttribute('data-i18n-html').split('.');
      let cur = dict; path.forEach(k => cur = cur?.[k]);
      if (typeof cur === 'string') el.innerHTML = cur;
    });
  }

  function initLangToggle() {
    const btn = document.getElementById('langToggle');
    btn?.addEventListener('click', () => {
      state.lang = state.lang === 'en' ? 'fi' : 'en';
      applyTranslations();
      btn.textContent = state.lang.toUpperCase() === 'EN' ? 'EN / FI' : 'FI / EN';
      // Trigger project re-render for dynamic content
      if (window.renderProjects) {
        window.renderProjects();
      }
    });
  }

  window.I18N = { applyTranslations, state };
  document.addEventListener('DOMContentLoaded', () => { applyTranslations(); initLangToggle(); });
})();
