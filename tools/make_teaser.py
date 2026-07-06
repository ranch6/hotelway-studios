"""Hotelway Studios 3s vertical teaser — three illustrated hotel scenes
(room w/ mountain window, gold terrace over lake, golden dome) with slow
Ken Burns moves and crossfades. Output: 1080x1920 @ 30fps H.264."""
import math
import numpy as np
import imageio.v2 as imageio
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920            # output
SW, SH = 1512, 2688          # oversized scene canvas (1.4x) for pan/zoom room
FPS = 30
SCENE_F = 30                 # 1s per scene
XFADE = 6                    # crossfade frames

INK = (43, 39, 33)
LINEN = (250, 247, 241)
CREAM = (246, 241, 229)
BUTTER = (236, 223, 174)
GOLD = (198, 166, 100)
GOLD_DK = (160, 129, 70)
PERI = (167, 177, 220)
PERI_DK = (109, 122, 177)
MAGENTA = (201, 64, 126)
SKYBLUE = (132, 168, 214)
SKYPALE = (205, 224, 240)
PINE = (58, 84, 58)
PINE_DK = (40, 60, 42)
LAKE = (94, 138, 176)


def vgrad(draw, x0, y0, x1, y1, top, bottom):
    steps = y1 - y0
    for i in range(steps):
        t = i / max(steps - 1, 1)
        c = tuple(int(top[k] + (bottom[k] - top[k]) * t) for k in range(3))
        draw.line([(x0, y0 + i), (x1, y0 + i)], fill=c)


def scene_room():
    img = Image.new("RGB", (SW, SH))
    d = ImageDraw.Draw(img)
    # warm wall with gentle light falloff
    vgrad(d, 0, 0, SW, SH, (233, 221, 202), (208, 192, 168))
    # ceiling cove glow
    vgrad(d, 0, 0, SW, 260, (246, 236, 214), (233, 221, 202))
    # window (right side) with mountains
    wx0, wy0, wx1, wy1 = 800, 300, 1512, 1500
    d.rectangle([wx0, wy0, wx1, wy1], fill=CREAM)
    gx0, gy0, gx1, gy1 = wx0 + 28, wy0 + 28, wx1, wy1 - 28
    vgrad(d, gx0, gy0, gx1, gy1, SKYPALE, (225, 235, 242))
    # mountain layers in window
    d.polygon([(gx0, 1080), (960, 780), (1120, 980), (1260, 820), (gx1, 1060),
               (gx1, gy1), (gx0, gy1)], fill=(168, 182, 205))
    d.polygon([(gx0, 1210), (1040, 960), (1220, 1160), (1380, 1010), (gx1, 1190),
               (gx1, gy1), (gx0, gy1)], fill=(140, 156, 184))
    # sheer curtain (soft vertical band)
    curtain = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    cd = ImageDraw.Draw(curtain)
    for i, cx in enumerate(range(780, 980, 40)):
        cd.polygon([(cx, 260), (cx + 34, 260), (cx + 60 + i * 4, 1560),
                    (cx + 14 + i * 4, 1560)], fill=(250, 247, 241, 120))
    img = Image.alpha_composite(img.convert("RGBA"), curtain).convert("RGB")
    d = ImageDraw.Draw(img)
    # floor
    vgrad(d, 0, 1500, SW, SH, (206, 182, 148), (184, 158, 122))
    # rug
    d.ellipse([60, 1700, 1100, 2450], fill=(196, 186, 168))
    # bed: headboard, mattress, duvet
    d.rounded_rectangle([90, 1080, 900, 1560], 40, fill=(150, 128, 104))
    d.rounded_rectangle([60, 1420, 950, 1900], 46, fill=(252, 251, 246))
    d.polygon([(60, 1640), (950, 1600), (950, 1856), (60, 1900)], fill=(238, 231, 216))
    # olive throw
    d.polygon([(60, 1760), (950, 1716), (950, 1800), (60, 1848)], fill=(150, 148, 106))
    # pillows
    d.rounded_rectangle([140, 1260, 470, 1450], 34, fill=LINEN)
    d.rounded_rectangle([500, 1250, 830, 1440], 34, fill=LINEN)
    d.rounded_rectangle([380, 1350, 610, 1500], 26, fill=(186, 74, 84))
    # floor lamp with glow
    glow = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([120, 760, 560, 1200], fill=(240, 216, 150, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    d = ImageDraw.Draw(img)
    d.line([(340, 1420), (340, 980)], fill=(90, 78, 64), width=10)
    d.polygon([(250, 980), (430, 980), (400, 850), (280, 850)], fill=BUTTER)
    return img


def scene_terrace():
    img = Image.new("RGB", (SW, SH))
    d = ImageDraw.Draw(img)
    # sky
    vgrad(d, 0, 0, SW, 1500, (96, 148, 208), SKYPALE)
    # far mountains
    d.polygon([(0, 1060), (260, 760), (520, 1010), (780, 700), (1050, 980),
               (1300, 800), (1512, 1000), (1512, 1500), (0, 1500)], fill=(122, 142, 170))
    # green slopes
    d.polygon([(0, 1240), (300, 1050), (640, 1230), (980, 1060), (1512, 1260),
               (1512, 1560), (0, 1560)], fill=(96, 128, 88))
    # lake
    vgrad(d, 0, 1380, SW, 1560, LAKE, (120, 162, 196))
    # terrace floor
    vgrad(d, 0, 1560, SW, SH, (214, 206, 192), (188, 178, 162))
    # sculptural gold arches sweeping in from the right
    for base_x, top_x, w_ in ((1360, 620, 150), (1120, 260, 120), (860, -40, 95)):
        pts = []
        steps = 28
        for i in range(steps + 1):
            t = i / steps
            x = base_x + (top_x - base_x) * (t ** 1.6)
            y = SH - 60 - t * (SH - 220)
            pts.append((x, y))
        back = []
        for i in range(steps + 1):
            t = (steps - i) / steps
            x = base_x + (top_x - base_x) * (t ** 1.6)
            y = SH - 60 - t * (SH - 220)
            back.append((x + w_ * (1 - 0.55 * t), y))
        d.polygon(pts + back, fill=GOLD)
        d.line(pts, fill=GOLD_DK, width=8)
    # cafe tables + chairs silhouettes
    for tx, s in ((250, 1.0), (620, 0.85), (950, 0.7)):
        ty = 2300 - (1 - s) * 260
        r = int(120 * s)
        d.ellipse([tx - r, ty - int(28 * s), tx + r, ty + int(28 * s)], fill=(52, 50, 48))
        d.line([(tx, ty), (tx, ty + int(180 * s))], fill=(52, 50, 48), width=int(14 * s))
        for ox in (-int(170 * s), int(170 * s)):
            d.line([(tx + ox, ty + int(40 * s)), (tx + ox, ty + int(190 * s))],
                   fill=(52, 50, 48), width=int(12 * s))
            d.ellipse([tx + ox - int(56 * s), ty - int(20 * s),
                       tx + ox + int(56 * s), ty + int(30 * s)], fill=(52, 50, 48))
    return img


def scene_dome(with_mark=0.0):
    img = Image.new("RGB", (SW, SH))
    d = ImageDraw.Draw(img)
    # sky
    vgrad(d, 0, 0, SW, SH, (86, 140, 202), SKYPALE)
    # cloud
    for cx, cy, r in ((380, 420, 130), (520, 380, 160), (680, 430, 120), (540, 470, 150)):
        d.ellipse([cx - r, cy - r * 0.55, cx + r, cy + r * 0.55], fill=(245, 249, 252))
    # mountain ridge
    d.polygon([(0, 1150), (300, 860), (620, 1120), (900, 900), (1200, 1130),
               (1512, 980), (1512, 1500), (0, 1500)], fill=(118, 138, 168))
    # pine band
    d.polygon([(0, 1400), (1512, 1300), (1512, 1620), (0, 1720)], fill=PINE)
    for px in range(30, SW, 90):
        base = 1400 + (1300 - 1400) * px / SW + 140
        d.polygon([(px, base - 190), (px - 42, base), (px + 42, base)], fill=PINE_DK)
    # golden dome swelling from bottom
    d.ellipse([-260, 1520, 1770, 3300], fill=GOLD)
    # dome lattice, clipped to the dome silhouette
    lattice = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lattice)
    for k in range(-3, 9):
        x0 = -260 + k * 240
        ld.arc([x0, 1520, x0 + 1400, 3300], 180, 360, fill=GOLD_DK + (255,), width=10)
    ld.arc([-260, 1560, 1770, 3340], 180, 360, fill=(226, 200, 140, 255), width=26)
    mask = Image.new("L", (SW, SH), 0)
    ImageDraw.Draw(mask).ellipse([-260, 1520, 1770, 3300], fill=255)
    img.paste(lattice, (0, 0), Image.composite(lattice.split()[3], Image.new("L", (SW, SH), 0), mask))
    d = ImageDraw.Draw(img)
    # skylight slit
    d.polygon([(430, 1700), (1000, 1640), (1030, 1700), (470, 1770)], fill=(70, 66, 58))
    d.polygon([(430, 1700), (1000, 1640), (1010, 1666), (444, 1728)], fill=SKYPALE)
    if with_mark > 0:
        overlay = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        a = int(255 * with_mark)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 74)
            small = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Italic.ttf", 46)
        except OSError:
            font = small = ImageFont.load_default()
        text = "H O T E L W A Y"
        tw = od.textlength(text, font=font)
        od.text(((SW - tw) / 2, 2100), text, font=font, fill=(255, 253, 248, a))
        sub = "the stay, remembered"
        sw_ = od.textlength(sub, font=small)
        od.text(((SW - sw_) / 2, 2210), sub, font=small, fill=(255, 253, 248, int(a * 0.85)))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    return img


def kb_crop(scene, t, mode):
    """Ken Burns: crop a WxH-proportioned window from the oversized scene."""
    if mode == "push":          # slow zoom in
        z = 1.0 + 0.10 * t
    elif mode == "pull":        # slow zoom out
        z = 1.10 - 0.10 * t
    else:                       # pan right
        z = 1.06
    cw, ch = int(SW / z), int(SH / z)
    cw = min(cw, SW); ch = min(ch, SH)
    if mode == "pan":
        x0 = int((SW - cw) * t)
        y0 = (SH - ch) // 2
    else:
        x0 = (SW - cw) // 2
        y0 = (SH - ch) // 2
    return scene.crop((x0, y0, x0 + cw, y0 + ch)).resize((W, H), Image.LANCZOS)


def ease(t):
    return 0.5 - 0.5 * math.cos(math.pi * t)


print("drawing scenes…")
room = scene_room()
terrace = scene_terrace()
dome_frames_cache = {}

out = "/Users/rguan/code/personal/content/hotelway-studios/assets/hotelway-teaser.mp4"
writer = imageio.get_writer(out, fps=FPS, codec="libx264", quality=8,
                            pixelformat="yuv420p", macro_block_size=1)

total = SCENE_F * 3
specs = [(room, "push"), (terrace, "pan"), (None, "pull")]  # dome drawn per-frame for wordmark fade

for f in range(total):
    idx = min(f // SCENE_F, 2)
    tf = (f % SCENE_F) / (SCENE_F - 1)
    scene, mode = specs[idx]
    if idx == 2:
        mark = max(0.0, (tf - 0.35) / 0.65)
        key = round(mark, 2)
        if key not in dome_frames_cache:
            dome_frames_cache[key] = scene_dome(with_mark=key)
        scene = dome_frames_cache[key]
    frame = kb_crop(scene, ease(tf), mode)
    # crossfade into next scene over the last XFADE frames of scenes 0 and 1
    rem = SCENE_F - (f % SCENE_F)
    if idx < 2 and rem <= XFADE:
        nxt_scene, nxt_mode = specs[idx + 1]
        if idx + 1 == 2:
            if 0.0 not in dome_frames_cache:
                dome_frames_cache[0.0] = scene_dome(0.0)
            nxt_scene = dome_frames_cache[0.0]
        nxt = kb_crop(nxt_scene, 0.0, nxt_mode)
        alpha = (XFADE - rem + 1) / (XFADE + 1)
        frame = Image.blend(frame, nxt, alpha)
    writer.append_data(np.asarray(frame))
    if f % 15 == 0:
        print(f"frame {f}/{total}")

writer.close()
print("done →", out)
