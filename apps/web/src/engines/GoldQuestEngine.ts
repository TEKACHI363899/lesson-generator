import { ClassroomAudioEngine } from './ClassroomAudioEngine';

export interface ChestLoot {
  type: 'GOLD' | 'MULT' | 'SWAP' | 'STEAL' | 'TRAP';
  value: number;
  label: string;
}

export interface ChestItemState {
  idx: number;
  loot: ChestLoot;
  opened: boolean;
}

export class GoldQuestEngine {
  private audio: ClassroomAudioEngine;
  public teams = {
    TEAM_1: { name: 'Đội Đỏ', gold: 500, color: '#2563EB' },
    TEAM_2: { name: 'Đội Xanh', gold: 500, color: '#DC2626' },
  };
  public currentTurn: 'TEAM_1' | 'TEAM_2' = 'TEAM_1';
  public chests: ChestItemState[] = [];
  public isInputLocked: boolean = false;
  private onStateChange: () => void;

  constructor(audio: ClassroomAudioEngine, onStateChange: () => void) {
    this.audio = audio;
    this.onStateChange = onStateChange;
    this.initBoard();
  }

  private generateLootPool(): ChestLoot[] {
    const pool: ChestLoot[] = [
      { type: 'GOLD', value: 100, label: '+100 VÀNG' },
      { type: 'GOLD', value: 250, label: '+250 VÀNG' },
      { type: 'GOLD', value: 500, label: '+500 VÀNG' },
      { type: 'GOLD', value: 1000, label: '+1000 KHO BÁU LỚN' },
      { type: 'MULT', value: 2, label: 'NHÂN ĐÔI ĐIỂM (x2)' },
      { type: 'MULT', value: 3, label: 'NHÂN BA ĐIỂM (x3)' },
      { type: 'SWAP', value: 0, label: 'HOÁN ĐỔI ĐIỂM 2 ĐỘI!' },
      { type: 'STEAL', value: 0.25, label: 'CƯỚP 25% ĐIỂM ĐỐI THỦ' },
      { type: 'TRAP', value: -200, label: 'BẪY TRỪ 200 ĐIỂM' },
      { type: 'GOLD', value: 150, label: '+150 VÀNG' },
      { type: 'GOLD', value: 300, label: '+300 VÀNG' },
      { type: 'SWAP', value: 0, label: 'HOÁN ĐỔI ĐIỂM 2 ĐỘI!' },
    ];

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }

  public initBoard(): void {
    const pool = this.generateLootPool();
    this.chests = pool.map((loot, idx) => ({
      idx,
      loot,
      opened: false,
    }));
    this.isInputLocked = false;
    this.onStateChange();
  }

  public openChest(idx: number): void {
    if (this.isInputLocked || this.chests[idx].opened) return;
    this.isInputLocked = true;
    this.chests[idx].opened = true;

    const loot = this.chests[idx].loot;
    this.applyLoot(loot);
    this.onStateChange();

    setTimeout(() => {
      this.currentTurn = this.currentTurn === 'TEAM_1' ? 'TEAM_2' : 'TEAM_1';
      this.isInputLocked = false;
      this.onStateChange();
    }, 1500);
  }

  private applyLoot(loot: ChestLoot): void {
    const active = this.teams[this.currentTurn];
    const opponentKey = this.currentTurn === 'TEAM_1' ? 'TEAM_2' : 'TEAM_1';
    const opponent = this.teams[opponentKey];

    switch (loot.type) {
      case 'GOLD':
        active.gold += loot.value;
        this.audio.playCorrect();
        break;
      case 'MULT':
        active.gold = Math.round(active.gold * loot.value);
        this.audio.playCheer();
        break;
      case 'SWAP': {
        const temp = active.gold;
        active.gold = opponent.gold;
        opponent.gold = temp;
        this.audio.playWhistle();
        break;
      }
      case 'STEAL': {
        const stolen = Math.round(opponent.gold * loot.value);
        opponent.gold -= stolen;
        active.gold += stolen;
        this.audio.playCheer();
        break;
      }
      case 'TRAP':
        active.gold = Math.max(0, active.gold + loot.value);
        this.audio.playBuzzer();
        this.audio.playWrong();
        break;
    }
  }
}
