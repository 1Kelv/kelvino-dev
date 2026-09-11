import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { useReducedMotion } from '../hooks/useMediaQuery';
import './NetworkCanvas.css';

/*
  A living "risk graph" behind the page. Nodes drift, link up when close and
  react to the cursor. Every few seconds one node is flagged (red), investigated
  and cleared (green), a small nod to the day job.
*/

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  flag: number; // 0 = normal, >0 = flagged countdown, <0 = cleared countdown
}

const PALETTE = {
  light: { node: '99,102,241', line: '99,102,241', text: '15,23,42' },
  dark: { node: '129,140,248', line: '129,140,248', text: '241,245,249' },
};

const NetworkCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = PALETTE[theme];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    let lastFlag = performance.now();
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(28, Math.min(90, Math.floor((width * height) / 18000)));
      if (nodes.length > target) nodes = nodes.slice(0, target);
      while (nodes.length < target) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 1.8,
          flag: 0,
        });
      }
    };

    const draw = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Occasionally flag a node, then clear it a moment later.
      if (now - lastFlag > 4200 && nodes.length) {
        lastFlag = now;
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        if (n.flag === 0) n.flag = 110;
      }

      const linkDist = 130;
      const mouseDist = 190;

      for (const n of nodes) {
        if (!reducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          // Gentle attraction to the cursor.
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseDist * mouseDist && d2 > 1) {
            const d = Math.sqrt(d2);
            n.vx += (dx / d) * 0.004;
            n.vy += (dy / d) * 0.004;
          }
          // Cap speed so they never zip about.
          const speed = Math.hypot(n.vx, n.vy);
          if (speed > 0.6) {
            n.vx = (n.vx / speed) * 0.6;
            n.vy = (n.vy / speed) * 0.6;
          }
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;
        }
        if (n.flag > 0) {
          n.flag--;
          if (n.flag === 0) n.flag = -70;
        } else if (n.flag < 0) {
          n.flag++;
        }
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.22;
            const flagged = a.flag > 0 || b.flag > 0;
            ctx.strokeStyle = flagged
              ? `rgba(239,68,68,${alpha + 0.15})`
              : `rgba(${palette.line},${alpha})`;
            ctx.lineWidth = flagged ? 1 : 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Link to cursor
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < mouseDist * mouseDist) {
          const alpha = (1 - Math.sqrt(md2) / mouseDist) * 0.35;
          ctx.strokeStyle = `rgba(${palette.line},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        if (n.flag > 0) {
          const pulse = 1 + Math.sin(now / 90) * 0.35;
          ctx.fillStyle = 'rgba(239,68,68,0.18)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5 * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(239,68,68,0.95)';
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(239,68,68,0.85)';
          ctx.fillText('FLAGGED', n.x + 9, n.y - 6);
        } else if (n.flag < 0) {
          const t = -n.flag / 70;
          ctx.fillStyle = `rgba(34,197,94,${0.15 * t})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(34,197,94,${0.5 + 0.5 * t})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = `rgba(34,197,94,${0.85 * t})`;
          ctx.fillText('CLEARED', n.x + 9, n.y - 6);
        } else {
          ctx.fillStyle = `rgba(${palette.node},0.55)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reducedMotion) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [theme, reducedMotion]);

  return <canvas ref={ref} className="network-canvas" aria-hidden="true" />;
};

export default NetworkCanvas;
