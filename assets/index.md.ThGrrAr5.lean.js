import{v as c,o as r,c as l,j as i,a as m}from"./chunks/framework.CeMiJbT_.js";const u=JSON.parse('{"title":"My TIL","description":"","frontmatter":{"title":"My TIL"},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),p={name:"index.md"},x=Object.assign(p,{setup(h){return c(()=>{const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",e.onload=()=>{const t=window.innerWidth,s=window.innerHeight,a=document.createElement("div");a.style.cssText="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;",document.body.appendChild(a);function d(o){const n=document.createElement("div");n.innerHTML="●",n.style.cssText=`
        position:absolute;
        color:white;

        text-shadow: 0 0 5px #fff;  
        opacity:${.2+Math.random()*.7};
        font-size:${3+Math.random()*4}px;
      `,a.appendChild(n),gsap.fromTo(n,{x:Math.random()*t,y:-30},{duration:5+Math.random()*10,y:s+30,x:"+="+(Math.random()*200-100),repeat:-1,ease:"none"})}for(let o=0;o<70;o++)setTimeout(()=>{d()},o*100)},document.head.appendChild(e)}),(e,t)=>(r(),l("div",null,[...t[0]||(t[0]=[i("h1",{id:"welcome-to-my-til",tabindex:"-1"},[m("Welcome to My TIL "),i("a",{class:"header-anchor",href:"#welcome-to-my-til","aria-label":'Permalink to "Welcome to My TIL"'},"​")],-1)])]))}});export{u as __pageData,x as default};
