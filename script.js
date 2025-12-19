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
    title: 'Ending 0',
    text: 'The Marquise has discovered what you are doing, without outside aid, you did not escape your fate of decapitation.',
    image: 'ImageE0.png',
  },
  ending1: {
    label: 'Ending 1',
    title: 'Ending 1',
    text: "You have rejected the marriage. But what's next? Your family's poor after your father's death, yourself, as a women , does not has the ability to sustain yourself. However, due to the rejection, other men start to view you as a disloyal wife. Nobody wants to marry you, you can adhere to none, you started a bakery at the southern streets, you strived for independence, but the best thing you can do is to sustain yourself from starvation, until someday the change come.",
    image: 'ImageE1.png',
  },
  ending2: {
    label: 'Ending 2',
    title: 'Ending 2',
    text: 'You decided that the men should not be able to get away with the evil they committed. You worked with the piano tuner and hanged the piano up the main door of the castle. When the marquise came back, you released the piano and killed him. You inherit all his property and enjoyed a great life in the castle',
    image: 'Iamge E2.png',
  },
  ending3: {
    label: 'Ending 3',
    title: 'Ending 3',
    text: 'You have failed to see the real picture. You lost control of your life in this patriarchal society and become the leaf that went off with the flowing stream. You are trapped into the castle forever with the marquise.',
    image: 'Image E3.png',
  },
  ending5: {
    label: 'Ending 5',
    title: 'Ending 5',
    text: 'You escaped the castle. The moment you stepped out you regretted, the servants of the Marquise are waiting for you outside, they surrounded you. You broke out into the village and tried to report the Marquise, however you discovered that the entire village\'s authorities are controlled by the Marquise. The Marquise returned and you did not escape your fate of decapitation.',
    image: 'Image E5.png',
  },
  ending6: {
    label: 'Ending 6',
    title: 'Ending 6',
    text: 'You got discovered by the Marquise, However, your mother knew what was going to happen, she arrived the gate with her horse, as the Marquise raises his sword and ready to decapitate you, your mother shot him in the head.',
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
  intro.textContent = 'The Marquise Has left the house, he handed over to you all of the keys of the castle, but he forbade you to use the "forbidden key". You are now free to explore the Castle Places to be explored:';
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
      'You now opened the storage rooms of the castle. In front of you are all of the gold, jewelry, and luxurious furniture of the Marquise. What will you do?',
    ],
    options: [
      {
        label: 'This is what I am here for, my destination my destiny. You picked up some Jewelry and start to dream of the future.',
        onChoose: () => {
          adjustRealization(-20);
          adjustSafety(-15);
          renderMap();
        },
      },
      {
        label: 'Wow, this is nice. You closed the door and went out',
        onChoose: () => {
          adjustRealization(-20);
          renderMap();
        },
      },
      {
        label: 'This looks good, but is this the only thing I am aiming for in my life. You close the door and left in doubt',
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
      'You have now entered the Marquise\'s office. A place full of luxurious products. Please select your action.',
    ],
    options: [
      { label: 'Open the drawer saying "stuff".', onChoose: renderOfficeDrawerStuff },
      { label: 'Open the drawer saying "personal"', onChoose: renderOfficeDrawerPersonal },
    ],
    footerButtons: [{ label: 'Exit to Map', onClick: renderMap }],
  });
}

function renderOfficeDrawerStuff() {
  renderChoiceScene({
    id: 'office-stuff',
    title: 'Office Drawer - Stuff',
    background: 'image10.png',
    display: ['This drawer is filled with Jewelry. Your decision?'],
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
      "this drawer has some files. You took a look and discovered it was the description of some Romanian countess, looks like they were the Marquise's past wives. What do you want to do now?",
    ],
    options: [
      {
        label: 'This man is too disloyal, I just not give him my real emotions.',
        onChoose: () => {
          adjustRealization(10);
          renderOffice();
        },
      },
      {
        label: 'What happened to those wives? Do they fled the marquise because of something, or is it something else? This is too scary! You escaped the castle.',
        onChoose: () => triggerEnding('ending5'),
      },
      {
        label: 'Wow, this men has to be so rich and powerful to attract this many women to follow him! I will prosper here for sure!',
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
    display: ['Do you really want to use this key? The Marquise forbades you from using it!'],
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
      'You have entered the bloody chamber, or in other words, hell. The chamber was filled with plenty of torturing devices including an iron Maiden and some wheels. Three of the wives of marquise lies there, the first in a coffin, second only have skull remaining, and the third pierced with hundreds of spikes.',
    ],
    options: [
      { label: 'You panically exit the chamber and fled the castle.', onChoose: () => triggerEnding('ending5') },
      {
        label: 'You ran away panically to call your mother, deciding to tell her all of this.',
        onChoose: () => {
          showToast('The phone is offline.');
          renderKeyChamber();
        },
      },
      { label: 'You ran into the piano room, attempting to calm down your nerves.', onChoose: renderPianoRoom },
      { label: 'You decided to investigate the room more.', onChoose: () => triggerEnding('ending0') },
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
      'You have now entered the Piano room, a large hall with a piano in the center. On the side stood a blind piano tuner, he has just tuned the piano.',
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
    'Piano Tuner:Have you been to the Chamber?',
    'Girl: (User choose between Yes or No, if yes then continue, if no then end conversation.)',
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
      'Piano tuner:"There was a Marquise that used to hunt women with dogs in his castle, later on their children inherited this practice and continued this torture. You should flee this place"';
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
    { label: 'Runaway with the piano tuner.', onChoose: () => triggerEnding('ending5') },
    { label: 'The Marquise need to pay for this!', onChoose: () => triggerEnding('ending2') },
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
      'After waking up this morning, you realized you have became a young girl at Paris train station. In your hands lies a marriage agreement with a rich, famous Marquise who lives on the nearby island. You decided to:',
    ],
    options: [
      { label: 'Step on the train', onChoose: renderCastle },
      { label: 'Tear off the agreement and reject the Marriage', onChoose: () => triggerEnding('ending1') },
    ],
  });
}

function renderCastle() {
  renderChoiceScene({
    id: 'castle',
    title: 'In Front of the Castle',
    background: 'Image2.png',
    display: [
      'You have arrived at the marquise\'s big and luxurious castle, in your mind this might be the magic place .',
      'What are you thinking now:',
    ],
    options: [
      {
        label: 'This is the place for me to gain wealth, get out of that spectra of poverty, and pass on the wealth to my heir.',
        onChoose: () => {
          adjustRealization(-20);
          renderMarquise();
        },
      },
      {
        label: 'This place looks isolated and creepy, I need to be careful.',
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
      'You met the marquise, a big old men who likes to sneak up at you with flowers and observe you like "a connoisseur inspecting horse flesh" inside the many mirrors inside his bedroom. How do you think about the marquise?',
    ],
    options: [
      {
        label: 'This is my husband I am staying with my entire life.',
        onChoose: () => {
          adjustRealization(-50);
          renderMap();
        },
      },
      {
        label: 'This men seems to be good, but he is weird..., never mind HE\'S RICH!!!',
        onChoose: () => {
          adjustRealization(-20);
          renderMap();
        },
      },
      {
        label: 'This men is weird, why he wants to observe me all the time. His sense of control is far too strong!',
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
