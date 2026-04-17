# hugo-kicad-site

A reusable Hugo theme for KiCad hardware project documentation.

**[Live demo →](https://laenzlinger.github.io/granit/latest/)** (Granit — a CM4 carrier board project using this theme)

## Features

- Multi-page versioned documentation (Read the Docs style)
- Version picker in the nav bar on every page
- Embedded [KiCanvas](https://kicanvas.org/) viewer for interactive schematic/PCB browsing
- 3D render gallery (from KiBot/Blender exports)
- Downloads section (Gerbers, BOM, iBOM, schematics)
- Links to GitHub repo, OSHWA certification, fabrication, BOM suppliers
- Extensible with custom markdown pages (assembly guides, design notes, etc.)
- Fully configurable via `hugo.yaml` params
- Reusable GitHub Actions workflow for CI/CD

## Architecture

Each version (git tag or `latest`) gets its own complete Hugo site:

```
gh-pages/
├── index.html          ← redirect to latest/
├── versions.json       ← version list for the picker
├── latest/             ← full site built from main branch
│   ├── index.html      ← overview
│   ├── schematic/      ← KiCanvas viewer
│   ├── gallery/        ← 3D renders
│   ├── downloads/      ← generated assets
│   └── assembly-guide/ ← custom content
└── v4.0.0/             ← full site built from tag
    └── ...
```

## Usage

### 1. Add the theme to your KiCad repo

Create a `site/` directory in your hardware repo:

```
pedalboard-hw/
├── pedalboard-hw.kicad_sch
├── pedalboard-hw.kicad_pcb
├── pedalboard-hw.kibot.yaml
└── site/
    ├── hugo.yaml
    └── content/
        ├── _index.md         ← overview (custom markdown)
        ├── board.md          ← type: board
        ├── release.md        ← type: release
        └── my-custom-page.md ← any additional content
```

### 2. Configure hugo.yaml

```yaml
module:
  imports:
    - path: github.com/laenzlinger/hugo-kicad-site

params:
  projectName: "My KiCad Project"
  repoURL: "https://github.com/org/repo"
```

See [exampleSite/hugo.yaml](exampleSite/hugo.yaml) for all parameters.

### 3. Add content pages

Built-in page types (set via `type` in front matter):

| Type | Description |
|------|-------------|
| `board` | KiCanvas schematic/PCB viewer + 3D render gallery + custom content |
| `release` | Combined release notes, downloads, and schematic/PCB diffs |
| `assembly` | Interactive 3D model viewer (STEP/GLB via [Online3DViewer](https://github.com/kovacsv/Online3DViewer)) |
| `kicanvas` | Embedded KiCanvas schematic/PCB viewer (standalone, use `board` instead) |
| `gallery` | 3D render image grid (standalone, use `board` instead) |
| `downloads` | Auto-generated download list (standalone, use `release` instead) |
| `changes` | Release notes + diffs (standalone, use `release` instead) |
| *(default)* | Standard markdown page |

Custom pages are plain markdown — add as many as you need.

### 4. Set up CI

See [docs/ci.md](docs/ci.md) for GitHub Actions integration.

## License

MIT

## Credits

Built on top of [PaperMod](https://github.com/adityatelange/hugo-PaperMod). All custom layouts use PaperMod's `baseof.html` and styling.
