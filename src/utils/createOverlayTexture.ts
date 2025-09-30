import { CanvasTexture, SRGBColorSpace } from 'three';

export interface OverlayOptions {
  text: string;
  fontFamily: string;
  textColor: string;
  backgroundColor?: string;
  logo?: HTMLImageElement | null;
}

const CANVAS_SIZE = 1024;
const DEFAULT_BACKGROUND = '#f8f8f8';

function drawText(ctx: CanvasRenderingContext2D, { text, fontFamily, textColor }: OverlayOptions) {
  const fontSize = Math.floor(CANVAS_SIZE * 0.12);
  ctx.fillStyle = textColor;
  ctx.font = `700 ${fontSize}px ${fontFamily}, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textX = CANVAS_SIZE / 2;
  const textY = CANVAS_SIZE * 0.35;
  ctx.fillText(text || 'Your Brand', textX, textY, CANVAS_SIZE * 0.9);
}

function drawLogo(ctx: CanvasRenderingContext2D, logo?: HTMLImageElement | null) {
  if (!logo) {
    return;
  }

  const maxLogoWidth = CANVAS_SIZE * 0.35;
  const maxLogoHeight = CANVAS_SIZE * 0.35;
  const aspect = logo.width / logo.height;
  let drawWidth = maxLogoWidth;
  let drawHeight = drawWidth / aspect;

  if (drawHeight > maxLogoHeight) {
    drawHeight = maxLogoHeight;
    drawWidth = drawHeight * aspect;
  }

  const padding = CANVAS_SIZE * 0.05;
  const x = (CANVAS_SIZE - drawWidth) / 2;
  const y = CANVAS_SIZE * 0.55;

  ctx.drawImage(logo, x, y, drawWidth, drawHeight);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 24;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 6;
  ctx.strokeRect(x - padding * 0.15, y - padding * 0.15, drawWidth + padding * 0.3, drawHeight + padding * 0.3);
  ctx.shadowBlur = 0;
}

function drawDecorations(ctx: CanvasRenderingContext2D, textColor: string) {
  const accentColor = textColor;
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.1;
  const radius = CANVAS_SIZE * 0.45;
  ctx.beginPath();
  ctx.arc(CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.5, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

export function createOverlayTexture(options: OverlayOptions): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to acquire 2D context for overlay texture');
  }

  ctx.fillStyle = options.backgroundColor || DEFAULT_BACKGROUND;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  drawDecorations(ctx, options.textColor);
  drawText(ctx, options);
  drawLogo(ctx, options.logo ?? null);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load image preview. Please try another file.'));
    image.src = dataUrl;
  });
}
