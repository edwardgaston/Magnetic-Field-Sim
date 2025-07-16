/**
 * Particle class for magnetic field simulation
 * Handles individual particle properties and rendering
 */

class Particle {
    constructor(id, type, charge, x, y) {
        this.id = id;
        this.type = type;
        this.charge = charge;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.mass = 1;
        this.window = null;
        this.radius = 30;
        this.color = type === 'positive' ? '#ff6b6b' : '#4ecdc4';
        this.symbol = type === 'positive' ? '+' : '-';
    }

    /**
     * Generate HTML content for particle window
     */
    generateHTML() {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Magnetic Particle (${this.type})</title>
            <link rel="stylesheet" href="/styles/particle.css">
        </head>
        <body>
            <div class="info">Charge: ${this.symbol} | Drag to move</div>
            <canvas id="canvas"></canvas>
            <script src="/js/particleWindow.js"></script>
            <script>
                // Initialize particle window
                const particleWindow = new ParticleWindow(${this.id}, '${this.type}', ${this.charge}, '${this.color}', '${this.symbol}');
            </script>
        </body>
        </html>
        `;
    }

    /**
     * Create and open particle window
     */
    createWindow(x, y) {
        const windowWidth = 300;
        const windowHeight = 300;
        
        this.window = window.open(
            'data:text/html;charset=utf-8,' + encodeURIComponent(this.generateHTML()),
            '_blank',
            `width=${windowWidth},height=${windowHeight},left=${x},top=${y},resizable=yes`
        );
        
        return this.window;
    }

    /**
     * Update particle position
     */
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Get particle data for serialization
     */
    toJSON() {
        return {
            id: this.id,
            type: this.type,
            charge: this.charge,
            x: this.x,
            y: this.y,
            vx: this.vx,
            vy: this.vy
        };
    }

    /**
     * Check if particle window is still open
     */
    isWindowOpen() {
        return this.window && !this.window.closed;
    }

    /**
     * Close particle window
     */
    closeWindow() {
        if (this.window && !this.window.closed) {
            this.window.close();
        }
    }
}

/**
 * Particle Factory for creating different types of particles
 */
class ParticleFactory {
    static createParticle(type, x, y) {
        const id = Date.now() + Math.random(); // Ensure unique ID
        const charge = type === 'positive' ? 1 : -1;
        
        return new Particle(id, type, charge, x, y);
    }
    
    static createPositiveParticle(x, y) {
        return this.createParticle('positive', x, y);
    }
    
    static createNegativeParticle(x, y) {
        return this.createParticle('negative', x, y);
    }
}