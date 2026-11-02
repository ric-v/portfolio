import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "public/projects"
os.makedirs(OUTPUT_DIR, exist_ok=True)

W, H = 800, 500

FONT_MONO_PATH = "/usr/share/fonts/TTF/CascadiaCode.ttf"
FONT_SANS_PATH = "/usr/share/fonts/noto/NotoSans-Regular.ttf"
FONT_SERIF_PATH = "/usr/share/fonts/noto/NotoSerif-Regular.ttf"

def get_mono(size):
    return ImageFont.truetype(FONT_MONO_PATH, size)

def get_sans(size):
    return ImageFont.truetype(FONT_SANS_PATH, size)

def create_base_canvas(bg_color=(12, 14, 20), grid_color=(20, 24, 34), grid_step=32):
    img = Image.new("RGBA", (W, H), color=bg_color)
    draw = ImageDraw.Draw(img)
    if grid_step:
        for x in range(0, W, grid_step):
            draw.line([(x, 0), (x, H)], fill=grid_color, width=1)
        for y in range(0, H, grid_step):
            draw.line([(0, y), (W, y)], fill=grid_color, width=1)
    return img

def draw_window_header(draw, title, subtitle="", x=30, y=20, w=740):
    # Window chrome dots
    draw.ellipse([x, y + 4, x + 10, y + 14], fill=(239, 68, 68, 200))
    draw.ellipse([x + 16, y + 4, x + 26, y + 14], fill=(245, 158, 11, 200))
    draw.ellipse([x + 32, y + 4, x + 42, y + 14], fill=(16, 185, 129, 200))
    # Title
    font = get_mono(12)
    draw.text((x + 55, y + 2), title, font=font, fill=(160, 175, 200, 240))
    if subtitle:
        sw = font.getlength(subtitle) if hasattr(font, 'getlength') else 100
        draw.text((x + w - sw - 10, y + 2), subtitle, font=font, fill=(100, 115, 140, 200))

# 1. nexql-core.png
def make_nexql_core():
    canvas = create_base_canvas(bg_color=(10, 12, 18), grid_color=(18, 22, 32))
    draw = ImageDraw.Draw(canvas)
    
    # Radial glow behind center
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int(25 * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(37, 99, 235, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(15))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    # Window frame
    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(40, 50, 70, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(30, 40, 60, 200), width=1)
    draw_window_header(draw, "NexQL for VS Code · postgres-explorer", "PostgreSQL Tooling", 45, 30)

    # Place the official artwork
    icon_path = "public/projects/nexql-core.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((300, 300), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        
        # Soft shadow behind icon
        shadow = Image.new("RGBA", (icon.width + 30, icon.height + 30), (0, 0, 0, 0))
        sdraw = ImageDraw.Draw(shadow)
        sdraw.rectangle([10, 10, icon.width + 10, icon.height + 10], fill=(0, 0, 0, 120))
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        canvas.paste(shadow, (ix - 10, iy - 5), shadow)
        canvas.paste(icon, (ix, iy), icon)

    # Badges at bottom
    draw = ImageDraw.Draw(canvas)
    font_badge = get_mono(11)
    badges = ["TypeScript", "PostgreSQL", "VS Code Extension", "AI Assistant", "Schema Browser"]
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(20, 26, 40, 220), outline=(45, 60, 90, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(180, 205, 240, 255))
        bx += bw + 22

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-core.png"), "PNG", optimize=True)

# 2. nexql-mcp.png
def make_nexql_mcp():
    canvas = create_base_canvas(bg_color=(12, 10, 20), grid_color=(24, 18, 38))
    draw = ImageDraw.Draw(canvas)

    # Purple/violet radial glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(250, 40, -10):
        alpha = int(30 * (1 - r / 250))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(147, 51, 234, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    # Window frame
    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(60, 45, 85, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(45, 35, 65, 200), width=1)
    draw_window_header(draw, "NexQL MCP Server · Model Context Protocol", "Rust / LLM Gateway", 45, 30)

    # Place official icon
    icon_path = "public/projects/nexql-mcp.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((290, 290), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        canvas.paste(icon, (ix, iy), icon)

    # Connecting architecture indicator lines
    font_diag = get_mono(11)
    draw = ImageDraw.Draw(canvas)
    draw.text((70, H // 2 - 10), "[AI Agents / Claude]\n       ↓", font=font_diag, fill=(168, 85, 247, 240))
    draw.text((W - 200, H // 2 - 10), "        ↑\n[Postgres Schemas]", font=font_diag, fill=(56, 189, 248, 240))

    badges = ["Rust", "MCP Protocol", "Claude Desktop", "Cursor", "Zero-Leak Security"]
    bx = 55
    for b in badges:
        bw = font_diag.getlength(b) if hasattr(font_diag, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(28, 20, 44, 220), outline=(80, 55, 120, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_diag, fill=(216, 180, 254, 255))
        bx += bw + 22

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-mcp.png"), "PNG", optimize=True)

# 3. nexql-themes.png
def make_nexql_themes():
    canvas = create_base_canvas(bg_color=(10, 10, 18), grid_color=(20, 20, 36))
    draw = ImageDraw.Draw(canvas)

    # Cyan/Violet dual glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int(25 * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r + 15, W//2 + r, H//2 + r + 15], fill=(79, 70, 229, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(50, 45, 80, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(40, 35, 65, 200), width=1)
    draw_window_header(draw, "NexQL Editor Themes · VS Code & Forks", "Color Schemes", 45, 30)

    icon_path = "public/projects/nexql-themes.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((300, 300), Image.Resampling.LANCZOS)
        ix = (W - icon.width) // 2
        iy = (H - icon.height) // 2 + 10
        canvas.paste(icon, (ix, iy), icon)

    font_badge = get_mono(11)
    draw = ImageDraw.Draw(canvas)
    badges = ["VS Code", "VSCodium", "Cursor", "Syntax Themes", "Dark & High Contrast"]
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(24, 22, 42, 220), outline=(70, 60, 110, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(196, 181, 253, 255))
        bx += bw + 22

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "nexql-themes.png"), "PNG", optimize=True)

# 4. divulge.png (Key-value DB UI)
def make_divulge():
    canvas = create_base_canvas(bg_color=(14, 15, 18), grid_color=(22, 24, 28))
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(50, 55, 65, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(40, 44, 52, 200), width=1)
    draw_window_header(draw, "Divulge · Embedded Key-Value Database UI", "Go + React", 45, 30)

    icon_path = "public/projects/divulge.png"
    if os.path.exists(icon_path):
        shot = Image.open(icon_path).convert("RGB")
        target_w = W - 90
        target_h = H - 130
        shot.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        sx = (W - shot.width) // 2
        sy = 65
        # Rounded frame for the screenshot
        canvas.paste(shot, (sx, sy))
        draw.rectangle([sx, sy, sx + shot.width, sy + shot.height], outline=(60, 65, 80, 220), width=1)

    badges = ["Go Backend", "React Frontend", "BoltDB", "BuntDB", "CRUD Explorer"]
    font_badge = get_mono(11)
    bx = 55
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 52, bx + bw + 14, H - 32], radius=4, fill=(22, 26, 32, 220), outline=(55, 65, 80, 220), width=1)
        draw.text((bx + 7, H - 49), b, font=font_badge, fill=(190, 205, 220, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "divulge.png"), "PNG", optimize=True)

# 5. drawdown.png (Trading Journal)
def make_drawdown():
    canvas = create_base_canvas(bg_color=(8, 11, 16), grid_color=(16, 22, 32))
    draw = ImageDraw.Draw(canvas)

    # Emerald profit glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(230, 30, -10):
        alpha = int(22 * (1 - r / 230))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(16, 185, 129, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(35, 50, 65, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(28, 40, 52, 200), width=1)
    draw_window_header(draw, "Drawdown · Bloomberg Terminal PnL Journal", "Next.js / Recharts", 45, 30)

    # Place drawdown logo
    icon_path = "public/projects/drawdown.png"
    if os.path.exists(icon_path):
        icon = Image.open(icon_path).convert("RGBA")
        icon.thumbnail((180, 180), Image.Resampling.LANCZOS)
        canvas.paste(icon, (70, 90), icon)

    # Bloomberg terminal UI cards mockup
    font_bold = get_mono(18)
    font_sub = get_mono(11)
    font_num = get_mono(14)

    # Card 1: Total PnL
    draw.rounded_rectangle([280, 80, 510, 170], radius=8, fill=(14, 20, 28, 240), outline=(28, 42, 58, 255), width=1)
    draw.text((295, 92), "NET P&L (MTD)", font=font_sub, fill=(140, 160, 180, 255))
    draw.text((295, 112), "+$18,450.25", font=font_bold, fill=(52, 211, 153, 255))
    draw.text((295, 142), "▲ +24.6% vs SPX", font=font_sub, fill=(16, 185, 129, 255))

    # Card 2: Win Rate & Sharpe
    draw.rounded_rectangle([530, 80, 740, 170], radius=8, fill=(14, 20, 28, 240), outline=(28, 42, 58, 255), width=1)
    draw.text((545, 92), "WIN RATE / PROFIT FACTOR", font=font_sub, fill=(140, 160, 180, 255))
    draw.text((545, 112), "68.4% · 2.45 PF", font=font_bold, fill=(245, 158, 11, 255))
    draw.text((545, 142), "Avg Trade: +$420.00", font=font_sub, fill=(140, 160, 180, 255))

    # Equity curve mini chart
    points = [
        (70, 360), (120, 350), (170, 340), (220, 355), (280, 310),
        (340, 290), (400, 305), (460, 270), (520, 250), (580, 260),
        (640, 220), (700, 200), (740, 190)
    ]
    for i in range(len(points) - 1):
        draw.line([points[i], points[i+1]], fill=(52, 211, 153, 240), width=3)
    for p in points[::2]:
        draw.ellipse([p[0]-3, p[1]-3, p[0]+3, p[1]+3], fill=(255, 255, 255, 255))

    badges = ["Next.js 16", "Tailwind CSS", "Recharts", "Analytics", "Trading Journal"]
    bx = 55
    for b in badges:
        bw = font_sub.getlength(b) if hasattr(font_sub, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(16, 24, 34, 220), outline=(35, 55, 75, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_sub, fill=(160, 215, 200, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "drawdown.png"), "PNG", optimize=True)

# 6. glog.png (Go Logger)
def make_glog():
    canvas = create_base_canvas(bg_color=(10, 14, 20), grid_color=(20, 28, 40))
    draw = ImageDraw.Draw(canvas)

    # Cyan Go glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(220, 30, -10):
        alpha = int(24 * (1 - r / 220))
        gdraw.ellipse([180 - r, H//2 - r, 180 + r, H//2 + r], fill=(0, 173, 216, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(35, 55, 75, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(28, 45, 65, 200), width=1)
    draw_window_header(draw, "glog · Concurrent Zero-Dependency Logger for Go", "pkg.go.dev/ric-v/glog", 45, 30)

    # Mascot on left
    icon_path = "public/projects/glog.png"
    if os.path.exists(icon_path):
        mascot = Image.open(icon_path).convert("RGBA")
        mascot.thumbnail((220, 280), Image.Resampling.LANCZOS)
        canvas.paste(mascot, (65, 95), mascot)

    # Terminal logs on right
    font_code = get_mono(12)
    logs = [
        ("INFO", (56, 189, 248), "channel-stream: initialized with 64KB ring buffer"),
        ("DEBUG", (168, 85, 247), "worker.0: batch lock acquired, flushed 4,200 events"),
        ("INFO", (56, 189, 248), "async-writer: disk sync latency p99 = 1.2ms"),
        ("WARN", (245, 158, 11), "high-throughput: rate 125,000 logs/sec sustained"),
        ("OK", (52, 211, 153), "zero-allocation logging verified across 16 goroutines"),
        ("INFO", (56, 189, 248), "thread-safe file rotation complete (size=100MB)"),
    ]
    draw.rounded_rectangle([310, 80, 740, 370], radius=8, fill=(8, 12, 18, 240), outline=(30, 44, 60, 255), width=1)
    # Header inside terminal box
    draw.rectangle([310, 80, 740, 105], fill=(16, 22, 32, 255))
    draw.text((325, 87), "$ glog_benchmark --goroutines=16 --zero-deps", font=font_code, fill=(140, 165, 195, 255))

    ly = 120
    for level, color, text in logs:
        draw.text((325, ly), f"[{level}]", font=font_code, fill=color)
        draw.text((385, ly), text[:45], font=font_code, fill=(200, 215, 230, 255))
        ly += 38

    badges = ["Go 1.21+", "Concurrency-Safe", "Channel Streaming", "Zero Dependencies", "Ring Buffer"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(16, 24, 34, 220), outline=(40, 60, 85, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(160, 225, 245, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "glog.png"), "PNG", optimize=True)

# 7. pacpad.png (Arch Linux TUI Manager)
def make_pacpad():
    canvas = create_base_canvas(bg_color=(12, 14, 18), grid_color=(20, 24, 30))
    draw = ImageDraw.Draw(canvas)

    # Arch Linux cyan glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int(22 * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(23, 147, 209, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(40, 55, 70, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(30, 42, 54, 200), width=1)
    draw_window_header(draw, "pacpad ── Arch Linux Terminal App Manager", "Rust + Ratatui", 45, 30)

    # TUI Tabs
    font_mono = get_mono(12)
    font_bold = get_mono(13)
    draw.rectangle([50, 70, W - 50, 100], fill=(18, 24, 32, 255))
    tabs = [("[1: Installed]", True), ("[2: Search]", False), ("[3: WebApps & TUI]", False), ("[4: System Updates]", False)]
    tx = 65
    for tab_label, active in tabs:
        tw = font_mono.getlength(tab_label) if hasattr(font_mono, 'getlength') else len(tab_label)*8
        if active:
            draw.rectangle([tx - 5, 73, tx + tw + 5, 97], fill=(23, 147, 209, 255))
            draw.text((tx, 78), tab_label, font=font_bold, fill=(255, 255, 255, 255))
        else:
            draw.text((tx, 78), tab_label, font=font_mono, fill=(120, 140, 160, 255))
        tx += tw + 25

    # TUI Table
    draw.rectangle([50, 110, W - 50, 360], fill=(14, 18, 24, 255), outline=(32, 42, 54, 255), width=1)
    headers = "  PACKAGE              VERSION        REPO          SIZE       DESCRIPTION"
    draw.text((60, 120), headers, font=font_mono, fill=(23, 147, 209, 255))
    draw.line([(50, 140), (W - 50, 140)], fill=(32, 42, 54, 255), width=1)

    pkgs = [
        ("  eza", "0.23.5-2", "extra", "1.4 MiB", "Modern, maintained replacement for ls"),
        ("  htop", "3.4.1-1", "extra", "420 KiB", "Interactive process viewer and manager"),
        ("  neovim", "0.10.4-1", "extra", "32.1 MiB", "Vim-fork focused on extensibility and Lua"),
        ("  pacman", "6.1.0-4", "core", "4.8 MiB", "A library-based package manager with deps"),
        ("  ripgrep", "15.2.0-1", "extra", "5.2 MiB", "Fast line-oriented search tool / regex engine"),
        ("  alacritty", "0.14.0-2", "extra", "12.8 MiB", "A cross-platform, GPU-accelerated terminal"),
    ]
    py = 155
    for name, ver, repo, sz, desc in pkgs:
        if name.strip() == "eza":
            draw.rectangle([52, py - 3, W - 52, py + 22], fill=(23, 147, 209, 45))
        draw.text((60, py), f"{name:<20} {ver:<14} {repo:<13} {sz:<10} {desc}", font=font_mono, fill=(220, 230, 240, 255))
        py += 32

    # Bottom status bar
    draw.rectangle([50, 335, W - 50, 360], fill=(23, 147, 209, 220))
    draw.text((60, 340), " [q] Quit  [Tab] Next Tab  [/] Filter  [Enter] Package Details  [u] Sync Repos", font=font_mono, fill=(10, 14, 20, 255))

    badges = ["Rust", "Ratatui", "Arch Linux", "ALPM Lib", "TUI Launcher"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(18, 26, 36, 220), outline=(35, 65, 90, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(140, 210, 245, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "pacpad.png"), "PNG", optimize=True)

# 8. timeis.png (And the time is...)
def make_timeis():
    canvas = create_base_canvas(bg_color=(8, 12, 22), grid_color=(18, 24, 38))
    draw = ImageDraw.Draw(canvas)

    # Blue oceanic atmospheric glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(250, 40, -10):
        alpha = int(26 * (1 - r / 250))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(14, 165, 233, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(35, 55, 80, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(28, 44, 65, 200), width=1)
    draw_window_header(draw, "And the time is… · Global Timezone Observatory", "Next.js / Redux", 45, 30)

    # Hero Clock on Left
    font_hero_time = get_mono(26)
    font_mono = get_mono(12)
    font_bold = get_mono(14)
    font_sub = get_mono(11)

    draw.rounded_rectangle([55, 80, 310, 230], radius=10, fill=(14, 20, 32, 240), outline=(35, 60, 90, 255), width=1)
    draw.text((75, 95), "LOCAL SYSTEM TIME", font=font_sub, fill=(56, 189, 248, 255))
    draw.text((75, 120), "16:45:20", font=font_hero_time, fill=(255, 255, 255, 255))
    draw.text((75, 160), "Asia/Kolkata (IST)", font=font_bold, fill=(224, 242, 254, 255))
    draw.text((75, 185), "UTC +05:30 · Monday, Nov 2", font=font_sub, fill=(148, 163, 184, 255))

    # Pinned Zone Cards on Right
    zones = [
        ("UTC (Universal)", "11:15:20", "0h offset", "Coordinated Universal Time"),
        ("America/New_York (EST)", "07:15:20", "-9h 30m", "Market Open · Wall Street"),
        ("Europe/London (GMT)", "12:15:20", "-4h 30m", "Midday · City of London"),
        ("Asia/Tokyo (JST)", "20:15:20", "+3h 30m", "Evening · Shibuya Crossing"),
    ]
    zy = 80
    for name, t_str, diff, desc in zones:
        draw.rounded_rectangle([330, zy, W - 55, zy + 65], radius=8, fill=(12, 18, 28, 230), outline=(28, 45, 68, 255), width=1)
        draw.text((345, zy + 12), name, font=font_bold, fill=(224, 231, 255, 255))
        draw.text((345, zy + 36), desc, font=font_sub, fill=(100, 116, 139, 255))
        
        tw = font_mono.getlength(t_str) if hasattr(font_mono, 'getlength') else 70
        draw.text((W - 75 - tw, zy + 12), t_str, font=font_bold, fill=(56, 189, 248, 255))
        draw.text((W - 75 - tw, zy + 36), diff, font=font_sub, fill=(148, 163, 184, 255))
        zy += 75

    # Globe silhouette / horizon points across bottom
    for i in range(40):
        px = 55 + i * 17
        py = 320 + int(math.sin(i * 0.25) * 15)
        draw.ellipse([px-1, py-1, px+1, py+1], fill=(56, 189, 248, 140))

    badges = ["Next.js", "Redux Toolkit", "Tailwind CSS", "Time Zones", "World Clock"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(14, 24, 38, 220), outline=(35, 65, 95, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(140, 220, 250, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "timeis.png"), "PNG", optimize=True)

# 9. taskmaster.png (Task Master Go scheduler)
def make_taskmaster():
    canvas = create_base_canvas(bg_color=(10, 14, 20), grid_color=(20, 26, 36))
    draw = ImageDraw.Draw(canvas)

    # Amber / Cyan scheduler engine glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(230, 40, -10):
        alpha = int(22 * (1 - r / 230))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(245, 158, 11, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(50, 45, 35, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(40, 35, 25, 200), width=1)
    draw_window_header(draw, "Task Master · Concurrent Execution & Scheduler", "Zero-Dependency Go Library", 45, 30)

    font_mono = get_mono(12)
    font_bold = get_mono(14)
    font_sub = get_mono(11)

    # DAG Nodes Pipeline
    nodes = [
        (65, 130, 180, 210, "1. Ingest Queue", "FIFO · Channel Buffer", (245, 158, 11)),
        (290, 100, 480, 175, "2A. Priority Pool", "Worker Pool x8 (CPU)", (56, 189, 248)),
        (290, 200, 480, 275, "2B. Batch Scheduler", "Debounce 100ms · Cron", (168, 85, 247)),
        (580, 130, 735, 210, "3. Commit & Ack", "Thread-Safe Storage", (52, 211, 153)),
    ]

    for x1, y1, x2, y2, title, desc, col in nodes:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=8, fill=(16, 20, 28, 240), outline=col, width=1)
        draw.text((x1 + 14, y1 + 18), title, font=font_bold, fill=(255, 255, 255, 255))
        draw.text((x1 + 14, y1 + 44), desc, font=font_sub, fill=(148, 163, 184, 255))

    # Connection lines & arrows
    draw.line([(180, 170), (290, 137)], fill=(245, 158, 11, 200), width=2)
    draw.line([(180, 170), (290, 237)], fill=(245, 158, 11, 200), width=2)
    draw.line([(480, 137), (580, 170)], fill=(56, 189, 248, 200), width=2)
    draw.line([(480, 237), (580, 170)], fill=(168, 85, 247, 200), width=2)

    # Code / Metric Bar
    draw.rounded_rectangle([65, 300, W - 65, 360], radius=6, fill=(12, 16, 24, 240), outline=(32, 44, 60, 255), width=1)
    draw.text((80, 315), "scheduler.New(PoolSize(16), WithBackoff(Exponential))", font=font_mono, fill=(56, 189, 248, 255))
    draw.text((80, 336), "▶ Running: 1,420 jobs/sec · Error rate: 0.00% · Goroutine leaks: 0", font=font_sub, fill=(52, 211, 153, 255))

    badges = ["Go", "Task Scheduling", "Worker Pools", "Zero Dependencies", "Concurrency"]
    bx = 55
    font_badge = get_mono(11)
    for b in badges:
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(24, 22, 18, 220), outline=(65, 55, 35, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(250, 215, 140, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "taskmaster.png"), "PNG", optimize=True)

# 10. gofunc.png (Go Func Collections)
def make_gofunc():
    canvas = create_base_canvas(bg_color=(10, 13, 18), grid_color=(18, 24, 34))
    draw = ImageDraw.Draw(canvas)

    # Indigo Go generics glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for r in range(240, 40, -10):
        alpha = int(22 * (1 - r / 240))
        gdraw.ellipse([W//2 - r, H//2 - r, W//2 + r, H//2 + r], fill=(99, 102, 241, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(16))
    canvas = Image.alpha_composite(canvas, glow)
    draw = ImageDraw.Draw(canvas)

    draw.rounded_rectangle([30, 20, W - 30, H - 25], radius=12, outline=(40, 45, 65, 200), width=1)
    draw.line([(30, 50), (W - 30, 50)], fill=(32, 38, 52, 200), width=1)
    draw_window_header(draw, "go-func-collections · Generic Functional Utilities", "Go 1.18+ Generics", 45, 30)

    font_code = get_mono(13)
    draw.rounded_rectangle([60, 80, W - 60, 360], radius=8, fill=(8, 11, 16, 255), outline=(30, 38, 52, 255), width=1)

    code_lines = [
        ("// Functional slice manipulation with type safety and zero reflection", (100, 116, 139)),
        ("package array", (244, 63, 94)),
        ("", (0,0,0)),
        ("func Map[T, R any](items []T, iter func(item T) R) []R {", (226, 232, 240)),
        ("    result := make([]R, len(items))", (148, 163, 184)),
        ("    for i, v := range items { result[i] = iter(v) }", (148, 163, 184)),
        ("    return result", (244, 63, 94)),
        ("}", (226, 232, 240)),
        ("", (0,0,0)),
        ("func Filter[T any](items []T, predicate func(T) bool) []T {", (226, 232, 240)),
        ("    result := make([]T, 0, len(items))", (148, 163, 184)),
        ("    for _, v := range items { if predicate(v) { result = append(result, v) } }", (148, 163, 184)),
        ("    return result", (244, 63, 94)),
        ("}", (226, 232, 240)),
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
        bw = font_badge.getlength(b) if hasattr(font_badge, 'getlength') else len(b)*7
        draw.rounded_rectangle([bx, H - 55, bx + bw + 14, H - 35], radius=4, fill=(18, 22, 34, 220), outline=(45, 55, 80, 220), width=1)
        draw.text((bx + 7, H - 52), b, font=font_badge, fill=(180, 195, 245, 255))
        bx += bw + 20

    canvas.convert("RGB").save(os.path.join(OUTPUT_DIR, "gofunc.png"), "PNG", optimize=True)

if __name__ == "__main__":
    print("Generating nexql-core...")
    make_nexql_core()
    print("Generating nexql-mcp...")
    make_nexql_mcp()
    print("Generating nexql-themes...")
    make_nexql_themes()
    print("Generating divulge...")
    make_divulge()
    print("Generating drawdown...")
    make_drawdown()
    print("Generating glog...")
    make_glog()
    print("Generating pacpad...")
    make_pacpad()
    print("Generating timeis...")
    make_timeis()
    print("Generating taskmaster...")
    make_taskmaster()
    print("Generating gofunc...")
    make_gofunc()
    print("Done! All project images generated.")
