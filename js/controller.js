/**
 * Main Controller for Magnetic Field Simulation
 * Manages particles, windows, and physics simulation
 */

class MagneticController {
    constructor() {
        this.particles = [];
        this.physicsEngine = new PhysicsEngine();
        this.canvas = document.getElementById('simCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.draggedParticle = null;
        this.isRunning = false;

        this.setupUI();
        this.setupCanvasEvents();
        this.start();
    }

    setupUI() {
        document.getElementById('addPositive').onclick = () => this.createParticle('positive');
        document.getElementById('addNegative').onclick = () => this.createParticle('negative');
        document.getElementById('removeAll').onclick = () => {
            this.particles = [];
            this.updateUI();
        };
        this.updateUI();
    }

    /**
     * Create a new particle
     */
    createParticle(type) {
        const id = Date.now() + Math.random();
        // Place randomly within canvas, not too close to edge
        const margin = 30;
        const x = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y = margin + Math.random() * (this.canvas.height - 2 * margin);
        const charge = type === 'positive' ? 1 : -1;
        const particle = new Particle(id, type, charge, x, y);
        this.particles.push(particle);
        this.updateUI();
    }

    /**
     * Update UI elements
     */
    updateUI() {
        document.getElementById('particleCount').textContent = this.particles.length;
    }

    /**
     * Set up canvas event listeners for particle interaction
     */
    setupCanvasEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            for (let p of this.particles) {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                if (dx * dx + dy * dy < p.radius * p.radius) {
                    this.draggedParticle = p;
                    p.isDragging = true;
                    p.dragOffset.x = dx;
                    p.dragOffset.y = dy;
                    break;
                }
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.draggedParticle) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                this.draggedParticle.x = mouseX - this.draggedParticle.dragOffset.x;
                this.draggedParticle.y = mouseY - this.draggedParticle.dragOffset.y;
                this.draggedParticle.vx = 0;
                this.draggedParticle.vy = 0;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.draggedParticle) {
                this.draggedParticle.isDragging = false;
                this.draggedParticle = null;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.draggedParticle) {
                this.draggedParticle.isDragging = false;
                this.draggedParticle = null;
            }
        });
    }

    /**
     * Start the physics simulation loop
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        const loop = () => {
            this.physicsEngine.simulatePhysics(this.particles);
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * Render the simulation frame
     */
    render() {
        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw field lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.drawFieldLine(this.particles[i], this.particles[j]);
            }
        }

        // Draw particles
        for (let p of this.particles) {
            p.draw(this.ctx);
        }
    }

    /**
     * Draw a field line between two particles
     */
    drawFieldLine(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 1) return;

        // Color and opacity
        const isAttraction = p1.charge * p2.charge < 0;
        const color = isAttraction ? "#888" : "#bbb";
        const opacity = Math.max(0.08, Math.min(0.25, 1000 / distance));

        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.restore();
    }
}

// Initialize controller on page load
window.addEventListener('DOMContentLoaded', () => {
    window.controller = new MagneticController();
});