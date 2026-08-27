import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const escapeHtml = (value = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const words = text => (text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)?/g) || []).length;
const durationFor = text => Math.round(words(text) / 145 * 60);
const pad = value => String(value).padStart(2, '0');
const clock = seconds => `${Math.floor(seconds / 60)}:${pad(Math.floor(seconds % 60))}`;
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.trimStart(), 'utf8');
};

const longScript = `On a common Mercator world map, Greenland can look almost as large as Africa. On the ground, that comparison is nowhere close. The African continent covers about thirty point three seven million square kilometres. Greenland covers about two point one seven million. Divide those numbers and Africa is about fourteen times as large. This is the first clue that a flat map is not a photograph of the planet.

The scale shock goes further. The combined surface areas of the United States, China, and India total roughly twenty two point seven million square kilometres. That is still well below Africa's area, with more than seven million square kilometres left over. Their shapes cannot simply be packed like puzzle pieces without overlap, but the area comparison is real. Africa only looks modest when a projection changes the visual scale of high latitudes.

Every flat world map makes a compromise. Earth is curved, paper and screens are flat, and a curved surface cannot be opened into a plane without distortion. Imagine cutting an orange peel and pressing it onto a table. It must tear, overlap, compress, or stretch. With a world map, something has to give. A projection may protect area, local shape, distance, or direction, but no single flat projection keeps all four perfectly everywhere. The right choice depends on what the map is for.

The Mercator projection chose a very specific job. Gerardus Mercator published his projection in 1569. On a Mercator nautical chart, a line of constant compass direction appears straight. Navigators call that a rhumb line, or a line of constant course. A sailor could draw the route with a ruler, measure its angle from north, and steer that bearing with a compass.

That convenience does not always produce the shortest route. On a globe, the shortest path between two points follows a curved arc called a great circle. A great-circle track usually changes compass direction as the journey progresses. For a long ocean crossing, a straight rhumb line could be easier to plot and follow, even when it travelled farther. Mercator's success came from navigation, not continent comparison.

The geometry that keeps directions useful also creates the size problem. Mercator places longitude lines as straight, parallel verticals. To preserve local angles, the spacing between horizontal latitude lines expands toward the poles. The map stretches east to west and north to south by the same scale in every direction at each point. Cartographers call that property conformal. It means local angles stay correct, so a small road intersection keeps a familiar shape.

But conformal does not mean equal area. On Mercator, scale grows with latitude. Along the equator, scale is true. At sixty degrees north, linear scale is about twice the equatorial scale. Because area has two dimensions, the displayed area is enlarged about four times. Near eighty degrees north, linear scale is roughly five point eight times larger, so a tiny patch can appear at about thirty three times the equatorial area scale.

That last number needs context. It describes a small patch near eighty degrees, not a claim that all of Greenland is thirty three times too large. Greenland stretches from about sixty to above eighty degrees north, so distortion changes across the island. Africa crosses the equator and reaches into mid-latitudes, where Mercator distortion is much lower. On the same wall map, Greenland expands far more than Africa. That is why their displayed areas become misleading.

The projection is not secretly changing land. It is changing the scale used to draw land at different latitudes. Problems begin when we use the wrong map for the wrong question. Mercator is useful when local direction and angle matter. If the question is which continent is larger, use an equal area projection instead.

An equal area projection keeps every region's area in the correct proportion to every other region. The tradeoff moves somewhere else: shape has to bend somewhere. Gall-Peters is one well-known equal area design, but its continents look vertically stretched in many places. Equal Earth, designed in 2018, also preserves relative area while keeping the overall shapes of continents visually familiar. It is excellent for comparing global size, but it still does not preserve every distance, direction, and shape.

So why does a modern phone still show Mercator geometry? Google Maps uses a Mercator projection for its standard base maps. At street scale, conformal geometry keeps nearby roads and corners familiar on the screen. Google's implementation cuts the world off near about eighty five degrees north and south, making a square base map. At zoom level zero, that base world is two hundred and fifty six pixels square.

Each higher zoom level doubles the pixel dimensions in both directions. That creates four times as many pixels as the previous level. The square can be divided into small image tiles, and the app requests only the tiles inside your screen. This is efficient for panning and zooming. The satellite positioning system calculates your location separately. Mercator decides how that position is drawn on a flat display.

Digital maps are not trapped forever. When a global view matters, an app can show the round Earth directly. Atlases can use Equal Earth or another equal area design. Nautical work can still use a Mercator chart. There is no universal winner. A map is a tool, and each tool protects a different property.

For navigation, a Mercator nautical chart remains useful. For comparing Africa with Greenland, choose an equal area map or a globe. In a classroom, do not ask only whether a map looks familiar. Ask what property it preserves, what it distorts, and what task it was built to solve.

Africa was never small. Greenland was never its twin. That distinction matters in every classroom. Mercator was not a liar; it was a successful tool doing a different job. The next time a flat world map surprises you, do not throw it away. Read it more intelligently, and choose the map that matches the question.`;

const normalizeFlowPrompt = prompt => {
  let result = prompt
    .replace(/\s*--ar\s+(?:16:9|9:16)\s*$/i, '')
    .replace(/\b8k(?:\s+(?:resolution|realism|IMAX quality))?\b/gi, 'high detail')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/[.,]\s*$/, '');
  if (!/no text/i.test(result)) result += ', no text';
  if (!/no (?:logo|logos)/i.test(result)) result += ', no logos';
  if (!/no watermark/i.test(result)) result += ', no watermark';
  if (!/no (?:spoken dialogue|dialogue)/i.test(result)) result += ', no spoken dialogue or narration';
  return `${result}.`;
};

const longSceneIdeas = [
  'Create one continuous 8-second horizontal 16:9 documentary shot. Slow push toward an aged Mercator world map in a quiet classroom, Greenland and Africa both visible, warm window light, accurate coastlines, no readable labels.',
  'Create one continuous 8-second horizontal 16:9 satellite-style shot. Orbit above Africa, then reveal Greenland beside it at true relative area, steady camera, natural terrain and cloud detail, accurate coastlines.',
  'Create one continuous 8-second horizontal 16:9 clean scale visualization. Accurate unlabeled silhouettes of Africa and Greenland settle side by side at true proportional area on a dark museum table, slow overhead drift.',
  'Create one continuous 8-second horizontal 16:9 museum visualization. Accurate unlabeled silhouettes of the United States, China, and India appear beside Africa, their combined area visibly smaller without pretending the shapes fit inside.',
  'Create one continuous 8-second horizontal 16:9 macro shot. A globe casts a curved shadow over several different flat world maps on a cartographer desk, slow lateral camera slide, soft archival lighting.',
  'Create one continuous 8-second horizontal 16:9 overhead documentary shot. Hands cut an orange peel and press it flat; gaps and overlaps appear naturally, precise motion, dark wooden table, soft window light.',
  'Create one continuous 8-second horizontal 16:9 gallery shot. A globe rotates behind three unlabeled projection sheets that preserve different geometric properties, subtle morphing, accurate continent outlines, warm museum lighting.',
  'Create one continuous 8-second horizontal 16:9 historical shot. Anonymous sixteenth-century cartographer hands draft a cylindrical world projection on parchment in a Flemish workshop, authentic tools, no visible face.',
  'Create one continuous 8-second horizontal 16:9 maritime shot. Brass compass, ruler, and unlabeled nautical chart on a moving wooden ship table, lantern light, ocean spray, steady macro camera.',
  'Create one continuous 8-second horizontal 16:9 chart visualization. A straight route line is drawn across a Mercator-style ocean grid while a compass bearing stays constant, accurate geometry, no place labels.',
  'Create one continuous 8-second horizontal 16:9 globe visualization. A shortest-route arc curves across the round Atlantic between two unlabeled points, slow orbit, realistic Earth, no borders or labels.',
  'Create one continuous 8-second horizontal 16:9 navigation comparison. Curved great-circle track on a globe transitions to a straight constant-bearing track on a flat chart, clean museum graphic, accurate geometry.',
  'Create one continuous 8-second horizontal 16:9 cinematic ship shot. Navigator follows a plotted bearing at a wooden helm on open ocean, calm dawn light, authentic compass, face not visible.',
  'Create one continuous 8-second horizontal 16:9 scientific animation. Earth sits inside a transparent cylinder; longitude lines project outward and become straight parallel verticals, slow orbit, clean dark laboratory.',
  'Create one continuous 8-second horizontal 16:9 technical animation. Horizontal latitude lines spread farther apart toward both poles on an unlabeled Mercator grid, smooth controlled motion, dark blueprint background.',
  'Create one continuous 8-second horizontal 16:9 conformal-grid demonstration. A small square and right angle move around a Mercator map while preserving local angles as their scale changes, clean geometric animation.',
  'Create one continuous 8-second horizontal 16:9 straight-down city shot. A compact road intersection keeps familiar right angles during a smooth map zoom, realistic urban blocks, no interface text.',
  'Create one continuous 8-second horizontal 16:9 globe-grid animation. A small equal patch at the equator moves to sixty degrees north and expands to four times its displayed area, no numbers or labels.',
  'Create one continuous 8-second horizontal 16:9 polar-grid animation. A small patch moves close to eighty degrees north and expands dramatically while the equatorial reference stays fixed, accurate Mercator geometry.',
  'Create one continuous 8-second horizontal 16:9 scientific shot. Greenland spans several latitude bands on a rotating globe, with distortion increasing gradually toward its north rather than uniformly, no labels.',
  'Create one continuous 8-second horizontal 16:9 map transformation. Africa and Greenland change from globe-correct relative area to Mercator display, Greenland expanding much more, accurate coastlines, neutral dark background.',
  'Create one continuous 8-second horizontal 16:9 documentary shot. A navigator selects one map while a geographer selects another from a projection drawer, hands only, purposeful studio lighting.',
  'Create one continuous 8-second horizontal 16:9 equal-area visualization. Identical glowing area tiles remain equal as they move across an unlabeled world map, while coastlines gently bend, accurate geometry.',
  'Create one continuous 8-second horizontal 16:9 projection morph. A Mercator-style map transforms into a Gall-Peters-style equal-area map, relative areas stabilize while continent shapes stretch, no labels.',
  'Create one continuous 8-second horizontal 16:9 gallery shot. A modern Equal Earth map unrolls across a walnut table, relative continent areas accurate and outlines recognizable, soft museum lighting.',
  'Create one continuous 8-second horizontal 16:9 comparison. Equal Earth sheet, Mercator sheet, and a globe rotate slowly together, each visibly useful for a different task, accurate unlabeled geography.',
  'Create one continuous 8-second horizontal 16:9 phone navigation shot. Hand pans a clean unlabeled city map with familiar right-angle streets, natural daylight, no readable interface text or brand marks.',
  'Create one continuous 8-second horizontal 16:9 map-engine animation. A global Mercator grid is cropped near both polar limits and settles into a perfect square, clean technical style, no numeric labels.',
  'Create one continuous 8-second horizontal 16:9 tile animation. A square base world divides into four, then sixteen, then many equal image tiles in orderly grids, smooth zoom, dark technical background.',
  'Create one continuous 8-second horizontal 16:9 server visualization. Successive map zoom levels double in width and height as only the visible tiles illuminate, restrained blue data glow, no text.',
  'Create one continuous 8-second horizontal 16:9 infrastructure shot. A small set of map tiles travels from server racks to one phone viewport while unused tiles remain dark, realistic documentary lighting.',
  'Create one continuous 8-second horizontal 16:9 split visualization. Navigation satellites locate a point on the globe, then a separate flat Mercator display draws that point, clear two-stage motion, no labels.',
  'Create one continuous 8-second horizontal 16:9 zoom-out shot. A close city map pulls back smoothly until it becomes a realistic rotating globe, clean interface edges, no text or brand marks.',
  'Create one continuous 8-second horizontal 16:9 projection gallery. Several accurate unlabeled world maps and one globe rotate under spotlights, each with visibly different geometry, calm documentary camera.',
  'Create one continuous 8-second horizontal 16:9 nautical documentary shot. Modern mariner plots a constant-course line on an unlabeled Mercator chart beside a compass, crisp practical lighting.',
  'Create one continuous 8-second horizontal 16:9 classroom comparison. Teacher hands replace a Mercator wall map with an equal-area map while keeping a globe nearby, faces out of frame, accurate coastlines.',
  'Create one continuous 8-second horizontal 16:9 close-up. A hand studies map scale, projection grid, and globe together before choosing the correct sheet, slow deliberate movement, warm study light.',
  'Create one continuous 8-second horizontal 16:9 orbital shot. Africa fills the sunlit center of a realistic Earth view, vast Sahara and Congo Basin visible, accurate continental outline, gentle camera drift.',
  'Create one continuous 8-second horizontal 16:9 historical-to-modern match cut. Parchment Mercator chart transitions into a phone map using the same grid geometry, no identifiable historical face, no brands.',
  'Create one continuous 8-second horizontal 16:9 finale. Camera pulls back from several flat projection sheets to a rotating globe above them, Africa clearly visible, sunrise rim light, calm documentary mood.'
];
const longPrompts = longSceneIdeas.map(normalizeFlowPrompt);
const longCuePhrases = [
  'almost as large as Africa', 'about fourteen times as large', 'more than seven million square kilometres left over', 'the area comparison is real', 'Imagine cutting an orange peel', 'something has to give', 'what the map is for', 'Gerardus Mercator published his projection in 1569', 'line of constant course', 'That convenience does not always produce the shortest route', 'changes compass direction as the journey progresses', 'straight rhumb line', 'Mercator\'s success came from navigation, not continent comparison', 'straight, parallel verticals', 'expands toward the poles', 'local angles stay correct', 'familiar shape', 'enlarged about four times', 'about thirty three times the equatorial area scale', 'not a claim that all of Greenland is thirty three times too large', 'Greenland expands far more than Africa', 'wrong map for the wrong question', 'equal area projection instead', 'shape has to bend somewhere', 'designed in 2018', 'does not preserve every distance, direction, and shape', 'nearby roads and corners familiar on the screen', 'eighty five degrees north and south', 'two hundred and fifty six pixels square', 'four times as many pixels', 'only the tiles inside your screen', 'Mercator decides how that position is drawn', 'show the round Earth directly', 'There is no universal winner', 'Mercator nautical chart remains useful', 'choose an equal area map or a globe', 'what task it was built to solve', 'Africa was never small', 'successful tool doing a different job', null
];
const longCues = longCuePhrases.map((phrase, index) => phrase
  ? `Jab voiceover bole: "${phrase}" → Theek yahan v1-clip-${pad(index + 2)}.mp4 lagayein.`
  : 'Video khatam → Outro Subscribe & End Screen lagayein.');

const shortOneScript = `Greenland is not the size of Africa. Africa can hold Greenland about fourteen times. Africa covers roughly thirty point three million square kilometres. Greenland covers about two point one seven million. A Mercator wall map makes them look like near twins because it preserves local angles, not area. That choice was useful for sailors in fifteen sixty nine. A straight line on Mercator could represent a constant compass bearing across an ocean. The tradeoff grows toward the poles. At sixty degrees north, the map's area scale is about four times the scale at the equator. Greenland expands on the page while equatorial Africa stays comparatively restrained. The projection is not a photograph and it was never designed to compare continent sizes. It is a navigation tool being asked to do a different job.`;

const shortTwoScript = `Google Maps uses Mercator geometry for its standard base map. Mercator preserves local angles, the same property that made a straight line useful as a constant compass bearing on nautical charts. At street scale, nearby roads and corners stay familiar. Google converts latitude and longitude into Mercator world coordinates, then divides the map into square image tiles. At zoom level zero, the base world is two hundred and fifty six pixels square. Every higher zoom level doubles both pixel dimensions, and the app requests only the tiles inside your screen. The satellite positioning system calculates your location separately. Mercator decides how that location appears on the flat display. An old navigation geometry survives because it still does one digital job efficiently.`;

const shortThreeScript = `A globe cannot be flattened into a perfect map. Imagine cutting an orange peel and pressing it onto a table. The peel must tear, overlap, or stretch before it lies flat. Earth creates the same problem. Every world map chooses which property to protect and which distortion to accept. Mercator protects local angles, which helps navigation, but enlarges high latitudes. Equal area projections protect relative size, but shapes bend more as they move away from favored regions. Equal Earth was designed to preserve area while keeping continents visually familiar. It still cannot preserve every distance, direction, and shape at once. A globe avoids the flattening problem, but it cannot show the entire planet on one sheet. There is no single correct world map. There are only projections built for different tasks.`;

const thirdPrompts = [
  'Create an 8-second vertical 9:16 photorealistic geography documentary clip. A detailed blue planet Earth rotates slowly in deep space while a translucent flat sheet appears beside it, emphasizing sphere versus plane, natural atmospheric glow, smooth camera drift, no text, no labels, no watermark.',
  'Create an 8-second vertical 9:16 macro documentary clip. Human hands carefully cut a fresh orange peel and press the curved peel onto a dark wooden table; the peel naturally tears and overlaps as it flattens, soft window light, precise overhead camera, photorealistic, no text.',
  'Create an 8-second vertical 9:16 museum visualization. Three unlabeled world map sheets float side by side, one preserving shape, one preserving relative area, one preserving direction; each sheet subtly bends and transforms while a globe remains behind them, warm gallery lighting, no text.',
  'Create an 8-second vertical 9:16 scientific animation. A glowing Earth sphere sits inside a transparent cylinder as light rays project the curved surface onto the cylinder, polar regions stretching upward, slow clean orbit, cinematic cyan and amber lighting, no text.',
  'Create an 8-second vertical 9:16 cartographic documentary clip. A modern equal-area world map unrolls across a walnut table, continent areas balanced and recognizable, curved outer edges suggesting a globe, soft museum lighting, no readable labels, no watermark.',
  'Create an 8-second vertical 9:16 cinematic finale. Camera pulls away from a collection of different flat world maps toward a single rotating globe suspended in a dark observatory, sunrise crossing Earth, contemplative geography documentary mood, no text, no watermark.'
];

const shortOnePrompts = [
  'Create one continuous 8-second vertical 9:16 classroom documentary shot. Slow punch-in toward an accurate Mercator wall map with Greenland and Africa both visible, warm sunlight, no readable labels.',
  'Create one continuous 8-second vertical 9:16 clean scale visualization. Accurate unlabeled silhouettes of Africa and Greenland settle side by side at true proportional area, steady camera, dark museum background.',
  'Create one continuous 8-second vertical 9:16 historical maritime shot. Brass compass and ruler rest on an unlabeled sixteenth-century nautical chart while a ship table moves gently, warm lantern light.',
  'Create one continuous 8-second vertical 9:16 globe-grid animation. An equal patch moves from the equator to sixty degrees north and expands to four times its displayed area, no numbers or labels.',
  'Create one continuous 8-second vertical 9:16 map transformation. Africa and Greenland change from globe-correct scale to Mercator display, Greenland expanding much more, accurate coastlines, neutral background.'
].map(normalizeFlowPrompt);

const shortTwoPrompts = [
  'Create one continuous 8-second vertical 9:16 phone navigation shot. Hand pans a clean unlabeled city map with familiar right-angle streets, soft daylight, no readable interface text or brands.',
  'Create one continuous 8-second vertical 9:16 historical chart shot. A straight constant-bearing route is drawn beside a brass compass on a Mercator-style ocean grid, authentic lantern light, no labels.',
  'Create one continuous 8-second vertical 9:16 map-engine animation. Latitude and longitude transform into a square Mercator world coordinate grid, smooth precise motion, no numeric labels.',
  'Create one continuous 8-second vertical 9:16 tile animation. A square base world divides into four, sixteen, then many equal image tiles while the camera zooms smoothly, restrained technical style.',
  'Create one continuous 8-second vertical 9:16 split visualization. Navigation satellites locate a point on a realistic globe, then a separate flat phone map draws that point, clear two-stage motion.'
].map(normalizeFlowPrompt);

const sources = [
  { title: 'African Union — The True Size of Africa', url: 'https://au.int/sites/default/files/documents/44438-doc-AUE_2024_English_2.pdf' },
  { title: 'United Nations Statistics — Greenland surface area', url: 'https://unstats.un.org/unsd/publications/pocketbook/files/world-stats-pocketbook-2024.pdf' },
  { title: 'USGS — Exploring Maps and projection tradeoffs', url: 'https://pubs.usgs.gov/unnumbered/70043847/report.pdf' },
  { title: 'NOAA — Mercator nautical charts and rhumb lines', url: 'https://www.nauticalcharts.noaa.gov/learn/nautical-cartography.html' },
  { title: 'Google Maps — Map and tile coordinates', url: 'https://developers.google.com/maps/documentation/javascript/coordinates' },
  { title: 'Google Maps — Projection documentation', url: 'https://developers.google.com/maps/documentation/javascript/maptypes' },
  { title: 'PROJ — Equal Earth projection', url: 'https://proj.org/en/stable/operations/projections/eqearth.html' },
  { title: 'Google Flow — Create video clips', url: 'https://support.google.com/flow/answer/16353334?hl=en' },
  { title: 'Google Flow — Models and supported features', url: 'https://support.google.com/flow/answer/16352836?hl=en' },
  { title: 'YouTube — Accurate and succinct title guidance', url: 'https://support.google.com/youtube/answer/12340300?hl=en' }
];

const makeClips = (prompts, cues, prefix, script, duration) => {
  if (prompts.length !== cues.length) throw new Error(`${prefix}: prompt/cue count mismatch`);
  const starts = [0];
  let searchFrom = 0;
  for (let index = 0; index < cues.length - 1; index += 1) {
    const phrase = cues[index].match(/"([^"]+)"/)?.[1];
    if (!phrase) throw new Error(`${prefix}: cue ${index + 1} has no quoted phrase`);
    const found = script.toLowerCase().indexOf(phrase.toLowerCase(), searchFrom);
    if (found < 0) throw new Error(`${prefix}: cue phrase missing from script: ${phrase}`);
    const end = found + phrase.length;
    starts.push(Number((words(script.slice(0, end)) / 145 * 60).toFixed(1)));
    searchFrom = end;
  }
  if (starts.some((start, index) => index && start <= starts[index - 1])) throw new Error(`${prefix}: cue order is invalid`);
  if (starts.at(-1) >= duration) throw new Error(`${prefix}: final cue exceeds duration`);
  return prompts.map((prompt, index) => ({
    number: index + 1,
    filename: `${prefix}-clip-${pad(index + 1)}.mp4`,
    predicted_start_seconds: starts[index],
    prompt: normalizeFlowPrompt(prompt),
    cut_cue: cues[index]
  }));
};

const longDuration = durationFor(longScript);
const longData = {
  week: '01',
  title: 'Why Mercator Maps Make Africa Look Too Small',
  format: 'YouTube long — Google Flow 16:9 + separate voiceover',
  script: longScript,
  word_count: words(longScript),
  predicted_duration_seconds: longDuration,
  clips: makeClips(longPrompts, longCues, 'v1', longScript, longDuration),
  sources
};

const shorts = [
  {
    week: '01', number: 1, title: 'Greenland Is Not the Size of Africa', script: shortOneScript,
    prompts: shortOnePrompts,
    cues: [
      'Jab voiceover bole: "about fourteen times" → s1a-clip-02.mp4 lagayein.',
      'Jab voiceover bole: "two point one seven million" → s1a-clip-03.mp4 lagayein.',
      'Jab voiceover bole: "constant compass bearing" → s1a-clip-04.mp4 lagayein.',
      'Jab voiceover bole: "four times the scale at the equator" → s1a-clip-05.mp4 lagayein.',
      'Short khatam → End screen lagayein.'
    ], prefix: 's1a'
  },
  {
    week: '01', number: 2, title: 'Why Google Maps Uses Mercator Geometry', script: shortTwoScript,
    prompts: shortTwoPrompts,
    cues: [
      'Jab voiceover bole: "nautical charts" → s1b-clip-02.mp4 lagayein.',
      'Jab voiceover bole: "nearby roads and corners stay familiar" → s1b-clip-03.mp4 lagayein.',
      'Jab voiceover bole: "square image tiles" → s1b-clip-04.mp4 lagayein.',
      'Jab voiceover bole: "tiles inside your screen" → s1b-clip-05.mp4 lagayein.',
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
    clips: makeClips(item.prompts, item.cues, item.prefix, item.script, duration),
    sources
  };
});

const channelSetup = {
  youtube: {
    name: 'Hidden Geography',
    handle: '@HiddenGeographyHQ',
    fallback_handle: '@HiddenGeographyMaps',
    description: 'Maps make the world look simple. Hidden Geography explains the borders, projections, rivers, cities, and geographic systems that make it complicated. One visual geography documentary and three Shorts each week.',
    keywords: 'geography documentary, map projections, borders explained, world geography, hidden geography, cartography, rivers and cities, geography facts, geography shorts, Hidden Geography',
    playlist: 'Hidden Geography | Maps Explained',
    profile_prompt: 'A minimal square channel emblem for a visual geography documentary brand, a simple globe crossed by one clean compass needle, deep ocean blue background, warm sand and copper land accents, crisp editorial vector style, strong silhouette readable at tiny size, centered composition, no letters, no words, no numbers, no gradients, no watermark, 1:1',
    banner_prompt: 'A wide cinematic geography documentary channel banner, a physical globe, an unlabeled relief map and a brass compass arranged on a dark cartography table, soft sunrise light crossing the globe, deep ocean blue, warm sand and copper palette, clean editorial composition, all important objects inside the center safe area, dark edges for responsive cropping, no readable text, no logo, no watermark, 16:9',
    banner_text: 'HIDDEN GEOGRAPHY\nMAPS EXPLAIN THE WORLD'
  },
  tiktok: {
    nickname: 'Hidden Geography',
    username: '@HiddenGeographyHQ',
    fallback_username: '@HiddenGeographyMaps',
    bio: 'Maps, borders and places explained visually. New geography Shorts weekly.'
  }
};

const tiktokPacks = [
  {
    short: 1,
    title: 'Greenland Is Not the Size of Africa',
    search_phrase: 'Mercator map Africa size',
    caption: 'Why does Greenland look almost as large as Africa on a Mercator map? Africa is actually about fourteen times larger. Mercator preserves local angles, but high latitudes expand. #Geography #MercatorProjection #Africa #MapFacts',
    cover_text: 'AFRICA IS 14× LARGER',
    first_frame_text: 'Greenland is not the size of Africa.',
    filename: 'hidden-geography-week-01-tiktok-short-01.mp4'
  },
  {
    short: 2,
    title: 'Why Google Maps Uses Mercator Geometry',
    search_phrase: 'why Google Maps uses Mercator',
    caption: 'Why does Google Maps use Mercator geometry? It keeps nearby roads and corners familiar and divides the world into square image tiles that load efficiently. GPS finds your location; Mercator controls how it appears. #Geography #GoogleMaps #Mercator #MapProjection',
    cover_text: 'WHY GOOGLE MAPS USES IT',
    first_frame_text: 'Google Maps still uses Mercator geometry.',
    filename: 'hidden-geography-week-01-tiktok-short-02.mp4'
  },
  {
    short: 3,
    title: 'No Flat World Map Can Be Perfect',
    search_phrase: 'why flat maps are distorted',
    caption: 'Why are flat world maps distorted? No projection can preserve area, shape, distance and direction perfectly at the same time. Every map protects one property and changes another. #Geography #MapProjection #Cartography #WorldMap',
    cover_text: 'NO FLAT MAP IS PERFECT',
    first_frame_text: 'A globe cannot become a perfect flat map.',
    filename: 'hidden-geography-week-01-tiktok-short-03.mp4'
  }
];

write('docs/data/week-01/long.json', `${JSON.stringify(longData, null, 2)}\n`);
shorts.forEach(item => write(`docs/data/week-01/short-${item.number}.json`, `${JSON.stringify(item, null, 2)}\n`));
write('docs/data/channel-setup.json', `${JSON.stringify(channelSetup, null, 2)}\n`);
write('docs/data/week-01/tiktok.json', `${JSON.stringify(tiktokPacks, null, 2)}\n`);

const nav = depth => {
  const base = '../'.repeat(depth);
  return `<details class="site-menu"><summary>Menu kholo</summary><nav aria-label="Safhon ka menu">
    <a href="${base}index.html">Ghar</a>
    <a href="${base}manual.html">Pehle manual parho</a>
    <a href="${base}channel-setup.html">Channel setup</a>
    <a href="${base}calendar.html">Calendar</a>
    <a href="${base}longs/index.html">Lambi videos</a>
    <a href="${base}shorts/index.html">Choti videos</a>
    <a href="${base}seo/week-01.html">TikTok upload packs</a>
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

const home = `<!doctype html><html lang="ur-Latn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Hidden Geography | Kaam</title><link rel="stylesheet" href="style.css"></head><body class="home"><header><span class="brand">Hidden Geography</span></header><main><p class="eyebrow">Google Flow + Voiceover</p><h1>Aaj kya karna hai?</h1><p class="home-help"><b>Maryam:</b> sab se pehle Manual poora parho. Us ke baad pehli dafa Channel setup, phir har week calendar, long, teen Shorts aur TikTok upload pack.</p><nav class="tiles" aria-label="Kaam ke raste"><a href="manual.html"><span class="num">01</span><span class="lbl">Pehle manual parho</span></a><a href="channel-setup.html"><span class="num">02</span><span class="lbl">Channel setup</span></a><a href="calendar.html"><span class="num">03</span><span class="lbl">Haftay ka calendar</span></a><a href="longs/index.html"><span class="num">04</span><span class="lbl">Lambi videos</span></a><a href="shorts/index.html"><span class="num">05</span><span class="lbl">Choti videos</span></a><a href="seo/week-01.html"><span class="num">06</span><span class="lbl">TikTok upload packs</span></a><a href="style-guide.html"><span class="num">07</span><span class="lbl">Flow style guide</span></a></nav></main></body></html>`;
write('docs/index.html', home);

const titles = [
  'Why Mercator Maps Make Africa Look Too Small',
  'This Country Has More Empty Land Than People',
  'The Town Where Your Kitchen Is in Another Country',
  'The River That Runs Out Before It Reaches the Sea',
  'What Happens When a Canal Runs Out of Water',
  'The Island 1,700 Miles From the Nearest Town',
  'The Countries That Will Lose Half Their People',
  'Two Thirds of This Country Lives in One City'
];

const calendarRows = titles.map((title, index) => `<tr><td>${pad(index + 1)}</td><td>${index === 0 ? `<a class="open" href="longs/week-01.html">${escapeHtml(title)}</a>` : escapeHtml(title)}</td><td>${index === 0 ? '<a class="open" href="shorts/index.html">Long + 3 Shorts tayyar</a>' : 'Jald'}</td></tr>`).join('');
write('docs/calendar.html', shell({ title: 'Calendar', brand: '8 hafton ka calendar', body: `<main><h1>8 hafton ka calendar</h1><p class="lede">Har hafta ek Google Flow long aur teen vertical Shorts.</p><div class="table-wrap"><table class="timing"><thead><tr><th>Hafta</th><th>Video</th><th>Status</th></tr></thead><tbody>${calendarRows}</tbody></table></div></main>` }));

const longCards = titles.map((title, index) => `<article class="card"><p class="meta">Hafta ${pad(index + 1)} · Google Flow 16:9</p><h2>${escapeHtml(title)}</h2>${index === 0 ? '<a href="week-01.html">Week 01 studio kholo</a>' : '<span class="soon">Jald</span>'}</article>`).join('');
write('docs/longs/index.html', shell({ title: 'Lambi videos', brand: 'Lambi videos', depth: 1, className: 'work listing', body: `<main><h1>Lambi videos</h1><p class="lede">Voiceover, Flow prompts aur exact cut cues ek jagah.</p><div class="cards">${longCards}</div></main>` }));

const shortCards = shorts.map(item => `<article class="card"><p class="meta">Hafta 01 · Short ${pad(item.number)} · Flow 9:16</p><h2>${escapeHtml(item.title)}</h2><a href="week-01/short-${item.number}.html">Short ${pad(item.number)} kholo</a></article>`).join('');
write('docs/shorts/index.html', shell({ title: 'Choti videos', brand: 'Choti videos', depth: 1, className: 'work listing', body: `<main><h1>Choti videos</h1><p class="lede">Har long ke saath teen vertical Google Flow Shorts.</p><div class="cards">${shortCards}</div></main>` }));

const sourceList = sources.map(source => `<li><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a></li>`).join('');
const clipCards = (clips, idPrefix) => clips.map(clip => `<article class="clip-card"><div class="clip-head"><div><span class="filename">${escapeHtml(clip.filename)}</span><span class="clip-time" data-t="${clip.predicted_start_seconds}">${clock(clip.predicted_start_seconds)}</span></div><span class="clip-count">Clip ${pad(clip.number)}</span></div><pre class="prompt" id="${idPrefix}-prompt-${clip.number}">${escapeHtml(clip.prompt)}</pre><button type="button" class="copy" data-copy="#${idPrefix}-prompt-${clip.number}">Prompt copy karo</button><p class="qc"><b>Generate ke baad check:</b> map/coastline ghalat, extra text, logo ya broken object ho to is clip ko dobara banao.</p><p class="cue"><b>Cut cue:</b> ${escapeHtml(clip.cut_cue)}</p></article>`).join('');

const productionBody = (data, kind, depth) => {
  const isLong = kind === 'Long video';
  const ratio = isLong ? '16:9' : '9:16';
  const voiceFile = `week-01-${isLong ? 'long' : kind.toLowerCase().replace(/\s+/g, '-')}-voice.mp3`;
  return `<main data-predicted-duration="${data.predicted_duration_seconds}"><p class="eyebrow">Hafta 01 · ${kind}</p><h1>${escapeHtml(data.title)}</h1><p class="lede">Upar se neeche 01–04 steps order mein karo. Pehle voice, phir clips, phir CapCut edit.</p><section class="step"><div class="head"><span class="num">01</span><h2>Voiceover banao</h2></div><p class="stat">${data.word_count} words · predicted ${clock(data.predicted_duration_seconds)}</p><pre class="script" id="voice-script">${escapeHtml(data.script)}</pre><div class="actions"><button type="button" class="copy" data-copy="#voice-script">Poora script copy karo</button><a class="link" href="https://f5tts-prod.duckdns.org/web/" target="_blank" rel="noopener">F5-TTS kholo</a></div><ol class="instructions mini"><li>Script copy karo aur F5-TTS mein paste karo.</li><li>Ledger wali same saved voice select karke audio banao.</li><li>MP3 download karke naam <b>${voiceFile}</b> rakho.</li></ol></section><section class="step"><div class="head"><span class="num">02</span><h2>Voice upload karke timings set karo</h2></div><label class="drop" for="voice"><span class="drop-cta">Voice file yahan select karo</span><span class="drop-sub">MP3 ya WAV; page neeche ke saare clip timings khud update karega.</span><input id="voice" type="file" accept="audio/*"></label><div class="status" id="status" role="status" aria-live="polite" hidden><p>Actual duration: <b id="actual"></b></p><p class="tip">Neeche har clip ka waqt actual voice ke mutabiq update ho gaya.</p></div></section><section class="step"><div class="head"><span class="num">03</span><h2>Google Flow clips banao</h2></div><div class="actions"><a class="link" href="https://labs.google/fx/tools/flow" target="_blank" rel="noopener">Google Flow kholo</a><a class="text-link" href="https://support.google.com/flow/answer/16353334?co=GENIE.Platform%3DDesktop&amp;hl=en" target="_blank" rel="noopener">Official video help</a><a class="text-link" href="https://support.google.com/flow/answer/16526234?hl=en" target="_blank" rel="noopener">Credits check</a></div><ol class="instructions mini"><li><b>+ New project</b> kholo; prompt box mein neeche wala prompt paste karo.</li><li>Model menu se <b>Video → Veo 3.1 Lite</b>, ratio <b>${ratio}</b>, duration <b>8 seconds</b> aur output <b>1</b> select karo.</li><li>Generate dabao. Har card ka QC note dekh kar sirf sahi clip rakho.</li><li>Best result download karke card par diya exact filename rakho.</li><li>Flow clip ki apni audio ho to fikar nahi; CapCut mein sab video clips mute karni hain.</li></ol><div class="clip-list">${clipCards(data.clips, kind.replace(/\s/g, '-').toLowerCase())}</div></section><section class="step"><div class="head"><span class="num">04</span><h2>CapCut mein jodo</h2></div><ol class="instructions"><li><b>${voiceFile}</b> ko Audio Track 1 par zero se lagao.</li><li>Saare clips ko filename order mein import karo aur un sab ka <b>Volume 0</b> karo.</li><li>Har clip ko updated timestamp aur quoted cut cue par badlo.</li><li>8-second clip ko aglay cue tak chalane ke liye speed halka slow ya clean freeze frame use karo; black gap mat chhoro.</li><li>${isLong ? 'Long export 16:9' : 'Short export 9:16'}; 1080p, 30fps.</li></ol></section>${isLong ? `<section class="step"><div class="head"><span class="num">05</span><h2>Verified sources</h2></div><p class="tip">Facts aur production workflow official/primary documentation se cross-check kiye gaye hain.</p><ul class="source-list">${sourceList}</ul></section>` : ''}</main>`;
};

write('docs/longs/week-01.html', shell({ title: longData.title, brand: 'Hafta 01 · Long', depth: 1, body: productionBody(longData, 'Long video', 1) }));
shorts.forEach(item => write(`docs/shorts/week-01/short-${item.number}.html`, shell({ title: item.title, brand: `Hafta 01 · Short ${pad(item.number)}`, depth: 2, body: productionBody(item, `Short ${pad(item.number)}`, 2) })));

const copyField = (label, value, id) => `<div class="upload-field"><p class="eyebrow">${escapeHtml(label)}</p><pre class="script" id="${id}">${escapeHtml(value)}</pre><button type="button" class="copy" data-copy="#${id}">Copy karo</button></div>`;

const manualBody = `<main><p class="eyebrow">Maryam · sab se pehle yeh parho</p><h1>Is site se video kaise banani hai?</h1><p class="lede">Maryam, is site ko upar se neeche follow karna hai. Tumhein script likhni, English samajhni, Flow prompt banana ya timing calculate nahi karni. Har jagah jo button aur file naam diya hai, bas wahi use karna hai.</p><article class="clip-card"><p><b>Sab se zaroori baat:</b> yeh site khud video nahi banati aur tumhari files save nahi karti. Yeh tayyar script, Google Flow prompts, cut timings aur TikTok upload text deti hai. Awaaz F5-TTS mein, clips Google Flow mein aur final video CapCut mein banti hai.</p></article>
<section class="step"><div class="head"><span class="num">01</span><h2>Paanch cheezein samjho</h2></div><div class="cards"><article class="card"><p class="meta">Yeh website</p><h2>Tumhari instruction copy hai</h2><p>Script, prompts, file names, timings aur upload text yahan milta hai.</p></article><article class="card"><p class="meta">F5-TTS</p><h2>English script ki awaaz</h2><p>Site se sirf English script copy karke F5-TTS mein paste karni hai.</p></article><article class="card"><p class="meta">Google Flow</p><h2>Video ke chotay clips</h2><p>Har English prompt se 8-second video clip banta hai.</p></article><article class="card"><p class="meta">CapCut</p><h2>Awaaz aur clips ko jorna</h2><p>Voice pehle lagti hai, Flow clips mute karke diye waqt par lagte hain.</p></article><article class="card"><p class="meta">TikTok upload pack</p><h2>Post ka tayyar text</h2><p>Caption, hashtags, cover text aur filename yahan se copy hota hai.</p></article></div></section>
<section class="step"><div class="head"><span class="num">02</span><h2>Pehli dafa kya karna hai?</h2></div><ol class="instructions"><li><a class="open" href="channel-setup.html">Channel setup page kholo</a>.</li><li>YouTube ka name, handle, description, profile aur banner set karo.</li><li>TikTok ka nickname, username, bio aur privacy settings set karo.</li><li>Yeh setup sirf ek dafa karna hai. Har video ke liye dobara nahi.</li></ol><a class="link" href="channel-setup.html">Channel setup shuru karo</a></section>
<section class="step"><div class="head"><span class="num">03</span><h2>Phone mein folders banao</h2></div><p class="tip">Files mix na hon. Files app mein yeh folders isi tarah banao:</p><pre class="script">Hidden Geography
  Week 01
    Long
      Voice
      Clips 01-40
      Final
    Short 01
    Short 02
    Short 03</pre><ul class="instructions"><li><b>Long:</b> voice MP3, 40 Flow clips aur final 16:9 video.</li><li><b>Short 01–03:</b> har Short ki voice, Flow clips aur final 9:16 video.</li><li><b>Week badle:</b> Week 02 ka naya folder banao. Week 01 ki files overwrite mat karo.</li></ul></section>
<section class="step"><div class="head"><span class="num">04</span><h2>Long video ka poora order</h2></div><ol class="instructions"><li><a class="open" href="calendar.html">Calendar kholo</a> aur jis week par kaam karna hai woh dekho.</li><li><a class="open" href="longs/index.html">Lambi videos kholo</a> aur us week ka Long studio kholo.</li><li><b>01 Voiceover:</b> “Poora script copy karo” dabao. F5-TTS kholo, script paste karo, saved voice select karo aur audio banao. Download ko page par diya exact naam do.</li><li>Wapas studio page par aao. <b>02 Voice upload</b> mein wahi MP3 select karo. Neeche ke clip timings asli voice ke mutabiq update ho jayenge.</li><li><b>03 Google Flow:</b> New project kholo. Model <b>Video → Veo 3.1 Lite</b>, ratio <b>16:9</b>, duration <b>8 seconds</b>, output <b>1</b>.</li><li>Clip 01 ka prompt copy karke Flow mein paste aur Generate. Sahi result download karke card par diya exact filename rakho. Isi tarah clip 40 tak.</li><li>Map/coastline ghalat, extra text, logo, broken object ya ajeeb movement ho to woh clip accept mat karo; dobara Generate.</li><li><b>04 CapCut:</b> naya 16:9 project. Voice Audio Track 1 par zero se. Saare Flow clips filename order mein import aur har clip ka <b>Volume 0</b>.</li><li>Page par updated timestamp aur quoted voice line ko dekh kar clip badlo. Gap aaye to halka slow ya clean freeze frame; black screen nahi.</li><li>Export <b>1080p, 30fps</b> aur Long/Final folder mein save.</li></ol><article class="clip-card"><p><b>Yaad:</b> voice upload karne ka matlab website par awaaz bhejna nahi. Browser file ki duration parhta hai aur sirf tumhare phone par timings update karta hai.</p></article></section>
<section class="step"><div class="head"><span class="num">05</span><h2>Teen Shorts ka poora order</h2></div><ol class="instructions"><li><a class="open" href="shorts/index.html">Choti videos kholo</a> aur Week 01 ka Short 01 kholo.</li><li>Script copy karke F5-TTS mein voice banao. Page ka exact MP3 filename rakho.</li><li>Voice Short page par upload karo taake timing update ho.</li><li>Google Flow mein model Veo 3.1 Lite, ratio <b>9:16</b>, duration 8 seconds aur output 1.</li><li>Har prompt alag Generate karo. Card ka exact filename rakho aur QC note se clip check karo.</li><li>CapCut 9:16 project mein voice zero se. Flow clips ka Volume 0 aur page ke updated timings/cut cues par clips badlo.</li><li>Export 1080p, 30fps aur Short 01 folder mein save.</li><li>Bilkul isi order se Short 02 aur Short 03 banao.</li></ol><p class="tip">Ek week tab production-complete hai jab 1 Long aur 3 Shorts export ho chuki hon.</p></section>
<section class="step"><div class="head"><span class="num">06</span><h2>Music aur captions</h2></div><ol class="instructions"><li>Voice sab se clear rehni chahiye.</li><li>Saif approved music de to CapCut mein <b>5%</b> volume se shuru karo; voice dab rahi ho to aur kam.</li><li>Random copyrighted song mat lagao.</li><li>English auto captions banao, har spelling check karo aur captions ko center safe area mein rakho.</li><li>TikTok buttons ke neeche ya YouTube edge ke paas text mat rakho.</li></ol></section>
<section class="step"><div class="head"><span class="num">07</span><h2>YouTube aur TikTok par upload</h2></div><ol class="instructions"><li>YouTube Long ke liye Long studio page ka title bilkul same rakho. Category Education, language English aur audience Not made for kids.</li><li>YouTube Short ke liye us Short page ka title same rakho. Original 9:16 file upload karo, kisi doosre platform ke watermark wali copy nahi.</li><li>Upload pehle <b>Private</b> rakho. Title, captions, cover, audio aur ratio check karke Schedule/Public.</li><li>TikTok ke liye <a class="open" href="seo/week-01.html">Week 01 TikTok upload packs kholo</a>.</li><li>Short 01 ke liye sirf Short 01 card ka caption, cover text aur filename. Isi tarah Short 02 aur Short 03.</li><li>Extra <b>#fyp</b> ya random hashtags mat lagao.</li></ol></section>
<section class="step"><div class="head"><span class="num">08</span><h2>In alfaaz ka matlab</h2></div><div class="cards"><article class="card"><p class="meta">Script</p><p>Woh English narration jo F5-TTS ko deni hai.</p></article><article class="card"><p class="meta">Prompt</p><p>English instruction jo Google Flow ko ek clip banane ke liye deni hai.</p></article><article class="card"><p class="meta">Clip</p><p>Flow se download hone wali 8-second choti video file.</p></article><article class="card"><p class="meta">Cut cue</p><p>Voice ki quoted line. Yeh line aaye to agla clip lagana hai.</p></article><article class="card"><p class="meta">Timestamp</p><p>CapCut timeline ka waqt, jaise 0:47.</p></article><article class="card"><p class="meta">Volume 0</p><p>Flow clip ki apni awaaz band. Sirf F5 voice aur low music sunai den.</p></article><article class="card"><p class="meta">16:9</p><p>YouTube Long ki horizontal video.</p></article><article class="card"><p class="meta">9:16</p><p>YouTube Short aur TikTok ki vertical video.</p></article><article class="card"><p class="meta">Cover</p><p>Post kholne se pehle nazar aane wali image/frame.</p></article><article class="card"><p class="meta">Captions</p><p>Video par voice ke English words.</p></article></div></section>
<section class="step"><div class="head"><span class="num">09</span><h2>Kaam complete check</h2></div><ul class="instructions"><li><b>Long:</b> voice + 40 named clips + 16:9 final export.</li><li><b>Short 01:</b> voice + named clips + 9:16 final export.</li><li><b>Short 02:</b> voice + named clips + 9:16 final export.</li><li><b>Short 03:</b> voice + named clips + 9:16 final export.</li><li><b>Audio:</b> saare Flow clips Volume 0, voice clear, music low.</li><li><b>Visual:</b> koi ghalat map, extra text, logo ya black gap nahi.</li><li><b>Upload:</b> English captions, correct title/card, Not made for kids, correct ratio.</li><li><b>Final:</b> Private preview poori dekh kar hi Public/Schedule.</li></ul></section>
<section class="step"><div class="head"><span class="num">10</span><h2>Agar samajh na aaye</h2></div><article class="clip-card"><p>Guess mat karo. Jis screen par ruk gayi ho us ka poora screenshot Saif ko bhejo aur sirf yeh likho: <b>“Main Week 01 Long ke step 03, clip 12 par ruk gayi hoon.”</b> Saif ko foran pata chal jayega kis jagah help chahiye.</p></article><a class="link" href="calendar.html">Ab Week ka kaam shuru karo</a></section></main>`;
write('docs/manual.html', shell({ title: 'Maryam ka manual', brand: 'Maryam ka manual', body: manualBody }));

const setupBody = `<main><p class="eyebrow">Sirf ek dafa karna hai</p><h1>YouTube aur TikTok setup</h1><p class="lede">Maryam: pehle YouTube ka 01–04 setup karo, phir TikTok ka 05–07. Har English box seedha copy karke usi jagah paste karo.</p><article class="clip-card"><p><b>Algorithm ki asal baat:</b> koi secret switch reach nahi deta. YouTube viewer ka click, watch aur satisfaction dekhta hai. TikTok watch behavior aur interactions ke saath caption, sound aur hashtags se topic samajhta hai. Yeh setup channel ko ek saaf geography niche aur consistent identity deta hai.</p></article>
<section class="step"><div class="head"><span class="num">01</span><h2>YouTube channel ki pehchan</h2></div><ol class="instructions"><li><a class="open" href="https://studio.youtube.com/" target="_blank" rel="noopener">YouTube Studio kholo</a>.</li><li><b>Customization → Profile</b> kholo.</li><li>Name aur pehla handle paste karo. Handle unavailable ho to sirf fallback try karo.</li></ol>${copyField('Channel name', channelSetup.youtube.name, 'geo-youtube-name')}${copyField('Pehla handle', channelSetup.youtube.handle, 'geo-youtube-handle')}${copyField('Sirf unavailable ho to fallback', channelSetup.youtube.fallback_handle, 'geo-youtube-fallback')}${copyField('Channel description', channelSetup.youtube.description, 'geo-youtube-description')}</section>
<section class="step"><div class="head"><span class="num">02</span><h2>YouTube profile aur banner</h2></div><p class="tip">Profile square banao. Banner 2560 × 1440 px banao aur saara zaroori text bilkul beech ke safe area mein rakho.</p>${copyField('Profile image prompt', channelSetup.youtube.profile_prompt, 'geo-profile-prompt')}${copyField('Banner background prompt', channelSetup.youtube.banner_prompt, 'geo-banner-prompt')}${copyField('Banner par CapCut mein text', channelSetup.youtube.banner_text, 'geo-banner-text')}<ul class="instructions"><li>Profile: square PNG; globe aur compass tiny circle mein bhi clear hon.</li><li>Banner: 2560 × 1440 px recommended, 6 MB se kam.</li><li>Text: bilkul center; desktop, mobile aur TV preview check karke Publish.</li><li>Watermark: profile wali same image poori video par lagao.</li></ul></section>
<section class="step"><div class="head"><span class="num">03</span><h2>YouTube channel settings</h2></div><ol class="instructions"><li><b>Studio → Settings → Channel → Basic info</b>.</li><li>Country of residence mein apna asal country select karo.</li><li>Keywords paste karo.</li><li><b>Advanced settings → Audience:</b> No, set this channel as not made for kids.</li><li><b>Feature eligibility:</b> phone/identity verification jo available ho complete karo.</li></ol>${copyField('Channel keywords', channelSetup.youtube.keywords, 'geo-channel-keywords')}${copyField('Playlist name', channelSetup.youtube.playlist, 'geo-playlist')}</section>
<section class="step"><div class="head"><span class="num">04</span><h2>YouTube upload defaults</h2></div><p class="tip">Studio → Settings → Upload defaults. Browser ke bahar upload karo to yeh settings manually check karni hain.</p><ul class="instructions"><li><b>Visibility:</b> Private; title, description, thumbnail aur captions check karke Schedule/Public.</li><li><b>Title aur description:</b> default khali; har video ka apna verified pack use hoga.</li><li><b>Category:</b> Education. <b>Language:</b> English.</li><li><b>License:</b> Standard YouTube License.</li><li><b>Comments:</b> On; potentially inappropriate comments review ke liye hold.</li><li><b>Captions:</b> English captions correct karke publish.</li><li><b>Altered content:</b> realistic synthetic scenes hon to upload par honestly disclose.</li><li><b>Third-party AI training:</b> off jab tak Saif khud permission na den.</li></ul><p class="tip">Home tab par Uploads, Shorts aur phir <b>${escapeHtml(channelSetup.youtube.playlist)}</b> playlist lagao.</p></section>
<section class="step"><div class="head"><span class="num">05</span><h2>TikTok account setup</h2></div><ol class="instructions"><li>Email/phone verify karo.</li><li><b>Personal Account</b> hi rakho aur account <b>Public</b> karo. Creator tools aur general sounds ke liye yeh sahi choice hai.</li><li>Nickname, username aur bio paste karo.</li></ol>${copyField('TikTok nickname', channelSetup.tiktok.nickname, 'geo-tiktok-name')}${copyField('TikTok username', channelSetup.tiktok.username, 'geo-tiktok-handle')}${copyField('Sirf unavailable ho to fallback', channelSetup.tiktok.fallback_username, 'geo-tiktok-fallback')}${copyField('TikTok bio', channelSetup.tiktok.bio, 'geo-tiktok-bio')}<p class="tip">Dono platforms par mumkin ho to same final handle rakho. Personal Account mein website link aam tor par 1,000 followers ke baad milta hai; YouTube link ka option nazar aaye to connect karo.</p></section>
<section class="step"><div class="head"><span class="num">06</span><h2>TikTok privacy aur upload settings</h2></div><ul class="instructions"><li><b>Account:</b> Public Personal Account.</li><li><b>Comments:</b> Everyone; filters on.</li><li><b>Duet aur Stitch:</b> On.</li><li><b>Downloads:</b> Off, clean copies ki reposting kam karne ke liye.</li><li><b>Video:</b> original 1080 × 1920, 9:16, kisi platform ke watermark ke baghair.</li><li><b>Captions:</b> English auto captions post se pehle correct karo.</li><li><b>Cover:</b> upload pack ka text center safe area mein.</li><li><b>Disclosure:</b> realistic AI visuals ka label option aaye to honestly select karo.</li></ul></section>
<section class="step"><div class="head"><span class="num">07</span><h2>Har upload ke baad algorithm check</h2></div><ol class="instructions"><li>Upload pack ka exact caption use karo; random <b>#fyp</b> aur unrelated hashtags mat lagao.</li><li>Main search phrase voice, captions aur post caption mein naturally match honi chahiye.</li><li>YouTube par pehle 24 ghantay Home/Suggested CTR aur audience retention dekho.</li><li>TikTok par average watch time, full-video watches, search traffic, shares aur saves dekho.</li><li>Weak post foran delete/re-upload mat karo. Agli Short ka opening aur cover data se improve karo.</li><li>Kisi ek video ka fail hona poore channel ko algorithm penalty nahi deta.</li></ol></section>
<section class="step"><div class="head"><span class="num">08</span><h2>Official references</h2></div><ul class="source-list"><li><a href="https://support.google.com/youtube/answer/16559650?hl=en" target="_blank" rel="noopener">YouTube recommendation performance</a></li><li><a href="https://support.google.com/youtube/answer/10456525?hl=en" target="_blank" rel="noopener">YouTube profile, banner aur watermark specifications</a></li><li><a href="https://support.google.com/youtube/answer/2976814?hl=en" target="_blank" rel="noopener">YouTube channel settings</a></li><li><a href="https://support.google.com/youtube/answer/2660027?hl=en" target="_blank" rel="noopener">YouTube upload defaults</a></li><li><a href="https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content" target="_blank" rel="noopener">TikTok recommendation factors</a></li><li><a href="https://support.tiktok.com/en/using-tiktok/growing-your-audience/creator-search-insights" target="_blank" rel="noopener">TikTok Creator Search Insights</a></li><li><a href="https://support.tiktok.com/en/using-tiktok/growing-your-audience/switching-to-a-creator-or-business-account" target="_blank" rel="noopener">TikTok account types</a></li></ul></section></main>`;
write('docs/channel-setup.html', shell({ title: 'YouTube aur TikTok setup', brand: 'Channel setup', body: setupBody }));

const tiktokCards = tiktokPacks.map(pack => `<article class="clip-card"><p class="eyebrow">TikTok · Short ${pad(pack.short)}</p><h2>${escapeHtml(pack.title)}</h2>${copyField('Main search phrase', pack.search_phrase, `tt-search-${pack.short}`)}${copyField('Final TikTok caption', pack.caption, `tt-caption-${pack.short}`)}${copyField('Cover par text', pack.cover_text, `tt-cover-${pack.short}`)}${copyField('Pehli frame ka text', pack.first_frame_text, `tt-first-${pack.short}`)}${copyField('Final file naam', pack.filename, `tt-file-${pack.short}`)}<ul class="instructions mini"><li>Original 9:16 export upload karo; YouTube watermark wali downloaded copy nahi.</li><li>English captions on karke spelling check karo.</li><li>Cover text center safe area mein set karo.</li><li>Caption ek hi dafa poora paste karo; extra <b>#fyp</b> mat lagao.</li><li>Post ke baad More insights mein watch time, full watches, search aur shares note karo.</li></ul></article>`).join('');
write('docs/seo/week-01.html', shell({ title: 'Week 01 TikTok upload packs', brand: 'Hafta 01 · TikTok', depth: 1, body: `<main><p class="eyebrow">3 copy-ready TikTok packs</p><h1>Week 01 TikTok upload packs</h1><p class="lede">Maryam: Short export hone ke baad usi number ka card kholo. Caption, cover text aur filename seedha copy karo.</p><article class="clip-card"><p><b>Verified rule:</b> TikTok user interactions aur watch behavior ko strong signals maanta hai. Caption, sound aur hashtags topic samjhate hain. Isliye har card mein ek main search phrase voice, captions aur caption ke saath match ki gayi hai.</p></article><section class="step"><div class="head"><span class="num">01</span><h2>Teen Shorts publish karo</h2></div><div class="clip-list">${tiktokCards}</div></section><section class="step"><div class="head"><span class="num">02</span><h2>Official reference</h2></div><ul class="source-list"><li><a href="https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content" target="_blank" rel="noopener">TikTok: content recommendation factors</a></li><li><a href="https://support.tiktok.com/en/using-tiktok/growing-your-audience/creator-search-insights" target="_blank" rel="noopener">TikTok: Creator Search Insights</a></li></ul></section></main>` }));

write('docs/style-guide.html', shell({ title: 'Flow style guide', brand: 'Flow style guide', body: `<main><h1>Google Flow style guide</h1><p class="lede">Har week ka visual look isi rule par lock rahega.</p><section class="step"><div class="head"><span class="num">01</span><h2>Long settings</h2></div><ul class="instructions"><li>Video → Veo 3.1 Lite, horizontal 16:9, output 1, har raw clip 8 seconds.</li><li>Cinematic geography documentary, accurate coastlines, photorealistic terrain aur natural light.</li><li>Ek continuous shot; slow steady drone, dolly, overhead ya orbital motion.</li><li>Prompt mein no text, logo, watermark, spoken dialogue aur narration locked hai.</li></ul></section><section class="step"><div class="head"><span class="num">02</span><h2>Short settings</h2></div><ul class="instructions"><li>Video → Veo 3.1 Lite, vertical 9:16, output 1, subject center safe area mein.</li><li>Text Google Flow ke andar generate nahi karna; captions CapCut mein.</li><li>Map/coastline ya object ghalat ho to clip accept nahi karni—regenerate karo.</li><li>Har clip ka exact filename page par diya gaya hai.</li></ul></section><section class="step"><div class="head"><span class="num">03</span><h2>Voice + edit</h2></div><ul class="instructions"><li>Voiceover F5-TTS se separate generate karo.</li><li>Voice upload karke page ke timestamps rescale karo.</li><li>Flow ki saari clip audio CapCut mein Volume 0 karo.</li><li>Music 5–7% se shuru karo; voice clear rehni chahiye.</li><li>Long 1080p 16:9 aur Shorts 1080p 9:16, 30fps.</li></ul></section></main>` }));

write('docs/style.css', `:root{--ink:#101820;--paper:#f4f0e4;--paper2:#e7dfca;--blue:#176b87;--gold:#b36a22;--green:#3e6b52;--rule:#344451;--pad:18px} @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;600;700&family=IBM+Plex+Serif:wght@700&display=swap');*{box-sizing:border-box}html{max-width:100%;overflow-x:hidden;background:var(--ink)}body{margin:0;min-width:320px;max-width:100%;overflow-x:hidden;color:var(--ink);background-color:var(--paper);background-image:repeating-linear-gradient(0deg,transparent 0,transparent 31px,rgba(52,68,81,.055) 32px);font-family:'IBM Plex Sans',sans-serif;font-size:15.5px;line-height:1.6}a{color:inherit}button,input{font:inherit}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--blue);outline-offset:2px}.home{min-height:100svh;display:flex;flex-direction:column;padding:24px var(--pad)}.home main{width:min(100%,660px);margin:auto}.home-help{max-width:58ch;margin:0 0 20px;color:#46515d}.brand,.eyebrow,.meta,.filename,.clip-time,.clip-count,.num{font-family:'IBM Plex Mono',monospace}.brand{font-size:11.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase}.eyebrow{margin:0 0 8px;color:var(--gold);font-size:12px;font-weight:600;text-transform:uppercase}h1,h2{overflow-wrap:anywhere;font-family:'IBM Plex Serif',serif;line-height:1.08}h1{margin:0 0 14px;font-size:clamp(30px,8vw,44px)}h2{margin:0;font-size:20px}.tiles,.cards,.clip-list{display:grid;min-width:0;gap:12px}.tiles a{min-height:92px;display:flex;align-items:center;gap:18px;padding:18px;color:var(--paper);background:var(--ink);border-radius:3px;text-decoration:none}.tiles a:hover{background:var(--blue)}.num{min-width:28px;color:#e57b55;font-size:13px;font-weight:600}.lbl{font-family:'IBM Plex Serif',serif;font-size:22px}.bar{min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px var(--pad);color:var(--paper);background:var(--ink)}.back{flex:0 0 auto;color:var(--paper);text-decoration:none;font-family:'IBM Plex Mono',monospace;font-size:12px}.site-menu{position:relative;z-index:10}.site-menu summary{min-height:40px;display:flex;align-items:center;padding:8px 10px;border:1px solid #ffffff66;border-radius:3px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:11.5px}.site-menu summary::-webkit-details-marker{display:none}.site-menu nav{position:absolute;top:calc(100% + 7px);right:0;width:min(82vw,250px);padding:7px;background:var(--ink);border:1px solid #ffffff55}.site-menu a{min-height:44px;display:flex;align-items:center;padding:10px 12px;color:var(--paper);text-decoration:none;font-size:13px}.site-menu a:hover{background:var(--blue)}.work{padding-bottom:48px}.work main{width:min(100%,720px);min-width:0;margin:0 auto;padding:34px var(--pad) 0}.lede{max-width:55ch;margin:0 0 26px;color:#46515d}.step{min-width:0;padding:26px 0;border-top:1px solid var(--rule)}.head{display:flex;align-items:center;gap:12px;margin-bottom:16px}.script,.prompt{max-width:100%;overflow-x:auto;overflow-wrap:anywhere;margin:0 0 12px;padding:15px;color:var(--ink);background:#e7dfcad9;border-left:3px solid var(--gold);white-space:pre-wrap;font-family:'IBM Plex Sans',sans-serif;font-size:14px;line-height:1.65}.prompt{font-size:13px;line-height:1.5}.actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 14px}.copy,.link{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border:0;border-radius:3px;color:var(--paper);background:var(--blue);font-weight:700;text-decoration:none;cursor:pointer}.copy:hover,.link:hover{background:#10536a}.copy.done{background:var(--green)}.text-link{padding:8px 4px;color:var(--blue);font-weight:700}.drop{display:block;padding:20px;border:2px dashed var(--blue);background:#e7dfca88;cursor:pointer}.drop input{display:block;width:100%;max-width:100%;margin-top:12px}.drop-cta{display:block;color:var(--blue);font-weight:700}.drop-sub,.tip{color:#46515d;font-size:13px}.status{margin-top:16px}.status p{margin:3px 0}.clip-card{min-width:0;padding:18px;background:var(--paper2);border-left:3px solid var(--gold)}.clip-head{display:flex;justify-content:space-between;gap:12px;margin-bottom:12px}.clip-head>div{display:flex;min-width:0;flex-wrap:wrap;gap:8px}.filename{overflow-wrap:anywhere;font-weight:600}.clip-time,.clip-count{flex:0 0 auto;color:var(--gold);font-size:12px;font-weight:600}.cue{overflow-wrap:anywhere;margin:14px 0 0;color:#46515d;font-size:13px}.instructions{margin:0;padding-left:24px}.instructions li{padding:4px 0}.instructions.mini{margin:0 0 18px}.upload-field{margin-top:22px;padding-top:18px;border-top:1px solid #34445155}.upload-field:first-of-type{margin-top:14px}.upload-field .script{background:#f4f0e4cc}.stat{color:var(--gold);font-family:'IBM Plex Mono',monospace;font-size:12px}.cards .card{min-width:0;padding:18px;background:var(--paper2);border-left:3px solid var(--gold)}.card .meta{margin:0 0 5px;color:var(--gold);font-size:12px}.card h2{margin-bottom:12px}.card a,.open,.source-list a{color:var(--blue);font-weight:700}.soon{color:#687480;font-family:'IBM Plex Mono',monospace;font-size:12px}.table-wrap{overflow-x:auto;border-top:1px solid var(--rule)}.timing{width:100%;border-collapse:collapse}.timing th,.timing td{padding:13px 9px;text-align:left;vertical-align:top;border-bottom:1px solid #34445155}.timing th{font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase}.timing td:first-child{color:var(--gold);font-family:'IBM Plex Mono',monospace}.source-list{padding-left:20px}.source-list li{margin:8px 0}@media(max-width:420px){.bar .brand{display:none}.copy,.link{width:100%}.actions .text-link{width:100%}.clip-head{align-items:flex-start}.clip-count{font-size:11px}}@media(min-width:900px){.site-menu{position:fixed;top:76px;left:18px}.site-menu nav{left:0;right:auto;width:230px}}@media(min-width:640px){:root{--pad:24px}.tiles a{min-height:110px}.lbl{font-size:25px}}`);

write('docs/app.js', `(function(){const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));document.addEventListener('click',async e=>{const btn=e.target.closest('[data-copy]');if(!btn)return;const target=$(btn.getAttribute('data-copy'));const value=target?target.textContent.trim():'';if(!value)return;try{await navigator.clipboard.writeText(value)}catch{const ta=document.createElement('textarea');ta.value=value;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}const old=btn.textContent;btn.textContent='Copy ho gaya';btn.classList.add('done');setTimeout(()=>{btn.textContent=old;btn.classList.remove('done')},1400)});const voice=$('#voice');if(!voice)return;voice.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const url=URL.createObjectURL(file);const audio=new Audio(url);await new Promise(resolve=>audio.addEventListener('loadedmetadata',resolve,{once:true}));const actual=audio.duration;const predicted=Number($('main').dataset.predictedDuration)||actual;const ratio=actual/predicted;$$('[data-t]').forEach(el=>{const scaled=Number(el.dataset.t)*ratio;el.textContent=fmt(scaled);el.classList.add('scaled')});$('#actual').textContent=fmt(actual);$('#status').hidden=false;URL.revokeObjectURL(url)});function fmt(seconds){return Math.floor(seconds/60)+':'+String(Math.floor(seconds%60)).padStart(2,'0')}})();`);
write('docs/.nojekyll', '');

console.log(JSON.stringify({
  longWords: longData.word_count,
  longClips: longData.clips.length,
  shortWords: shorts.map(item => item.word_count),
  shortClips: shorts.map(item => item.clips.length)
}, null, 2));
