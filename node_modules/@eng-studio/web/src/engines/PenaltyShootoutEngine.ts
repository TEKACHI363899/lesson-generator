import { ClassroomAudioEngine } from './ClassroomAudioEngine';
import { TouchCanvasAdapter, PointerHitResult } from './TouchCanvasAdapter';

export interface PenaltyTarget {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
}

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  vRot: number;
  rotation: number;
  size: number;
  color: string;
  life: number;
}

export class PenaltyShootoutEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audio: ClassroomAudioEngine;

  public mode: 'SOLO' | 'VERSUS' = 'VERSUS';
  public currentTeam: 'TEAM_1' | 'TEAM_2' = 'TEAM_1';
  public round: number = 1;
  public maxRounds: number = 5;
  public scores: { TEAM_1: boolean[]; TEAM_2: boolean[] } = {
    TEAM_1: [],
    TEAM_2: [],
  };

  private targets: Record<string, PenaltyTarget> = {
    TL: { id: 'TL', name: 'Top-Left', x: 0.22, y: 0.26, radius: 0.065 },
    TR: { id: 'TR', name: 'Top-Right', x: 0.78, y: 0.26, radius: 0.065 },
    C: { id: 'C', name: 'Center', x: 0.5, y: 0.44, radius: 0.075 },
    BL: { id: 'BL', name: 'Bottom-Left', x: 0.22, y: 0.72, radius: 0.065 },
    BR: { id: 'BR', name: 'Bottom-Right', x: 0.78, y: 0.72, radius: 0.065 },
  };

  private ball = {
    x: 0.5,
    y: 0.9,
    targetX: 0.5,
    targetY: 0.9,
    scale: 1.0,
    active: false,
    progress: 0,
  };

  private keeper = {
    x: 0.5,
    y: 0.58,
    baseX: 0.5,
    baseY: 0.58,
    targetX: 0.5,
    targetY: 0.58,
    diveProgress: 0,
    diving: false,
  };

  private confetti: ConfettiParticle[] = [];
  public celebrationActive: boolean = false;
  public celebrationText: string = '';
  public inputLocked: boolean = false;
  private animationFrameId: number | null = null;
  private adapter: TouchCanvasAdapter;

  constructor(canvas: HTMLCanvasElement, audio: ClassroomAudioEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get canvas 2D context');
    this.ctx = context;
    this.audio = audio;

    this.adapter = new TouchCanvasAdapter(this.canvas, (hit) => this.handlePointer(hit));
    this.initRenderLoop();
  }

  public setMode(mode: 'SOLO' | 'VERSUS'): void {
    this.mode = mode;
    this.resetMatch();
  }

  public resetMatch(): void {
    this.round = 1;
    this.currentTeam = 'TEAM_1';
    this.scores = { TEAM_1: [], TEAM_2: [] };
    this.inputLocked = false;
    this.celebrationActive = false;
    this.resetBallAndKeeper();
    this.audio.playWhistle();
  }

  private resetBallAndKeeper(): void {
    this.ball = {
      x: 0.5,
      y: 0.9,
      targetX: 0.5,
      targetY: 0.9,
      scale: 1.0,
      active: false,
      progress: 0,
    };
    this.keeper.x = this.keeper.baseX;
    this.keeper.y = this.keeper.baseY;
    this.keeper.targetX = this.keeper.baseX;
    this.keeper.targetY = this.keeper.baseY;
    this.keeper.diving = false;
    this.keeper.diveProgress = 0;
  }

  private handlePointer(hit: PointerHitResult): void {
    if (this.inputLocked || this.ball.active) return;

    for (const key in this.targets) {
      const t = this.targets[key];
      const dist = Math.hypot(hit.normX - t.x, hit.normY - t.y);
      if (dist <= t.radius) {
        this.executeShot(t);
        break;
      }
    }
  }

  public executeShot(targetSpot: PenaltyTarget): void {
    this.inputLocked = true;
    this.ball.active = true;
    this.ball.progress = 0;
    this.ball.targetX = targetSpot.x;
    this.ball.targetY = targetSpot.y;

    // Goalkeeper AI: chooses a spot (60% chance to pick another spot, giving 40% save chance)
    const spotKeys = Object.keys(this.targets);
    const chosenDiveSpotKey = spotKeys[Math.floor(Math.random() * spotKeys.length)];
    const diveTarget = this.targets[chosenDiveSpotKey];

    this.keeper.targetX = diveTarget.x;
    this.keeper.targetY = diveTarget.y;
    this.keeper.diving = true;
    this.keeper.diveProgress = 0;
  }

  private updatePhysics(dt: number): void {
    if (this.ball.active) {
      this.ball.progress += dt * 1.8;
      if (this.ball.progress >= 1.0) {
        this.ball.progress = 1.0;
        this.ball.active = false;
        this.resolveShotResolution();
      }
      this.ball.x = 0.5 + (this.ball.targetX - 0.5) * this.ball.progress;
      this.ball.y = 0.9 + (this.ball.targetY - 0.9) * this.ball.progress;
      this.ball.scale = 1.0 - 0.6 * this.ball.progress;
    }

    if (this.keeper.diving) {
      this.keeper.diveProgress += dt * 2.0;
      if (this.keeper.diveProgress >= 1.0) this.keeper.diveProgress = 1.0;
      const ease = 1 - Math.pow(1 - this.keeper.diveProgress, 3);
      this.keeper.x = this.keeper.baseX + (this.keeper.targetX - this.keeper.baseX) * ease;
      this.keeper.y = this.keeper.baseY + (this.keeper.targetY - this.keeper.baseY) * ease;
    }

    if (this.celebrationActive) {
      for (let i = this.confetti.length - 1; i >= 0; i--) {
        const p = this.confetti[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 400 * dt;
        p.rotation += p.vRot * dt;
        p.life -= dt;
        if (p.life <= 0) this.confetti.splice(i, 1);
      }
      if (this.confetti.length === 0 && !this.ball.active) {
        this.celebrationActive = false;
      }
    }
  }

  private resolveShotResolution(): void {
    const finalDist = Math.hypot(
      this.ball.targetX - this.keeper.targetX,
      this.ball.targetY - this.keeper.targetY,
    );
    const isSaved = finalDist < 0.12;

    if (!isSaved) {
      this.audio.playCorrect();
      this.audio.playCheer();
      this.scores[this.currentTeam].push(true);
      this.triggerGoalCelebration('GOAL!');
    } else {
      this.audio.playWrong();
      this.audio.playBuzzer();
      this.scores[this.currentTeam].push(false);
      this.triggerGoalCelebration('SAVED!');
    }

    setTimeout(() => {
      this.advanceTurn();
    }, 2000);
  }

  private triggerGoalCelebration(text: string): void {
    this.celebrationActive = true;
    this.celebrationText = text;
    this.confetti = [];
    const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    for (let i = 0; i < 90; i++) {
      this.confetti.push({
        x: this.canvas.width * 0.5,
        y: this.canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 600,
        vy: (Math.random() - 0.8) * 500,
        vRot: (Math.random() - 0.5) * 10,
        rotation: 0,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.8 + Math.random() * 0.8,
      });
    }
  }

  private advanceTurn(): void {
    this.resetBallAndKeeper();
    if (this.mode === 'SOLO') {
      if (this.scores.TEAM_1.length >= this.maxRounds) {
        this.finishMatch();
        return;
      }
      this.round = this.scores.TEAM_1.length + 1;
    } else {
      if (this.currentTeam === 'TEAM_1') {
        this.currentTeam = 'TEAM_2';
      } else {
        this.currentTeam = 'TEAM_1';
        this.round++;
      }

      if (
        this.scores.TEAM_1.length >= this.maxRounds &&
        this.scores.TEAM_2.length >= this.maxRounds
      ) {
        this.finishMatch();
        return;
      }
    }
    this.inputLocked = false;
  }

  private finishMatch(): void {
    this.audio.playWhistle();
    let winnerText = 'HOÀN THÀNH LƯỢT SÚT';
    if (this.mode === 'VERSUS') {
      const g1 = this.scores.TEAM_1.filter(Boolean).length;
      const g2 = this.scores.TEAM_2.filter(Boolean).length;
      if (g1 > g2) winnerText = 'ĐỘI ĐỎ CHIẾN THẮNG!';
      else if (g2 > g1) winnerText = 'ĐỘI XANH CHIẾN THẮNG!';
      else winnerText = 'TỶ SỐ HOÀ NHAU!';
    }
    this.celebrationText = winnerText;
    this.celebrationActive = true;
  }

  private initRenderLoop(): void {
    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      this.updatePhysics(dt);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private render(): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Pitch Background
    this.ctx.fillStyle = '#065F46'; // Emerald turf
    this.ctx.fillRect(0, 0, w, h);

    // Goal Post
    const goalLeft = w * 0.15;
    const goalRight = w * 0.85;
    const goalTop = h * 0.15;
    const goalBottom = h * 0.82;

    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 8;
    this.ctx.strokeRect(goalLeft, goalTop, goalRight - goalLeft, goalBottom - goalTop);

    // Net Pattern
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1.5;
    for (let x = goalLeft; x <= goalRight; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, goalTop);
      this.ctx.lineTo(x, goalBottom);
      this.ctx.stroke();
    }
    for (let y = goalTop; y <= goalBottom; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(goalLeft, y);
      this.ctx.lineTo(goalRight, y);
      this.ctx.stroke();
    }

    // 5 Target Aim Spots
    for (const key in this.targets) {
      const t = this.targets[key];
      const cx = t.x * w;
      const cy = t.y * h;
      const r = t.radius * Math.min(w, h);

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#FCD34D'; // Academic Gold ring
      this.ctx.lineWidth = 3;
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Goalkeeper
    const gx = this.keeper.x * w;
    const gy = this.keeper.y * h;
    this.ctx.fillStyle = '#EF4444'; // Red goalkeeper jersey
    this.ctx.beginPath();
    this.ctx.arc(gx, gy - 25, 22, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#1E3A8A';
    this.ctx.fillRect(gx - 20, gy - 3, 40, 50);

    // Gloves
    this.ctx.fillStyle = '#F59E0B';
    this.ctx.beginPath();
    this.ctx.arc(gx - 32, gy + 8, 14, 0, Math.PI * 2);
    this.ctx.arc(gx + 32, gy + 8, 14, 0, Math.PI * 2);
    this.ctx.fill();

    // Soccer Ball
    const bx = this.ball.x * w;
    const by = this.ball.y * h;
    const br = 28 * this.ball.scale;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(bx, by, br, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#0F172A';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Top Scoreboard
    this.renderScoreboard(w);

    // Goal Confetti & Banner
    if (this.celebrationActive) {
      this.confetti.forEach((p) => {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        this.ctx.restore();
      });

      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      this.ctx.fillRect(w * 0.1, h * 0.4, w * 0.8, 100);
      this.ctx.fillStyle = '#FCD34D';
      this.ctx.font = 'bold 50px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.celebrationText, w * 0.5, h * 0.4 + 68);
    }
  }

  private renderScoreboard(w: number): void {
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, 0, w, 60);

    this.ctx.font = 'bold 16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = '#FFFFFF';
    const turnText =
      this.mode === 'SOLO'
        ? `LƯỢT SÚT ${this.round}/${this.maxRounds} (DẠY KÈM 1-1)`
        : `LƯỢT SÚT ${this.round}/${this.maxRounds} | ${
            this.currentTeam === 'TEAM_1' ? 'ĐỘI ĐỎ SÚT' : 'ĐỘI XANH SÚT'
          }`;
    this.ctx.fillText(turnText, 20, 36);

    // Draw dots for shots
    const drawDots = (scoresList: boolean[], startX: number) => {
      for (let i = 0; i < this.maxRounds; i++) {
        this.ctx.beginPath();
        this.ctx.arc(startX + i * 24, 34, 8, 0, Math.PI * 2);
        if (scoresList[i] === true) {
          this.ctx.fillStyle = '#10B981'; // Green = Goal
        } else if (scoresList[i] === false) {
          this.ctx.fillStyle = '#EF4444'; // Red = Miss
        } else {
          this.ctx.fillStyle = '#475569'; // Grey = Unplayed
        }
        this.ctx.fill();
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    };

    drawDots(this.scores.TEAM_1, w - 320);
    if (this.mode === 'VERSUS') {
      drawDots(this.scores.TEAM_2, w - 160);
    }
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.adapter.destroy();
  }
}
