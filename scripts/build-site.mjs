import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const legacyLong = fs.readFileSync(path.join(root, 'content-plan/long-videos/v1/production-studio.html'), 'utf8');
const legacyShorts = fs.readFileSync(path.join(root, 'content-plan/shorts/week-1/shorts-studio.html'), 'utf8');

const clean = (value = '') => value
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\r/g, '')
  .trim();

const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const matches = (html, regex) => [...html.matchAll(regex)].map(match => clean(match[1]));
const words = text => (text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)?/g) || []).length;
const durationFor = text => Math.round(words(text) / 145 * 60);
const pad = value => String(value).padStart(2, '0');
const clock = seconds => `${Math.floor(seconds / 60)}:${pad(Math.floor(seconds % 60))}`;
const makeDir = dir => fs.mkdirSync(path.join(root, dir), { recursive: true });
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.trimStart(), 'utf8');
};

let longScript = clean(legacyLong.match(/<p class="full-script-text"[^>]*>([\s\S]*?)<\/p>/)?.[1] || '');
longScript = longScript
  .replace('The entire United States, China, India, and almost all of Western Europe could sit inside Africa simultaneously with room to spare.', 'The United States, China, and India could sit inside Africa together, with millions of square kilometres still remaining.')
  .replace('This was not an accident or a printing error—it was a calculated mathematical decision made in 1569 that we still use every single day.', 'This was not an accident or a printing error. It was a deliberate mathematical compromise made in fifteen sixty nine that still shapes maps today.')
  .replace('In 1828, mathematician Carl Friedrich Gauss proved that no sphere can ever be flattened without stretching, tearing, or shrinking its surface.', 'Mathematics places a hard limit here. A curved surface cannot be flattened without changing distance, shape, direction, or area somewhere.')
  .replace('At the equator where Africa sits, distortion is zero percent.', 'Along the equator, Mercator scale is true.')
  .replace('In 2005, when Google built Google Maps, they had dozens of accurate world projections to pick. They deliberately chose Web Mercator.', 'Google Maps launched in two thousand five using a web version of Mercator, a projection already common in online mapping.')
  .replace('On an equal-area map, every city intersection in New York or London would appear skewed into an angled diamond.', 'A conformal map preserves local angles, so small shapes such as street intersections remain familiar. An equal-area map preserves area instead and must allow more local shape distortion.')
  .replace('A 450-year-old sailing trick became the digital operating system of modern GPS.', 'A four hundred and fifty year old sailing trick became the map display beneath modern navigation screens.')
  .replace('Today, the Equal Earth projection gives every continent its true proportions without distorting shapes, and Google Maps seamlessly switches into a 3D rotating globe once you zoom out.', 'Today, the Equal Earth projection preserves relative areas while keeping continental shapes recognizable, although no flat map removes every distortion. Digital globes can show the round Earth directly when a user zooms out.');

const longPrompts = matches(legacyLong, /<pre class="prompt-code-box"><code>([\s\S]*?)<\/code><\/pre>/g);
const longCues = matches(legacyLong, /<p class="cut-point-instruction">([\s\S]*?)<\/p>/g);
if (longPrompts.length !== 27 || longCues.length !== 27) throw new Error('Expected 27 long prompts and cues');
longCues[20] = 'Jab voiceover bole: "two hundred and fifty six pixel square tiles" → Theek yahan v1-clip-22.mp4 lagayein.';
longCues[22] = 'Jab voiceover bole: "modern navigation screens" → Theek yahan v1-clip-24.mp4 lagayein.';
longCues[23] = 'Jab voiceover bole: "continental shapes recognizable" → Theek yahan v1-clip-25.mp4 lagayein.';

const shortPrompts = matches(legacyShorts, /<pre class="prompt-code-box"><code>([\s\S]*?)<\/code><\/pre>/g);
if (shortPrompts.length !== 10) throw new Error('Expected 10 legacy short prompts');

const shortOneScript = `Greenland is not the size of Africa. Africa can hold Greenland about fourteen times. Africa covers roughly thirty point three million square kilometres. Greenland covers about two point one seven million. A Mercator wall map makes them look like near twins because it preserves local angles, not area. That choice was useful for sailors in fifteen sixty nine. A straight line on Mercator could represent a constant compass bearing across an ocean. The tradeoff grows toward the poles. At sixty degrees north, the map's area scale is about four times the scale at the equator. Greenland expands on the page while equatorial Africa stays comparatively restrained. The projection is not a photograph and it was never designed to compare continent sizes. It is a navigation tool being asked to do a different job.`;

const shortTwoScript = `Your phone's map display uses a modern form of a projection created for sailors in fifteen sixty nine. Mercator preserved local angles, which made a straight line useful as a constant compass bearing. The same property helps small street shapes remain familiar on a digital map. Google Maps converts locations into Mercator world coordinates, then divides the result into square image tiles. At the first zoom level, the usable world fits into a base tile that is two hundred and fifty six pixels wide. Each higher zoom level divides the map into more tiles, so the screen requests only the pieces it needs. The satellite positioning system calculates location independently. Mercator controls how that location is drawn on the flat screen. An old maritime geometry survives inside a modern interface because it still performs one specific job well.`;

const shortThreeScript = `A globe cannot be flattened into a perfect map. Imagine cutting an orange peel and pressing it onto a table. The peel must tear, overlap, or stretch before it lies flat. Earth creates the same problem. Every world map chooses which property to protect and which distortion to accept. Mercator protects local angles, which helps navigation, but enlarges high latitudes. Equal area projections protect relative size, but shapes bend more as they move away from favored regions. Equal Earth was designed to preserve area while keeping continents visually familiar. It still cannot preserve every distance, direction, and shape at once. A globe avoids the flattening problem, but it cannot show the entire planet on one sheet. There is no single correct world map. There are only projections built for different tasks.`;

const thirdPrompts = [
  'Create an 8-second vertical 9:16 photorealistic geography documentary clip. A detailed blue planet Earth rotates slowly in deep space while a translucent flat sheet appears beside it, emphasizing sphere versus plane, natural atmospheric glow, smooth camera drift, no text, no labels, no watermark.',
  'Create an 8-second vertical 9:16 macro documentary clip. Human hands carefully cut a fresh orange peel and press the curved peel onto a dark wooden table; the peel naturally tears and overlaps as it flattens, soft window light, precise overhead camera, photorealistic, no text.',
  'Create an 8-second vertical 9:16 museum visualization. Three unlabeled world map sheets float side by side, one preserving shape, one preserving relative area, one preserving direction; each sheet subtly bends and transforms while a globe remains behind them, warm gallery lighting, no text.',
  'Create an 8-second vertical 9:16 scientific animation. A glowing Earth sphere sits inside a transparent cylinder as light rays project the curved surface onto the cylinder, polar regions stretching upward, slow clean orbit, cinematic cyan and amber lighting, no text.',
  'Create an 8-second vertical 9:16 cartographic documentary clip. A modern equal-area world map unrolls across a walnut table, continent areas balanced and recognizable, curved outer edges suggesting a globe, soft museum lighting, no readable labels, no watermark.',
  'Create an 8-second vertical 9:16 cinematic finale. Camera pulls away from a collection of different flat world maps toward a single rotating globe suspended in a dark observatory, sunrise crossing Earth, contemplative geography documentary mood, no text, no watermark.'
];

const sources = [
  { title: 'African Union — The True Size of Africa', url: 'https://au.int/sites/default/files/documents/44438-doc-AUE_2024_English_2.pdf' },
  { title: 'United Nations Statistics — Greenland surface area', url: 'https://unstats.un.org/unsd/publications/pocketbook/files/world-stats-pocketbook-2024.pdf' },
  { title: 'Google Maps — Map and tile coordinates', url: 'https://developers.google.com/maps/documentation/javascript/coordinates' },
  { title: 'Google Maps — Projection documentation', url: 'https://developers.google.com/maps/documentation/javascript/maptypes' },
  { title: 'PROJ — Equal Earth projection', url: 'https://proj.org/en/stable/operations/projections/eqearth.html' }
];

const makeClips = (prompts, cues, prefix, duration) => prompts.map((prompt, index) => ({
  number: index + 1,
  filename: `${prefix}-clip-${pad(index + 1)}.mp4`,
  predicted_start_seconds: Number((index * duration / prompts.length).toFixed(1)),
  prompt,
  cut_cue: cues[index] || 'Short khatam → End screen lagayein.'
}));

const longDuration = durationFor(longScript);
const longData = {
  week: '01',
  title: "Every Map You've Seen Is Lying About Africa",
  format: 'YouTube long — Google Flow 16:9 + separate voiceover',
  script: longScript,
  word_count: words(longScript),
  predicted_duration_seconds: longDuration,
  clips: makeClips(longPrompts, longCues, 'v1', longDuration),
  sources
};

const shorts = [
  {
    week: '01', number: 1, title: 'Greenland Is Not the Size of Africa', script: shortOneScript,
    prompts: shortPrompts.slice(0, 5),
    cues: [
      'Jab voiceover bole: "about fourteen times" → s1a-clip-02.mp4 lagayein.',
      'Jab voiceover bole: "two point one seven million" → s1a-clip-03.mp4 lagayein.',
      'Jab voiceover bole: "constant compass bearing" → s1a-clip-04.mp4 lagayein.',
      'Jab voiceover bole: "four times the scale at the equator" → s1a-clip-05.mp4 lagayein.',
      'Short khatam → End screen lagayein.'
    ], prefix: 's1a'
  },
  {
    week: '01', number: 2, title: 'Why Your Phone Map Still Uses Mercator', script: shortTwoScript,
    prompts: shortPrompts.slice(5, 10),
    cues: [
      'Jab voiceover bole: "fifteen sixty nine" → s1b-clip-02.mp4 lagayein.',
      'Jab voiceover bole: "remain familiar" → s1b-clip-03.mp4 lagayein.',
      'Jab voiceover bole: "square image tiles" → s1b-clip-04.mp4 lagayein.',
      'Jab voiceover bole: "only the pieces it needs" → s1b-clip-05.mp4 lagayein.',
      'Short khatam → End screen lagayein.'
    ], prefix: 's1b'
  },
  {
    week: '01', number: 3, title: 'No Flat World Map Can Be Perfect', script: shortThreeScript,
    prompts: thirdPrompts,
    cues: [
      'Jab voiceover bole: "perfect map" → s1c-clip-02.mp4 lagayein.',
      'Jab voiceover bole: "before it lies flat" → s1c-clip-03.mp4 lagayein.',
      'Jab voiceover bole: "distortion to accept" → s1c-clip-04.mp4 lagayein.',
      'Jab voiceover bole: "enlarges high latitudes" → s1c-clip-05.mp4 lagayein.',
      'Jab voiceover bole: "entire planet on one sheet" → s1c-clip-06.mp4 lagayein.',
      'Short khatam → End screen lagayein.'
    ], prefix: 's1c'
  }
].map(item => {
  const duration = durationFor(item.script);
  return {
    week: item.week,
    number: item.number,
    title: item.title,
    format: 'YouTube Short + TikTok — Google Flow 9:16 + separate voiceover',
    script: item.script,
    word_count: words(item.script),
    predicted_duration_seconds: duration,
    clips: makeClips(item.prompts, item.cues, item.prefix, duration),
    sources
  };
});

makeDir('weeks/week-01');
write('weeks/week-01/long.json', `${JSON.stringify(longData, null, 2)}\n`);
shorts.forEach(item => write(`weeks/week-01/short-${item.number}.json`, `${JSON.stringify(item, null, 2)}\n`));

const nav = depth => {
  const base = '../'.repeat(depth);
  return `<details class="site-menu"><summary>Menu kholo</summary><nav aria-label="Safhon ka menu">
    <a href="${base}index.html">Ghar</a>
    <a href="${base}calendar.html">Calendar</a>
    <a href="${base}longs/index.html">Lambi videos</a>
    <a href="${base}shorts/index.html">Choti videos</a>
    <a href="${base}style-guide.html">Flow style guide</a>
    <a href="${base}longs/week-01.html">Hafta 01 ka long</a>
  </nav></details>`;
};

const shell = ({ title, brand, depth = 0, body, className = 'work' }) => {
  const base = '../'.repeat(depth);
  return `<!doctype html>
<html lang="ur-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escapeHtml(title)} | Hidden Geography</title><link rel="stylesheet" href="${base}style.css"></head>
<body class="${className}"><header class="bar"><a class="back" href="${base}index.html">‹ Ghar</a><span class="brand">${escapeHtml(brand)}</span>${nav(depth)}</header>${body}<script src="${base}app.js"></script></body></html>`;
};

const home = `<!doctype html><html lang="ur-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Hidden Geography | Kaam</title><link rel="stylesheet" href="style.css"></head><body class="home"><header><span class="brand">Hidden Geography</span></header><main><p class="eyebrow">Google Flow + Voiceover</p><h1>Aaj kya karna hai?</h1><nav class="tiles" aria-label="Kaam ke raste"><a href="calendar.html"><span class="num">01</span><span class="lbl">Haftay ka calendar</span></a><a href="longs/index.html"><span class="num">02</span><span class="lbl">Lambi videos</span></a><a href="shorts/index.html"><span class="num">03</span><span class="lbl">Choti videos</span></a><a href="style-guide.html"><span class="num">04</span><span class="lbl">Flow style guide</span></a></nav></main></body></html>`;
write('docs/index.html', home);

const titles = [
  "Every Map You've Seen Is Lying About Africa",
  'This Country Has More Empty Land Than People',
  'The Town Where Your Kitchen Is in Another Country',
  'The River That Runs Out Before It Reaches the Sea',
  'What Happens When a Canal Runs Out of Water',
  'The Island 1,700 Miles From the Nearest Town',
  'The Countries That Will Lose Half Their People',
  'Two Thirds of This Country Lives in One City'
];

const calendarRows = titles.map((title, index) => `<tr><td>${pad(index + 1)}</td><td>${index === 0 ? `<a class="open" href="longs/week-01.html">${escapeHtml(title)}</a>` : escapeHtml(title)}</td><td>${index === 0 ? 'Long + 3 Shorts tayyar' : 'Jald'}</td></tr>`).join('');
write('docs/calendar.html', shell({ title: 'Calendar', brand: '8 hafton ka calendar', body: `<main><h1>8 hafton ka calendar</h1><p class="lede">Har hafta ek Google Flow long aur teen vertical Shorts.</p><div class="table-wrap"><table class="timing"><thead><tr><th>Hafta</th><th>Video</th><th>Status</th></tr></thead><tbody>${calendarRows}</tbody></table></div></main>` }));

const longCards = titles.map((title, index) => `<article class="card"><p class="meta">Hafta ${pad(index + 1)} · Google Flow 16:9</p><h2>${escapeHtml(title)}</h2>${index === 0 ? '<a href="week-01.html">Week 01 studio kholo</a>' : '<span class="soon">Jald</span>'}</article>`).join('');
write('docs/longs/index.html', shell({ title: 'Lambi videos', brand: 'Lambi videos', depth: 1, className: 'work listing', body: `<main><h1>Lambi videos</h1><p class="lede">Voiceover, Flow prompts aur exact cut cues ek jagah.</p><div class="cards">${longCards}</div></main>` }));

const shortCards = shorts.map(item => `<article class="card"><p class="meta">Hafta 01 · Short ${pad(item.number)} · Flow 9:16</p><h2>${escapeHtml(item.title)}</h2><a href="week-01/short-${item.number}.html">Short ${pad(item.number)} kholo</a></article>`).join('');
write('docs/shorts/index.html', shell({ title: 'Choti videos', brand: 'Choti videos', depth: 1, className: 'work listing', body: `<main><h1>Choti videos</h1><p class="lede">Har long ke saath teen vertical Google Flow Shorts.</p><div class="cards">${shortCards}</div></main>` }));

const sourceList = sources.map(source => `<li><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a></li>`).join('');
const clipCards = (clips, idPrefix) => clips.map(clip => `<article class="clip-card"><div class="clip-head"><div><span class="filename">${escapeHtml(clip.filename)}</span><span class="clip-time" data-t="${clip.predicted_start_seconds}">${clock(clip.predicted_start_seconds)}</span></div><span class="clip-count">Clip ${pad(clip.number)}</span></div><pre class="prompt" id="${idPrefix}-prompt-${clip.number}">${escapeHtml(clip.prompt)}</pre><button class="copy" data-copy="#${idPrefix}-prompt-${clip.number}">Prompt copy karo</button><p class="cue"><b>Cut cue:</b> ${escapeHtml(clip.cut_cue)}</p></article>`).join('');

const productionBody = (data, kind, depth) => `<main data-predicted-duration="${data.predicted_duration_seconds}"><p class="eyebrow">Hafta 01 · ${kind}</p><h1>${escapeHtml(data.title)}</h1><p class="lede">Pehle voice banao, phir Google Flow clips download karke cut cues par lagao.</p><section class="step"><div class="head"><span class="num">01</span><h2>Voiceover banao</h2></div><p class="stat">${data.word_count} words · predicted ${clock(data.predicted_duration_seconds)}</p><pre class="script" id="voice-script">${escapeHtml(data.script)}</pre><button class="copy" data-copy="#voice-script">Poora script copy karo</button><a class="link" href="https://f5tts-prod.duckdns.org/web/" target="_blank" rel="noopener">Voice tool kholo</a></section><section class="step"><div class="head"><span class="num">02</span><h2>Voice upload karke timings set karo</h2></div><label class="drop"><span class="drop-cta">Voice file yahan select karo</span><span class="drop-sub">MP3 ya WAV; page timings khud rescale karega.</span><input id="voice" type="file" accept="audio/*"></label><div class="status" id="status" hidden><p>Actual duration: <b id="actual"></b></p><p class="tip">Neeche har clip ka waqt actual voice ke mutabiq update ho gaya.</p></div></section><section class="step"><div class="head"><span class="num">03</span><h2>Google Flow clips banao</h2></div><p class="tip">Har prompt Google Flow mein paste karo. Generated audio off rakho. Download ke waqt exact filename use karo.</p><div class="clip-list">${clipCards(data.clips, kind.replace(/\s/g, '-').toLowerCase())}</div></section><section class="step"><div class="head"><span class="num">04</span><h2>CapCut mein jodo</h2></div><ol class="instructions"><li>Voice Track 1 par zero se lagao.</li><li>Clips ko filename order mein import karo.</li><li>Har clip ko updated timestamp aur quoted cut cue par badlo.</li><li>Clip chhota ho to speed kam ya freeze frame use karo; black gap mat chhoro.</li><li>Long export 16:9; Shorts export 9:16; 1080p, 30fps.</li></ol></section>${kind === 'Long video' ? `<section class="step"><div class="head"><span class="num">05</span><h2>Research sources</h2></div><ul class="source-list">${sourceList}</ul></section>` : ''}</main>`;

write('docs/longs/week-01.html', shell({ title: longData.title, brand: 'Hafta 01 · Long', depth: 1, body: productionBody(longData, 'Long video', 1) }));
shorts.forEach(item => write(`docs/shorts/week-01/short-${item.number}.html`, shell({ title: item.title, brand: `Hafta 01 · Short ${pad(item.number)}`, depth: 2, body: productionBody(item, `Short ${pad(item.number)}`, 2) })));

write('docs/style-guide.html', shell({ title: 'Flow style guide', brand: 'Flow style guide', body: `<main><h1>Google Flow style guide</h1><p class="lede">Har week ka visual look isi rule par lock rahega.</p><section class="step"><div class="head"><span class="num">01</span><h2>Long settings</h2></div><ul class="instructions"><li>Horizontal 16:9, har raw clip 8 seconds.</li><li>Cinematic geography documentary, photorealistic terrain aur natural atmospheric haze.</li><li>Slow steady drone, dolly ya orbital motion.</li><li>Generated audio, dialogue, subtitles aur watermark off.</li></ul></section><section class="step"><div class="head"><span class="num">02</span><h2>Short settings</h2></div><ul class="instructions"><li>Vertical 9:16, subject center safe area mein.</li><li>Text Google Flow ke andar generate nahi karna; captions CapCut mein.</li><li>Har clip ka exact filename page par diya gaya hai.</li></ul></section><section class="step"><div class="head"><span class="num">03</span><h2>Voice + edit</h2></div><ul class="instructions"><li>Voiceover separate generate karo.</li><li>Voice upload karke page ke timestamps rescale karo.</li><li>Music 5–7% se shuru karo; voice clear rehni chahiye.</li><li>Long 1080p 16:9 aur Shorts 1080p 9:16, 30fps.</li></ul></section></main>` }));

write('docs/style.css', `:root{--ink:#101820;--paper:#f4f0e4;--paper2:#e7dfca;--blue:#176b87;--gold:#b36a22;--green:#3e6b52;--rule:#344451;--pad:18px} @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Serif:wght@700&display=swap');*{box-sizing:border-box}html{background:var(--ink)}body{margin:0;min-width:320px;color:var(--ink);background-color:var(--paper);background-image:repeating-linear-gradient(0deg,transparent 0,transparent 31px,rgba(52,68,81,.055) 32px);font-family:'IBM Plex Sans',sans-serif;font-size:15.5px;line-height:1.6}a{color:inherit}button,input{font:inherit}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--blue);outline-offset:2px}.home{min-height:100svh;display:flex;flex-direction:column;padding:24px var(--pad)}.home main{width:min(100%,660px);margin:auto}.brand,.eyebrow,.meta,.filename,.clip-time,.clip-count,.num{font-family:'IBM Plex Mono',monospace}.brand{font-size:11.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}.eyebrow{margin:0 0 8px;color:var(--gold);font-size:12px;font-weight:600;text-transform:uppercase}h1,h2{font-family:'IBM Plex Serif',serif;line-height:1.08}h1{margin:0 0 14px;font-size:clamp(30px,8vw,44px)}h2{margin:0;font-size:20px}.tiles,.cards,.clip-list{display:grid;gap:12px}.tiles a{min-height:92px;display:flex;align-items:center;gap:18px;padding:18px;color:var(--paper);background:var(--ink);border-radius:3px;text-decoration:none}.tiles a:hover{background:var(--blue)}.num{min-width:28px;color:#e57b55;font-size:13px;font-weight:600}.lbl{font-family:'IBM Plex Serif',serif;font-size:22px}.bar{min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px var(--pad);color:var(--paper);background:var(--ink)}.back{color:var(--paper);text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px}.site-menu{position:relative;z-index:10}.site-menu summary{min-height:40px;display:flex;align-items:center;padding:8px 10px;border:1px solid #ffffff66;border-radius:3px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:11.5px}.site-menu summary::-webkit-details-marker{display:none}.site-menu nav{position:absolute;top:calc(100% + 7px);right:0;width:min(82vw,250px);padding:7px;background:var(--ink);border:1px solid #ffffff55}.site-menu a{min-height:44px;display:flex;align-items:center;padding:10px 12px;color:var(--paper);text-decoration:none;font-size:13px}.site-menu a:hover{background:var(--blue)}.work{padding-bottom:48px}.work main{width:min(100%,720px);margin:0 auto;padding:34px var(--pad) 0}.lede{max-width:55ch;margin:0 0 26px;color:#46515d}.step{padding:26px 0;border-top:1px solid var(--rule)}.head{display:flex;align-items:center;gap:12px;margin-bottom:16px}.script,.prompt{overflow-x:auto;margin:0 0 12px;padding:15px;color:var(--ink);background:#e7dfcad9;border-left:3px solid var(--gold);white-space:pre-wrap;font-family:'IBM Plex Sans',sans-serif;font-size:14px;line-height:1.65}.prompt{font-size:13px;line-height:1.5}.copy,.link{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border:0;border-radius:3px;color:var(--paper);background:var(--blue);font-weight:700;text-decoration:none;cursor:pointer}.copy:hover,.link:hover{background:#10536a}.copy.done{background:var(--green)}.link{margin:0 0 0 7px}.drop{display:block;padding:20px;border:2px dashed var(--blue);background:#e7dfca88;cursor:pointer}.drop input{display:block;width:100%;margin-top:12px}.drop-cta{display:block;color:var(--blue);font-weight:700}.drop-sub,.tip{color:#46515d;font-size:13px}.status{margin-top:16px}.status p{margin:3px 0}.clip-card{padding:18px;background:var(--paper2);border-left:3px solid var(--gold)}.clip-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px}.clip-head>div{display:flex;flex-wrap:wrap;gap:8px}.filename{font-weight:600}.clip-time,.clip-count{color:var(--gold);font-size:12px;font-weight:600}.cue{margin:14px 0 0;color:#46515d;font-size:13px}.instructions{margin:0;padding-left:24px}.instructions li{padding:4px 0}.stat{color:var(--gold);font-family:'IBM Plex Mono',monospace;font-size:12px}.cards .card{padding:18px;background:var(--paper2);border-left:3px solid var(--gold)}.card .meta{margin:0 0 5px;color:var(--gold);font-size:12px}.card h2{margin-bottom:12px}.card a,.open,.source-list a{color:var(--blue);font-weight:700}.soon{color:#687480;font-family:'IBM Plex Mono',monospace;font-size:12px}.table-wrap{overflow-x:auto;border-top:1px solid var(--rule)}.timing{width:100%;border-collapse:collapse}.timing th,.timing td{padding:13px 9px;text-align:left;vertical-align:top;border-bottom:1px solid #34445155}.timing th{font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase}.timing td:first-child{color:var(--gold);font-family:'IBM Plex Mono',monospace}.source-list{padding-left:20px}.source-list li{margin:8px 0}@media(min-width:900px){.site-menu{position:fixed;top:76px;left:18px}.site-menu nav{left:0;right:auto;width:230px}}@media(min-width:640px){:root{--pad:24px}.tiles a{min-height:110px}.lbl{font-size:25px}}`);

write('docs/app.js', `(function(){const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));document.addEventListener('click',async e=>{const btn=e.target.closest('[data-copy]');if(!btn)return;const target=$(btn.getAttribute('data-copy'));const value=target?target.textContent.trim():'';if(!value)return;try{await navigator.clipboard.writeText(value)}catch{const ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}const old=btn.textContent;btn.textContent='Copy ho gaya';btn.classList.add('done');setTimeout(()=>{btn.textContent=old;btn.classList.remove('done')},1400)});const voice=$('#voice');if(!voice)return;voice.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file);const audio=new Audio(url);await new Promise(resolve=>audio.addEventListener('loadedmetadata',resolve,{once:true}));const actual=audio.duration;const predicted=Number($('main').dataset.predictedDuration)||actual;const ratio=actual/predicted;$$('[data-t]').forEach(el=>{const scaled=Number(el.dataset.t)*ratio;el.textContent=fmt(scaled);el.classList.add('scaled')});$('#actual').textContent=fmt(actual);$('#status').hidden=false;URL.revokeObjectURL(url)});function fmt(seconds){return Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0')}})();`);
write('docs/.nojekyll', '');

console.log(JSON.stringify({
  longWords: longData.word_count,
  longClips: longData.clips.length,
  shortWords: shorts.map(item => item.word_count),
  shortClips: shorts.map(item => item.clips.length)
}, null, 2));
