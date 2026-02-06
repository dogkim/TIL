import{u as c,J as l,v as p,q as m,x as u,o as h,c as f,P as w}from"./chunks/framework.CeMiJbT_.js";const y=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),x={name:"index.md"},v=Object.assign(x,{setup(_){const{frontmatter:a}=c(),i=l();let t=null;const r=()=>new Promise(n=>{if(window.gsap)return n(window.gsap);const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",e.onload=()=>n(window.gsap),document.head.appendChild(e)}),d=n=>{if(!t)return;const e=document.createElement("div");e.innerHTML="●",e.style.cssText=`
    position: absolute; color: white; text-shadow: 0 0 5px #fff;
    opacity: ${.2+Math.random()*.7};
    font-size: ${3+Math.random()*4}px;
    top: -20px;
    will-change: transform;
  `,t.appendChild(e),n.fromTo(e,{x:Math.random()*window.innerWidth,y:-30},{duration:5+Math.random()*10,y:window.innerHeight+50,x:"+="+(Math.random()*200-100),repeat:-1,ease:"none",delay:Math.random()*4})},o=async()=>{if(t||a.value.layout!=="home")return;const n=await r();t=document.createElement("div"),t.style.cssText=`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 9999; overflow: hidden;
  `,document.body.appendChild(t);for(let e=0;e<70;e++)d(n)},s=()=>{t&&(t.remove(),t=null)};return p(()=>o()),m(()=>i.path,async()=>{await w(),a.value.layout==="home"?o():s()}),u(()=>s()),(n,e)=>(h(),f("div"))}});export{y as __pageData,v as default};
