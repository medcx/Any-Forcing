/* Each scene owns an independent synchronized sampling group. */
window.createSamplingGallery = (item, {icons, waitForMedia, waitForSeekable, formatTime, onPlay}) => {
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text!==undefined) element.textContent = text;
    return element;
  };
  const root = make('article','gallery-schedule-group');
  root.dataset.scene = item.id;
  root.dataset.kind = item.kind;
  const heading = make('div','gallery-group-heading');
  heading.append(make('h3','',item.title),make('span','gallery-group-meta',`${item.kind==='long' ? '30s' : '5s'} · Any Forcing`));
  const grid = make('div','gallery-schedule-grid');
  grid.dataset.columns = item.videos.length;
  const videos = item.videos.map((sample,index) => {
    const figure = make('figure','gallery-schedule-tile');
    figure.dataset.schedule = sample.schedule;
    const header = make('figcaption','gallery-schedule-label');
    const step = make('span','gallery-schedule-step',String(index+1).padStart(2,'0'));
    const label = make('div','gallery-schedule-name');
    const nfe = make('strong','',`NFE = ${sample.nfe==='dagger' || sample.nfe==='star' ? '1' : sample.nfe}`);
    if (sample.nfe==='dagger' || sample.nfe==='star') {
      nfe.append(make('sup','',sample.nfe==='dagger' ? '\u2020' : '*'));
    }
    label.append(nfe,make('span','',sample.label));
    if (item.differentSamples && item.showSampleLabels!==false) label.append(make('span','gallery-sample-index',`Sample ${sample.sample}`));
    const open = make('a','gallery-open');
    open.href = sample.src;
    open.target = '_blank'; open.rel = 'noopener';
    open.title = `Open ${item.title}: ${sample.label}`;
    open.setAttribute('aria-label',open.title);
    open.innerHTML = '<i data-lucide="arrow-up-right"></i>';
    header.append(step,label,open);
    const video = document.createElement('video');
    video.poster = sample.poster;
    video.dataset.src = sample.src;
    video.dataset.duration = sample.duration;
    video.preload = 'none';
    video.muted = true; video.playsInline = true;
    video.setAttribute('aria-label',`${item.title}: ${sample.label}`);
    figure.append(header,video);
    grid.append(figure);
    return video;
  });
  const toolbar = make('div','gallery-group-toolbar');
  const play = make('button','button gallery-group-play');
  const restart = make('button','icon-button');
  const repeat = make('button','icon-button gallery-group-repeat');
  [play,restart,repeat].forEach(button => button.type='button');
  restart.innerHTML = '<i data-lucide="rotate-ccw"></i>';
  restart.title = 'Restart all sampling videos'; restart.setAttribute('aria-label',restart.title);
  repeat.innerHTML = '<i data-lucide="repeat"></i>';
  repeat.title = 'Loop sampling videos'; repeat.setAttribute('aria-label',repeat.title);
  repeat.setAttribute('aria-pressed','true');
  const slider = make('input','gallery-group-seek');
  slider.type='range'; slider.min=0; slider.max=1000; slider.step=1; slider.value=0;
  slider.setAttribute('aria-label',`Seek all ${item.title} sampling videos`);
  const time = make('output','gallery-group-time');
  toolbar.append(play,restart,repeat,slider,time);
  const error = make('p','gallery-group-error');
  error.setAttribute('role','status'); error.hidden=true;
  const details = document.createElement('details');
  details.className = 'gallery-group-prompt';
  details.append(make('summary','','Text prompt'),make('p','',item.prompt));
  root.append(heading,grid,toolbar,error,details);

  let intent = false, busy = false, scrubbing = false, looping = true, alive = true;
  let generation = 0, requested = 0, ticker;
  const duration = () => Math.min(...videos.map(video => Number.isFinite(video.duration) ? video.duration : Number(video.dataset.duration)));
  const controls = () => {
    play.innerHTML = intent ? '<i data-lucide="pause"></i><span>Pause all</span>' : '<i data-lucide="play"></i><span>Play all</span>';
    play.title = `${intent ? 'Pause' : 'Play'} all ${item.title} sampling videos`;
    play.setAttribute('aria-label',play.title);
    root.dataset.playing=String(intent);
    icons();
  };
  const update = () => {
    const value = busy ? requested : videos[0].currentTime;
    if (!scrubbing && !busy) slider.value=value/duration()*1000;
    time.textContent=`${formatTime(value)} / ${formatTime(duration())}`;
  };
  const pause = () => {
    intent=false; busy=false; scrubbing=false; ++generation;
    cancelAnimationFrame(ticker);
    videos.forEach(video => { video.pause(); video.playbackRate=1; });
    controls(); update();
  };
  const sync = () => {
    if (!intent || busy || scrubbing || !alive) return;
    const now=videos[0].currentTime;
    if (now>=duration()-.06) {
      if (looping) seek(0); else pause();
      return;
    }
    videos.slice(1).forEach(video => {
      const drift=now-video.currentTime;
      if (!video.seeking && Math.abs(drift)>.18) video.currentTime=now;
      else video.playbackRate=Math.max(.97,Math.min(1.03,1+drift*.2));
    });
    update(); ticker=requestAnimationFrame(sync);
  };
  async function seek(seconds, fraction=null) {
    const operation=++generation;
    const current=() => alive && operation===generation;
    requested=Math.min(Math.max(0,seconds),duration()-.04);
    let target=requested;
    busy=true; cancelAnimationFrame(ticker);
    videos.forEach(video => {
      video.pause(); video.playbackRate=1;
      if (!video.getAttribute('src')) video.src=video.dataset.src;
    });
    update();
    try {
      await Promise.all(videos.map(waitForMedia));
      if (!current()) return;
      if (fraction!==null) target=fraction*duration();
      target=Math.min(target,Math.max(0,duration()-.04));
      requested=target;
      update();
      await Promise.all(videos.map(video => waitForSeekable(video,target,current)));
      if (!current()) return;
      videos.forEach(video => { if (Math.abs(video.currentTime-target)>.001) video.currentTime=target; });
      await Promise.all(videos.map(waitForMedia));
      if (!current()) return;
      if (videos.some(video => Math.abs(video.currentTime-target)>.15)) throw new Error('Seek did not reach its target');
      if (intent && !scrubbing) {
        await Promise.all(videos.map(video => video.play()));
        if (!current()) return;
      }
      busy=false; update();
      if (intent && !scrubbing) ticker=requestAnimationFrame(sync);
    } catch (_) {
      if (!current()) return;
      pause(); error.hidden=false; error.textContent='Video unavailable.';
    }
  }
  play.addEventListener('click',() => {
    if (intent) { pause(); return; }
    const start=busy ? requested : videos[0].currentTime;
    intent=true; error.hidden=true;
    onPlay(); controls();
    seek(start>=duration()-.1 ? 0 : start);
  });
  restart.addEventListener('click',() => seek(0));
  repeat.addEventListener('click',() => {
    looping=!looping; repeat.setAttribute('aria-pressed',String(looping));
  });
  slider.addEventListener('pointerdown',() => {
    scrubbing=true; busy=true; requested=videos[0].currentTime; ++generation;
    cancelAnimationFrame(ticker); videos.forEach(video => video.pause());
  });
  slider.addEventListener('input',() => {
    const fraction=Number(slider.value)/1000;
    seek(fraction*duration(),fraction);
  });
  const finish = () => {
    if (!scrubbing || !alive) return;
    scrubbing=false;
    const fraction=Number(slider.value)/1000;
    seek(fraction*duration(),fraction);
  };
  ['pointerup','pointercancel','blur'].forEach(event => window.addEventListener(event,finish));
  const visibility = () => { if (document.hidden) pause(); };
  document.addEventListener('visibilitychange',visibility);
  videos.forEach(video => video.addEventListener('ended',() => {
    if (!intent || busy || scrubbing) return;
    if (looping) seek(0); else pause();
  }));
  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting && intent && !busy && !scrubbing) pause();
  },{threshold:.05});
  observer.observe(root);
  controls(); update();
  return {element:root,videos,pause,destroy:() => {
    pause(); alive=false; observer.disconnect();
    ['pointerup','pointercancel','blur'].forEach(event => window.removeEventListener(event,finish));
    document.removeEventListener('visibilitychange',visibility);
  }};
};
