import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

OUTPUT_DIR = "public/projects"
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 800, 500

FONT_MONO_PATH = "/usr/share/fonts/TTF/CascadiaCode.ttf"
FONT_SANS_PATH = "/usr/share/fonts/noto/NotoSans-Regular.ttf"

def get_mono(size):
    try:
        return ImageFont.truetype(FONT_MONO_PATH, size)
    except:
        return ImageFont.load_default()

def get_sans(size):
    try:
        return ImageFont.truetype(FONT_SANS_PATH, size)
    except:
        return ImageFont.load_default()

def create_blurred_card(bg_elements_drawer, logo_img, brand_glow_color, dark=True, logo_scale=220):
    """
    Renders an 800x500 card where:
    - The background elements are drawn and then heavily Gaussian-blurred (soft atmospheric depth).
    - The actual project logo is the primary hero in the center, large, sharp, and high-contrast.
    - In dark mode: radiant ambient glow + deep dark background.
    - In light mode: clean luminous background + soft diffused drop shadow for 100% crispness.
    """
    # 1. Base canvas
    bg_base = (11, 14, 22) if dark else (248, 249, 252)
    base = Image.new("RGBA", (W, H), bg_base)
    
    # 2. Draw background atmosphere
    atmo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    adraw = ImageDraw.Draw(atmo)
    
    # Ambient color blooms
    r, g, b = brand_glow_color
    alpha_bloom1 = 110 if dark else 65
    alpha_bloom2 = 80 if dark else 45
    adraw.ellipse([W//2 - 280, H//2 - 190, W//2 + 280, H//2 + 190], fill=(r, g, b, alpha_bloom1))
    adraw.ellipse([W//2 - 160, H//2 - 120, W//2 + 160, H//2 + 120], fill=(r, g, b, alpha_bloom2))
    
    # Custom background elements (windows, code lines, charts, grids, tables)
    bg_elements_drawer(adraw, dark)
    
    # Heavy Gaussian Blur to turn background into soft ambient depth
    atmo_blurred = atmo.filter(ImageFilter.GaussianBlur(32))
    base = Image.alpha_composite(base, atmo_blurred)
    
    # 3. Soft card border
    fdraw = ImageDraw.Draw(base)
    border_col = (255, 255, 255, 24) if dark else (15, 23, 42, 20)
    fdraw.rounded_rectangle([10, 10, W - 11, H - 11], radius=16, outline=border_col, width=1)
    
    # 4. Process Logo
    # Crop to content
    bbox = logo_img.getbbox()
    if bbox:
        cropped = logo_img.crop(bbox)
    else:
        cropped = logo_img
        
    # Scale keeping aspect ratio
    max_dim = max(cropped.width, cropped.height)
    scale = logo_scale / max_dim
    nw = max(1, int(cropped.width * scale))
    nh = max(1, int(cropped.height * scale))
    scaled_logo = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    
    lx = (W - nw) // 2
    ly = (H - nh) // 2
    
    # 5. Shadow / Illumination layer
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    
    if dark:
        # Luminous brand aura behind logo
        glow_rad_x = nw // 2 + 35
        glow_rad_y = nh // 2 + 35
        sdraw.ellipse(
            [W//2 - glow_rad_x, H//2 - glow_rad_y, W//2 + glow_rad_x, H//2 + glow_rad_y],
            fill=(r, g, b, 120)
        )
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(30))
    else:
        # Diffused soft drop shadow for clean contrast on light mode
        salpha = scaled_logo.split()[3].point(lambda p: int(p * 0.40))
        shadow_layer.paste((15, 23, 42, 255), (lx, ly + 8), salpha)
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(16))
        
    base = Image.alpha_composite(base, shadow_layer)
    base.paste(scaled_logo, (lx, ly), scaled_logo)
    
    return base.convert("RGB")

def save_dual(name, bg_fn, logo_fn, glow_rgb, logo_scale=220):
    for dark in [True, False]:
        logo = logo_fn(dark)
        img = create_blurred_card(bg_fn, logo, glow_rgb, dark=dark, logo_scale=logo_scale)
        suffix = "dark" if dark else "light"
        img.save(os.path.join(OUTPUT_DIR, f"{name}-{suffix}.png"), "PNG", optimize=True)
    # Default fallback is dark
    img_dark = create_blurred_card(bg_fn, logo_fn(True), glow_rgb, dark=True, logo_scale=logo_scale)
    img_dark.save(os.path.join(OUTPUT_DIR, f"{name}.png"), "PNG", optimize=True)
    print(f"Saved {name} (light, dark, fallback)")

# ----------------- 1. NexQL for VS Code -----------------
# Official NexQL logo
nexql_raw = Image.open("/tmp/logos/nexql-core.png").convert("RGBA")
# Generate standalone square nexql-logo
bbox = nexql_raw.getbbox()
nexql_crop = nexql_raw.crop(bbox)
sq_size = max(nexql_crop.width, nexql_crop.height) + 40
sq_logo = Image.new("RGBA", (sq_size, sq_size), (0, 0, 0, 0))
sq_logo.paste(nexql_crop, ((sq_size - nexql_crop.width) // 2, (sq_size - nexql_crop.height) // 2), nexql_crop)
sq_logo.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "nexql-logo.png"))
sq_logo.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "nexql-logo-dark.png"))
sq_logo.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(OUTPUT_DIR, "nexql-logo-light.png"))

def bg_nexql_core(draw, dark):
    # VS Code editor panels + PostgreSQL explorer outlines
    c_line = (124, 58, 237, 80) if dark else (147, 197, 253, 90)
    c_panel = (59, 130, 246, 70) if dark else (192, 132, 252, 70)
    draw.rounded_rectangle([40, 40, 240, H - 40], radius=8, fill=c_panel)
    draw.rounded_rectangle([260, 40, W - 40, H - 40], radius=8, fill=c_line)
    for y in range(80, H - 80, 28):
        draw.rectangle([280, y, W - 80, y + 14], fill=(255, 255, 255, 40) if dark else (0, 0, 0, 30))

save_dual("nexql-core", bg_nexql_core, lambda dark: nexql_raw, (124, 58, 237), logo_scale=220)

# ----------------- 2. NexQL MCP -----------------
def bg_nexql_mcp(draw, dark):
    # Protocol node network & tool calls
    c_node = (147, 51, 234, 90) if dark else (168, 85, 247, 80)
    c_link = (217, 70, 239, 70) if dark else (192, 132, 252, 70)
    nodes = [(120, 150), (200, 350), (600, 140), (680, 360), (400, 100), (400, 400)]
    for n1 in nodes:
        for n2 in nodes:
            if n1 != n2: draw.line([n1, n2], fill=c_link, width=2)
    for x, y in nodes:
        draw.ellipse([x - 24, y - 24, x + 24, y + 24], fill=c_node)

save_dual("nexql-mcp", bg_nexql_mcp, lambda dark: nexql_raw, (147, 51, 234), logo_scale=220)

# ----------------- 3. NexQL Themes -----------------
themes_raw = Image.open("/tmp/logos/nexql-themes.png").convert("RGBA")

def bg_nexql_themes(draw, dark):
    # Syntax color spectrum blocks
    colors = [
        (234, 179, 8, 90),   # yellow
        (236, 72, 153, 90),  # pink
        (6, 182, 212, 90),   # cyan
        (16, 185, 129, 90),  # emerald
        (168, 85, 247, 90),  # purple
    ]
    for i, col in enumerate(colors):
        x = 60 + i * 140
        draw.rounded_rectangle([x, 60, x + 110, H - 60], radius=12, fill=col)

save_dual("nexql-themes", bg_nexql_themes, lambda dark: themes_raw, (236, 72, 153), logo_scale=225)

# ----------------- 4. Drawdown -----------------
drawdown_raw = Image.open("/tmp/logos/drawdown.png").convert("RGBA")

def bg_drawdown(draw, dark):
    # Trading curve + candlesticks
    c_green = (34, 197, 94, 95) if dark else (22, 163, 74, 80)
    c_blue = (59, 130, 246, 95) if dark else (37, 99, 235, 80)
    points = [(50, 380), (140, 310), (240, 350), (360, 230), (480, 260), (600, 160), (750, 110)]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=c_green, width=6)
    candlesticks = [(100, 220, 130, 320), (280, 180, 310, 290), (520, 140, 550, 240), (680, 80, 710, 200)]
    for r in candlesticks:
        draw.rectangle(r, fill=c_blue)

save_dual("drawdown", bg_drawdown, lambda dark: drawdown_raw, (59, 130, 246), logo_scale=220)

# ----------------- 5. Glog -----------------
glog_raw = Image.open("/tmp/logos/glog.png").convert("RGBA")

def bg_glog(draw, dark):
    # Concurrent terminal streaming log channels
    c_teal = (20, 184, 166, 95) if dark else (13, 148, 136, 80)
    c_amber = (245, 158, 11, 85) if dark else (217, 119, 6, 75)
    for y in range(50, H - 50, 32):
        draw.rectangle([50, y, 160, y + 14], fill=c_amber)
        draw.rectangle([180, y, W - 60, y + 14], fill=c_teal)

save_dual("glog", bg_glog, lambda dark: glog_raw, (20, 184, 166), logo_scale=235)

# ----------------- 6. Divulge -----------------
divulge_raw = Image.open("/tmp/logos/divulge.png").convert("RGBA")

def bg_divulge(draw, dark):
    # Key-value database storage table & tree blocks
    c_plum = (139, 92, 246, 90) if dark else (124, 58, 237, 75)
    c_gold = (245, 158, 11, 90) if dark else (217, 119, 6, 75)
    for col_idx in range(4):
        x = 60 + col_idx * 175
        draw.rounded_rectangle([x, 50, x + 155, 120], radius=10, fill=c_gold)
        draw.rounded_rectangle([x, 140, x + 155, H - 60], radius=10, fill=c_plum)

save_dual("divulge", bg_divulge, lambda dark: divulge_raw, (139, 92, 246), logo_scale=220)

# ----------------- 7. Asterix OS -----------------
asterixos_raw = Image.open("/tmp/logos/asterixos.png").convert("RGBA")

def make_asterixos_logo(dark):
    # The original is dark teal (26, 93, 87).
    # For dark mode: transform to luminous electric emerald (45, 212, 191) so it shines brilliantly!
    # For light mode: use deep rich forest teal (15, 118, 110) for strong contrast!
    cropped = asterixos_raw.crop(asterixos_raw.getbbox())
    r, g, b, a = cropped.split()
    target_rgb = (45, 212, 191) if dark else (15, 118, 110)
    colored = Image.new("RGBA", cropped.size, (*target_rgb, 255))
    colored.putalpha(a)
    return colored

def bg_asterixos(draw, dark):
    # Desktop windows + dock bar
    c_win = (16, 185, 129, 90) if dark else (5, 150, 105, 80)
    c_dock = (6, 182, 212, 90) if dark else (8, 145, 178, 80)
    draw.rounded_rectangle([60, 50, 360, 320], radius=14, fill=c_win)
    draw.rounded_rectangle([400, 80, 740, 350], radius=14, fill=c_dock)
    draw.rounded_rectangle([180, H - 70, W - 180, H - 30], radius=16, fill=c_win)

save_dual("asterixos", bg_asterixos, make_asterixos_logo, (16, 185, 129), logo_scale=220)

# ----------------- 8. Pacpad -----------------
def make_pacpad_logo(dark):
    # Arch Linux chevron + terminal package glyph
    sz = 512
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Outer diamond / hexagon
    c_arch = (23, 147, 209, 255) if dark else (14, 116, 144, 255)
    c_rust = (247, 76, 0, 255) if dark else (194, 65, 12, 255)
    c_white = (255, 255, 255, 255) if dark else (15, 23, 42, 255)
    
    # Diamond container
    pts = [(256, 30), (470, 180), (470, 390), (256, 490), (42, 390), (42, 180)]
    draw.polygon(pts, fill=c_arch)
    # Inner terminal window
    inner_pts = [(256, 80), (425, 205), (425, 370), (256, 445), (87, 370), (87, 205)]
    draw.polygon(inner_pts, fill=(15, 23, 42, 255) if dark else (248, 250, 252, 255))
    
    # Arch chevron curve
    draw.polygon([(256, 110), (380, 340), (256, 300), (132, 340)], fill=c_arch)
    # Rust accent diamond
    draw.polygon([(256, 230), (286, 280), (256, 330), (226, 280)], fill=c_rust)
    return img

def bg_pacpad(draw, dark):
    # Terminal package lists & filter pills
    c_arch = (23, 147, 209, 90) if dark else (14, 116, 144, 80)
    c_rust = (247, 76, 0, 80) if dark else (194, 65, 12, 70)
    draw.rounded_rectangle([50, 45, 250, H - 45], radius=10, fill=c_arch)
    for y in range(70, H - 60, 36):
        draw.rounded_rectangle([280, y, W - 60, y + 22], radius=6, fill=c_rust if y % 72 == 0 else c_arch)

save_dual("pacpad", bg_pacpad, make_pacpad_logo, (23, 147, 209), logo_scale=220)

# ----------------- 9. And the time is... -----------------
def make_timeis_logo(dark):
    # Horizon world clock & meridian circle emblem
    sz = 512
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    c_indigo = (99, 102, 241, 255) if dark else (67, 56, 202, 255)
    c_gold = (245, 158, 11, 255) if dark else (217, 119, 6, 255)
    
    # Outer celestial sphere ring
    draw.ellipse([46, 46, 466, 466], outline=c_indigo, width=28)
    # Vertical meridian line
    draw.line([(256, 46), (256, 466)], fill=c_gold, width=24)
    # Horizontal horizon line
    draw.line([(46, 256), (466, 256)], fill=c_indigo, width=16)
    # Center sun / star
    draw.ellipse([216, 216, 296, 296], fill=c_gold)
    # Dial indices (12, 3, 6, 9)
    draw.rectangle([248, 16, 264, 46], fill=c_gold)
    draw.rectangle([248, 466, 264, 496], fill=c_gold)
    draw.rectangle([16, 248, 46, 264], fill=c_indigo)
    draw.rectangle([466, 248, 496, 264], fill=c_indigo)
    return img

def bg_timeis(draw, dark):
    # Timezone day/night gradient bands & clocks
    c_indigo = (99, 102, 241, 95) if dark else (79, 70, 229, 80)
    c_gold = (245, 158, 11, 90) if dark else (217, 119, 6, 75)
    for i in range(5):
        y = 50 + i * 80
        draw.rounded_rectangle([50, y, W - 50, y + 55], radius=10, fill=c_gold if i % 2 == 0 else c_indigo)

save_dual("timeis", bg_timeis, make_timeis_logo, (99, 102, 241), logo_scale=220)

# ----------------- 10. Task Master -----------------
def make_taskmaster_logo(dark):
    # Go task scheduler gear & execution pulse
    sz = 512
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    c_go = (0, 173, 216, 255) if dark else (2, 132, 199, 255) # Go cyan
    c_pulse = (59, 130, 246, 255) if dark else (29, 78, 216, 255)
    
    # Central gear / clock body
    cx, cy, r_outer, r_inner = 256, 256, 170, 95
    # 8 gear teeth
    for deg in range(0, 360, 45):
        rad = math.radians(deg)
        tx = cx + int((r_outer + 35) * math.cos(rad))
        ty = cy + int((r_outer + 35) * math.sin(rad))
        draw.rectangle([tx - 26, ty - 26, tx + 26, ty + 26], fill=c_go)
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=c_go)
    draw.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=(15, 23, 42, 255) if dark else (248, 250, 252, 255))
    
    # Pulse checkmark / arrow
    pts = [(cx - 45, cy), (cx - 10, cy + 38), (cx + 50, cy - 35)]
    draw.line(pts, fill=c_pulse, width=22)
    return img

def bg_taskmaster(draw, dark):
    # Concurrent task queues & scheduling lanes
    c_go = (0, 173, 216, 90) if dark else (2, 132, 199, 80)
    c_blue = (59, 130, 246, 85) if dark else (37, 99, 235, 75)
    for row in range(4):
        y = 55 + row * 95
        draw.rounded_rectangle([50, y, W - 50, y + 65], radius=10, fill=c_go if row % 2 == 0 else c_blue)

save_dual("taskmaster", bg_taskmaster, make_taskmaster_logo, (0, 173, 216), logo_scale=220)

# ----------------- 11. Go Func Collections -----------------
def make_gofunc_logo(dark):
    # Go generics [T] brackets + stream flow
    sz = 512
    img = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    c_go = (0, 173, 216, 255) if dark else (2, 132, 199, 255)
    c_em = (16, 185, 129, 255) if dark else (5, 150, 105, 255)
    
    # Left bracket '['
    draw.rectangle([60, 60, 110, 452], fill=c_go)
    draw.rectangle([110, 60, 190, 110], fill=c_go)
    draw.rectangle([110, 402, 190, 452], fill=c_go)
    
    # Right bracket ']'
    draw.rectangle([402, 60, 452, 452], fill=c_go)
    draw.rectangle([322, 60, 402, 110], fill=c_go)
    draw.rectangle([322, 402, 402, 452], fill=c_go)
    
    # Center 'T' with lambda arrow
    draw.rectangle([210, 130, 302, 180], fill=c_em)
    draw.rectangle([236, 180, 276, 380], fill=c_em)
    # Stream flow dots
    draw.ellipse([210, 350, 240, 380], fill=c_go)
    draw.ellipse([272, 350, 302, 380], fill=c_go)
    return img

def bg_gofunc(draw, dark):
    # Slice pipeline & transformation flows
    c_go = (0, 173, 216, 90) if dark else (2, 132, 199, 80)
    c_em = (16, 185, 129, 85) if dark else (5, 150, 105, 75)
    for i in range(5):
        y = 55 + i * 78
        draw.rounded_rectangle([60 + i * 30, y, W - 60 - i * 30, y + 45], radius=8, fill=c_go if i % 2 == 0 else c_em)

save_dual("gofunc", bg_gofunc, make_gofunc_logo, (0, 173, 216), logo_scale=220)

print("All 11 project dual images generated successfully!")
