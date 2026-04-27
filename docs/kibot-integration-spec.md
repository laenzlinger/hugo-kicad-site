# KiBot Integration Spec for hugo-kicad-site

This document describes what the Hugo site expects from KiBot, so that KiBot
could optionally produce the site-ready structure directly — replacing the
shell glue currently in the CI workflow.

## Overview

The CI workflow does three things after KiBot runs:

1. **Copies KiBot outputs** into Hugo's `static/` directory
2. **Discovers assets** (renders, downloads, diffs, iBOM) from the KiBot output
3. **Generates `config_override.yaml`** with the discovered asset metadata

Steps 2 and 3 are pure post-processing of KiBot's output and could be done by
KiBot itself.

## Expected directory layout

Hugo expects assets in `site/static/` with this structure:

```
site/static/
├── kicad/                          ← KiCad source files (for KiCanvas viewer)
│   ├── my-project.kicad_sch
│   ├── sub-sheet.kicad_sch         ← additional schematic sheets
│   └── my-project.kicad_pcb
├── 3D/                             ← 3D renders
│   ├── my-project-3D_blender_1_top.png
│   └── my-project-3D_blender_2_bottom.png
├── Schematic/                      ← PDF schematic
│   └── my-project-schematic.pdf
├── BoM/                            ← BOM files
│   ├── my-project-bom.html
│   └── my-project-bom.csv
├── Assembly/                       ← Interactive BOM
│   └── my-project-ibom.html
├── Diff/                           ← Schematic/PCB diffs (optional)
│   ├── my-project-diff_sch.pdf
│   └── my-project-diff_pcb.pdf
├── JLCPCB/                         ← Fabrication files (optional)
│   └── my-project-JLCPCB.zip
├── PCBWay/                         ← Fabrication files (optional)
│   └── my-project-PCBWay.zip
└── assembly/                       ← 3D assembly models (optional)
    ├── assembly-enclosure.step
    └── assembly-enclosure.png      ← thumbnail (auto-generated if missing)
```

The directory names and file patterns come from typical KiBot configurations.
The CI workflow doesn't enforce a rigid structure — it uses `find` with glob
patterns to discover files.

## config_override.yaml

This YAML file is merged with the user's `hugo.yaml` at build time. It
contains the dynamic, build-specific parameters:

```yaml
baseURL: "https://example.github.io/my-project/latest/"
params:
  version: "main"
  kicadFiles: ["my-project.kicad_sch","sub-sheet.kicad_sch","my-project.kicad_pcb"]
  renders: ["my-project-3D_blender_1_top.png","my-project-3D_blender_2_bottom.png"]
  downloads:
    - name: "Schematic (PDF)"
      path: "Schematic/my-project-schematic.pdf"
    - name: "BOM (HTML)"
      path: "BoM/my-project-bom.html"
    - name: "BOM (CSV)"
      path: "BoM/my-project-bom.csv"
    - name: "Interactive BOM"
      path: "Assembly/my-project-ibom.html"
    - name: "JLCPCB"
      path: "JLCPCB/my-project-JLCPCB.zip"
  diffs:
    - name: "My Project Diff Sch"
      path: "Diff/my-project-diff_sch.pdf"
    - name: "My Project Diff Pcb"
      path: "Diff/my-project-diff_pcb.pdf"
  ibom: "Assembly/my-project-ibom.html"
  assemblyModels:
    - name: "Enclosure"
      file: "assembly-enclosure.step"
```

### Field reference

| Field | Type | Description |
|-------|------|-------------|
| `baseURL` | string | Full URL including version path segment |
| `params.version` | string | Git tag (e.g. `v1.0.0`) or `main` for latest |
| `params.kicadFiles` | string[] | Filenames in `static/kicad/`, root schematic first, then sub-sheets, then PCB |
| `params.renders` | string[] | Filenames in `static/3D/`, Blender renders preferred over plain renders |
| `params.downloads` | object[] | `{name, path}` — display name and path relative to `static/` |
| `params.diffs` | object[] | `{name, path}` — display name and path relative to `static/` |
| `params.ibom` | string | Path to interactive BOM relative to `static/` |
| `params.assemblyModels` | object[] | `{name, file}` — display name and filename in `static/assembly/` |

### Discovery rules (current CI logic)

**Renders:** All `*.png` files in `3D/`. If any contain `blender` in the name, only those are used.

**Downloads:** Found by glob pattern in the generated output directory:
- `*schematic*.pdf` → "Schematic (PDF)"
- `*bom*.html` (excluding `*ibom*`) → "BOM (HTML)"
- `*bom*.csv` (excluding `*ibom*`) → "BOM (CSV)"
- `*ibom*.html` → "Interactive BOM"
- `*JLCPCB*.zip` → "JLCPCB"
- `*PCBWay*.zip` → "PCBWay"

**Diffs:** All `*.html` and `*.pdf` files in `Diff/` or `diff/`. Display name is derived from the filename (hyphens → spaces, title case).

**Interactive BOM:** First `*ibom*.html` found anywhere in the output.

**Assembly models:** All `*.step`, `*.glb`, `*.3mf` files in `assembly/` prefixed with `assembly-`. Display name is derived from the filename (strip `assembly-` prefix and extension, replace hyphens/underscores with spaces).

## What KiBot could provide

A KiBot output that:

1. Copies KiBot-generated assets into the Hugo `static/` directory structure
2. Copies KiCad source files (`.kicad_sch`, `.kicad_pcb`) into `static/kicad/`
3. Generates `config_override.yaml` with discovered asset metadata

This would replace the "Discover" and "Copy assets" and "Build Hugo config override" steps in the CI workflow, reducing it to: KiBot → Hugo build → Deploy.
