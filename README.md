# hugo-kicad-site

A reusable Hugo theme for KiCad hardware project documentation.

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
        ├── schematic.md      ← type: kicanvas
        ├── gallery.md        ← type: gallery
        ├── downloads.md      ← type: downloads
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
  schematicFile: "project.kicad_sch"
  pcbFile: "project.kicad_pcb"
  oshwaID: "CH000023"
```

See [exampleSite/hugo.yaml](exampleSite/hugo.yaml) for all parameters.

### 3. Add content pages

Built-in page types (set via `type` in front matter):

| Type | Description |
|------|-------------|
| `kicanvas` | Embedded KiCanvas schematic/PCB viewer |
| `gallery` | 3D render image grid |
| `downloads` | Auto-generated download list |
| *(default)* | Standard markdown page |

Custom pages are plain markdown — add as many as you need.

### 4. Set up CI

See [docs/ci.md](docs/ci.md) for GitHub Actions integration.

## License

MIT
