// 눈송이 데이터 초기화
export const initSnowFlakes = (count, width, height) => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * -height,
    r: Math.random() * 2 + 1,
    speed: (Math.random() * 2 + 1) * 30, // 픽셀/초
    opacity: Math.random() * 0.3 + 0.6,
    swing: Math.random() * 0.5 + 0.2,
    step: Math.random() * Math.PI * 2
  }))
}

// 눈송이 그리기 & 이동
export const snowEffect = (ctx, f, deltaTime, canvas) => {
  const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r)
  gradient.addColorStop(0, `rgba(255, 255, 255, ${f.opacity})`)
  gradient.addColorStop(0.8, `rgba(255, 255, 255, ${f.opacity * 0.3})`)
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  
  ctx.beginPath()
  ctx.fillStyle = gradient
  ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
  ctx.fill()

  f.y += f.speed * deltaTime
  f.step += 2 * deltaTime
  f.x += Math.sin(f.step) * (f.swing * deltaTime * 10)

  if (f.y > canvas.height) {
    f.y = -10
    f.x = Math.random() * canvas.width
  }
}