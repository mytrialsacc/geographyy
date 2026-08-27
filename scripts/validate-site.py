#!/usr/bin/env python3
import json
import posixpath
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
ERRORS = []


def fail(message):
    ERRORS.append(message)


def word_count(text):
    return len(re.findall(r"[A-Za-z0-9]+(?:['’][A-Za-z]+)?", text))


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.copy_targets = []
        self.refs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if values.get("data-copy"):
            self.copy_targets.append(values["data-copy"].removeprefix("#"))
        for name in ("href", "src"):
            if values.get(name):
                self.refs.append(values[name])


required = {
    "index.html",
    "manual.html",
    "channel-setup.html",
    "calendar.html",
    "longs/index.html",
    "longs/week-01.html",
    "shorts/index.html",
    "shorts/week-01/short-1.html",
    "shorts/week-01/short-2.html",
    "shorts/week-01/short-3.html",
    "seo/week-01.html",
    "style-guide.html",
    "style.css",
    "app.js",
    "data/week-01/long.json",
    "data/week-01/short-1.json",
    "data/week-01/short-2.json",
    "data/week-01/short-3.json",
    "data/week-01/tiktok.json",
    "data/channel-setup.json",
}
files = {str(path.relative_to(DOCS)).replace("\\", "/") for path in DOCS.rglob("*") if path.is_file()}
for name in sorted(required - files):
    fail(f"missing required output: {name}")

packs = ["long"] + [f"short-{number}" for number in range(1, 4)]
expected_clips = {"long": 40, "short-1": 5, "short-2": 5, "short-3": 6}
for pack in packs:
    target = DOCS / "data" / "week-01" / f"{pack}.json"
    if not target.exists():
        continue
    data = json.loads(target.read_text(encoding="utf-8"))
    script = data.get("script", "")
    actual_words = word_count(script)
    if data.get("word_count") != actual_words:
        fail(f"{pack}: word_count does not match script")
    if pack == "long" and not 1000 <= actual_words <= 1200:
        fail(f"long: expected 1000-1200 words, got {actual_words}")
    if pack != "long" and not 110 <= actual_words <= 135:
        fail(f"{pack}: expected 110-135 words, got {actual_words}")
    clips = data.get("clips", [])
    if len(clips) != expected_clips[pack]:
        fail(f"{pack}: expected {expected_clips[pack]} clips, got {len(clips)}")
    if pack == "long" and data.get("title") != "Why Mercator Maps Make Africa Look Too Small":
        fail("long: verified title changed unexpectedly")
    if len(data.get("sources", [])) < 9:
        fail(f"{pack}: official/primary source list is incomplete")
    previous_time = -1
    search_from = 0
    expected_prefix = "v1" if pack == "long" else {"short-1": "s1a", "short-2": "s1b", "short-3": "s1c"}[pack]
    ratio = "16:9" if pack == "long" else "9:16"
    for index, clip in enumerate(clips, 1):
        expected_name = f"{expected_prefix}-clip-{index:02}.mp4"
        if clip.get("filename") != expected_name:
            fail(f"{pack} clip {index}: filename must be {expected_name}")
        start = float(clip.get("predicted_start_seconds", -1))
        if start <= previous_time:
            fail(f"{pack} clip {index}: timestamp is not increasing")
        previous_time = start
        prompt = clip.get("prompt", "").lower()
        for guard in ("8-second", ratio, "no text", "no logos", "no watermark", "no spoken dialogue or narration"):
            if guard not in prompt:
                fail(f"{pack} clip {index}: prompt missing {guard}")
        if "--ar" in prompt or "8k" in prompt:
            fail(f"{pack} clip {index}: unsupported or empty prompt decoration remains")
        cue = clip.get("cut_cue", "")
        if index < len(clips):
            match = re.search(r'"([^"]+)"', cue)
            if not match:
                fail(f"{pack} clip {index}: cue has no quoted script phrase")
                continue
            phrase = match.group(1)
            found = script.lower().find(phrase.lower(), search_from)
            if found < 0:
                fail(f"{pack} clip {index}: cue phrase missing or out of order: {phrase}")
                continue
            expected_next = round(word_count(script[: found + len(phrase)]) / 145 * 60, 1)
            if abs(float(clips[index].get("predicted_start_seconds", -1)) - expected_next) > 0.11:
                fail(f"{pack} clip {index + 1}: timestamp does not come from previous cue")
            search_from = found + len(phrase)

tiktok_file = DOCS / "data" / "week-01" / "tiktok.json"
if tiktok_file.exists():
    tiktok_packs = json.loads(tiktok_file.read_text(encoding="utf-8"))
    if len(tiktok_packs) != 3:
        fail(f"tiktok: expected 3 packs, got {len(tiktok_packs)}")
    for index, pack in enumerate(tiktok_packs, 1):
        if pack.get("short") != index:
            fail(f"tiktok pack {index}: short number mismatch")
        for field in ("title", "search_phrase", "caption", "cover_text", "first_frame_text", "filename"):
            if not pack.get(field):
                fail(f"tiktok pack {index}: missing {field}")
        if pack.get("caption", "").count("#") < 3:
            fail(f"tiktok pack {index}: caption needs focused hashtags")
        if "#fyp" in pack.get("caption", "").lower():
            fail(f"tiktok pack {index}: generic #fyp must not be used")

setup_file = DOCS / "data" / "channel-setup.json"
if setup_file.exists():
    setup = json.loads(setup_file.read_text(encoding="utf-8"))
    for platform in ("youtube", "tiktok"):
        if platform not in setup:
            fail(f"channel setup: missing {platform}")

for filename in sorted(name for name in files if name.endswith(".html")):
    text = (DOCS / filename).read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(text)
    if len(parser.ids) != len(set(parser.ids)):
        fail(f"{filename}: duplicate HTML id")
    for target in parser.copy_targets:
        if target not in parser.ids:
            fail(f"{filename}: copy target #{target} does not exist")
    for ref in parser.refs:
        if ref.startswith(("http://", "https://", "#", "mailto:", "tel:", "data:")):
            continue
        clean = ref.split("#", 1)[0].split("?", 1)[0]
        resolved = posixpath.normpath(posixpath.join(posixpath.dirname(filename), clean))
        if clean.endswith("/"):
            resolved = posixpath.join(resolved, "index.html")
        if resolved not in files:
            fail(f"{filename}: broken local reference {ref} -> {resolved}")

home = (DOCS / "index.html").read_text(encoding="utf-8") if (DOCS / "index.html").exists() else ""
if "Maryam:" not in home:
    fail("home: beginner start instruction is missing")
for required_link in ("channel-setup.html", "seo/week-01.html"):
    if required_link not in home:
        fail(f"home: missing top-level link {required_link}")
if "manual.html" not in home:
    fail("home: missing top-level manual link")
manual_html = (DOCS / "manual.html").read_text(encoding="utf-8") if (DOCS / "manual.html").exists() else ""
for required_text in ("Maryam · sab se pehle yeh parho", "Long video ka poora order", "Teen Shorts ka poora order", "Agar samajh na aaye"):
    if required_text not in manual_html:
        fail(f"manual page: missing {required_text}")
for required_text in (
    "https://f5tts-prod.duckdns.org/web/",
    "https://labs.google/fx/tools/flow",
    "bm_mix_adam_lewis",
    "Speed:</b> 0.8",
    "Video → Veo 3.1 Lite",
    "ratio <b>16:9</b>",
    "ratio <b>9:16</b>",
    "duration <b>8 seconds</b>",
    "output <b>1</b>",
):
    if required_text not in manual_html:
        fail(f"manual page: exact tool setting/link is missing: {required_text}")
setup_html = (DOCS / "channel-setup.html").read_text(encoding="utf-8") if (DOCS / "channel-setup.html").exists() else ""
for required_text in ("Hidden Geography", "@HiddenGeographyHQ", "Personal Account", "Official references"):
    if required_text not in setup_html:
        fail(f"channel setup page: missing {required_text}")
tiktok_html = (DOCS / "seo" / "week-01.html").read_text(encoding="utf-8") if (DOCS / "seo" / "week-01.html").exists() else ""
for required_text in ("Greenland Is Not the Size of Africa", "Why Google Maps Uses Mercator Geometry", "No Flat World Map Can Be Perfect"):
    if required_text not in tiktok_html:
        fail(f"TikTok page: missing {required_text}")
long_html = (DOCS / "longs" / "week-01.html").read_text(encoding="utf-8") if (DOCS / "longs" / "week-01.html").exists() else ""
for required_text in ("Google Flow kholo", "Veo 3.1 Lite", "Volume 0", "Verified sources", "bm_mix_adam_lewis", "speed <b>0.8</b>"):
    if required_text not in long_html:
        fail(f"long page: missing beginner instruction: {required_text}")
all_content = "\n".join((DOCS / name).read_text(encoding="utf-8") for name in files if name.endswith((".html", ".json")))
for banned in ("Every Map You've Seen Is Lying", "Western Europe", "Generated audio off", "guaranteed to arrive"):
    if banned.lower() in all_content.lower():
        fail(f"outdated or misleading phrase remains: {banned}")
if re.search(r"\bSaif\b", all_content, flags=re.IGNORECASE):
    fail("site pages: old reporter name Saif remains; use Anas")
for awkward_phrase in (
    "khool",
    "Generate dabao",
    "Guess mat karo",
    "Tumhari instruction copy hai",
):
    if awkward_phrase.lower() in all_content.lower():
        fail(f"site wording: awkward phrase remains: {awkward_phrase}")
if re.search(r"\bkhol\b", all_content, flags=re.IGNORECASE):
    fail("site wording: use the natural instruction 'kholo', not 'khol'")
if "https://www.usgs.gov/faqs/how-are-different-map-projections-used" not in long_html:
    fail("long page: current official USGS projection reference is missing")

css = (DOCS / "style.css").read_text(encoding="utf-8") if (DOCS / "style.css").exists() else ""
for rule in ("overflow-x:hidden", "overflow-wrap:anywhere", "@media(max-width:420px)"):
    if rule not in css:
        fail(f"style.css: mobile guard missing: {rule}")
if "--gold:#7a3e00" not in css:
    fail("style.css: accessible copper text color is missing")

if ERRORS:
    print(f"VALIDATION FAILED ({len(ERRORS)} issues)")
    for error in ERRORS:
        print(f"- {error}")
    sys.exit(1)

print("VALIDATION PASSED: beginner manual, channel setup, Week 1 long + 3 shorts, TikTok packs, 56 prompts/cues, links and JSON")
