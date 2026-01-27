function makeFlake(i, ff){
    arr.push({ i: i, x: 0, x2: 0, y: 0, s:0 })
    arr[i].t = gsap
        .timeline({ repeat: -1, repeatRefresh: true})
        .fromTo(
            arr[i],
            {
                x: () => -400 + (cw + 800) * Math.random(),
                y: - 15,
                s: () => 'random(1.8), 7, .1',
                x2: -500,
            },
            {
                ease: 'none',
                y: ch,
                x: '+=' + 'random(-400, 400, 1)',
                x2: 500,
            }
        )
}