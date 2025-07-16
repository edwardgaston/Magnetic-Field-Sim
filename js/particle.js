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
        this.radius = 18;
        this.mass = 1; // <-- Add this line
        this.color = type === 'positive' ? '#e74c3c' : '#3498db';
        this.symbol = type === 'positive' ? '+' : '-';
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
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

    

    draw(ctx) {
        // Main circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Symbol
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
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