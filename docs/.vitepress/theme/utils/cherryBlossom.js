// 벚꽃잎 데이터 초기화
export const initCherryPetals = (count, width, height) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * -height,
    r: Math.random() * 3 + 2,
    speed: (Math.random() * 2 + 1) * 20,
    opacity: Math.random() * 0.5 + 0.4,
    swing: Math.random() * 0.8 + 0.2,
    step: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: Math.random() * 0.4 - 0.2
  }))
}

// 벚꽃잎 그리기 & 이동
export const cherryEffect = (ctx, f, deltaTime, canvas) => {
  ctx.save()
  ctx.translate(f.x, f.y)
  ctx.rotate(f.rotation)
  ctx.beginPath()
  ctx.ellipse(0, 0, f.r * 0.8, f.r * 1.5, 0, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(255, 192, 203, ${f.opacity})`
  ctx.fill()
  ctx.restore()

  f.y += f.speed * deltaTime
  f.step += 1 * deltaTime
  f.x += Math.sin(f.step) * (f.swing * deltaTime * 25)
  f.rotation += f.rotationSpeed * deltaTime * 2

  if (f.y > canvas.height) {
    f.y = -20
    f.x = Math.random() * canvas.width
    f.rotation = Math.random() * Math.PI * 2
  }
}