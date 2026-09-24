import { ClassroomAudioEngine } from './ClassroomAudioEngine';

interface FloatingText {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  life: number;
  maxLife: number;
}

interface SpellParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
}

interface LightningBolt {
  points: { x: number; y: number }[];
  life: number;
}

export class BossMonsterBattleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private audio: ClassroomAudioEngine;

  public boss = {
    name: 'QUÁI THÚ BÓNG ĐÊM (INFERNAL BOSS)',
    maxHp: 12000,
    currentHp: 12000,
    ghostHp: 12000,
    shakeTimer: 0,
    phase: 1,
  };

  public teamStats = {
    TEAM_1: { name: 'Đội Đỏ', totalDmg: 0, color: '#2563EB' },
    TEAM_2: { name: 'Đội Xanh', totalDmg: 0, color: '#DC2626' },
  };

  private particles: SpellParticle[] = [];
  private damageFloats: FloatingText[] = [];
  private lightningBolts: LightningBolt[] = [];
  public isDefeated: boolean = false;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement, audio: ClassroomAudioEngine) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get canvas 2D context');
    this.ctx = context;
    this.audio = audio;

    this.initRenderLoop();
  }

  public castTeamSpell(
    teamId: 'TEAM_1' | 'TEAM_2',
    spellType: 'FIREBALL' | 'LIGHTNING' | 'FROST' = 'FIREBALL',
    isCrit: boolean = false,
  ): void {
    if (this.isDefeated) return;

    const baseDmg = isCrit ? 1600 : 800;
    const team = this.teamStats[teamId];
    team.totalDmg += baseDmg;

    this.boss.currentHp = Math.max(0, this.boss.currentHp - baseDmg);
    this.boss.shakeTimer = 0.25;

    if (this.boss.currentHp / this.boss.maxHp < 0.35 && this.boss.phase === 1) {
      this.boss.phase = 2;
      this.audio.playBuzzer();
    }

    if (this.boss.currentHp <= 0) {
      this.isDefeated = true;
      this.audio.playWhistle();
      this.audio.playCheer();
    } else {
      if (isCrit) this.audio.playCheer();
      else this.audio.playCorrect();
    }

    this.damageFloats.push({
      text: `${isCrit ? 'BẠO KÍCH! ' : ''}-${baseDmg}`,
      x: this.canvas.width * 0.5 + (Math.random() - 0.5) * 120,
      y: this.canvas.height * 0.38,
      color: isCrit ? '#FCD34D' : '#FFFFFF',
      fontSize: isCrit ? 34 : 26,
      life: 1.0,
      maxLife: 1.0,
    });

    const targetX = this.canvas.width * 0.5;
    const targetY = this.canvas.height * 0.42;

    if (spellType === 'FIREBALL') {
      this.createFireballVfx(targetX, targetY);
    } else if (spellType === 'LIGHTNING') {
      this.createLightningVfx(targetX, targetY);
    } else {
      this.createFrostNovaVfx(targetX, targetY);
    }
  }

  private createFireballVfx(tx: number, ty: number): void {
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: tx,
        y: ty,
        vx: (Math.random() - 0.5) * 500,
        vy: (Math.random() - 0.5) * 500,
        color: Math.random() > 0.4 ? '#EF4444' : '#F59E0B',
        radius: 4 + Math.random() * 6,
        life: 0.65,
        maxLife: 0.65,
      });
    }
  }

  private createLightningVfx(tx: number, ty: number): void {
    const points: { x: number; y: number }[] = [];
    let curX = tx + (Math.random() - 0.5) * 100;
    let curY = 0;
    points.push({ x: curX, y: curY });

    while (curY < ty) {
      curY += 24;
      curX += (Math.random() - 0.5) * 44;
      points.push({ x: curX, y: curY });
    }
    this.lightningBolts.push({ points, life: 0.22 });
  }

  private createFrostNovaVfx(tx: number, ty: number): void {
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const speed = 280 + Math.random() * 80;
      this.particles.push({
        x: tx,
        y: ty,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#38BDF8',
        radius: 3 + Math.random() * 4,
        life: 0.5,
        maxLife: 0.5,
      });
    }
  }

  private update(dt: number): void {
    if (this.boss.ghostHp > this.boss.currentHp) {
      this.boss.ghostHp = Math.max(this.boss.currentHp, this.boss.ghostHp - dt * 2800);
    }

    if (this.boss.shakeTimer > 0) {
      this.boss.shakeTimer -= dt;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.damageFloats.length - 1; i >= 0; i--) {
      const f = this.damageFloats[i];
      f.y -= 70 * dt;
      f.life -= dt;
      if (f.life <= 0) this.damageFloats.splice(i, 1);
    }

    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const b = this.lightningBolts[i];
      b.life -= dt;
      if (b.life <= 0) this.lightningBolts.splice(i, 1);
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

    // Dark Chamber
    this.ctx.fillStyle = '#0B0F19';
    this.ctx.fillRect(0, 0, w, h);

    // Screen shake
    let sx = 0,
      sy = 0;
    if (this.boss.shakeTimer > 0) {
      sx = (Math.random() - 0.5) * 14;
      sy = (Math.random() - 0.5) * 14;
    }

    this.ctx.save();
    this.ctx.translate(sx, sy);

    // Boss Silhouette Graphic
    const bx = w * 0.5;
    const by = h * 0.42;

    this.ctx.fillStyle = this.boss.phase === 2 ? '#7F1D1D' : '#334155';
    this.ctx.beginPath();
    this.ctx.arc(bx, by - 40, 60, 0, Math.PI * 2);
    this.ctx.rect(bx - 90, by - 20, 180, 130);
    this.ctx.fill();

    // Eyes
    this.ctx.fillStyle = this.boss.phase === 2 ? '#F59E0B' : '#EF4444';
    this.ctx.fillRect(bx - 35, by - 50, 18, 10);
    this.ctx.fillRect(bx + 17, by - 50, 18, 10);

    // Lightning Bolts
    this.lightningBolts.forEach((bolt) => {
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      bolt.points.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });
      this.ctx.stroke();
    });

    // Particle System
    this.particles.forEach((p) => {
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * (p.life / p.maxLife), 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Floating text
    this.damageFloats.forEach((f) => {
      this.ctx.fillStyle = f.color;
      this.ctx.font = `bold ${f.fontSize}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(f.text, f.x, f.y);
    });

    this.ctx.restore();

    // Boss HP Bar
    this.renderBossHealthBar(w);

    // Team Contributions
    this.renderTeamContributions(w, h);
  }

  private renderBossHealthBar(w: number): void {
    const barW = w * 0.7;
    const barH = 26;
    const barX = (w - barW) * 0.5;
    const barY = 32;

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      `${this.boss.name} ${this.boss.phase === 2 ? '[CUỒNG NỘ PHA 2]' : ''}`,
      w * 0.5,
      barY - 10,
    );

    this.ctx.fillStyle = '#1E293B';
    this.ctx.fillRect(barX, barY, barW, barH);

    const ghostPct = this.boss.ghostHp / this.boss.maxHp;
    this.ctx.fillStyle = '#F87171';
    this.ctx.fillRect(barX, barY, barW * ghostPct, barH);

    const activePct = this.boss.currentHp / this.boss.maxHp;
    this.ctx.fillStyle = this.boss.phase === 2 ? '#EF4444' : '#10B981';
    this.ctx.fillRect(barX, barY, barW * activePct, barH);

    this.ctx.strokeStyle = '#94A3B8';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(barX, barY, barW, barH);

    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.fillText(`${this.boss.currentHp} / ${this.boss.maxHp} HP`, w * 0.5, barY + 18);
  }

  private renderTeamContributions(w: number, h: number): void {
    const panelY = h - 60;
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, panelY, w, 60);

    this.ctx.font = 'bold 16px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = this.teamStats.TEAM_1.color;
    this.ctx.fillText(
      `${this.teamStats.TEAM_1.name}: ${this.teamStats.TEAM_1.totalDmg} SÁT THƯƠNG`,
      30,
      panelY + 36,
    );

    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = this.teamStats.TEAM_2.color;
    this.ctx.fillText(
      `${this.teamStats.TEAM_2.name}: ${this.teamStats.TEAM_2.totalDmg} SÁT THƯƠNG`,
      w - 30,
      panelY + 36,
    );

    if (this.isDefeated) {
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      this.ctx.fillRect(w * 0.15, h * 0.35, w * 0.7, 120);
      this.ctx.fillStyle = '#FCD34D';
      this.ctx.font = 'bold 44px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('ĐÃ TIÊU DIỆT TRÙM QUÁI!', w * 0.5, h * 0.35 + 72);
    }
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
