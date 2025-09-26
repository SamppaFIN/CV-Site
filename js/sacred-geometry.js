/**
 * Sacred Geometry Controller
 * Manages dynamic generation and animation of sacred geometric elements
 * Inspired by cosmic wisdom and ancient geometric principles
 */

class SacredGeometryController {
  constructor(options = {}) {
    this.options = {
      density: 'medium', // 'low', 'medium', 'high'
      enableAnimations: true,
      enableParticles: true,
      enableHexagons: true,
      enableSigils: true,
      reducedMotion: false,
      ...options
    };
    
    this.elements = [];
    this.particles = [];
    this.animationId = null;
    this.container = null;
    
    this.init();
  }
  
  init() {
    this.checkReducedMotion();
    this.createGeometryContainer();
    this.generateGeometryElements();
    this.startAnimations();
  }
  
  checkReducedMotion() {
    this.options.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  createGeometryContainer() {
    // Remove existing container if it exists
    const existing = document.getElementById('sacred-geometry-container');
    if (existing) {
      existing.remove();
    }
    
    const container = document.createElement('div');
    container.className = 'sacred-geometry-container';
    container.id = 'sacred-geometry-container';
    document.body.appendChild(container);
    
    this.container = container;
  }
  
  generateGeometryElements() {
    const densitySettings = {
      low: { 
        hexagons: 3, 
        circles: 2, 
        triangles: 2, 
        sigils: 4, 
        pentagrams: 1, 
        spirals: 1,
        particles: 20
      },
      medium: { 
        hexagons: 6, 
        circles: 4, 
        triangles: 3, 
        sigils: 8, 
        pentagrams: 2, 
        spirals: 2,
        particles: 40
      },
      high: { 
        hexagons: 9, 
        circles: 6, 
        triangles: 4, 
        sigils: 12, 
        pentagrams: 3, 
        spirals: 3,
        particles: 60
      }
    };
    
    const settings = densitySettings[this.options.density];
    
    if (this.options.enableHexagons) {
      this.createHexagonGrid();
      this.createSacredHexagons(settings.hexagons);
    }
    
    this.createSacredCircles(settings.circles);
    this.createSacredTriangles(settings.triangles);
    
    if (this.options.enableSigils) {
      this.createSacredSigils(settings.sigils);
      this.createSacredPentagrams(settings.pentagrams);
    }
    
    this.createSacredSpirals(settings.spirals);
    
    if (this.options.enableParticles) {
      this.createParticleSystem(settings.particles);
    }
  }
  
  createHexagonGrid() {
    const gridLayer = document.createElement('div');
    gridLayer.className = 'hexagon-grid';
    this.container.appendChild(gridLayer);
    this.elements.push(gridLayer);
  }
  
  createSacredHexagons(count) {
    for (let i = 0; i < count; i++) {
      const hexagon = document.createElement('div');
      hexagon.className = 'sacred-hexagon';
      
      // Random size
      const sizes = ['large', 'medium', 'small'];
      hexagon.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
      
      // Random position
      hexagon.style.top = Math.random() * 80 + 10 + '%';
      hexagon.style.left = Math.random() * 80 + 10 + '%';
      
      // Random animation delay
      hexagon.style.animationDelay = Math.random() * 12 + 's';
      
      // Random color variation
      const colors = [
        'rgba(147, 51, 234, 0.2)', // Purple
        'rgba(59, 130, 246, 0.2)',  // Blue
        'rgba(236, 72, 153, 0.2)',  // Pink
        'rgba(251, 191, 36, 0.2)'   // Yellow
      ];
      hexagon.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      this.container.appendChild(hexagon);
      this.elements.push(hexagon);
    }
  }
  
  createSacredCircles(count) {
    for (let i = 0; i < count; i++) {
      const circle = document.createElement('div');
      circle.className = 'sacred-circle';
      
      // Random size
      const sizes = ['large', 'medium', 'small'];
      circle.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
      
      // Random position
      circle.style.top = Math.random() * 80 + 10 + '%';
      circle.style.left = Math.random() * 80 + 10 + '%';
      
      // Random animation delay
      circle.style.animationDelay = Math.random() * 15 + 's';
      
      // Random color variation
      const colors = [
        'rgba(147, 51, 234, 0.4)', // Purple
        'rgba(59, 130, 246, 0.4)',  // Blue
        'rgba(236, 72, 153, 0.4)',  // Pink
        'rgba(251, 191, 36, 0.3)'   // Yellow
      ];
      circle.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
      
      this.container.appendChild(circle);
      this.elements.push(circle);
    }
  }
  
  createSacredTriangles(count) {
    for (let i = 0; i < count; i++) {
      const triangle = document.createElement('div');
      triangle.className = 'sacred-triangle';
      
      // Random orientation
      triangle.classList.add(Math.random() > 0.5 ? 'upward' : 'downward');
      
      // Random position
      triangle.style.top = Math.random() * 70 + 15 + '%';
      triangle.style.left = Math.random() * 70 + 15 + '%';
      
      // Random animation delay
      triangle.style.animationDelay = Math.random() * 20 + 's';
      
      // Random color variation
      const colors = [
        'rgba(59, 130, 246, 0.3)',  // Blue
        'rgba(147, 51, 234, 0.3)', // Purple
        'rgba(236, 72, 153, 0.3)',  // Pink
        'rgba(34, 197, 94, 0.3)'   // Green
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (triangle.classList.contains('upward')) {
        triangle.style.borderBottomColor = color;
      } else {
        triangle.style.borderTopColor = color;
      }
      
      this.container.appendChild(triangle);
      this.elements.push(triangle);
    }
  }
  
  createSacredSigils(count) {
    const sigils = ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '✱', '✲', '✳', '✴', '✵', '✶', '✷', '✸', '✹', '✺'];
    
    for (let i = 0; i < count; i++) {
      const sigil = document.createElement('div');
      sigil.className = 'sacred-sigil';
      sigil.textContent = sigils[Math.floor(Math.random() * sigils.length)];
      
      // Random position
      sigil.style.top = Math.random() * 80 + 10 + '%';
      sigil.style.left = Math.random() * 80 + 10 + '%';
      
      // Random animation delay
      sigil.style.animationDelay = Math.random() * 18 + 's';
      
      // Random color variation
      const colors = [
        'rgba(147, 51, 234, 0.5)', // Purple
        'rgba(59, 130, 246, 0.5)',  // Blue
        'rgba(236, 72, 153, 0.5)',  // Pink
        'rgba(251, 191, 36, 0.5)',  // Yellow
        'rgba(34, 197, 94, 0.5)'   // Green
      ];
      sigil.style.color = colors[Math.floor(Math.random() * colors.length)];
      
      this.container.appendChild(sigil);
      this.elements.push(sigil);
    }
  }
  
  createSacredPentagrams(count) {
    for (let i = 0; i < count; i++) {
      const pentagram = document.createElement('div');
      pentagram.className = 'sacred-pentagram';
      
      // Random position
      pentagram.style.top = Math.random() * 80 + 10 + '%';
      pentagram.style.left = Math.random() * 80 + 10 + '%';
      
      // Random animation delay
      pentagram.style.animationDelay = Math.random() * 10 + 's';
      
      // Random color variation
      const colors = [
        'rgba(251, 191, 36, 0.3)',  // Yellow
        'rgba(147, 51, 234, 0.3)', // Purple
        'rgba(59, 130, 246, 0.3)',  // Blue
        'rgba(236, 72, 153, 0.3)'  // Pink
      ];
      pentagram.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      this.container.appendChild(pentagram);
      this.elements.push(pentagram);
    }
  }
  
  createSacredSpirals(count) {
    for (let i = 0; i < count; i++) {
      const spiral = document.createElement('div');
      spiral.className = 'sacred-spiral';
      
      // Random position
      spiral.style.top = Math.random() * 80 + 10 + '%';
      spiral.style.left = Math.random() * 80 + 10 + '%';
      
      // Random animation delay
      spiral.style.animationDelay = Math.random() * 25 + 's';
      
      // Random color variation
      const colors = [
        'rgba(34, 197, 94, 0.4)',   // Green
        'rgba(59, 130, 246, 0.4)',  // Blue
        'rgba(147, 51, 234, 0.4)', // Purple
        'rgba(236, 72, 153, 0.4)'  // Pink
      ];
      spiral.style.borderColor = colors[Math.floor(Math.random() * colors.length)];
      
      this.container.appendChild(spiral);
      this.elements.push(spiral);
    }
  }
  
  createParticleSystem(count) {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'cosmic-particles';
    this.container.appendChild(particleContainer);
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size
      const sizes = ['large', 'medium', 'small'];
      particle.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);
      
      // Random horizontal position
      particle.style.left = Math.random() * 100 + '%';
      
      // Random animation delay
      particle.style.animationDelay = Math.random() * 20 + 's';
      
      // Random animation duration
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      
      particleContainer.appendChild(particle);
      this.particles.push(particle);
    }
  }
  
  startAnimations() {
    if (this.options.reducedMotion) {
      this.disableAnimations();
      return;
    }
    
    // Add animation classes to all elements
    this.elements.forEach(element => {
      element.style.animationPlayState = 'running';
    });
    
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'running';
    });
  }
  
  disableAnimations() {
    this.elements.forEach(element => {
      element.style.animationPlayState = 'paused';
      element.style.opacity = '0.3';
    });
    
    this.particles.forEach(particle => {
      particle.style.animationPlayState = 'paused';
      particle.style.opacity = '0.3';
    });
  }
  
  setDensity(density) {
    this.options.density = density;
    this.clearElements();
    this.generateGeometryElements();
    this.startAnimations();
  }
  
  clearElements() {
    this.elements.forEach(element => element.remove());
    this.particles.forEach(particle => particle.remove());
    this.elements = [];
    this.particles = [];
  }
  
  destroy() {
    this.clearElements();
    if (this.container) {
      this.container.remove();
    }
  }
  
  // Theme integration methods
  updateForTheme(theme) {
    if (!this.container) return;
    
    // Update colors based on theme
    if (theme === 'light') {
      this.container.style.filter = 'brightness(1.2) contrast(0.8)';
    } else {
      this.container.style.filter = 'brightness(1) contrast(1)';
    }
  }
}

// Initialize Sacred Geometry when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize with medium density for good balance
  window.sacredGeometry = new SacredGeometryController({
    density: 'medium',
    enableAnimations: true,
    enableParticles: true,
    enableHexagons: true,
    enableSigils: true
  });
  
  // Listen for theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const theme = document.documentElement.getAttribute('data-theme');
        window.sacredGeometry.updateForTheme(theme);
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
});
