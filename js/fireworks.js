/**
 * HTML5 Canvas Fireworks, Confetti & Particle FX
 * Cute pastel colors, star shapes, and flying rewards animation.
 */
class FireworksEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animating = false;
        this.colors = ['#FF69B4', '#FFB6C1', '#BA55D3', '#E6E6FA', '#FFD700', '#FFF9C4', '#48D1CC', '#FF1493'];
    }

    init() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'fx-canvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '99999';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.resize();

            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    // Launch a burst of pastel stars, ducklings, bubbles, and golden eggs
    burst(x, y, count = 35) {
        this.init();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: Math.random() * 8 + 4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                shape: Math.random() > 0.4 ? 'star' : 'circle',
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.2
            });
        }

        // Spawn cute floating emoji particles (ducklings, bubbles, eggs, hearts)
        const emojis = ['🐣', '🐥', '🫧', '🥚', '✨', '💖', '🐾', '⭐'];
        const emojiCount = Math.min(10, Math.floor(count / 3));
        for (let j = 0; j < emojiCount; j++) {
            const el = document.createElement('div');
            el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.position = 'fixed';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.fontSize = `${Math.floor(Math.random() * 16 + 20)}px`;
            el.style.zIndex = '99999';
            el.style.pointerEvents = 'none';
            el.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease';
            document.body.appendChild(el);

            const dx = (Math.random() - 0.5) * 200;
            const dy = -80 - Math.random() * 120;
            const rot = (Math.random() - 0.5) * 720;

            requestAnimationFrame(() => {
                el.style.transform = `translate(${dx}px, ${dy}px) scale(1.4) rotate(${rot}deg)`;
                el.style.opacity = '0';
            });

            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 1200);
        }

        if (!this.animating) {
            this.animating = true;
            this.loop();
        }
    }

    // Launch major celebration fireworks (Weekend Chest or Level Up)
    launchCelebration(durationMs = 3500) {
        this.init();
        const endTime = Date.now() + durationMs;

        const interval = setInterval(() => {
            if (Date.now() > endTime) {
                clearInterval(interval);
                return;
            }
            const rx = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
            const ry = Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.1);
            this.burst(rx, ry, 35);
        }, 300);
    }

    // Animate flying reward icons (e.g. Duck Paw 🐾 / Golden Egg 🥚) to target header counter
    flyStar(sourceElem, targetElem, starCount = 3, emojiSymbol = '🐾') {
        if (!sourceElem || !targetElem) return;
        
        const srcRect = sourceElem.getBoundingClientRect();
        const tgtRect = targetElem.getBoundingClientRect();

        const startX = srcRect.left + srcRect.width / 2;
        const startY = srcRect.top + srcRect.height / 2;
        const endX = tgtRect.left + tgtRect.width / 2;
        const endY = tgtRect.top + tgtRect.height / 2;

        for (let i = 0; i < starCount; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.innerText = emojiSymbol;
                el.style.position = 'fixed';
                el.style.left = `${startX}px`;
                el.style.top = `${startY}px`;
                el.style.fontSize = '26px';
                el.style.zIndex = '9999';
                el.style.pointerEvents = 'none';
                el.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
                document.body.appendChild(el);

                // Offset trajectory slightly
                const offsetX = (Math.random() - 0.5) * 80;
                const offsetY = -40 - Math.random() * 40;

                requestAnimationFrame(() => {
                    el.style.transform = `translate(${endX - startX + offsetX}px, ${endY - startY + offsetY}px) scale(1.4) rotate(360deg)`;
                    setTimeout(() => {
                        el.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.8) rotate(720deg)`;
                        el.style.opacity = '0';
                    }, 500);
                });

                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                    // Pulse target header counter when reward arrives
                    targetElem.classList.add('pulse-glow');
                    setTimeout(() => targetElem.classList.remove('pulse-glow'), 300);
                }, 850);
            }, i * 150);
        }
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color, alpha, rotation) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = Math.cos(rot) * outerRadius;
            y = Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = Math.cos(rot) * innerRadius;
            y = Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();
    }

    loop() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.rotation += p.vRot;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            if (p.shape === 'star') {
                this.drawStar(this.ctx, p.x, p.y, 5, p.size, p.size / 2, p.color, p.alpha, p.rotation);
            } else {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fill();
                this.ctx.restore();
            }
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.animating = false;
        }
    }
}

const fx = new FireworksEngine();
