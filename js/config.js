/**
 * Configuration file for Magnetic Field Simulation
 * Centralized place to modify physics and visual parameters
 */

const CONFIG = {
    // Physics parameters
    PHYSICS: {
        COULOMB_CONSTANT: 1000,
        DAMPING_FACTOR: 0.99,
        FORCE_SCALE: 0.01,
        MIN_DISTANCE: 50,
        MAX_VELOCITY: 10,
        INTERACTION_THRESHOLD: 500
    },

    // Visual parameters
    VISUALS: {
        PARTICLE_RADIUS: 30,
        GLOW_RADIUS: 35,
        FIELD_LINE_WIDTH: 2,
        ARROW_SIZE: 8,
        MAX_FIELD_LINE_LENGTH: 0.4, // Fraction of canvas size
        FIELD_LINE_OPACITY: {
            MIN: 0.1,
            MAX: 0.8
        }
    },

    // Colors
    COLORS: {
        POSITIVE: '#ff6b6b',
        NEGATIVE: '#4ecdc4',
        BACKGROUND: {
            CONTROLLER: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            PARTICLE: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
        },
        FIELD_LINES: {
            ATTRACTION: '#4ecdc4',
            REPULSION: '#ff6b6b'
        }
    },

    // Window management
    WINDOWS: {
        PARTICLE_WIDTH: 300,
        PARTICLE_HEIGHT: 300,
        STARTING_OFFSET: 100,
        GRID_SPACING: 350,
        GRID_COLUMNS: 3
    },

    // Animation settings
    ANIMATION: {
        TARGET_FPS: 60,
        PHYSICS_UPDATE_INTERVAL: 16, // milliseconds
        TRAIL_DURATION: 1000, // milliseconds
        GLOW_ANIMATION_SPEED: 0.02
    },

    // Debug settings
    DEBUG: {
        SHOW_FORCE_VECTORS: false,
        SHOW_VELOCITY_VECTORS: false,
        SHOW_PARTICLE_INFO: true,
        LOG_PHYSICS_UPDATES: false,
        SHOW_PERFORMANCE_STATS: false
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally
window.CONFIG = CONFIG;