/* Static, dependency-light project page. No model code or external API calls. */
(() => {
  'use strict';
  const data = window.ANY_FORCING_DATA;
  const byId = id => document.getElementById(id);
  const icons = () => window.lucide?.createIcons();
  const formatTime = seconds => {
    const whole = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
  };
  if (!data) return;

  // Links and identity are optional, never filled with invented author details.
  document.title = `${data.config.title} | Any-Step Generality, One-Step Stability`;
  if (data.config.authors.length) {
    byId('authors').textContent = data.config.authors.join(' · ');
    byId('authors').hidden = false;
  }
  if (/^https?:\/\//.test(data.config.paper_url)) {
    const paper = byId('paper-link');
    paper.href = data.config.paper_url;
    paper.target = '_blank';
    paper.rel = 'noopener';
    paper.hidden = false;
  }

  const heroVideos = [...document.querySelectorAll('.hero-mosaic video')];
  const playHero = () => {
    if (document.hidden) return;
    heroVideos.forEach(video => {
      if (video.paused) video.play().catch(() => {});
    });
  };
  heroVideos.forEach((video, index) => {
    const sample = data.hero[index];
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.addEventListener('canplay', playHero);
    video.poster = sample.poster;
    video.src = sample.src;
  });
  // Retry after browser lifecycle changes or an autoplay-blocking policy.
  window.addEventListener('pageshow', playHero);
  document.addEventListener('pointerdown', playHero, { passive: true });
  playHero();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const memoryAnimation = window.createMemoryDemo({root: byId('memory-demo'), reducedMotion, icons});

  let comparisonKind = 'short';
  let currentCase;
  let comparisonVideos = [];
  let playing = false;
  let loadingGeneration = 0;
  let frameHandle;
  let seekingGroup = false;
  let scrubbing = false;
  let seekGeneration = 0;
  let requestedTime = 0;
  const playButton = byId('play-comparison');
  const seek = byId('comparison-seek');
  const minimumDuration = () => Math.min(...comparisonVideos.map(v =>
    Number.isFinite(v.duration) ? v.duration : Number(v.dataset.duration)), Infinity);

  function updatePlayback() {
    const duration = minimumDuration();
    const time = seekingGroup ? requestedTime : comparisonVideos[0]?.currentTime || 0;
    if (!scrubbing && !seekingGroup) {
      seek.value = Number.isFinite(duration) && duration > 0 ? time / duration * 1000 : 0;
    }
    byId('comparison-time').textContent = `${formatTime(time)} / ${formatTime(duration)}`;
  }

  function updatePlayButton() {
    playButton.innerHTML = playing
      ? '<i data-lucide="pause"></i><span>Pause all</span>'
      : '<i data-lucide="play"></i><span>Play all</span>';
    playButton.title = `${playing ? 'Pause' : 'Play'} all comparison videos`;
    icons();
  }

  function pauseComparisons() {
    playing = false;
    seekingGroup = false;
    scrubbing = false;
    ++seekGeneration;
    cancelAnimationFrame(frameHandle);
    comparisonVideos.forEach(v => v.pause());
    playButton.disabled = false;
    updatePlayButton();
    updatePlayback();
  }

  function setTime(seconds) {
    const duration = minimumDuration();
    const target = Math.min(Math.max(seconds, 0), Math.max(0, duration - .04));
    comparisonVideos.forEach(v => {
      if (v.readyState >= 1 && Math.abs(v.currentTime - target) > .001) v.currentTime = target;
    });
    updatePlayback();
  }

  function synchronize() {
    if (!playing || seekingGroup || scrubbing) return;
    const leader = comparisonVideos[0];
    const time = leader.currentTime;
    if (time >= minimumDuration() - .06) {
      pauseComparisons();
      return;
    }
    for (const video of comparisonVideos.slice(1)) {
      if (!video.seeking && Math.abs(video.currentTime - time) > .15) {
        video.currentTime = time;
      }
    }
    updatePlayback();
    frameHandle = requestAnimationFrame(synchronize);
  }

  const waitForMedia = video => new Promise((resolve, reject) => {
    if (video.readyState >= 2 && !video.seeking) return resolve();
    let timer;
    const clean = () => {
      clearTimeout(timer);
      video.removeEventListener('loadeddata', done);
      video.removeEventListener('canplay', done);
      video.removeEventListener('seeked', done);
      video.removeEventListener('error', fail);
    };
    const done = () => {
      if (video.readyState < 2 || video.seeking) return;
      clean(); resolve();
    };
    const fail = () => { clean(); reject(new Error('Video could not be loaded')); };
    video.addEventListener('loadeddata', done);
    video.addEventListener('canplay', done);
    video.addEventListener('seeked', done);
    video.addEventListener('error', fail, { once: true });
    timer = setTimeout(fail, 20000);
    // Loading again during a pending seek would reset the requested timestamp.
    video.preload = 'auto';
    if (video.networkState === video.NETWORK_EMPTY) video.load();
  });

  const waitForSeekable = async (video, seconds, current) => {
    const until = Date.now() + 60000;
    while (current()) {
      for (let i=0; i<video.seekable.length; i++) {
        if (seconds>=video.seekable.start(i)-.01 && seconds<=video.seekable.end(i)+.01) return;
      }
      if (seconds===0 && video.readyState>=2) return;
      if (video.error || Date.now()>=until) throw new Error('Requested video position is not available');
      await new Promise(resolve => setTimeout(resolve,100));
    }
  };

  async function seekComparisons(seconds) {
    const generation = loadingGeneration;
    const operation = ++seekGeneration;
    const group = [...comparisonVideos];
    const current = () => generation === loadingGeneration && operation === seekGeneration;
    requestedTime = Math.min(Math.max(seconds, 0), Math.max(0, minimumDuration() - .04));
    const target = requestedTime;
    seekingGroup = true;
    cancelAnimationFrame(frameHandle);
    group.forEach(v => v.pause());
    playButton.disabled = false;
    updatePlayback();
    try {
      await Promise.all(group.map(waitForMedia));
      if (!current()) return;
      await Promise.all(group.map(video => waitForSeekable(video,target,current)));
      if (!current()) return;
      setTime(target);
      await Promise.all(group.map(waitForMedia));
      if (!current()) return;
      if (group.some(video => Math.abs(video.currentTime-target)>.15)) throw new Error('Seek did not reach its target');
      if (playing && !scrubbing) {
        const outcomes = await Promise.allSettled(group.map(v => v.play()));
        if (!current()) return;
        if (outcomes.some(result => result.status === 'rejected')) throw new Error('Playback was blocked');
      }
      seekingGroup = false;
      updatePlayButton();
      updatePlayback();
      if (playing && !scrubbing) synchronize();
    } catch {
      if (!current()) return;
      pauseComparisons();
      byId('comparison-time').textContent = 'Playback unavailable';
    }
  }

  playButton.addEventListener('click', async () => {
    if (playing) return pauseComparisons();
    const generation = loadingGeneration;
    const operation = ++seekGeneration;
    const current = () => generation === loadingGeneration && operation === seekGeneration;
    const group = [...comparisonVideos];
    const startTime = seekingGroup ? requestedTime : group[0]?.currentTime || 0;
    playing = true;
    seekingGroup = true;
    requestedTime = startTime;
    updatePlayButton();
    playButton.disabled = true;
    galleryControllers.forEach(controller => controller.pause());
    document.querySelectorAll('.gallery-item video').forEach(v => v.pause());
    try {
      await Promise.all(group.map(waitForMedia));
      if (!current()) return;
      const time = startTime;
      if (time >= minimumDuration() - .1) setTime(0);
      else setTime(time);
      await Promise.all(group.map(waitForMedia));
      if (!current()) return;
      const outcomes = await Promise.allSettled(group.map(v => v.play()));
      if (!current()) return;
      if (outcomes.some(r => r.status === 'rejected')) throw new Error('Playback was blocked');
      seekingGroup = false;
      updatePlayButton();
      synchronize();
    } catch {
      if (!current()) return;
      pauseComparisons();
      byId('comparison-time').textContent = 'Playback unavailable';
    } finally {
      if (current()) playButton.disabled = false;
    }
  });
  byId('restart-comparison').addEventListener('click', () => seekComparisons(0));
  seek.addEventListener('pointerdown', () => {
    scrubbing = true;
    seekingGroup = true;
    requestedTime = comparisonVideos[0]?.currentTime || 0;
    ++seekGeneration;
    cancelAnimationFrame(frameHandle);
    comparisonVideos.forEach(v => v.pause());
    playButton.disabled = false;
  });
  seek.addEventListener('input', () => seekComparisons(Number(seek.value) / 1000 * minimumDuration()));
  const finishScrubbing = () => {
    if (!scrubbing) return;
    scrubbing = false;
    seekComparisons(Number(seek.value) / 1000 * minimumDuration());
  };
  window.addEventListener('pointerup', finishScrubbing);
  window.addEventListener('pointercancel', finishScrubbing);
  window.addEventListener('blur', finishScrubbing);
  byId('late-sequence').addEventListener('click', () => seekComparisons(20));

  function renderCase(caseId) {
    pauseComparisons();
    ++loadingGeneration;
    playButton.disabled = false;
    currentCase = data.cases.find(c => c.id === caseId);
    byId('case-name').textContent = currentCase.name;
    byId('case-sampling').textContent = currentCase.sampling;
    byId('case-prompt').textContent = currentCase.prompt;
    byId('case-note').textContent = currentCase.note;
    byId('case-note').hidden = !currentCase.note;
    byId('late-sequence').hidden = !currentCase.videos.every(v => v.duration > 25);
    const grid = byId('comparison-videos');
    grid.replaceChildren();
    grid.className = `comparison-grid ${currentCase.videos.length === 4 ? 'four' : currentCase.videos.length === 2 ? 'two' : ''}`;
    comparisonVideos = currentCase.videos.map(item => {
      const ours = item.method === 'Any Forcing';
      const figure = document.createElement('figure');
      figure.className = 'video-tile';
      const caption = document.createElement('figcaption');
      caption.className = 'video-label';
      if (ours) {
        const dot = document.createElement('span');
        dot.className = 'ours-dot';
        caption.append(dot);
      }
      caption.append(document.createTextNode(item.method));
      if (ours) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Ours';
        caption.append(badge);
      }
      const frame = document.createElement('div');
      frame.className = `video-frame ${ours ? 'ours' : ''}`;
      const video = document.createElement('video');
      video.src = item.src;
      video.poster = item.poster;
      video.dataset.duration = item.duration;
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-label', `${item.method}: ${currentCase.name}`);
      const expand = document.createElement('button');
      expand.className = 'video-expand';
      expand.type = 'button';
      expand.title = `View ${item.method} fullscreen`;
      expand.setAttribute('aria-label', expand.title);
      expand.innerHTML = '<i data-lucide="maximize-2"></i>';
      expand.addEventListener('click', async () => {
        try {
          if (video.requestFullscreen) await video.requestFullscreen();
          else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        } catch { /* Fullscreen requires a user gesture and browser support. */ }
      });
      caption.append(expand);
      const error = document.createElement('div');
      error.className = 'video-error';
      error.textContent = 'Video unavailable. Please reload.';
      video.addEventListener('error', () => frame.classList.add('failed'));
      video.addEventListener('loadedmetadata', updatePlayback);
      video.addEventListener('ended', () => {
        if (!seekingGroup && !scrubbing) pauseComparisons();
      });
      frame.append(video, error);
      figure.append(caption, frame);
      grid.append(figure);
      return video;
    });
    setTime(0);
    icons();
  }

  function changeComparisonKind(kind) {
    comparisonKind = kind;
    const tabs = [...document.querySelectorAll('[data-kind]')];
    tabs.forEach(tab => {
      const selected = tab.dataset.kind === kind;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    byId('comparison-panel').setAttribute('aria-labelledby', `${kind}-tab`);
    const select = byId('scene-select');
    select.replaceChildren();
    data.cases.filter(c => c.kind === kind).forEach(c => {
      select.add(new Option(c.name, c.id));
    });
    select.closest('.select-wrap').hidden = select.options.length < 2;
    renderCase(select.value);
  }
  document.querySelectorAll('[data-kind]').forEach(tab => {
    tab.addEventListener('click', () => changeComparisonKind(tab.dataset.kind));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const kind = comparisonKind === 'short' ? 'long' : 'short';
      changeComparisonKind(kind);
      document.querySelector(`[data-kind="${kind}"]`).focus();
    });
  });
  byId('scene-select').addEventListener('change', event => renderCase(event.target.value));

  const benchmarks = {
    short: {
      two: { label: 'First 2 steps / Rest 1 step', rows: [
        ['Self Forcing',82.25,83.16,78.62], ['Causal Forcing',81.87,82.66,78.73],
        ['ASD',81.70,82.29,79.32], ['One Forcing',84.01,85.11,79.59],
        ['Any Forcing',84.79,85.83,80.64]] },
      four: { label: 'First 4 steps / Rest 1 step', rows: [
        ['Self Forcing',83.08,83.73,80.50], ['Causal Forcing',83.06,83.75,80.28],
        ['ASD',82.74,83.08,81.35], ['One Forcing',84.35,85.52,79.65],
        ['Any Forcing',85.06,86.19,80.54]] },
      uniform: { label: 'Uniform 4-step sampling', rows: [
        ['CausVid',83.05,84.14,78.70], ['rCM',83.11,84.48,77.65],
        ['Self Forcing',84.20,84.88,81.48], ['Causal Forcing',85.08,86.19,80.64],
        ['Any Forcing',85.09,86.18,80.73]] },
      uniformTwo: { label: 'Uniform 2-step sampling', rows: [
        ['CausVid',81.03,82.26,76.11], ['rCM',81.06,83.23,72.34],
        ['Self Forcing',81.79,83.13,76.40], ['Causal Forcing',84.03,85.18,79.40],
        ['Any Forcing',84.89,86.08,80.12]] },
    },
    long: {
      two: { label: 'First 2 steps / Rest 1 step', rows: [
        ['Infinity RoPE',84.13,85.56,78.42], ['Deep Forcing',84.06,85.30,79.10],
        ['Relax Forcing',83.76,85.10,78.41], ['Any Forcing',84.53,85.73,79.71]] },
      four: { label: 'First 4 steps / Rest 1 step', rows: [
        ['Infinity RoPE',84.51,85.83,79.22], ['Deep Forcing',84.33,85.43,79.91],
        ['Relax Forcing',84.09,85.27,79.40], ['Any Forcing',84.56,85.64,80.22]] },
    },
  };
  let resultKind = 'short';
  function renderResults() {
    const entry = benchmarks[resultKind][byId('result-sampling').value];
    byId('result-caption').textContent = `${resultKind === 'short' ? '5s' : '30s'} generation: ${entry.label}`;
    const ranks = [1, 2, 3].map(column => [...new Set(entry.rows.map(r => r[column]).filter(Number.isFinite))].sort((a,b) => b-a));
    const ours = entry.rows.find(row => row[0] === 'Any Forcing');
    byId('score-context').textContent = `${resultKind === 'short' ? '5s' : '30s'} · ${entry.label}`;
    const scoreboard = byId('result-scoreboard');
    scoreboard.replaceChildren();
    ['Total', 'Quality', 'Semantic'].forEach((label,column) => {
      const value = ours[column+1];
      const place = ranks[column].indexOf(value)+1;
      const article = document.createElement('article');
      article.className = 'result-score';
      const header = document.createElement('div');
      header.className = 'result-score-header';
      const heading = document.createElement('h3');
      heading.textContent = label;
      const rank = document.createElement('span');
      rank.className = 'result-rank';
      if (place===1) {
        const trophy = document.createElement('i');
        trophy.dataset.lucide = 'trophy';
        trophy.setAttribute('aria-hidden', 'true');
        rank.append(trophy);
      }
      rank.append(document.createTextNode(`Rank ${place} / ${entry.rows.length}`));
      header.append(heading,rank);
      const score = document.createElement('div');
      score.className = 'result-score-value';
      const number = document.createElement('strong');
      number.textContent = value.toFixed(2);
      const scale = document.createElement('span');
      scale.textContent = '/ 100';
      score.append(number,scale);
      const meter = document.createElement('div');
      meter.className = 'result-meter';
      meter.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('i');
      fill.style.transform = `scaleX(${value/100})`;
      meter.append(fill);
      article.append(header,score,meter);
      scoreboard.append(article);
      if (!reducedMotion.matches) {
        number.animate([{opacity:.3,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],
          {duration:360,delay:column*45,easing:'ease-out'});
        fill.animate([{transform:'scaleX(0)'},{transform:fill.style.transform}],
          {duration:600,delay:column*60,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
    });
    icons();
    const body = byId('result-body');
    body.replaceChildren();
    entry.rows.forEach(row => {
      const tr = document.createElement('tr');
      if (row[0] === 'Any Forcing') tr.className = 'ours';
      const name = document.createElement('th');
      name.scope = 'row';
      name.textContent = row[0];
      name.style.background = 'transparent';
      tr.append(name);
      const params = document.createElement('td');
      params.textContent = '1.3B';
      tr.append(params);
      row.slice(1).forEach((value, column) => {
        const td = document.createElement('td');
        if (!Number.isFinite(value)) {
          td.textContent = '--';
          tr.append(td);
          return;
        }
        const tag = ranks[column][0] === value ? 'strong' : ranks[column][1] === value ? 'u' : 'span';
        const number = document.createElement(tag);
        number.textContent = value.toFixed(2);
        td.append(number);
        tr.append(td);
      });
      body.append(tr);
    });
  }
  function changeResults(kind) {
    resultKind = kind;
    byId('long-result-note').hidden = kind !== 'long';
    document.querySelectorAll('[data-result-kind]').forEach(tab => {
      const selected = tab.dataset.resultKind === kind;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const select = byId('result-sampling');
    const previous = select.value || 'two';
    select.replaceChildren();
    Object.entries(benchmarks[kind]).forEach(([key, value]) => select.add(new Option(value.label, key)));
    select.value = benchmarks[kind][previous] ? previous : 'two';
    renderResults();
  }
  document.querySelectorAll('[data-result-kind]').forEach(tab => {
    tab.addEventListener('click', () => changeResults(tab.dataset.resultKind));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      changeResults(resultKind === 'short' ? 'long' : 'short');
      document.querySelector(`[data-result-kind="${resultKind}"]`).focus();
    });
  });
  byId('result-sampling').addEventListener('change', renderResults);

  const gallery = byId('gallery-grid');
  let galleryControllers = [];
  const lazyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const video = entry.target;
    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.preload = 'metadata';
    }
    lazyObserver.unobserve(video);
  }), { rootMargin: '250px' });
  function renderGallery(filter) {
    galleryControllers.forEach(controller => controller.destroy());
    galleryControllers = [];
    gallery.querySelectorAll('video').forEach(v => { v.pause(); lazyObserver.unobserve(v); });
    gallery.replaceChildren();
    [...(data.shortGallery || []),...(data.longGallery || [])]
      .filter(item => filter==='all' || item.kind===filter).forEach(item => {
        const controller = window.createSamplingGallery(item, {icons,waitForMedia,waitForSeekable,formatTime,onPlay:() => {
          pauseComparisons();
          galleryControllers.forEach(other => { if (other !== controller) other.pause(); });
          gallery.querySelectorAll('.gallery-item video').forEach(video => video.pause());
        }});
        galleryControllers.push(controller);
        gallery.append(controller.element);
        // Sampling groups load media only when played or scrubbed, not while scrolling.
      });
    data.gallery.filter(c => filter === 'all' || c.kind === filter).forEach(item => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const video = document.createElement('video');
      video.poster = item.poster;
      video.dataset.src = item.src;
      video.preload = 'none';
      video.controls = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-label', item.title);
      video.addEventListener('play', () => {
        pauseComparisons();
        galleryControllers.forEach(controller => controller.pause());
        gallery.querySelectorAll('video').forEach(v => { if (v !== video) v.pause(); });
      });
      const caption = document.createElement('figcaption');
      caption.className = 'gallery-caption';
      const heading = document.createElement('h3');
      heading.textContent = item.title;
      const meta = document.createElement('p');
      meta.className = 'gallery-meta';
      meta.textContent = `${item.kind === 'short' ? 'Short video' : 'Long video'} · ${item.duration.toFixed(1)}s playback`;
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Prompt & sample details';
      const prompt = document.createElement('p');
      prompt.textContent = item.prompt;
      const note = document.createElement('p');
      note.textContent = item.note;
      details.append(summary, prompt);
      if (item.note) details.append(note);
      caption.append(heading, meta, details);
      figure.append(video, caption);
      gallery.append(figure);
      lazyObserver.observe(video);
    });
  }
  document.querySelectorAll('[data-gallery-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      renderGallery(button.dataset.galleryFilter);
    });
  });

  const citation = `@misc{anyforcing,\n  title = {Any Forcing: ${data.config.subtitle}},\n  url   = {${data.config.project_url}}\n}`;
  byId('bibtex').textContent = citation;
  byId('copy-citation').addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(citation);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = citation;
        textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.append(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        textarea.remove();
        if (!success) throw new Error('Clipboard unavailable');
      }
      byId('copy-status').textContent = 'Citation copied.';
      byId('copy-citation').innerHTML = '<i data-lucide="check"></i>';
      icons();
      setTimeout(() => { byId('copy-citation').innerHTML = '<i data-lucide="copy"></i>'; icons(); }, 1800);
    } catch { byId('copy-status').textContent = 'Clipboard unavailable. Select the citation text to copy it.'; }
  });

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.site-header nav a').forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
  }), { rootMargin: '-15% 0px -65% 0px' });
  ['comparisons','method','results','gallery'].forEach(id => sectionObserver.observe(byId(id)));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseComparisons(); gallery.querySelectorAll('video').forEach(v => v.pause()); }
    else playHero();
    memoryAnimation.schedule();
  });
  changeComparisonKind('short');
  changeResults('short');
  renderGallery('all');
  icons();
})();
