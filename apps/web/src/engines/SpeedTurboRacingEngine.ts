import { ClassroomAudioEngine } from './ClassroomAudioEngine';
import { TouchCanvasAdapter, PointerHitResult } from './TouchCanvasAdapter';

interface RacingTeam {
  id: string;
  name: string;
  laneIndex: number;
  x: number;
  distance: number;
  speed: number;
  baseSpeed: number;
  nitroTimer: number;
  color: string;
}

interface Obstacle {
  type: 'CONE' | 'OIL_SLICK' | 'BARRIER';
  laneIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface NitroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

export class SpeedTurboRacingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audio: ClassroomAudioEngine;

  public distanceTarget: number = 4000;
  private roadOffset: number = 0;
  private lanes: number[] = [0.25, 0.5, 0.75];

  public teams: Record<string, RacingTeam> = {
    TEAM_1: {
      id: 'TEAM_1',
      name: 'Đội Đỏ',
      laneIndex: 0,
      x: 0.25,
      distance: 0,
      speed: 240,
      baseSpeed: 240,
      nitroTimer: 0,
      color: '#2563EB',
    },
    TEAM_2: {
      id: 'TEAM_2',
      name: 'Đội Xanh',
      laneIndex: 2,
      x: 0.75,
      distance: 0,
      speed: 240,
      baseSpeed: 240,
      nitroTimer: 0,
      color: '#DC2626',
    },
  };

  private obstacles: Obstacle[] = [];
  private spawnTimer: number = 0;
  private particles: NitroParticle[] = [];
  public isFinished: boolean = false;
  public winnerTeam: string | null = null;
  private animationFrameId: number | null = null;
  private adapter: TouchCanvasAdapter;

  constructor(canvas: HTMLCanvasElement, audio: ClassroomAudioEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get canvas 2D context');
    this.ctx = context;
    this.audio = audio;

    this.adapter = new TouchCanvasAdapter(this.canvas, (hit) => this.handleTouchLane(hit));
    this.initRenderLoop();
  }

  private handleTouchLane(hit: PointerHitResult): void {
    if (hit.normX < 0.5) {
      this.shiftLane('TEAM_1', hit.normX < 0.25 ? -1 : 1);
    } else {
      this.shiftLane('TEAM_2', hit.normX < 0.75 ? -1 : 1);
    }
  }

  public shiftLane(teamId: 'TEAM_1' | 'TEAM_2', dir: number): void {
    const t = this.teams[teamId];
    t.laneIndex = Math.max(0, Math.min(2, t.laneIndex + dir));
    t.x = this.lanes[t.laneIndex];
  }

  public triggerNitroBoost(teamId: 'TEAM_1' | 'TEAM_2', durationSec: number = 3.5): void {
    const t = this.teams[teamId];
    if (!t) return;
    t.nitroTimer = durationSec;
    t.speed = t.baseSpeed * 2.5;
    this.audio.playCorrect();
    this.audio.playCheer();
  }

  public triggerFaultPenalty(teamId: 'TEAM_1' | 'TEAM_2'): void {
    const t = this.teams[teamId];
    if (!t) return;
    t.speed = t.baseSpeed * 0.45;
    t.nitroTimer = 0;
    this.audio.playWrong();
    this.audio.playBuzzer();
    setTimeout(() => {
      t.speed = t.baseSpeed;
    }, 1500);
  }

  private spawnObstacle(): void {
    const types: ('CONE' | 'OIL_SLICK' | 'BARRIER')[] = ['CONE', 'OIL_SLICK', 'BARRIER'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const chosenLane = Math.floor(Math.random() * 3);
    this.obstacles.push({
      type: chosenType,
      laneIndex: chosenLane,
      x: this.lanes[chosenLane],
      y: -0.1,
      width: 0.1,
      height: 0.06,
    });
  }

  private update(dt: number): void {
    if (this.isFinished) return;

    const dominantSpeed = Math.max(this.teams.TEAM_1.speed, this.teams.TEAM_2.speed);
    this.roadOffset = (this.roadOffset + dominantSpeed * dt * 0.8) % 80;

    this.spawnTimer += dt;
    if (this.spawnTimer > 1.4) {
      this.spawnTimer = 0;
      this.spawnObstacle();
    }

    (['TEAM_1', 'TEAM_2'] as const).forEach((teamId) => {
      const t = this.teams[teamId];
      if (t.nitroTimer > 0) {
        t.nitroTimer -= dt;
        this.particles.push({
          x: t.x * this.canvas.width + (Math.random() - 0.5) * 16,
          y: this.canvas.height * 0.84,
          vx: (Math.random() - 0.5) * 40,
          vy: 200 + Math.random() * 100,
          color: '#38BDF8',
          life: 0.35,
          maxLife: 0.35,
        });

        if (t.nitroTimer <= 0) {
          t.speed = t.baseSpeed;
        }
      }

      t.distance += t.speed * dt;
      if (t.distance >= this.distanceTarget && !this.isFinished) {
        this.isFinished = true;
        this.winnerTeam = t.name;
        this.audio.playWhistle();
        this.audio.playCheer();
      }
    });

    const carH = 0.12;
    const carW = 0.08;
    const carY = 0.78;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.y += (dominantSpeed * 0.75 * dt) / this.canvas.height;

      (['TEAM_1', 'TEAM_2'] as const).forEach((teamId) => {
        const t = this.teams[teamId];
        if (
          Math.abs(t.x - obs.x) < carW / 2 + obs.width / 2 &&
          Math.abs(carY - obs.y) < carH / 2 + obs.height / 2
        ) {
          if (t.nitroTimer > 0) {
            this.obstacles.splice(i, 1);
          } else {
            this.triggerFaultPenalty(teamId);
            this.obstacles.splice(i, 1);
          }
        }
      });

      if (obs.y > 1.1) {
        this.obstacles.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private initRenderLoop(): void {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      this.update(dt);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private render(): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Track
    this.ctx.fillStyle = '#1E293B';
    this.ctx.fillRect(0, 0, w, h);

    // Curbs
    const curbW = 16;
    for (let y = -80 + this.roadOffset; y < h; y += 40) {
      this.ctx.fillStyle = Math.floor(y / 40) % 2 === 0 ? '#EF4444' : '#FFFFFF';
      this.ctx.fillRect(0, y, curbW, 40);
      this.ctx.fillRect(w - curbW, y, curbW, 40);
    }

    // Lane Dividers
    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash([25, 25]);
    this.ctx.lineDashOffset = -this.roadOffset;

    [0.375, 0.625].forEach((lx) => {
      this.ctx.beginPath();
      this.ctx.moveTo(w * lx, 0);
      this.ctx.lineTo(w * lx, h);
      this.ctx.stroke();
    });
    this.ctx.setLineDash([]);

    // Obstacles
    this.obstacles.forEach((obs) => {
      const ox = obs.x * w;
      const oy = obs.y * h;
      if (obs.type === 'CONE') {
        this.ctx.fillStyle = '#F97316';
        this.ctx.beginPath();
        this.ctx.moveTo(ox, oy - 16);
        this.ctx.lineTo(ox - 14, oy + 14);
        this.ctx.lineTo(ox + 14, oy + 14);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (obs.type === 'OIL_SLICK') {
        this.ctx.fillStyle = '#0F172A';
        this.ctx.beginPath();
        this.ctx.ellipse(ox, oy, 24, 14, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = '#EAB308';
        this.ctx.fillRect(ox - 22, oy - 10, 44, 20);
      }
    });

    // Nitro exhaust particles
    this.particles.forEach((p) => {
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4 * (p.life / p.maxLife), 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Cars
    (['TEAM_1', 'TEAM_2'] as const).forEach((teamId) => {
      const t = this.teams[teamId];
      const cx = t.x * w;
      const cy = h * 0.78;

      this.ctx.fillStyle = t.color;
      this.ctx.fillRect(cx - 20, cy - 35, 40, 70);

      this.ctx.fillStyle = '#0F172A';
      this.ctx.fillRect(cx - 15, cy - 12, 30, 20);
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(cx - 24, cy - 28, 6, 16);
      this.ctx.fillRect(cx + 18, cy - 28, 6, 16);
      this.ctx.fillRect(cx - 24, cy + 12, 6, 16);
      this.ctx.fillRect(cx + 18, cy + 12, 6, 16);

      if (t.nitroTimer > 0) {
        this.ctx.strokeStyle = '#38BDF8';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(cx - 24, cy - 40, 48, 80);
      }
    });

    // Telemetry Leaderboard
    this.renderTelemetry(w, h);
  }

  private renderTelemetry(w: number, h: number): void {
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    this.ctx.fillRect(0, 0, w, 56);

    const p1 = Math.min(1.0, this.teams.TEAM_1.distance / this.distanceTarget);
    const p2 = Math.min(1.0, this.teams.TEAM_2.distance / this.distanceTarget);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 15px sans-serif';
    this.ctx.fillText(`${this.teams.TEAM_1.name}: ${Math.floor(this.teams.TEAM_1.distance)}m`, 20, 24);
    this.ctx.fillText(`${this.teams.TEAM_2.name}: ${Math.floor(this.teams.TEAM_2.distance)}m`, w - 180, 24);

    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(20, 32, 200, 10);
    this.ctx.fillRect(w - 180, 32, 160, 10);

    this.ctx.fillStyle = '#2563EB';
    this.ctx.fillRect(20, 32, 200 * p1, 10);
    this.ctx.fillStyle = '#DC2626';
    this.ctx.fillRect(w - 180, 32, 160 * p2, 10);

    if (this.isFinished) {
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      this.ctx.fillRect(w * 0.15, h * 0.35, w * 0.7, 100);
      this.ctx.fillStyle = '#FCD34D';
      this.ctx.font = 'bold 40px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${this.winnerTeam} CHIẾN THẮNG!`, w * 0.5, h * 0.35 + 64);
    }
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.adapter.destroy();
  }
}
