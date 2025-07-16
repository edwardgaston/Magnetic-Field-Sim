# Magnetic Field Simulation

A web-based interactive magnetic field simulation that demonstrates electromagnetic forces between charged particles across multiple browser windows.

## Features

- **Multi-window interaction**: Particles in separate windows interact with each other
- **Real-time physics**: Coulomb's law implementation with realistic force calculations
- **Visual field lines**: Dynamic visualization of electromagnetic fields
- **Drag and drop**: Interactive particle manipulation
- **Responsive design**: Modern UI with glassmorphism effects

## Project Structure

```
magnetic-field-simulation/
├── index.html                 # Main controller window
├── styles/
│   ├── main.css              # Controller window styles
│   └── particle.css          # Particle window styles
├── js/
│   ├── config.js             # Configuration and constants
│   ├── physics.js            # Physics engine
│   ├── particle.js           # Particle class and factory
│   ├── controller.js         # Main controller logic
│   └── particleWindow.js     # Particle window rendering
└── README.md                 # This file
```

## How to Run

1. **Local Development**:
   ```bash
   # Serve files with a local server (required for proper file loading)
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Open in Browser**:
   Navigate to `http://localhost:8000` and open `index.html`

3. **Create Particles**:
   - Click "Create Positive Particle" or "Create Negative Particle"
   - Each particle opens in a new window
   - Drag particles to see magnetic interactions

## Physics Implementation

### Coulomb's Law
The simulation uses Coulomb's law to calculate electromagnetic forces:

```
F = k * (q₁ * q₂) / r²
```

Where:
- `F` = Force between particles
- `k` = Coulomb's constant
- `q₁, q₂` = Charges of particles
- `r` = Distance between particles

### Force Calculation
```javascript
// Simplified physics calculation
const force = (COULOMB_CONSTANT * charge1 * charge2) / (distance * distance);
const forceX = -force * (dx / distance);
const forceY = -force * (dy / distance);
```

## Configuration

Modify `js/config.js` to customize:

- **Physics parameters**: Force constants, damping, velocity limits
- **Visual settings**: Colors, particle sizes, field line appearance
- **Window management**: Positioning, sizing, grid layout
- **Debug options**: Performance monitoring, force visualization

## Key Classes

### `PhysicsEngine`
Handles all physics calculations including:
- Magnetic force calculations
- Particle velocity updates
- Field strength calculations

### `Particle`
Represents individual charged particles with:
- Position and velocity tracking
- Window management
- HTML generation for particle windows

### `MagneticController`
Main controller that manages:
- Particle creation and deletion
- Cross-window communication
- Physics simulation loop
- UI updates

### `ParticleWindow`
Handles individual particle window:
- Canvas rendering
- User interaction (dragging)
- Field line visualization
- Communication with controller

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

**Note**: Requires modern browser with support for:
- `postMessage()` API
- HTML5 Canvas
- ES6 Classes
- CSS Grid

## Extending the Project

### Adding New Particle Types
1. Modify `ParticleFactory` in `particle.js`
2. Add new colors in `config.js`
3. Update UI in `index.html`

### Custom Force Laws
1. Extend `PhysicsEngine` class
2. Implement new force calculation methods
3. Update physics loop in controller

### Enhanced Visualizations
1. Modify `ParticleWindow` rendering methods
2. Add new canvas drawing functions
3. Implement particle trails or animations

## Performance Optimization

- **Frame rate limiting**: Configurable target FPS
- **Distance culling**: Only calculate forces within threshold
- **Efficient rendering**: Canvas optimization techniques
- **Memory management**: Automatic cleanup of closed windows

## Troubleshooting

### Common Issues

1. **Pop-up blocked**: Enable pop-ups for the domain
2. **Files not loading**: Must serve from HTTP server (not file://)
3. **Cross-origin errors**: Use proper local server setup

### Debug Mode

Enable debug features in `config.js`:
```javascript
DEBUG: {
    SHOW_FORCE_VECTORS: true,
    LOG_PHYSICS_UPDATES: true,
    SHOW_PERFORMANCE_STATS: true
}
```

## Future Enhancements

- [ ] Particle collision detection
- [ ] Electric field visualization
- [ ] Magnetic field strength heatmap
- [ ] Preset particle configurations
- [ ] Export/import simulation states
- [ ] Mobile touch support
- [ ] WebGL acceleration
- [ ] Real-time collaboration

## Contributing

1. Fork the repository
2. Create feature branch
3. Follow existing code style
4. Add tests for new features
5. Submit pull request

## License

MIT License - feel free to use and modify for your projects.

## Related Projects

This framework can be extended to create:
- **Gravitational simulations**
- **Elastic connection systems**
- **Communication networks**
- **Fluid dynamics visualization**