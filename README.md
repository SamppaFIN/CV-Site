# CV Portfolio - Sami Räisänen

**Live Demo**: [View Portfolio](https://samppafin.github.io/CV-Site/)

A modern, bilingual (EN/FI) CV and portfolio site featuring interactive UI, theme switching, and dynamic project showcases with GitHub-style tech badges.

## ✨ Features

- **🌍 Bilingual Support**: Seamless EN/FI language switching
- **🌓 Theme Toggle**: Light/Dark mode with smooth transitions (click Aurora card for instant light!)
- **📱 Mobile-First**: Fully responsive design optimized for all devices
- **🎨 Modern UI**: Glass morphism effects, smooth animations, and sacred geometry background
- **🏷️ GitHub-Style Tech Badges**: Colorful language tags for each project
- **🔍 Project Modals**: Expandable project details with README content
- **⚡ Interactive Effects Lab**: Particle systems and visual effects (footer button)
- **♿ Accessibility**: Keyboard navigation, ARIA labels, semantic HTML

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/SamppaFIN/CV-Site.git
cd CV-Site

# Open in browser (or use any static server)
open index.html

# OR use Python server
python -m http.server 8000
# Visit http://localhost:8000
```

### GitHub Pages Deployment

This site is configured to deploy automatically via GitHub Pages:
1. Push to `main` branch
2. GitHub Pages serves from root `/`
3. Access at: `https://samppafin.github.io/CV-Site/`

## 📁 Project Structure

```
cv-site/
├── index.html              # Main SPA entry point
├── css/
│   ├── styles.css          # Main styles, themes, layouts
│   └── sacred-geometry.css # Background geometry effects
├── js/
│   ├── app.js              # Main application logic, projects data
│   ├── i18n.js             # Bilingual translations (EN/FI)
│   ├── markdown.js         # Minimal markdown renderer
│   └── sacred-geometry.js  # Sacred geometry background animation
└── README.md               # This file
```

## 🛠️ Tech Stack

- **Pure Vanilla JavaScript** - No frameworks, fast and lightweight
- **CSS3** - Modern features: Grid, Flexbox, Custom Properties, Animations
- **HTML5** - Semantic, accessible markup
- **No Build Tools** - Simple, direct, no compilation needed

## 🎨 Key Features

### Theme System
- Persistent theme selection (localStorage)
- Smooth transitions between light/dark modes
- Click Aurora card for instant light theme toggle

### Project Showcase
- Dynamic project cards with:
  - Hero images
  - Concise descriptions
  - GitHub-style colorful tech badges
  - Click-to-expand modal with full details
- Bilingual project descriptions

### Interactive Effects
- Sacred geometry animated background
- Particle burst effects (click brand name)
- Full-screen particle systems
- Canvas-based 2.5D effects lab

## 📝 Updating Content

### Adding Projects

Edit the `projects` array in `js/app.js`:

```javascript
{
  id: 'YourProject',
  title: 'Project Name',
  titleFi: 'Projektin Nimi',
  img: 'https://your-image-url.com/image.jpg',
  tech: ['React', 'TypeScript', 'Node.js'],
  md: `English description with [links](url)`,
  mdFi: `Suomenkielinen kuvaus [linkeillä](url)`
}
```

### Modifying Translations

Edit `js/i18n.js` to add/modify EN/FI translations:

```javascript
const en = { /* English translations */ };
const fi = { /* Finnish translations */ };
```

## 🎯 Roadmap

- [x] Bilingual support
- [x] Theme toggle
- [x] Project modal system
- [x] GitHub-style tech badges
- [x] Sacred geometry background
- [x] Mobile optimization
- [ ] Project filtering by tech
- [ ] Blog integration
- [ ] Contact form
- [ ] Analytics integration

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome! Feel free to:
- Report bugs via Issues
- Suggest improvements
- Fork for your own use (remember to customize!)

## 📄 License

MIT License - Feel free to use this as a template for your own portfolio.

## 🙏 Acknowledgments

- Built with ❤️ and conscious development principles
- Inspired by modern design trends and user experience best practices
- Aurora AI Assistant for guidance and collaboration

---

**Built by Sami Räisänen** | [GitHub](https://github.com/SamppaFIN) | Made with vanilla.js and care ✨
