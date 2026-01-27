import{v as r,o as c,c as l,j as i,a as m}from"./chunks/framework.CeMiJbT_.js";const x=JSON.parse('{"title":"My TIL","description":"","frontmatter":{"title":"My TIL"},"headers":[],"relativePath":"index.md","filePath":"index.md"}'),p={name:"index.md"},u=Object.assign(p,{setup(h){return r(()=>{const e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",e.onload=()=>{const t=window.innerWidth,d=window.innerHeight,o=document.createElement("div");o.style.cssText="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;",document.body.appendChild(o);function s(n){const a=document.createElement("div");a.innerHTML="●",a.style.cssText=`
        position:absolute;
        color:white;

        text-shadow: 0 0 5px #fff;  
        opacity:${Math.random()};
        font-size:${2+Math.random()*5}px;
      `,o.appendChild(a),gsap.fromTo(a,{x:Math.random()*t,y:-30},{duration:5+Math.random()*10,y:d+30,x:"+="+(Math.random()*200-100),repeat:-1,ease:"none",delay:Math.random()*5})}for(let n=0;n<50;n++)s()},document.head.appendChild(e)}),(e,t)=>(c(),l("div",null,[...t[0]||(t[0]=[i("h1",{id:"welcome-to-my-til",tabindex:"-1"},[m("Welcome to My TIL "),i("a",{class:"header-anchor",href:"#welcome-to-my-til","aria-label":'Permalink to "Welcome to My TIL"'},"​")],-1)])]))}});export{x as __pageData,u as default};
