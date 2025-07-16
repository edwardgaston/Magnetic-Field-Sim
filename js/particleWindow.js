/**
 * Particle Window Script
 * Handles rendering and interaction for individual particle windows
 */

class ParticleWindow {
    constructor(particleId, type, charge, color, symbol) {
        this.particleId = particleId;
        this.type = type;
        this.charge = charge;
        this.color = color;
        this.symbol = symbol;
        this.allParticles = [];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.lastUpdateTime = 0;
        this.radius = 30;
        
        this.initialize();
    }

    /**
     * Initialize the particle window
     */
    initialize() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupMessageListener();
        this.startRenderLoop();
        
        // Notify parent that particle is ready
        this.sendMessage({
            type: 'particle-ready',
            id: this.particleId
        });
    }

    /**
     * Setup canvas and handle resize
     */
    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }

    /**
     * Setup mouse event listeners for dragging
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragOffset.x = e.clientX - this.canvas.width/2;
            this.dragOffset.y = e.clientY - this.canvas.height/2;
            this.canvas.style.cursor = 'grabbing';
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.canvas.style.cursor = 'grab';
        });
    }

    /**
     * Handle drag events
     */
    handleDrag(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = window.screenX + rect.left + this.canvas.width/2;
        const y = window.screenY + rect.top + this.canvas.height/2;
        
        this.sendMessage({
            type: 'particle-update',
            id: this.particleId,
            x: x,
            y: y
        });
    }

    /**
     * Setup message listener for updates from parent
     */
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            if (data.type === 'physics-update') {
                this.allParticles = data.allParticles;
                this.lastUpdateTime = data.timestamp;
            }
        });
    }

    /**
     * Send message to parent window
     */
    sendMessage(message) {
        if (window.opener) {
            window.opener.postMessage(message, '*');
        }
    }

    /**
     * Start the render loop
     */
    startRenderLoop() {
        const render = () => {
            this.renderParticle();
            requestAnimationFrame(render);
        };
        render();
    }

    /**
     * Render the particle and field lines
     */
    renderParticle() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Draw field lines to other particles
        this.drawFieldLines(centerX, centerY);
        
        // Draw the main particle
        this.drawMainParticle(centerX, centerY);
        
        // Draw particle info
        this.drawParticleInfo();
    }

    /**
     * Draw field lines to other particles
     */
    drawFieldLines(centerX, centerY) {
        this.allParticles.forEach(particle => {
            if (particle.id !== this.particleId) {
                this.drawFieldLine(centerX, centerY, particle);
            }
        });
    }

    /**
     * Draw a single field line to another particle
     */
    drawFieldLine(centerX, centerY, targetParticle) {
        const rect = this.canvas.getBoundingClientRect();
        const thisX = window.screenX + rect.left + centerX;
        const thisY = window.screenY + rect.top + centerY;
        
        const dx = targetParticle.x - thisX;
        const dy = targetParticle.y - thisY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Determine line color based on interaction type
            const isAttraction = targetParticle.charge * this.charge < 0;
            const lineColor = isAttraction ? '#4ecdc4' : '#ff6b6b';
            const lineOpacity = Math.max(0.1, Math.min(0.8, 1000 / distance));
            
            this.ctx.strokeStyle = lineColor;
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = lineOpacity;
            
            // Draw field line
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            
            // Calculate end point within canvas bounds
            const maxDistance = Math.min(this.canvas.width, this.canvas.height) * 0.4;
            const normalizedDistance = Math.min(distance, maxDistance);
            const endX = centerX + (dx / distance) * normalizedDistance;
            const endY = centerY + (dy / distance) * normalizedDistance;
            
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
            
            // Draw arrow indicating direction
            this.drawArrow(endX, endY, Math.atan2(dy, dx));
        }
    }

    /**
     * Draw arrow at end of field line
     */
    drawArrow(x, y, angle) {
        const arrowSize = 8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowSize * Math.cos(angle - Math.PI/6),
            y - arrowSize * Math.sin(angle - Math.PI/6)
        );
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x - arrowSize * Math.cos(angle + Math.PI/6),
            y - arrowSize * Math.sin(angle + Math.PI/6)
        );
        this.ctx.stroke();
    }

    /**
     * Draw the main particle
     */
    drawMainParticle(centerX, centerY) {
        this.ctx.globalAlpha = 1.0;
        
        // Draw glow effect
        this.ctx.shadowColor = this.color;
        this.ctx.shadowBlur = 20;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.radius + 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1.0;
        
        // Draw main particle
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw charge symbol
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.symbol, centerX, centerY);
    }

    /**
     * Draw particle information
     */
    drawParticleInfo() {
        const infoText = `Charge: ${this.symbol} | Particles: ${this.allParticles.length}`;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 30);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(infoText, 15, 25);