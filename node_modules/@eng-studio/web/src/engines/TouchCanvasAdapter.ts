export interface PointerHitResult {
  readonly normX: number;
  readonly normY: number;
  readonly pixelX: number;
  readonly pixelY: number;
  readonly canvasW: number;
  readonly canvasH: number;
}

export class TouchCanvasAdapter {
  private canvas: HTMLCanvasElement;
  private onPointerHit: (hit: PointerHitResult) => void;
  private rect: DOMRect;

  constructor(
    canvasElement: HTMLCanvasElement,
    onPointerHit: (hit: PointerHitResult) => void,
  ) {
    this.canvas = canvasElement;
    this.onPointerHit = onPointerHit;
    this.rect = this.canvas.getBoundingClientRect();
    this.initListeners();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
  }

  public handleResize(): void {
    this.rect = this.canvas.getBoundingClientRect();
  }

  private initListeners(): void {
    const trigger = (e: PointerEvent): void => {
      e.preventDefault();
      this.handleResize();

      const clientX = e.clientX;
      const clientY = e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      const normX = Math.max(0, Math.min(1, (clientX - this.rect.left) / this.rect.width));
      const normY = Math.max(0, Math.min(1, (clientY - this.rect.top) / this.rect.height));

      this.onPointerHit({
        normX,
        normY,
        pixelX: clientX - this.rect.left,
        pixelY: clientY - this.rect.top,
        canvasW: this.canvas.width,
        canvasH: this.canvas.height,
      });
    };

    this.canvas.addEventListener('pointerdown', trigger, { passive: false });
  }

  public destroy(): void {
    // Adapter cleanup
  }
}
