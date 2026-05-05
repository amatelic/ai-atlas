// Generate unique pixelated art for each item based on its ID
export function generatePixelArt(id, width = 800, height = 400) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  
  // Use id to seed random-ish values
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (n) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate color palette based on seed
  const baseHue = (seed * 137.5) % 360;
  const colors = [
    `hsl(${baseHue}, 70%, 20%)`,
    `hsl(${baseHue}, 60%, 30%)`,
    `hsl(${baseHue}, 50%, 40%)`,
    `hsl(${baseHue}, 40%, 50%)`,
    `hsl(${(baseHue + 30) % 360}, 60%, 45%)`,
    `hsl(${(baseHue + 60) % 360}, 50%, 35%)`,
    `hsl(${baseHue}, 30%, 60%)`,
    `hsl(${baseHue}, 20%, 70%)`,
  ];
  
  // Background
  ctx.fillStyle = `hsl(${baseHue}, 40%, 15%)`;
  ctx.fillRect(0, 0, width, height);
  
  // Generate pixelated blocks
  const pixelSize = 25;
  for (let x = 0; x < width; x += pixelSize) {
    for (let y = 0; y < height; y += pixelSize) {
      const n = (x / pixelSize) * (height / pixelSize) + (y / pixelSize);
      if (random(n) > 0.3) {
        ctx.fillStyle = colors[Math.floor(random(n + 1) * colors.length)];
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }
  
  // Add some larger blocks
  for (let i = 0; i < 5; i++) {
    const bx = Math.floor(random(i * 10) * (width / pixelSize)) * pixelSize;
    const by = Math.floor(random(i * 10 + 1) * (height / pixelSize)) * pixelSize;
    const bw = (Math.floor(random(i * 10 + 2) * 3) + 2) * pixelSize;
    const bh = (Math.floor(random(i * 10 + 3) * 2) + 2) * pixelSize;
    
    ctx.fillStyle = colors[Math.floor(random(i * 10 + 4) * colors.length)];
    ctx.globalAlpha = 0.7;
    ctx.fillRect(bx, by, bw, bh);
    ctx.globalAlpha = 1;
  }
  
  return canvas.toDataURL('image/png');
}

// Pre-generate thumbnails for all items
export function generateAllThumbnails(catalog) {
  const thumbnails = {};
  
  catalog.resources.forEach((resource) => {
    thumbnails[resource.id] = generatePixelArt(resource.id);
  });
  
  catalog.articles.forEach((article) => {
    thumbnails[article.id] = generatePixelArt(article.id);
  });
  
  return thumbnails;
}
