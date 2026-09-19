/**
 * Vanilla JS implementation of ClickSpark from React Bits
 */
class ClickSpark {
    constructor(options = {}) {
        this.sparkColor = options.sparkColor || '#0ea5e9'; // Match theme accent
        this.sparkSize = options.sparkSize || 10;
        this.sparkRadius = options.sparkRadius || 15;
        this.sparkCount = options.sparkCount || 8;
        this.duration = options.duration || 400;
        this.easing = options.easing || 'ease-out';
        this.extraScale = options.extraScale || 1.0;

        this.sparks = [];
        this.startTime = null;
        this.animationId = null;

        this.initCanvas();
        this.bindEvents();
        this.startAnimationLoop();
    }

    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Full screen, pointer events none, high z-index
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '999999',
            display: 'block'
        });

        document.body.appendChild(this.canvas);
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Listen for clicks anywhere on the document
        document.addEventListener('click', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            const now = performance.now();
            
            const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
                x,
                y,
                angle: (2 * Math.PI * i) / this.sparkCount,
                startTime: now
            }));
            
            this.sparks.push(...newSparks);
        });
    }

    easeFunc(t) {
        switch (this.easing) {
            case 'linear': return t;
            case 'ease-in': return t * t;
            case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            default: return t * (2 - t); // ease-out
        }
    }

    draw(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.sparks = this.sparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= this.duration) {
                return false;
            }

            const progress = elapsed / this.duration;
            const eased = this.easeFunc(progress);

            const distance = eased * this.sparkRadius * this.extraScale;
            const lineLength = this.sparkSize * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            this.ctx.strokeStyle = this.sparkColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            return true;
        });

        this.animationId = requestAnimationFrame((t) => this.draw(t));
    }

    startAnimationLoop() {
        this.animationId = requestAnimationFrame((t) => this.draw(t));
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // We use the theme accent color for the sparks by checking computed style,
    // or fallback to the cyan hex.
    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--accent-red').trim() || '#0ea5e9';
    
    new ClickSpark({
        sparkColor: accentColor,
        sparkSize: 12,
        sparkRadius: 20,
        sparkCount: 8,
        duration: 400
    });
});
