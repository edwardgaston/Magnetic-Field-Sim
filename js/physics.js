/**
 * Physics Engine for Magnetic Field Simulation
 * Handles force calculations and particle interactions
 */

class PhysicsEngine {
    constructor() {
        this.constants = {
            COULOMB_CONSTANT: 1000,
            DAMPING_FACTOR: 0.99,
            FORCE_SCALE: 0.01,
            MIN_DISTANCE: 50 // Minimum distance to prevent infinite forces
        };
    }

    /**
     * Calculate magnetic force between two particles using Coulomb's law
     * F = k * (q1 * q2) / r^2
     */
    calculateMagneticForce(particle1, particle2) {
        const dx = particle2.x - particle1.x;
        const dy = particle2.y - particle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Prevent division by zero and infinite forces
        if (distance < this.constants.MIN_DISTANCE) {
            return { fx: 0, fy: 0 };
        }
        
        // Calculate force magnitude
        const forceMagnitude = (this.constants.COULOMB_CONSTANT * particle1.charge * particle2.charge) / (distance * distance);
        
        // Calculate force components (negative because we want repulsion for same charges)
        const forceX = -forceMagnitude * (dx / distance);
        const forceY = -forceMagnitude * (dy / distance);
        
        return { fx: forceX, fy: forceY };
    }

    /**
     * Calculate total forces acting on a particle from all other particles
     */
    calculateTotalForces(targetParticle, allParticles) {
        let totalForceX = 0;
        let totalForceY = 0;
        
        allParticles.forEach(particle => {
            if (particle.id !== targetParticle.id) {
                const force = this.calculateMagneticForce(targetParticle, particle);
                totalForceX += force.fx;
                totalForceY += force.fy;
            }
        });
        
        return { fx: totalForceX, fy: totalForceY };
    }

    /**
     * Update particle physics (velocity and position)
     */
    updateParticlePhysics(particle, force) {
        // Apply force to velocity (F = ma, assuming mass = 1)
        particle.vx += force.fx / particle.mass * this.constants.FORCE_SCALE;
        particle.vy += force.fy / particle.mass * this.constants.FORCE_SCALE;
        
        // Apply damping to prevent infinite acceleration
        particle.vx *= this.constants.DAMPING_FACTOR;
        particle.vy *= this.constants.DAMPING_FACTOR;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
    }

    /**
     * Run physics simulation for all particles
     */
    simulatePhysics(particles) {
        particles.forEach(particle => {
            const totalForce = this.calculateTotalForces(particle, particles);
            this.updateParticlePhysics(particle, totalForce);
        });
    }

    /**
     * Calculate field strength at a given point
     */
    calculateFieldStrength(x, y, particles) {
        let fieldX = 0;
        let fieldY = 0;
        
        particles.forEach(particle => {
            const dx = x - particle.x;
            const dy = y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const fieldMagnitude = (particle.charge * this.constants.COULOMB_CONSTANT) / (distance * distance);
                fieldX += fieldMagnitude * (dx / distance);
                fieldY += fieldMagnitude * (dy / distance);
            }
        });
        
        return { fx: fieldX, fy: fieldY };
    }
}