/* One continuous clock drives selection, transfer, mapping, and the loop reset. */
window.createMemoryDemo = ({root, reducedMotion, icons}) => {
  const get = id => document.getElementById(id);
  const cycleLength = 15000;
  const boundaries = [1800, 4200, 6600, 9000, 11400, cycleLength];
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const p = clamp(value); return p*p*(3-2*p); };
  const ramp = (time, start, length) => ease((time-start)/length);
  const envelope = (time, start, end, fade = 400) =>
    ramp(time, start, fade) * (1-ramp(time, end-fade, fade));
  let elapsed = 0;
  let running = !reducedMotion.matches;
  let visible = false;
  let lastTime;
  let ticker;
  const canRun = () => running && visible && !document.hidden;

  const prepareToken = (element, frame) => {
    element.classList.add('memory-token');
    element.replaceChildren();
    const image = document.createElement('img');
    image.src = `assets/memory/frame-${frame}.jpg`;
    image.alt = '';
    image.draggable = false;
    const number = document.createElement('span');
    number.className = 'token-number';
    number.textContent = frame;
    element.append(image, number);
    element.setAttribute('aria-label', `Latent-frame index ${frame}`);
    return {element, image, number, frame};
  };
  const tokens = [...root.querySelectorAll('[data-frame]')].map(element =>
    prepareToken(element, element.dataset.frame));
  const a = tokens.find(token => token.element.id === 'memory-a');
  const b = tokens.find(token => token.element.id === 'memory-b');
  const candidate = tokens.find(token => token.frame === '100');
  const recent = tokens.find(token => token.frame === '101');
  const current = tokens.find(token => token.frame === '102');
  const sinks = tokens.slice(0,3);
  [a,b].forEach((token,index) => {
    token.updated = document.createElement('img');
    token.updated.src = `assets/memory/frame-${index ? 100 : 80}.jpg`;
    token.updated.alt = '';
    token.updated.className = 'token-updated';
    token.updated.draggable = false;
    token.element.insertBefore(token.updated, token.number);
  });

  const makeCopy = token => {
    const element = token.element.cloneNode(true);
    element.removeAttribute('id');
    element.removeAttribute('data-frame');
    element.removeAttribute('aria-label');
    element.setAttribute('aria-hidden', 'true');
    element.className = 'memory-token memory-moving-block';
    element.querySelector('.token-updated')?.remove();
    element.hidden = true;
    root.append(element);
    return element;
  };
  const outgoing = makeCopy(a);
  const movingOld = makeCopy(b);
  const movingNew = makeCopy(candidate);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('memory-flow');
  svg.setAttribute('aria-hidden', 'true');
  root.prepend(svg);
  const flows = [];
  const connect = (source,target,kind) => {
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.classList.add(kind);
    svg.append(path);
    flows.push({source,target,kind,path});
  };
  sinks.forEach(token => connect(candidate.element, token.element, 'global-flow'));
  connect(recent.element, get('comparison-c'), 'local-flow');
  connect(recent.element, get('comparison-a'), 'local-flow');
  [...sinks,a,b,recent].forEach(token => connect(token.element, current.element, 'generation-flow'));

  const positions = [[0,0],[1,1],[2,2],[80,15],[100,18],[101,19],[102,20]].map(([frame,position]) => {
    const element = document.createElement('b');
    const label = document.createElement('small');
    label.textContent = `F${frame}`;
    const value = document.createElement('span');
    value.textContent = position;
    element.append(label,value);
    get('memory-positions').append(element);
    return {element,label,value,frame,position};
  });

  // Offset coordinates exclude bobbing transforms and stay stable while resizing.
  const box = element => {
    let left = 0, top = 0;
    for (let node=element; node && node!==root; node=node.offsetParent) {
      left += node.offsetLeft; top += node.offsetTop;
    }
    return {left, top, width:element.offsetWidth, height:element.offsetHeight};
  };
  let geometry;
  const measure = () => {
    geometry = {a:box(a.element), b:box(b.element), candidate:box(candidate.element),
      comparisonA:box(get('comparison-a')), comparisonC:box(get('comparison-c'))};
    svg.setAttribute('viewBox', `0 0 ${root.clientWidth} ${root.clientHeight}`);
    flows.forEach(({source,target,path}) => {
      const from = box(source), to = box(target);
      const x1 = from.left+from.width/2, y1 = from.top+from.height+9;
      const x2 = to.left+to.width/2, y2 = to.top+to.height+9;
      const depth = Math.abs(y2-y1)>30 ? 12 : 32;
      path.setAttribute('d', `M${x1},${y1} C${x1},${y1+depth} ${x2},${y2+depth} ${x2},${y2}`);
    });
    [[outgoing,geometry.a],[movingOld,geometry.b],[movingNew,geometry.candidate]].forEach(([element,rect]) => {
      Object.assign(element.style, {left:`${rect.left}px`, top:`${rect.top}px`,
        width:`${rect.width}px`, height:`${rect.height}px`});
    });
  };
  const fly = (element,from,to,time,start,length) => {
    const p = clamp((time-start)/length), travel = ease(p);
    element.hidden = p===0 || p===1;
    const lift = Math.sin(Math.PI*travel)*34;
    element.style.transform = `translate(${(to.left-from.left)*travel}px,${(to.top-from.top)*travel-lift}px) rotate(${-5*Math.sin(Math.PI*travel)}deg)`;
    element.style.opacity = String(envelope(time,start,start+length,140));
  };
  const render = () => {
    if (!geometry) measure();
    const time = elapsed % cycleLength;
    root.dataset.phase = String(boundaries.findIndex(end => time<end));
    root.dataset.elapsed = elapsed.toFixed(1);
    const reset = ramp(time,14100,900);
    const commit = ramp(time,8400,350)*(1-reset);
    const global = envelope(time,1800,4200,500);
    const local = envelope(time,4200,6600,500);
    const mapping = ramp(time,9000,800)*(1-reset);
    const generated = ramp(time,11400,900)*(1-reset);
    const result = ramp(time,11800,650)*(1-reset);
    tokens.forEach((token,index) => {
      const bob = Math.sin(elapsed/640+index*.72);
      const scale = token===current ? 1+generated*.14 : 1;
      token.element.style.transform = `translateY(${bob*2.8}px) rotate(${bob*.65}deg) scale(${scale})`;
      const activity = sinks.includes(token) ? global : token===recent ? local :
        token===candidate ? Math.max(global,local) : token===current ? generated : local*.6;
      token.element.style.setProperty('--activity', activity.toFixed(3));
    });
    [a,b].forEach((token,index) => {
      const blend = index ? ramp(time,8500,350)*(1-reset) : commit;
      token.updated.style.opacity = String(blend);
      const frame = blend>.5 ? (index ? 100 : 80) : (index ? 80 : 40);
      if (token.element.dataset.frame !== String(frame)) {
        token.element.dataset.frame = String(frame);
        token.number.textContent = frame;
        token.element.setAttribute('aria-label', `Latent-frame index ${frame}`);
      }
      token.element.style.opacity = String(1-.88*envelope(time,index ? 6600 : 1800,index ? 8800 : 8700,260));
    });
    candidate.element.style.opacity = String(1-.72*ramp(time,2000,500)*(1-reset));
    current.element.style.setProperty('--noise-opacity', (1-generated).toFixed(3));
    current.element.style.setProperty('--noise-shift', `${elapsed/65}px`);
    fly(movingOld,geometry.b,geometry.a,time,6600,1900);
    if (time<6600) {
      const travel = ease((time-2000)/1400);
      const lift = Math.sin(Math.PI*travel)*24;
      movingNew.hidden = time<=2000;
      movingNew.style.opacity = String(ramp(time,2000,180));
      movingNew.style.transform = `translate(${(geometry.comparisonC.left-geometry.candidate.left)*travel}px,${(geometry.comparisonC.top-geometry.candidate.top)*travel-lift+Math.sin(elapsed/640)*2}px)`;
    } else {
      fly(movingNew,geometry.comparisonC,geometry.b,time,6600,2150);
      movingNew.hidden = time>=8750;
      movingNew.style.opacity = String(1-ramp(time,8590,160));
      movingNew.style.left = `${geometry.comparisonC.left}px`;
      movingNew.style.top = `${geometry.comparisonC.top}px`;
    }
    if (time<6600) {
      movingNew.style.left = `${geometry.candidate.left}px`;
      movingNew.style.top = `${geometry.candidate.top}px`;
    }
    const compareTravel = ease((time-1800)/1400);
    const exit = ease((time-6800)/900);
    outgoing.hidden = time<=1800 || time>=7700;
    outgoing.style.opacity = String((1-exit)*ramp(time,1800,180));
    outgoing.style.transform = `translate(${(geometry.comparisonA.left-geometry.a.left)*compareTravel-24*exit}px,${(geometry.comparisonA.top-geometry.a.top)*compareTravel-Math.sin(Math.PI*compareTravel)*24+Math.sin(elapsed/640)*2+34*exit}px) rotate(${-12*exit}deg)`;
    get('global-verdict').style.opacity = String(envelope(time,3300,7400,500));
    get('local-verdict').style.opacity = String(envelope(time,4700,7400,500));
    root.querySelectorAll('.comparison-entry').forEach(element => {
      element.style.opacity = String(1-ramp(time,7700,500)*(1-reset));
    });
    get('memory-result').style.opacity = String(result);
    get('memory-result').style.transform = `translateY(${(1-result)*12+Math.sin(elapsed/850)*1.5}px) scale(${.95+.05*result})`;
    flows.forEach(({kind,path},index) => {
      const activity = kind==='global-flow' ? global : kind==='local-flow' ? local : envelope(time,11400,13500,400);
      path.style.opacity = String(activity*.65);
      path.style.strokeDashoffset = String(-elapsed/38-index*8);
    });
    get('memory-positions').style.opacity = String(.35+.65*mapping);
    positions.forEach(({element,label,value,frame,position},index) => {
      const mapped = mapping>.5;
      const historical = index===3 ? Number(a.element.dataset.frame) : index===4 ? Number(b.element.dataset.frame) : frame;
      label.textContent = `F${historical}`;
      value.textContent = mapped ? position : historical;
      const wave = Math.sin(elapsed/700-index*.65);
      element.style.transform = `translateY(${wave*(1+mapping*2)}px)`;
      element.style.setProperty('--mapping', mapping.toFixed(3));
    });
  };
  const updateControls = () => {
    root.dataset.playing = String(canRun());
    const button = get('memory-toggle');
    button.innerHTML = `<i data-lucide="${running ? 'pause' : 'play'}"></i>`;
    button.setAttribute('aria-label', `${running ? 'Pause' : 'Play'} memory animation`);
    button.title = button.getAttribute('aria-label');
    icons();
  };
  const tick = timestamp => {
    if (!canRun()) { lastTime = undefined; return; }
    if (lastTime!==undefined) elapsed += Math.min(timestamp-lastTime,80);
    lastTime = timestamp;
    render();
    ticker = requestAnimationFrame(tick);
  };
  const schedule = () => {
    cancelAnimationFrame(ticker);
    lastTime = undefined;
    updateControls();
    if (canRun()) ticker = requestAnimationFrame(tick);
  };
  get('memory-toggle').addEventListener('click', () => { running = !running; schedule(); });
  get('memory-reset').addEventListener('click', () => { elapsed=0; render(); schedule(); });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, {threshold:.15});
  observer.observe(root);
  const resize = new ResizeObserver(() => { measure(); render(); });
  resize.observe(root);
  reducedMotion.addEventListener('change', event => {
    running = !event.matches;
    schedule();
  });
  render(); updateControls();
  return {schedule};
};
