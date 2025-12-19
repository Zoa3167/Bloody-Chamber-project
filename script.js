const root = document.documentElement;
const sceneEl = document.getElementById('scene');
const toastEl = document.getElementById('toast');
const ending2Btn = document.getElementById('ending2-button');
const realizationWarning = document.getElementById('realization-warning');
const safetyWarning = document.getElementById('safety-warning');
const topBarEl = document.querySelector('.top-bar');
const floatingHud = document.querySelector('.floating-hud');

const endings = {
  ending0: {
    label: 'Ending 0',
    title: 'Discovered',
    text: 'The Marquise has discovered what you are doing, without outside aid, you did not escape your fate of decapitation.',
    image: 'ImageE0.png',
  },
  ending1: {
    label: 'Ending 1',
    title: 'Rejected the Marriage',
    text: 'You have rejected the marriage. Your family is poor, and society calls you disloyal. You start a bakery on the southern streets, striving for independence to keep yourself from starvation while you wait for change.',
    image: 'ImageE1.png',
  },
  ending2: {
    label: 'Ending 2',
    title: 'Confrontation',
    text: 'You decide the Marquise will not get away with his evil. You work with the piano tuner and hang the piano above the main door. When the Marquise returns, you release it and kill him. You inherit everything and enjoy a greater life in the castle.',
    image: 'Iamge E2.png',
  },
  ending3: {
    label: 'Ending 3',
    title: 'Trapped',
    text: 'You have failed to see the real picture. You lose control of your life in this patriarchal society and become a leaf swept away by the stream, trapped in the castle forever with the Marquise.',
    image: 'Image E3.png',
  },
  ending5: {
    label: 'Ending 5',
    title: 'Escape Fails',
    text: 'You escaped the castle, but the servants surround you. The village authorities are controlled by the Marquise. He returns, and you do not escape decapitation.',
    image: 'Image E5.png',
  },
  ending6: {
    label: 'Ending 6',
    title: 'Mother\'s Rescue',
    text: 'The Marquise discovers you, but your mother rides to the gate. As he raises his sword, your mother shoots him in the head.',
    image: 'Image E6.png',
  },
};

const state = {
  realization: 70,
  safety: 100,
  scene: 'station',
  gameEnded: false,
  endingsSeen: new Set(),
  totalEndings: Object.keys(endings).length,
};

const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

function setBackground(imagePath) {
  if (!imagePath) return;
  const safePath = encodeURI(imagePath);
  root.style.setProperty('--bg-image', `url('${safePath}')`);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => toastEl.classList.add('hidden'), 2400);
}

function setChromeVisible(show) {
  if (floatingHud) {
    floatingHud.classList.toggle('hidden', !show);
  }
  if (topBarEl) {
    topBarEl.classList.toggle('hidden', !show);
  }
}

function updateHud() {
  const realizationBar = document.getElementById('realization-bar');
  const safetyBar = document.getElementById('safety-bar');
  document.getElementById('realization-value').textContent = state.realization;
  document.getElementById('safety-value').textContent = state.safety;
  realizationBar.style.width = `${state.realization}%`;
  safetyBar.style.width = `${state.safety}%`;

  if (state.realization < 50 && state.realization > 0) {
    realizationWarning.classList.remove('hidden');
  } else {
    realizationWarning.classList.add('hidden');
  }

  if (state.safety < 50 && state.safety > 0) {
    safetyWarning.classList.remove('hidden');
  } else {
    safetyWarning.classList.add('hidden');
  }

  if (!state.gameEnded && state.realization >= 100) {
    ending2Btn.classList.remove('hidden');
  } else {
    ending2Btn.classList.add('hidden');
  }
}

function adjustRealization(delta) {
  state.realization = clamp(state.realization + delta);
  updateHud();
  checkAutoTriggers();
}

function adjustSafety(delta) {
  state.safety = clamp(state.safety + delta);
  updateHud();
  checkAutoTriggers();
}

function checkAutoTriggers() {
  if (state.gameEnded) return;
  if (state.realization <= 0) {
    triggerEnding('ending3');
    return;
  }
  if (state.safety <= 0) {
    triggerEnding('ending0');
  }
}

function renderChoiceScene({ id, title, display, options, background, footerButtons = [] }) {
  if (state.gameEnded) return;
  setChromeVisible(true);
  state.scene = id;
  setBackground(background);
  const card = document.createElement('section');
  card.className = 'scene-card';

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  meta.innerHTML = `<span class="eyebrow">${title}</span><span class="pill">Story</span>`;
  card.appendChild(meta);

  const h2 = document.createElement('h2');
  h2.className = 'scene-title';
  h2.textContent = title;
  card.appendChild(h2);

  display.forEach((line) => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.textContent = line;
    card.appendChild(p);
  });

  const choiceWrap = document.createElement('div');
  choiceWrap.className = 'choices';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      opt.onChoose();
    });
    choiceWrap.appendChild(btn);
  });
  card.appendChild(choiceWrap);

  if (footerButtons.length) {
    const footer = document.createElement('div');
    footer.style.marginTop = '14px';
    footer.style.display = 'flex';
    footer.style.gap = '10px';
    footerButtons.forEach((f) => {
      const btn = document.createElement('button');
      btn.className = 'pill';
      btn.type = 'button';
      btn.textContent = f.label;
      btn.addEventListener('click', f.onClick);
      footer.appendChild(btn);
    });
    card.appendChild(footer);
  }

  sceneEl.innerHTML = '';
  sceneEl.appendChild(card);
}

function renderMap() {
  if (state.gameEnded) return;
  setChromeVisible(true);
  state.scene = 'map';
  setBackground('Image2.png');

  const card = document.createElement('section');
  card.className = 'scene-card';

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  meta.innerHTML = `<span class="eyebrow">Exploration</span><span class="pill">Castle Map</span>`;
  card.appendChild(meta);

  const h2 = document.createElement('h2');
  h2.className = 'scene-title';
  h2.textContent = 'The Marquise Has Left the House';
  card.appendChild(h2);

  const intro = document.createElement('p');
  intro.className = 'scene-text';
  intro.textContent = 'He handed over all the keys of the castle but forbade you to use the "forbidden key." You are now free to explore the castle. Places to be explored:';
  card.appendChild(intro);

  const map = document.createElement('div');
  map.className = 'map';

  const tiles = document.createElement('div');
  tiles.className = 'map-tiles';

  const rooms = [
    { label: 'Storage Room', image: 'image4.png', action: renderStorageRoom },
    { label: "Marquise's Office", image: 'image5.png', action: renderOffice },
    { label: 'Piano Room', image: 'image6.png', action: renderPianoRoom },
    { label: 'Forbidden Key', image: 'Image7.png', action: renderForbiddenKey },
  ];

  rooms.forEach((room) => {
    const tile = document.createElement('button');
    tile.className = 'map-tile';
    tile.type = 'button';
    tile.style.setProperty('--tile-image', `url('${encodeURI(room.image)}')`);
    tile.innerHTML = `<div class="label">${room.label}</div>`;
    tile.addEventListener('click', room.action);
    tiles.appendChild(tile);
  });

  map.appendChild(tiles);
  card.appendChild(map);

  sceneEl.innerHTML = '';
  sceneEl.appendChild(card);
}

function renderStorageRoom() {
  renderChoiceScene({
    id: 'storage',
    title: 'Storage Room',
    background: 'image4.png',
    display: [
      'You open the storage room. Gold, jewelry, and luxurious furniture glitter around you.',
      'What will you do?',
    ],
    options: [
      {
        label: '"This is what I am here for, my destination my destiny." You pick up some jewelry.',
        onChoose: () => {
          adjustRealization(-20);
          adjustSafety(-15);
          renderMap();
        },
      },
      {
        label: '"Wow, this is nice." You close the door and walk out.',
        onChoose: () => {
          adjustRealization(-20);
          renderMap();
        },
      },
      {
        label: '"Is this the only thing I am aiming for?" You leave in doubt.',
        onChoose: () => {
          adjustRealization(10);
          renderMap();
        },
      },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderOffice() {
  renderChoiceScene({
    id: 'office',
    title: "Marquise's Office",
    background: 'image5.png',
    display: [
      "You enter the Marquise's office, full of luxurious objects.",
      'Please select your action.',
    ],
    options: [
      { label: 'Open the drawer labeled "stuff".', onChoose: renderOfficeDrawerStuff },
      { label: 'Open the drawer labeled "personal".', onChoose: renderOfficeDrawerPersonal },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderOfficeDrawerStuff() {
  renderChoiceScene({
    id: 'office-stuff',
    title: 'Office Drawer - Stuff',
    background: 'image10.png',
    display: ['This drawer is filled with jewelry. Your decision?'],
    options: [
      {
        label: 'Take some jewelry.',
        onChoose: () => {
          adjustRealization(-20);
          adjustSafety(-15);
          renderOffice();
        },
      },
      {
        label: 'Close the drawer and doubt where the jewelry is coming from.',
        onChoose: () => {
          adjustRealization(10);
          renderOffice();
        },
      },
    ],
    footerButtons: [{ label: 'Back to Office', onClick: renderOffice }],
  });
}

function renderOfficeDrawerPersonal() {
  renderChoiceScene({
    id: 'office-personal',
    title: 'Office Drawer - Personal',
    background: 'image11.png',
    display: [
      'You find files describing Romanian countesses, apparently past wives of the Marquise.',
      'What do you want to do now?',
    ],
    options: [
      {
        label: '"This man is too disloyal; I will not give him my real emotions."',
        onChoose: () => {
          adjustRealization(10);
          renderOffice();
        },
      },
      {
        label: '"What happened to those wives? This is too scary!" Escape the castle.',
        onChoose: () => triggerEnding('ending5'),
      },
      {
        label: '"He must be rich and powerful to attract so many women! I will prosper here for sure!"',
        onChoose: () => {
          adjustRealization(-20);
          renderOffice();
        },
      },
    ],
    footerButtons: [{ label: 'Back to Office', onClick: renderOffice }],
  });
}

function renderForbiddenKey() {
  renderChoiceScene({
    id: 'forbidden-key',
    title: 'Forbidden Key',
    background: 'Image7.png',
    display: ['Do you really want to use this key? The Marquise forbade you from using it!'],
    options: [
      {
        label: 'Yes',
        onChoose: () => {
          adjustSafety(-60);
          renderKeyChamber();
        },
      },
      { label: 'No', onChoose: () => triggerEnding('ending3') },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderKeyChamber() {
  renderChoiceScene({
    id: 'bloody-chamber',
    title: 'The Bloody Chamber',
    background: 'Image BC.png',
    display: [
      'You have entered the bloody chamber - hell itself. Torture devices fill the room: an iron maiden, wheels, and more.',
      'Three of the Marquise\'s wives remain: one in a coffin, one reduced to a skull, and one pierced with hundreds of spikes.',
    ],
    options: [
      { label: 'Panic, exit the chamber, and flee the castle.', onChoose: () => triggerEnding('ending5') },
      {
        label: 'Run to call your mother and tell her everything.',
        onChoose: () => {
          showToast('The phone is offline.');
          renderKeyChamber();
        },
      },
      { label: 'Run into the piano room to calm your nerves.', onChoose: renderPianoRoom },
      { label: 'Investigate the room more.', onChoose: () => triggerEnding('ending0') },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderPianoRoom() {
  renderChoiceScene({
    id: 'piano-room',
    title: 'Piano Room',
    background: 'image6.png',
    display: [
      'You enter a large hall with a piano in the center. A blind piano tuner has just tuned it.',
    ],
    options: [
      {
        label: 'Play the piano.',
        onChoose: () => {
          adjustSafety(20);
          showToast('You feel a little safer after playing.');
        },
      },
      { label: 'Talk to the piano tuner.', onChoose: renderPianoDialogue },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderPianoDialogue() {
  if (state.gameEnded) return;
  setChromeVisible(true);
  state.scene = 'piano-dialogue';
  setBackground('image13.png');

  const card = document.createElement('section');
  card.className = 'scene-card';

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  meta.innerHTML = `<span class="eyebrow">Piano Room</span><span class="pill">Dialogue</span>`;
  card.appendChild(meta);

  const h2 = document.createElement('h2');
  h2.className = 'scene-title';
  h2.textContent = 'Conversation with the Piano Tuner';
  card.appendChild(h2);

  const lines = [
    'Piano Tuner: "Have you been to the Chamber?"',
    'Girl: (choose Yes or No)',
  ];

  lines.forEach((line) => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.textContent = line;
    card.appendChild(p);
  });

  const question = document.createElement('div');
  question.className = 'choices';

  const followUp = document.createElement('div');
  followUp.className = 'choices hidden';

  const yesBtn = document.createElement('button');
  yesBtn.className = 'choice';
  yesBtn.type = 'button';
  yesBtn.textContent = 'Yes';
  yesBtn.addEventListener('click', () => {
    if (!followUp.classList.contains('hidden')) return;
    const info = document.createElement('p');
    info.className = 'scene-text';
    info.textContent =
      'Piano tuner: "There was a Marquise who hunted women with dogs. Their children inherited this practice. You should flee this place."';
    card.insertBefore(info, followUp);
    followUp.classList.remove('hidden');
  });

  const noBtn = document.createElement('button');
  noBtn.className = 'choice';
  noBtn.type = 'button';
  noBtn.textContent = 'No';
  noBtn.addEventListener('click', () => {
    showToast('The conversation ends. You leave the tuner be.');
    renderPianoRoom();
  });

  question.appendChild(yesBtn);
  question.appendChild(noBtn);
  card.appendChild(question);

  [
    { label: 'Run away with the piano tuner.', onChoose: () => triggerEnding('ending5') },
    { label: 'The Marquise needs to pay for this!', onChoose: () => triggerEnding('ending2') },
    { label: 'Wait to see what happens next.', onChoose: () => triggerEnding('ending6') },
  ].forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.type = 'button';
    btn.textContent = opt.label;
    btn.addEventListener('click', opt.onChoose);
    followUp.appendChild(btn);
  });

  card.appendChild(followUp);

  const footer = document.createElement('div');
  footer.style.marginTop = '14px';
  const exitBtn = document.createElement('button');
  exitBtn.className = 'pill';
  exitBtn.type = 'button';
  exitBtn.textContent = 'Back to Piano Room';
  exitBtn.addEventListener('click', renderPianoRoom);
  footer.appendChild(exitBtn);
  card.appendChild(footer);

  sceneEl.innerHTML = '';
  sceneEl.appendChild(card);
}

function renderEnding(key) {
  const ending = endings[key];
  if (!ending) return;
  state.gameEnded = true;
  state.scene = key;
  state.endingsSeen.add(key);
  setChromeVisible(true);
  setBackground(ending.image);

  const card = document.createElement('section');
  card.className = 'ending-card';

  const meta = document.createElement('div');
  meta.className = 'scene-meta';
  meta.innerHTML = `<span class="eyebrow">${ending.label}</span><span class="pill">Finale</span>`;
  card.appendChild(meta);

  const h2 = document.createElement('h2');
  h2.textContent = ending.title;
  card.appendChild(h2);

  const p = document.createElement('p');
  p.textContent = ending.text;
  card.appendChild(p);

  const remaining = state.totalEndings - state.endingsSeen.size;
  const remainNote = document.createElement('p');
  remainNote.className = 'ending-remaining';
  remainNote.textContent =
    remaining > 0
      ? `${remaining} other endings are left to discover.`
      : 'You have uncovered every ending.';
  card.appendChild(remainNote);

  const restart = document.createElement('button');
  restart.className = 'restart';
  restart.type = 'button';
  restart.textContent = 'Restart from the station';
  restart.addEventListener('click', restartGame);
  card.appendChild(restart);

  sceneEl.innerHTML = '';
  sceneEl.appendChild(card);
  updateHud();
}

function triggerEnding(key) {
  if (state.gameEnded) return;
  renderEnding(key);
}

function restartGame() {
  state.realization = 70;
  state.safety = 100;
  state.gameEnded = false;
  setChromeVisible(true);
  updateHud();
  renderStation();
}

function renderStation() {
  setChromeVisible(true);
  renderChoiceScene({
    id: 'station',
    title: 'At the Station',
    background: 'Image1.png',
    display: [
      'After waking up this morning, you realized you have become a young girl at the Paris train station.',
      'In your hands lies a marriage agreement with a rich, famous Marquise who lives on a nearby island. You decided to:',
    ],
    options: [
      { label: 'Step on the train.', onChoose: renderCastle },
      { label: 'Tear off the agreement and reject the marriage.', onChoose: () => triggerEnding('ending1') },
    ],
  });
}

function renderCastle() {
  renderChoiceScene({
    id: 'castle',
    title: 'In Front of the Castle',
    background: 'Image2.png',
    display: [
      'You arrive at the Marquise\'s big and luxurious castle - perhaps a magic place.',
      'What are you thinking now?',
    ],
    options: [
      {
        label: 'Gain wealth, escape poverty, and pass on the riches to your heir.',
        onChoose: () => {
          adjustRealization(-20);
          renderMarquise();
        },
      },
      {
        label: 'This place looks isolated and creepy; I need to be careful.',
        onChoose: () => {
          adjustRealization(10);
          renderMarquise();
        },
      },
    ],
  });
}

function renderMarquise() {
  renderChoiceScene({
    id: 'marquise',
    title: 'The Marquise',
    background: 'image3.png',
    display: [
      'You meet the Marquise, a big old man who sneaks up with flowers and observes you like "a connoisseur inspecting horse flesh" in the mirrors of his bedroom.',
      'How do you think about the Marquise?',
    ],
    options: [
      {
        label: '"This is my husband; I am staying with him my entire life."',
        onChoose: () => {
          adjustRealization(-50);
          renderMap();
        },
      },
      {
        label: '"He seems good but weird... never mind, he\'s rich!"',
        onChoose: () => {
          adjustRealization(-20);
          renderMap();
        },
      },
      {
        label: '"He is weird; why does he observe me all the time? His control is too strong!"',
        onChoose: () => {
          adjustRealization(10);
          renderMap();
        },
      },
    ],
  });
}

ending2Btn.addEventListener('click', () => triggerEnding('ending2'));

updateHud();
renderHome();

function renderHome() {
  state.scene = 'home';
  state.gameEnded = false;
  setChromeVisible(false);
  setBackground('Imagex.png');

  const card = document.createElement('section');
  card.className = 'home-card';

  const title = document.createElement('h1');
  title.className = 'home-title';
  title.textContent = 'Bloody Chamber game';
  card.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'home-sub';
  sub.textContent = 'Jackey Games';
  card.appendChild(sub);

  const actions = document.createElement('div');
  actions.className = 'home-actions';

  const startBtn = document.createElement('button');
  startBtn.className = 'home-btn primary';
  startBtn.type = 'button';
  startBtn.textContent = 'Start Game';
  startBtn.addEventListener('click', restartGame);
  actions.appendChild(startBtn);

  const introBtn = document.createElement('button');
  introBtn.className = 'home-btn ghost';
  introBtn.type = 'button';
  introBtn.textContent = 'Introduction';
  actions.appendChild(introBtn);

  const introText = document.createElement('div');
  introText.className = 'home-intro hidden';
  introText.textContent =
    'Welcome to the bloody chamber game. In this game you will become the girl and walk your own journey through the Marquise\'s castle. As you play the game you need to make choices of your actions. Each of your actions will lead to changes in your realization and safety levels, please do not make them reach zero or even below 50! Aim to increase your realization levels into 100, some interesting things will happen. Have fun and enjoy the journey!';
  introBtn.addEventListener('click', () => {
    introText.classList.toggle('hidden');
  });

  card.appendChild(actions);
  card.appendChild(introText);

  sceneEl.innerHTML = '';
  sceneEl.appendChild(card);
}
