/**
 * Main Controller for Magnetic Field Simulation
 * Manages particles, windows, and physics simulation
 */

class MagneticController {
    constructor() {
        this.particles = [];
        this.physicsEngine = new PhysicsEngine();
        this.animationId = null;
        this.windowOffset = 0;
        this.isRunning = false;
        
        this.initialize();
    }

    /**
     * Initialize the controller
     */
    initialize() {
        this.setupMessageListener();
        this.startPhysicsLoop();
        this.updateUI();
    }

    /**
     * Create a new particle
     */
    createParticle(type) {
        const windowWidth = 300;
        const windowHeight = 300;
        
        // Calculate position to avoid overlap
        const x = 100 + (this.windowOffset % 3) * 350;
        const y = 100 + Math.floor(this.windowOffset / 3) * 350;
        
        // Create particle using factory
        const particle = ParticleFactory.createParticle(type, x + windowWidth/2, y + windowHeight/2);
        
        // Create window for particle
        const particleWindow = particle.createWindow(x, y);
        
        if (particleWindow) {
            this.particles.push(particle);
            this.windowOffset++;
            this.updateUI();
            
            // Monitor window closure
            this.monitorWindowClosure(particle);
            
            console.log(`Created ${type} particle with ID: ${particle.id}`);
        } else {
            console.error('Failed to create particle window');
        }
    }

    /**
     * Monitor particle window closure
     */
    monitorWindowClosure(particle) {
        const checkClosed = setInterval(() => {
            if (!particle.isWindowOpen()) {
                this.removeParticle(particle.id);
                clearInterval(checkClosed);
            }
        }, 1000);
    }

    /**
     * Remove a particle from the simulation
     */
    removeParticle(id) {
        const index = this.particles.findIndex(p => p.id === id);
        if (index !== -1) {
            const particle = this.particles[index];
            particle.closeWindow();
            this.particles.splice(index, 1);
            this.updateUI();
            console.log(`Removed particle with ID: ${id}`);
        }
    }

    /**
     * Set up message listener for cross-window communication
     */
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            switch (data.type) {
                case 'particle-update':
                    this.handleParticleUpdate(data);
                    break;
                case 'particle-ready':
                    this.handleParticleReady(data);
                    break;
                default:
                    console.warn('Unknown message type:', data.type);
            }
        });
    }

    /**
     * Handle particle position updates
     */
    handleParticleUpdate(data) {
        const particle = this.particles.find(p => p.id === data.id);
        if (particle) {
            particle.updatePosition(data.x, data.y);
        }
    }

    /**
     * Handle particle ready notifications
     */
    handleParticleReady(data) {
        console.log(`Particle ${data.id} is ready`);
    }

    /**
     * Start the physics simulation loop
     */
    startPhysicsLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const loop = () => {
            if (this.particles.length > 0) {
                this.physicsEngine.simulatePhysics(this.particles);
                this.broadcastParticleData();
            }
            this.animationId = requestAnimationFrame(loop);
        };
        
        loop();
    }

    /**
     * Stop the physics simulation loop
     */
    stopPhysicsLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
    }

    /**
     * Broadcast particle data to all windows
     */
    broadcastParticleData() {
        const particleData = this.particles.map(p => p.toJSON());
        
        this.particles.forEach(particle => {
            if (particle.isWindowOpen()) {
                try {
                    particle.window.postMessage({
                        type: 'physics-update',
                        allParticles: particleData,
                        timestamp: Date.now()
                    }, '*');
                } catch (error) {
                    console.warn('Failed to send message to particle window:', error);
                    this.removeParticle(particle.id);
                }
            }
        });
    }

    /**
     * Update UI elements
     */
    updateUI() {
        const totalCount = this.particles.length;
        const positiveCount = this.particles.filter(p => p.type === 'positive').length;
        const negativeCount = this.particles.filter(p => p.type === 'negative').length;
        
        document.getElementById('particleCount').textContent = totalCount;
        document.getElementById('positiveCount').textContent = positiveCount;
        document.getElementById('negativeCount').textContent = negativeCount;
    }

    /**
     * Get simulation statistics
     */
    getStats() {
        return {
            particleCount: this.particles.length,
            positiveCount: this.particles.filter(p => p.type === 'positive').length,
            negativeCount: this.particles.filter(p => p.type === 'negative').length,
            isRunning: this.isRunning
        };
    }

    /**
     * Reset simulation
     */
    reset() {
        this.particles.forEach(particle => particle.closeWindow());
        this.particles = [];
        this.windowOffset = 0;
        this.updateUI();
        console.log('Simulation reset');
    }

    /**
     * Cleanup on page unload
     */
    cleanup() {
        this.stopPhysicsLoop();
        this.reset();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.controller) {
        window.controller.cleanup();
    }
});