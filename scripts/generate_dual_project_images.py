import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "public/projects"
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 800, 500

FONT_MONO_PATH = "/usr/share/fonts/TTF/CascadiaCode.ttf"
FONT_SANS_PATH = "/usr/share/fonts/noto/NotoSans-Regular.ttf"

def get_mono(size):
    return ImageFont.truetype(FONT_MONO_PATH, size)

def get_sans(size):
    return ImageFont.truetype(FONT_SANS_PATH, size)

def draw_window_header(draw, title, subtitle="", x=30, y=20, w=740, dark=True):
    draw.ellipse([x, y + 4, x + 10, y + 14], fill=(239, 68, 68, 220))
    draw.ellipse([x + 16, y + 4, x + 26, y + 14], fill=(245, 158, 11, 220))
    draw.ellipse([x + 32, y + 4, x + 42, y + 14], fill=(16, 185, 129, 220))
    font = get_mono(12)
    title_col = (160, 175, 200, 240) if dark else (65, 75, 90, 255)
    sub_col = (100, 115, 140, 200) if dark else (115, 125, 140, 220)
    draw.text((x + 55, y + 2), title, font=font, fill=title_col)
    if subtitle:
        sw = font.getlength(subtitle)
        draw.text((x + w - sw - 10, y + 2), subtitle, font=font, fill=sub_col)

# ----------------- 1. NexQL for VS Code -----------------
def make_nexql_core(dark=True):
    bg = (10, 12, 18) if dark else (246, 244, 238)
    grid = (18, 22, 32) if dark else (232, 228, 218)
    border = (40, 50, 70, 200) if dark else (205, 198, 185, 255)
    divider = (30, 40, 60, 200) if dark else (220, 215, 202, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gcolor = (37, 99, 235) if dark else (59, 130, 246)
    for r in range(240, 40, -10):
        alpha = int((25 if dark else 18) * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(*gcolor, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "NexQL for VS Code · postgres-explorer", "PostgreSQL Tooling", 45, 30, dark=dark)

    icon_path = "/tmp/pe1.png" if os.path.exists("/tmp/pe1.png") else "public/projects/nexql-core.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((300, 300), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        img.paste(icon, (ix, iy), icon)

    font_badge = get_mono(11)
    draw = ImageDraw.Draw(img)
    badges = ["TypeScript", "PostgreSQL", "VS Code Extension", "AI Assistant", "Schema Browser"]
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (20, 26, 40, 220) if dark else (238, 234, 224, 240)
        b_out = (45, 60, 90, 220) if dark else (205, 198, 185, 255)
        t_col = (180, 205, 240, 255) if dark else (40, 55, 75, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 22

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"nexql-core{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-core.png"), "PNG", optimize=True)

# ----------------- 2. NexQL MCP -----------------
def make_nexql_mcp(dark=True):
    bg = (12, 10, 20) if dark else (246, 243, 249)
    grid = (24, 18, 38) if dark else (234, 227, 242)
    border = (60, 45, 85, 200) if dark else (210, 195, 230, 255)
    divider = (45, 35, 65, 200) if dark else (225, 215, 240, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gcolor = (147, 51, 234)
    for r in range(250, 40, -10):
        alpha = int((30 if dark else 20) * (1 - r / 250))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(*gcolor, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "NexQL MCP Server · Model Context Protocol", "Rust / LLM Gateway", 45, 30, dark=dark)

    icon_path = "public/projects/nexql-mcp.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((290, 290), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        img.paste(icon, (ix, iy), icon)

    font_diag = get_mono(11)
    draw = ImageDraw.Draw(img)
    ai_col = (168, 85, 247, 240) if dark else (126, 34, 206, 255)
    pg_col = (56, 189, 248, 240) if dark else (2, 132, 199, 255)
    draw.text((70, H // 2 - 10), "[AI Agents / Claude]\n       ↓", font=font_diag, fill=ai_col)
    draw.text((W - 200, H // 2 - 10), "        ↑\n[Postgres Schemas]", font=font_diag, fill=pg_col)

    badges = ["Rust", "MCP Protocol", "Claude Desktop", "Cursor", "Zero-Leak Security"]
    bx = 55
    for b in badges:
        bw = font_diag.getlength(b)
        b_fill = (28, 20, 44, 220) if dark else (240, 232, 248, 240)
        b_out = (80, 55, 120, 220) if dark else (210, 190, 235, 255)
        t_col = (216, 180, 254, 255) if dark else (88, 28, 135, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_diag, fill=t_col)
        bx += bw + 22

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"nexql-mcp{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-mcp.png"), "PNG", optimize=True)

# ----------------- 3. NexQL Themes -----------------
def make_nexql_themes(dark=True):
    bg = (10, 10, 18) if dark else (245, 244, 250)
    grid = (20, 20, 36) if dark else (232, 230, 244)
    border = (50, 45, 80, 200) if dark else (205, 200, 230, 255)
    divider = (40, 35, 65, 200) if dark else (220, 215, 238, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int((25 if dark else 18) * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(79, 70, 229, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "NexQL Editor Themes · VS Code & Forks", "Color Schemes", 45, 30, dark=dark)

    icon_path = "public/projects/nexql-themes.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((300, 300), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        img.paste(icon, (ix, iy), icon)

    font_badge = get_mono(11)
    draw = ImageDraw.Draw(img)
    badges = ["VS Code", "VSCodium", "Cursor", "Syntax Themes", "Dark & Light Variants"]
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (24, 22, 42, 220) if dark else (238, 235, 248, 240)
        b_out = (70, 60, 110, 220) if dark else (205, 195, 230, 255)
        t_col = (196, 181, 253, 255) if dark else (79, 70, 229, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 22

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"nexql-themes{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-themes.png"), "PNG", optimize=True)

# ----------------- 4. Divulge -----------------
def make_divulge(dark=True):
    bg = (14, 15, 18) if dark else (246, 244, 240)
    grid = (22, 24, 28) if dark else (232, 230, 224)
    border = (50, 55, 65, 200) if dark else (205, 200, 190, 255)
    divider = (40, 44, 52, 200) if dark else (220, 215, 205, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "Divulge · Embedded Key-Value Database UI", "Go + React", 45, 30, dark=dark)

    src_file = "public/projects/divulge.png" if dark else "/tmp/divulge-light.png"
    if not os.path.exists(src_file) and not dark:
        src_file = "public/projects/divulge.png"
    
    if os.path.exists(src_file):
        shot = Image.open(src_file).convert("RGB")
        target_w = W - 90
        target_h = H - 130
        shot.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        sx = (W - shot.width) // 2
        sy = 65
        img.paste(shot, (sx, sy))
        draw.rectangle([sx, sy, sx + shot.width, sy + shot.height], outline=border, width=1)

    badges = ["Go Backend", "React Frontend", "BoltDB", "BuntDB", "CRUD Explorer"]
    font_badge = get_mono(11)
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (22, 26, 32, 220) if dark else (238, 235, 228, 240)
        b_out = (55, 65, 80, 220) if dark else (205, 198, 185, 255)
        t_col = (190, 205, 220, 255) if dark else (50, 60, 75, 255)
        draw.rounded_rectangle([bx, H - 52, bx + bw + 14, H - 32], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 49), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"divulge{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "divulge.png"), "PNG", optimize=True)

# ----------------- 5. Drawdown -----------------
def make_drawdown(dark=True):
    bg = (8, 11, 16) if dark else (245, 247, 250)
    grid = (16, 22, 32) if dark else (230, 234, 240)
    border = (35, 50, 65, 200) if dark else (200, 210, 225, 255)
    divider = (28, 40, 52, 200) if dark else (215, 225, 238, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(230, 30, -10):
        alpha = int((22 if dark else 16) * (1 - r / 230))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(16, 185, 129, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "Drawdown · Bloomberg Terminal PnL Journal", "Next.js / Recharts", 45, 30, dark=dark)

    icon_path = "public/projects/drawdown.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((180, 180), Image.Resampling.LANCZOS)
        img.paste(icon, (70, 90), icon)

    font_bold = get_mono(18)
    font_sub = get_mono(11)

    card_bg = (14, 20, 28, 240) if dark else (255, 255, 255, 240)
    card_out = (28, 42, 58, 255) if dark else (210, 220, 235, 255)
    t_dim = (140, 160, 180, 255) if dark else (100, 116, 139, 255)

    draw.rounded_rectangle([280, 80, 510, 170], radius=8, fill=card_bg, outline=card_out, width=1)
    draw.text((295, 92), "NET P&L (MTD)", font=font_sub, fill=t_dim)
    draw.text((295, 112), "+$18,450.25", font=font_bold, fill=(16, 185, 129, 255) if dark else (5, 150, 105, 255))
    draw.text((295, 142), "▲ +24.6% vs SPX", font=font_sub, fill=(16, 185, 129, 255))

    draw.rounded_rectangle([530, 80, 740, 170], radius=8, fill=card_bg, outline=card_out, width=1)
    draw.text((545, 92), "WIN RATE / PROFIT FACTOR", font=font_sub, fill=t_dim)
    draw.text((545, 112), "68.4% · 2.45 PF", font=font_bold, fill=(245, 158, 11, 255) if dark else (217, 119, 6, 255))
    draw.text((545, 142), "Avg Trade: +$420.00", font=font_sub, fill=t_dim)

    # Equity curve
    points = [
        (70, 360), (120, 350), (170, 340), (220, 355), (280, 310),
        (340, 290), (400, 305), (460, 270), (520, 250), (580, 260),
        (640, 220), (700, 200), (740, 190)
    ]
    curve_col = (52, 211, 153, 240) if dark else (5, 150, 105, 240)
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=curve_col, width=3)
    for p in points[::2]:
        draw.ellipse([p[0]-3, p[1]-3, p[0]+3, p[1]+3], fill=(255, 255, 255, 255) if dark else (5, 150, 105, 255))

    badges = ["Next.js 16", "Tailwind CSS", "Recharts", "Analytics", "Trading Journal"]
    bx = 55
    for b in badges:
        bw = font_sub.getlength(b)
        b_fill = (16, 24, 34, 220) if dark else (238, 242, 248, 240)
        b_out = (35, 55, 75, 220) if dark else (205, 218, 235, 255)
        t_col = (160, 215, 200, 255) if dark else (15, 118, 110, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_sub, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"drawdown{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "drawdown.png"), "PNG", optimize=True)

# ----------------- 6. Asterix OS -----------------
def make_asterixos(dark=True):
    bg = (10, 12, 18) if dark else (245, 246, 249)
    grid = (18, 22, 32) if dark else (230, 232, 240)
    border = (40, 50, 70, 200) if dark else (200, 205, 220, 255)
    divider = (30, 40, 60, 200) if dark else (215, 220, 235, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int((25 if dark else 18) * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(99, 102, 241, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "Asterix OS · Browser Desktop Environment", "Next.js / Zustand", 45, 30, dark=dark)

    card_path = "/tmp/asterix-card.png"
    if os.path.exists(card_path):
        card = Image.open(card_path).convert("RGBA")
        card.thumbnail((290, 290), Image.Resampling.LANCZOS)
        cx = (W - card.width) // 2
        cy = (H - card.height) // 2 + 10
        img.paste(card, (cx, cy), card)

    font_badge = get_mono(11)
    draw = ImageDraw.Draw(img)
    badges = ["Next.js", "TypeScript", "Zustand", "Framer Motion", "Web Desktop"]
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (20, 26, 40, 220) if dark else (236, 238, 246, 240)
        b_out = (45, 60, 90, 220) if dark else (200, 205, 225, 255)
        t_col = (180, 205, 240, 255) if dark else (67, 56, 202, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 22

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"asterixos{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "asterixos.png"), "PNG", optimize=True)

# ----------------- 7. Glog -----------------
def make_glog(dark=True):
    bg = (10, 14, 20) if dark else (245, 248, 250)
    grid = (20, 28, 40) if dark else (228, 235, 242)
    border = (35, 55, 75, 200) if dark else (195, 212, 225, 255)
    divider = (28, 45, 65, 200) if dark else (210, 225, 238, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(220, 30, -10):
        alpha = int((24 if dark else 18) * (1 - r / 220))
        gdraw.ellipse([180 - r, H//2 - r, 180 + r, H//2 + r], fill=(0, 173, 216, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "glog · Concurrent Zero-Dependency Logger for Go", "pkg.go.dev/ric-v/glog", 45, 30, dark=dark)

    icon_path = "public/projects/glog.png"
    if os.path.exists(icon_path):
        mascot = Image.open(icon_path).convert("RGBA")
        mascot.thumbnail((220, 280), Image.Resampling.LANCZOS)
        img.paste(mascot, (65, 95), mascot)

    font_code = get_mono(12)
    logs = [
        ("INFO", (56, 189, 248) if dark else (2, 132, 199), "channel-stream: initialized with 64KB buffer"),
        ("DEBUG", (168, 85, 247) if dark else (126, 34, 206), "worker.0: batch lock acquired, 4,200 events"),
        ("INFO", (56, 189, 248) if dark else (2, 132, 199), "async-writer: disk sync latency p99 = 1.2ms"),
        ("WARN", (245, 158, 11) if dark else (217, 119, 6), "high-throughput: rate 125,000 logs/sec"),
        ("OK", (52, 211, 153) if dark else (5, 150, 105), "zero-allocation logging verified in 16 goroutines"),
        ("INFO", (56, 189, 248) if dark else (2, 132, 199), "thread-safe file rotation complete (100MB)"),
    ]
    tbox_bg = (8, 12, 18, 240) if dark else (255, 255, 255, 250)
    tbox_out = (30, 44, 60, 255) if dark else (205, 220, 235, 255)
    draw.rounded_rectangle([310, 80, 740, 370], radius=8, fill=tbox_bg, outline=tbox_out, width=1)
    
    hdr_fill = (16, 22, 32, 255) if dark else (240, 244, 250, 255)
    draw.rectangle([310, 80, 740, 105], fill=hdr_fill)
    hdr_text = (140, 165, 195, 255) if dark else (70, 95, 125, 255)
    draw.text((325, 87), "$ glog_benchmark --goroutines=16 --zero-deps", font=font_code, fill=hdr_text)

    ly = 120
    body_text = (200, 215, 230, 255) if dark else (40, 50, 65, 255)
    for level, color, text in logs:
        draw.text((325, ly), f"[{level}]", font=font_code, fill=color)
        draw.text((385, ly), text[:45], font=font_code, fill=body_text)
        ly += 38

    badges = ["Go 1.21+", "Concurrency-Safe", "Channel Streaming", "Zero Dependencies", "Ring Buffer"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (16, 24, 34, 220) if dark else (235, 244, 250, 240)
        b_out = (40, 60, 85, 220) if dark else (195, 218, 235, 255)
        t_col = (160, 225, 245, 255) if dark else (3, 105, 161, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"glog{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "glog.png"), "PNG", optimize=True)

# ----------------- 8. Pacpad -----------------
def make_pacpad(dark=True):
    bg = (12, 14, 18) if dark else (244, 246, 249)
    grid = (20, 24, 30) if dark else (228, 232, 238)
    border = (40, 55, 70, 200) if dark else (195, 208, 222, 255)
    divider = (30, 42, 54, 200) if dark else (210, 220, 234, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int((22 if dark else 16) * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(23, 147, 209, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "pacpad ── Arch Linux Terminal App Manager", "Rust + Ratatui", 45, 30, dark=dark)

    font_mono = get_mono(12)
    font_bold = get_mono(13)
    bar_fill = (18, 24, 32, 255) if dark else (234, 238, 245, 255)
    draw.rectangle([50, 70, W - 50, 100], fill=bar_fill)
    tabs = [("[1: Installed]", True), ("[2: Search]", False), ("[3: WebApps & TUI]", False), ("[4: System Updates]", False)]
    tx = 65
    for tab_label, active in tabs:
        tw = font_mono.getlength(tab_label)
        if active:
            draw.rectangle([tx - 5, 73, tx + tw + 5, 97], fill=(23, 147, 209, 255))
            draw.text((tx, 78), tab_label, font=font_bold, fill=(255, 255, 255, 255))
        else:
            inact_col = (120, 140, 160, 255) if dark else (90, 110, 130, 255)
            draw.text((tx, 78), tab_label, font=font_mono, fill=inact_col)
        tx += tw + 25

    table_bg = (14, 18, 24, 255) if dark else (255, 255, 255, 255)
    table_out = (32, 42, 54, 255) if dark else (205, 218, 232, 255)
    draw.rectangle([50, 110, W - 50, 360], fill=table_bg, outline=table_out, width=1)
    headers = "  PACKAGE              VERSION        REPO          SIZE       DESCRIPTION"
    draw.text((60, 120), headers, font=font_mono, fill=(23, 147, 209, 255) if dark else (14, 116, 175, 255))
    draw.line([(50, 140), (W - 50, 140)], fill=table_out, width=1)

    pkgs = [
        ("  eza", "0.23.5-2", "extra", "1.4 MiB", "Modern, maintained replacement for ls"),
        ("  htop", "3.4.1-1", "extra", "420 KiB", "Interactive process viewer and manager"),
        ("  neovim", "0.10.4-1", "extra", "32.1 MiB", "Vim-fork focused on extensibility and Lua"),
        ("  pacman", "6.1.0-4", "core", "4.8 MiB", "A library-based package manager with deps"),
        ("  ripgrep", "15.2.0-1", "extra", "5.2 MiB", "Fast line-oriented search tool / regex engine"),
        ("  alacritty", "0.14.0-2", "extra", "12.8 MiB", "A cross-platform, GPU-accelerated terminal"),
    ]
    py = 155
    text_col = (220, 230, 240, 255) if dark else (40, 50, 65, 255)
    for name, ver, repo, sz, desc in pkgs:
        if name.strip() == "eza":
            hl_fill = (23, 147, 209, 45) if dark else (23, 147, 209, 30)
            draw.rectangle([52, py - 3, W - 52, py + 22], fill=hl_fill)
        draw.text((60, py), f"{name:<20} {ver:<14} {repo:<13} {sz:<10} {desc}", font=font_mono, fill=text_col)
        py += 32

    draw.rectangle([50, 335, W - 50, 360], fill=(23, 147, 209, 220))
    draw.text((60, 340), " [q] Quit  [Tab] Next Tab  [/] Filter  [Enter] Package Details  [u] Sync Repos", font=font_mono, fill=(10, 14, 20, 255))

    badges = ["Rust", "Ratatui", "Arch Linux", "ALPM Lib", "TUI Launcher"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (18, 26, 36, 220) if dark else (234, 242, 248, 240)
        b_out = (35, 65, 90, 220) if dark else (195, 218, 235, 255)
        t_col = (140, 210, 245, 255) if dark else (14, 116, 175, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"pacpad{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "pacpad.png"), "PNG", optimize=True)

# ----------------- 9. TimeIs -----------------
def make_timeis(dark=True):
    bg = (8, 12, 22) if dark else (245, 248, 252)
    grid = (18, 24, 38) if dark else (228, 234, 244)
    border = (35, 55, 80, 200) if dark else (195, 210, 230, 255)
    divider = (28, 44, 65, 200) if dark else (212, 224, 240, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(250, 40, -10):
        alpha = int((26 if dark else 18) * (1 - r / 250))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(14, 165, 233, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "And the time is… · Global Timezone Observatory", "Next.js / Redux", 45, 30, dark=dark)

    font_hero_time = get_mono(26)
    font_mono = get_mono(12)
    font_bold = get_mono(14)
    font_sub = get_mono(11)

    card_bg = (14, 20, 32, 240) if dark else (255, 255, 255, 240)
    card_out = (35, 60, 90, 255) if dark else (205, 220, 238, 255)

    draw.rounded_rectangle([55, 80, 310, 230], radius=10, fill=card_bg, outline=card_out, width=1)
    draw.text((75, 95), "LOCAL SYSTEM TIME", font=font_sub, fill=(56, 189, 248, 255) if dark else (2, 132, 199, 255))
    draw.text((75, 120), "16:45:20", font=font_hero_time, fill=(255, 255, 255, 255) if dark else (15, 23, 42, 255))
    draw.text((75, 160), "Asia/Kolkata (IST)", font=font_bold, fill=(224, 242, 254, 255) if dark else (30, 41, 59, 255))
    draw.text((75, 185), "UTC +05:30 · Monday, Nov 2", font=font_sub, fill=(148, 163, 184, 255) if dark else (100, 116, 139, 255))

    zones = [
        ("UTC (Universal)", "11:15:20", "0h offset", "Coordinated Universal Time"),
        ("America/New_York (EST)", "07:15:20", "-9h 30m", "Market Open · Wall Street"),
        ("Europe/London (GMT)", "12:15:20", "-4h 30m", "Midday · City of London"),
        ("Asia/Tokyo (JST)", "20:15:20", "+3h 30m", "Evening · Shibuya Crossing"),
    ]
    zy = 80
    zcard_bg = (12, 18, 28, 230) if dark else (255, 255, 255, 230)
    zcard_out = (28, 45, 68, 255) if dark else (210, 222, 238, 255)
    for name, t_str, diff, desc in zones:
        draw.rounded_rectangle([330, zy, W - 55, zy + 65], radius=8, fill=zcard_bg, outline=zcard_out, width=1)
        draw.text((345, zy + 12), name, font=font_bold, fill=(224, 231, 255, 255) if dark else (30, 41, 59, 255))
        draw.text((345, zy + 36), desc, font=font_sub, fill=(100, 116, 139, 255))
        
        tw = font_mono.getlength(t_str)
        draw.text((W - 75 - tw, zy + 12), t_str, font=font_bold, fill=(56, 189, 248, 255) if dark else (2, 132, 199, 255))
        draw.text((W - 75 - tw, zy + 36), diff, font=font_sub, fill=(148, 163, 184, 255) if dark else (100, 116, 139, 255))
        zy += 75

    for i in range(40):
        px = 55 + i * 17
        py = 320 + int(math.sin(i * 0.25) * 15)
        pt_col = (56, 189, 248, 140) if dark else (14, 165, 233, 160)
        draw.ellipse([px-1, py-1, px+1, py+1], fill=pt_col)

    badges = ["Next.js", "Redux Toolkit", "Tailwind CSS", "Time Zones", "World Clock"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (14, 24, 38, 220) if dark else (235, 242, 250, 240)
        b_out = (35, 65, 95, 220) if dark else (195, 218, 238, 255)
        t_col = (140, 220, 250, 255) if dark else (2, 132, 199, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"timeis{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "timeis.png"), "PNG", optimize=True)

# ----------------- 10. Task Master -----------------
def make_taskmaster(dark=True):
    bg = (10, 14, 20) if dark else (248, 246, 242)
    grid = (20, 26, 36) if dark else (232, 228, 220)
    border = (50, 45, 35, 200) if dark else (210, 200, 185, 255)
    divider = (40, 35, 25, 200) if dark else (222, 215, 200, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(230, 40, -10):
        alpha = int((22 if dark else 16) * (1 - r / 230))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(245, 158, 11, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "Task Master · Concurrent Execution & Scheduler", "Zero-Dependency Go Library", 45, 30, dark=dark)

    font_mono = get_mono(12)
    font_bold = get_mono(14)
    font_sub = get_mono(11)

    nodes = [
        (65, 130, 180, 210, "1. Ingest Queue", "FIFO · Buffer", (245, 158, 11) if dark else (217, 119, 6)),
        (290, 100, 480, 175, "2A. Priority Pool", "Worker Pool x8", (56, 189, 248) if dark else (2, 132, 199)),
        (290, 200, 480, 275, "2B. Scheduler", "Cron · Debounce", (168, 85, 247) if dark else (126, 34, 206)),
        (580, 130, 735, 210, "3. Commit & Ack", "Thread-Safe", (52, 211, 153) if dark else (5, 150, 105)),
    ]

    node_bg = (16, 20, 28, 240) if dark else (255, 255, 255, 240)
    for x1, y1, x2, y2, title, desc, col in nodes:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=8, fill=node_bg, outline=col, width=1)
        draw.text((x1 + 14, y1 + 18), title, font=font_bold, fill=(255, 255, 255, 255) if dark else (30, 41, 59, 255))
        draw.text((x1 + 14, y1 + 44), desc, font=font_sub, fill=(148, 163, 184, 255) if dark else (100, 116, 139, 255))

    line_col = (200, 200, 200, 200) if dark else (160, 165, 180, 220)
    draw.line([(180, 170), (290, 137)], fill=line_col, width=2)
    draw.line([(180, 170), (290, 237)], fill=line_col, width=2)
    draw.line([(480, 137), (580, 170)], fill=line_col, width=2)
    draw.line([(480, 237), (580, 170)], fill=line_col, width=2)

    bar_bg = (12, 16, 24, 240) if dark else (255, 255, 255, 250)
    bar_out = (32, 44, 60, 255) if dark else (210, 205, 195, 255)
    draw.rounded_rectangle([65, 300, W - 65, 360], radius=6, fill=bar_bg, outline=bar_out, width=1)
    draw.text((80, 315), "scheduler.New(PoolSize(16), WithBackoff(Exponential))", font=font_mono, fill=(56, 189, 248, 255) if dark else (2, 132, 199, 255))
    draw.text((80, 336), "▶ Running: 1,420 jobs/sec · Error rate: 0.00% · Goroutine leaks: 0", font=font_sub, fill=(52, 211, 153, 255) if dark else (5, 150, 105, 255))

    badges = ["Go", "Task Scheduling", "Worker Pools", "Zero Dependencies", "Concurrency"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (24, 22, 18, 220) if dark else (244, 240, 232, 240)
        b_out = (65, 55, 35, 220) if dark else (210, 200, 185, 255)
        t_col = (250, 215, 140, 255) if dark else (180, 83, 9, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"taskmaster{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "taskmaster.png"), "PNG", optimize=True)

# ----------------- 11. Go Func Collections -----------------
def make_gofunc(dark=True):
    bg = (10, 13, 18) if dark else (246, 247, 249)
    grid = (18, 24, 34) if dark else (230, 232, 238)
    border = (40, 45, 65, 200) if dark else (200, 205, 220, 255)
    divider = (32, 38, 52, 200) if dark else (215, 220, 235, 255)

    img = Image.new("RGBA", (W, H), color=bg)
    draw = ImageDraw.Draw(img)
    for x in range(0, W, 32): draw.line([(x, 0), (x, H)], fill=grid, width=1)
    for y in range(0, H, 32): draw.line([(0, y), (W, y)], fill=grid, width=1)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int((22 if dark else 16) * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(99, 102, 241, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=border, width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=divider, width=1)
    draw_window_header(draw, "go-func-collections · Generic Functional Utilities", "Go 1.18+ Generics", 45, 30, dark=dark)

    code_bg = (8, 11, 16, 255) if dark else (255, 255, 255, 255)
    code_out = (30, 38, 52, 255) if dark else (210, 215, 228, 255)
    draw.rounded_rectangle([60, 80, W - 60, 360], radius=8, fill=code_bg, outline=code_out, width=1)

    font_code = get_mono(13)
    c_comm = (100, 116, 139) if dark else (148, 163, 184)
    c_kw = (244, 63, 94) if dark else (225, 29, 72)
    c_txt = (226, 232, 240) if dark else (30, 41, 59)
    c_dim = (148, 163, 184) if dark else (71, 85, 105)

    code_lines = [
        ("// Functional slice manipulation with type safety and zero reflection", c_comm),
        ("package array", c_kw),
        ("", (0,0,0)),
        ("func Map[T, R any](items []T, iter func(item T) R) []R {", c_txt),
        ("    result := make([]R, len(items))", c_dim),
        ("    for i, v := range items { result[i] = iter(v) }", c_dim),
        ("    return result", c_kw),
        ("}", c_txt),
        ("", (0,0,0)),
        ("func Filter[T any](items []T, predicate func(T) bool) []T {", c_txt),
        ("    result := make([]T, 0, len(items))", c_dim),
        ("    for _, v := range items { if predicate(v) { result = append(result, v) } }", c_dim),
        ("    return result", c_kw),
        ("}", c_txt),
    ]

    cy = 96
    for text, color in code_lines:
        if text:
            draw.text((85, cy), text, font=font_code, fill=color)
        cy += 18

    badges = ["Go 1.18+", "Type-Safe Generics", "Zero Reflection", "Unit Tested", "Micro-Benchmarked"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b)
        b_fill = (18, 22, 34, 220) if dark else (238, 240, 248, 240)
        b_out = (45, 55, 80, 220) if dark else (205, 210, 230, 255)
        t_col = (180, 195, 245, 255) if dark else (79, 70, 229, 255)
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=b_fill, outline=b_out, width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=t_col)
        bx += bw + 20

    suffix = "-dark.png" if dark else "-light.png"
    img.convert("RGB").save(os.path.join(OUTPUT_DIR, f"gofunc{suffix}"), "PNG", optimize=True)
    if dark: img.convert("RGB").save(os.path.join(OUTPUT_DIR, "gofunc.png"), "PNG", optimize=True)

if __name__ == "__main__":
    for dark_mode in [True, False]:
        mode_str = "Dark" if dark_mode else "Light"
        print(f"Generating {mode_str} mode images...")
        make_nexql_core(dark=dark_mode)
        make_nexql_mcp(dark=dark_mode)
        make_nexql_themes(dark=dark_mode)
        make_divulge(dark=dark_mode)
        make_drawdown(dark=dark_mode)
        make_asterixos(dark=dark_mode)
        make_glog(dark=dark_mode)
        make_pacpad(dark=dark_mode)
        make_timeis(dark=dark_mode)
        make_taskmaster(dark=dark_mode)
        make_gofunc(dark=dark_mode)
    print("All light & dark project images generated successfully!")
