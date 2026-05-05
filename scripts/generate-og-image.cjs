const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;
const BLACK = '#111111';
const INK = '#202020';
const MUTED = '#656565';
const PAPER = '#f8f7f3';
const CARD = '#ffffff';
const BORDER = '#d9d5cc';
const OCHRE = '#b8752d';

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, width, height, radius, fill) {
  roundRect(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function strokeRoundRect(ctx, x, y, width, height, radius, stroke, lineWidth = 1) {
  roundRect(ctx, x, y, width, height, radius);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawNoise(ctx) {
  let seed = 42;
  function next() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  ctx.save();
  ctx.globalAlpha = 0.17;
  for (let i = 0; i < 9000; i += 1) {
    const x = Math.floor(next() * WIDTH);
    const y = Math.floor(next() * HEIGHT);
    const light = 195 + Math.floor(next() * 42);
    ctx.fillStyle = `rgb(${light}, ${light - 2}, ${light - 8})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
}

function drawPixelPreview(ctx, x, y, width, height) {
  const palette = ['#2a123d', '#43115b', '#602785', '#8c4caf', '#bf2aa9', '#90324e', '#bba7c8'];
  const grid = [
    [3, 6, 0, 0, 5, 6, 4, 1, 2, 0, 6, 4, 1, 6, 2, 5],
    [4, 2, 2, 0, 0, 1, 2, 5, 4, 2, 1, 1, 0, 6, 6, 1],
    [1, 6, 2, 3, 1, 5, 6, 0, 1, 1, 2, 3, 2, 2, 0, 5],
    [0, 3, 1, 1, 2, 2, 4, 5, 0, 3, 1, 4, 6, 1, 4, 2],
    [2, 5, 0, 3, 6, 4, 3, 2, 6, 0, 5, 6, 1, 4, 4, 2],
    [1, 5, 0, 2, 2, 6, 4, 1, 4, 2, 1, 0, 0, 3, 2, 2],
    [4, 6, 2, 3, 3, 6, 1, 0, 2, 5, 6, 1, 5, 2, 6, 4],
    [0, 6, 1, 0, 2, 1, 6, 3, 0, 3, 2, 0, 1, 5, 2, 1],
  ];
  const cellW = width / grid[0].length;
  const cellH = height / grid.length;

  ctx.save();
  roundRect(ctx, x, y, width, height, 18);
  ctx.clip();
  ctx.fillStyle = '#f1ede4';
  ctx.fillRect(x, y, width, height);
  grid.forEach((row, rowIndex) => {
    row.forEach((colorIndex, columnIndex) => {
      ctx.fillStyle = palette[colorIndex];
      ctx.fillRect(
        x + Math.floor(columnIndex * cellW),
        y + Math.floor(rowIndex * cellH),
        Math.ceil(cellW) + 1,
        Math.ceil(cellH) + 1,
      );
    });
  });
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x, y, width, Math.floor(height * 0.18));
  ctx.restore();
}

function drawMcpIcon(ctx, x, y, size = 80) {
  const scale = size / 80;
  fillRoundRect(ctx, x, y, size, size, 14 * scale, '#ffffff');
  fillRoundRect(ctx, x + 12 * scale, y + 12 * scale, 56 * scale, 56 * scale, 8 * scale, BLACK);
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 29 * scale, y + 47 * scale);
  ctx.lineTo(x + 47 * scale, y + 29 * scale);
  ctx.quadraticCurveTo(x + 54 * scale, y + 22 * scale, x + 60 * scale, y + 28 * scale);
  ctx.quadraticCurveTo(x + 66 * scale, y + 34 * scale, x + 59 * scale, y + 41 * scale);
  ctx.lineTo(x + 41 * scale, y + 59 * scale);
  ctx.quadraticCurveTo(x + 34 * scale, y + 66 * scale, x + 28 * scale, y + 60 * scale);
  ctx.quadraticCurveTo(x + 22 * scale, y + 54 * scale, x + 29 * scale, y + 47 * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 37 * scale, y + 51 * scale);
  ctx.lineTo(x + 55 * scale, y + 33 * scale);
  ctx.stroke();
  ctx.restore();
}

function drawTag(ctx, x, y, label) {
  ctx.font = '700 15px Arial, Helvetica, sans-serif';
  const width = Math.ceil(ctx.measureText(label).width) + 28;
  fillRoundRect(ctx, x, y, width, 36, 14, '#f8f8f8');
  ctx.fillStyle = '#666666';
  ctx.fillText(label, x + 14, y + 24);
  return width;
}

function drawArticleCard(ctx) {
  const x = 704;
  const y = 92;
  const width = 344;
  const height = 420;
  const mediaHeight = 142;

  ctx.save();
  ctx.shadowColor = 'rgba(17, 17, 17, 0.1)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 20;
  fillRoundRect(ctx, x, y, width, height, 20, CARD);
  ctx.restore();
  strokeRoundRect(ctx, x, y, width, height, 20, '#dddddd', 1.5);

  drawPixelPreview(ctx, x + 1, y + 1, width - 2, mediaHeight);
  drawMcpIcon(ctx, x + width - 78, y + 28, 64);

  ctx.fillStyle = MUTED;
  ctx.font = '700 18px Arial, Helvetica, sans-serif';
  ctx.fillText('modelcontextprotocol.io', x + 34, y + 184);

  fillRoundRect(ctx, x + 34, y + 216, 94, 34, 17, '#f5f5f5');
  ctx.fillStyle = '#999999';
  ctx.font = '800 14px Arial, Helvetica, sans-serif';
  ctx.fillText('PROTOCOL', x + 48, y + 238);

  ctx.fillStyle = BLACK;
  ctx.font = '800 24px Arial, Helvetica, sans-serif';
  ctx.fillText('Model Context Protocol', x + 34, y + 288);

  ctx.fillStyle = MUTED;
  ctx.font = '500 19px Arial, Helvetica, sans-serif';
  ctx.fillText('Open protocol for connecting AI', x + 34, y + 320);
  ctx.fillText('applications to tools, data sources,', x + 34, y + 348);
  ctx.fillText('and workflows.', x + 34, y + 376);

  let tagX = x + 34;
  tagX += drawTag(ctx, tagX, y + 376, 'mcp') + 8;
  tagX += drawTag(ctx, tagX, y + 376, 'tools') + 8;
  drawTag(ctx, tagX, y + 376, 'integrations');
}

function generateSocialImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawNoise(ctx);

  ctx.strokeStyle = '#e1dbcf';
  ctx.lineWidth = 1.5;
  strokeRoundRect(ctx, 38, 38, WIDTH - 76, HEIGHT - 76, 34, '#ded7ca', 1.5);

  fillRoundRect(ctx, 102, 86, 74, 74, 16, BLACK);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 27px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AI', 139, 133);
  ctx.textAlign = 'left';

  ctx.fillStyle = BLACK;
  ctx.font = '800 102px Arial, Helvetica, sans-serif';
  ctx.fillText('AI Atlas', 102, 258);

  ctx.fillStyle = '#343434';
  ctx.font = '500 33px Arial, Helvetica, sans-serif';
  ctx.fillText('Curated AI tools, skills,', 106, 324);
  ctx.fillText('docs & articles.', 106, 366);

  ctx.fillStyle = BLACK;
  ctx.font = '700 18px Arial, Helvetica, sans-serif';
  ctx.fillText('TOOLS  /  SKILLS  /  DOCS  /  ARTICLES', 106, 474);

  ctx.strokeStyle = '#d7d0c3';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(106, 504);
  ctx.lineTo(448, 504);
  ctx.stroke();

  drawArticleCard(ctx);

  return canvas.toBuffer('image/png');
}

const buffer = generateSocialImage();
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buffer);
console.log('OG image generated at:', outputPath);
