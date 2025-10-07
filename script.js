// بسيط: interactive nav, particles, theme toggle, smooth scroll
document.addEventListener('DOMContentLoaded', ()=>{

  // smooth scroll for nav links
  document.querySelectorAll('.nav a, .side-menu li, .btn').forEach(el=>{
    el.addEventListener('click', (e)=>{
      const href = el.getAttribute('href') || el.dataset.target;
      if(!href || !href.startsWith('#')) return;
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior:'smooth', block:'center'});
      // update active side menu
      document.querySelectorAll('.side-menu li').forEach(li=>li.classList.remove('active'));
      const clicked = document.querySelector(`.side-menu li[data-target="${href}"]`);
      if(clicked) clicked.classList.add('active');
    });
  });

  // side menu click -> same
  document.querySelectorAll('.side-menu li').forEach(li=>{
    li.addEventListener('click', ()=> {
      const t = li.dataset.target;
      if(!t) return;
      document.querySelector(t).scrollIntoView({behavior:'smooth', block:'center'});
      document.querySelectorAll('.side-menu li').forEach(i=>i.classList.remove('active'));
      li.classList.add('active');
    });
  });

  // theme toggle (light / dark small demo)
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light-mode');
    // simple visual swap
    if(document.documentElement.classList.contains('light-mode')){
      document.documentElement.style.setProperty('--bg','#f6f7fb');
      document.documentElement.style.setProperty('--card','#ffffff');
      document.documentElement.style.setProperty('--muted','#5b6b77');
      document.documentElement.style.setProperty('--glass-border','rgba(0,0,0,0.06)');
      document.documentElement.style.setProperty('--accent','#e07b5d');
      themeToggle.textContent = 'داكن';
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--muted');
      document.documentElement.style.removeProperty('--glass-border');
      document.documentElement.style.removeProperty('--accent');
      themeToggle.textContent = 'ثيم';
    }
  });

  // particles generator: small sprites moving up (sparks/petals)
  const particles = document.getElementById('particles');
  const W = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const H = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  function makeParticle(){
    const el = document.createElement('div');
    el.className = 'p';
    const size = Math.random()*6 + 4;
    el.style.position = 'fixed';
    el.style.left = (Math.random()*W) + 'px';
    el.style.top = (H + 30) + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.borderRadius = '50%';
    el.style.opacity = (Math.random()*0.6 + 0.2);
    // color random warm
    const colors = ['#ffb36b','#ffd78f','#f2a06d','#ffd3b0','#ffedd6'];
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.zIndex = 1;
    el.style.pointerEvents = 'none';
    el.style.filter = 'blur(0.5px)';
    particles.appendChild(el);

    const duration = 4000 + Math.random()*3000;
    const toX = (Math.random()-0.5)*200;
    const toY = -H - 100 - Math.random()*300;
    el.animate([
      {transform:`translate(0px,0px) rotate(0deg)`, opacity:el.style.opacity},
      {transform:`translate(${toX}px, ${toY}px) rotate(${Math.random()*90-45}deg)`, opacity:0}
    ], {duration:duration, easing:'linear'});

    setTimeout(()=>el.remove(), duration+50);
  }

  // spawn periodically
  let pInterval = setInterval(makeParticle, 350);

  // pause particles when hidden
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) clearInterval(pInterval);
    else pInterval = setInterval(makeParticle, 350);
  });

  // small parallax on portrait with mouse move
  const portrait = document.getElementById('portrait');
  const wrap = document.querySelector('.portrait-wrap');
  if(portrait && wrap){
    wrap.addEventListener('mousemove', (e)=>{
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      portrait.style.transform = `translate(${dx*10}px, ${dy*-10}px) rotate(${dx*3}deg) scale(1.02)`;
    });
    wrap.addEventListener('mouseleave', ()=> portrait.style.transform = '');
  }

  // intersection observer to highlight side menu
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const id = '#'+en.target.id;
        document.querySelectorAll('.side-menu li').forEach(li=>li.classList.remove('active'));
        const item = document.querySelector(`.side-menu li[data-target="${id}"]`);
        if(item) item.classList.add('active');
      }
    });
  }, {threshold:0.45});
  sections.forEach(s=>observer.observe(s));

});