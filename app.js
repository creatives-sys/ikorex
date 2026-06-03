var DONE=false;
var ms=function(n){return new Promise(function(r){setTimeout(r,n);});};

function showPhrase(el,hold){
  return new Promise(function(resolve){
    el.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,calc(-50% + 32px));opacity:0;transition:none;will-change:opacity,transform;width:90%;text-align:center;';
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      el.style.transition='opacity 650ms cubic-bezier(0.22,1,0.36,1),transform 750ms cubic-bezier(0.22,1,0.36,1)';
      el.style.opacity='1';el.style.transform='translate(-50%,-50%)';
      setTimeout(function(){
        el.style.transition='opacity 550ms ease,transform 650ms ease';
        el.style.opacity='0';el.style.transform='translate(-50%,calc(-50% - 24px))';
        setTimeout(resolve,650);
      },hold);
    });});
  });
}

function animateBar(durationMs){
  var bar=document.getElementById('intro-bar');
  bar.style.transition='width '+durationMs+'ms linear';
  bar.style.width='100%';
}

async function runIntro(){
  var totalDuration=4000;
  animateBar(totalDuration);
  await ms(300);
  await showPhrase(document.getElementById('line1'),1000);
  await ms(50);
  await showPhrase(document.getElementById('line2'),1000);
  await ms(50);
  await showPhrase(document.getElementById('line3'),1200);
  await ms(100);

  var br=document.getElementById('brand-reveal');
  br.style.opacity='1';
  document.getElementById('brand-ring').classList.add('show');
  await ms(100);
  document.getElementById('brand-ring2').classList.add('show');
  await ms(150);
  document.getElementById('brand-mark-svg').classList.add('show');
  await ms(500);
  document.getElementById('brand-name-wrap').classList.add('show');
  await ms(250);
  document.getElementById('brand-hr').classList.add('show');
  await ms(150);
  document.getElementById('brand-city').classList.add('show');
  await ms(250);
  document.getElementById('brand-cta').classList.add('show');
}

function launchSite(){
  if(DONE)return;DONE=true;
  document.getElementById('intro').classList.add('out');
  document.getElementById('site').classList.add('visible');
  setTimeout(function(){
    document.getElementById('intro').style.display='none';
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  },600);
}

function toggleTheme() {
  var isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function toggleMenu(){
  var links = document.querySelector('.nav-links');
  var toggle = document.querySelector('.menu-toggle');
  var isOpen = links.classList.toggle('open');
  toggle.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
}

function go(name){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.nav-links a').forEach(function(a){a.classList.remove('active');});
  var page=document.getElementById('page-'+name);
  var nav=document.getElementById('n'+name.charAt(0));
  if(page){page.classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
  if(nav)nav.classList.add('active');
  
  var links = document.querySelector('.nav-links');
  var toggle = document.querySelector('.menu-toggle');
  if(links.classList.contains('open')) {
    links.classList.remove('open');
    toggle.classList.remove('open');
  }
}

(function(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var d=e.target.dataset.srDelay;
        if(d)e.target.style.transitionDelay=(parseFloat(d)*0.1)+'s';
        e.target.classList.add('sr-in');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.05,rootMargin:'0px 0px -20px 0px'});

  function observe(){document.querySelectorAll('[data-sr]:not(.sr-in)').forEach(function(el){io.observe(el);});}
  
  var _L=window.launchSite;
  window.launchSite=function(){_L();setTimeout(observe,200);};
  var _G=window.go;
  window.go=function(name){_G(name);setTimeout(observe,50);};
  document.addEventListener('DOMContentLoaded',function(){
    var track = document.querySelector('.marquee-track');
    if(track) {
      track.innerHTML += track.innerHTML;
    }
    
    // Subpage load transitions
    var site = document.getElementById('site');
    if(site && !document.getElementById('intro')) {
      site.classList.remove('visible');
      requestAnimationFrame(function(){
        setTimeout(function(){
          site.classList.add('visible');
        }, 50);
      });
    }

    setTimeout(observe,100);
  });
})();

// Mouse Spotlight Hover tracking for cards
document.addEventListener('mousemove', function(e) {
  var card = e.target.closest('.glow-card');
  if (card) {
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  }
});

// Scroll Progress Indicator Logic
window.addEventListener('scroll', function() {
  var progress = document.querySelector('.scroll-progress-bar');
  if (progress) {
    var scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = scrollTotal > 0 ? (window.pageYOffset / scrollTotal) * 100 : 0;
    progress.style.width = scrolled + '%';
  }
});

window.addEventListener('load',function(){
  var intro = document.getElementById('intro');
  if(intro) {
    runIntro();
  } else {
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }
});
