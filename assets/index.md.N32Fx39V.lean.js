import{J as r,v as c,q as l,x as p,o as m,c as h}from"./chunks/framework.CeMiJbT_.js";const x=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),u={name:"index.md"},_=Object.assign(u,{setup(f){const o=r();let n=null;const s=()=>new Promise(t=>{if(window.gsap)return t(window.gsap);const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",e.onload=()=>t(window.gsap),document.head.appendChild(e)}),d=t=>{if(!n)return;const e=document.createElement("div");e.innerHTML="●",e.style.cssText=`
    position: absolute; color: white; text-shadow: 0 0 5px #fff;
    opacity: ${.2+Math.random()*.7};
    font-size: ${3+Math.random()*4}px;
    top: -20px;
    will-change: transform;
  `,n.appendChild(e),t.fromTo(e,{x:Math.random()*window.innerWidth,y:-30},{duration:5+Math.random()*10,y:window.innerHeight+50,x:"+="+(Math.random()*200-100),repeat:-1,ease:"none",delay:Math.random()*5})},a=async()=>{if(n||o.path!=="/"&&o.path!=="/index.html")return;const t=await s();n=document.createElement("div"),n.style.cssText=`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `,document.body.appendChild(n);for(let e=0;e<70;e++)d(t)},i=()=>{n&&(n.remove(),n=null)};return c(()=>a()),l(()=>o.path,t=>{t==="/"||t==="/index.html"?a():i()}),p(()=>i()),(t,e)=>(m(),h("div"))}});export{x as __pageData,_ as default};
