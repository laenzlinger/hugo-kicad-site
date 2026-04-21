# CI Integration

## Using the reusable workflow

Create `.github/workflows/ci.yml` in your KiCad repo:

```yaml
name: "Generate output"

on:
  push:
    branches: [main]
    tags: ["v*"]
    paths:
      - "*.kicad_sch"
      - "*.kicad_pcb"
      - "*.kibot.yaml"
      - "site/**"
      - ".github/workflows/ci.yml"
  pull_request:
    paths:
      - "*.kicad_sch"
      - "*.kicad_pcb"

jobs:
  site:
    uses: laenzlinger/hugo-kicad-site/.github/workflows/kicad-site.yml@main
    with:
      project_name: "pedalboard-hw"
      schematic: "pedalboard-hw.kicad_sch"
      site_base_url: "https://pedalboard.github.io/pedalboard-hw"
```

## Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `project_name` | (required) | Project name |
| `schematic` | (required) | KiCad schematic filename |
| `site_base_url` | (required) | GitHub Pages base URL |
| `pcb` | `""` | KiCad PCB filename |
| `kicad_dir` | `.` | Directory containing KiCad files |
| `kibot_config` | `""` | KiBot config filename |
| `container_image` | `ghcr.io/inti-cmnb/kicad9_auto_full:latest` | KiCad container |
| `kibot_install` | `""` | Custom KiBot install command (for containers without KiBot) |
| `site_dir` | `site` | Directory with Hugo site (must contain `.mise.toml`) |
| `remove_step_file` | `true` | Remove large STEP file |
| `assembly_dir` | `""` | Directory containing assembly 3D models (STEP/GLB) |

## How it works

Hugo and Go versions are managed via [mise](https://mise.jdx.dev/). Your `site_dir` must contain a `.mise.toml`:

```toml
[tools]
hugo = "0.160.1"
go = "1.26"
```

1. KiBot generates assets (Gerbers, BOM, iBOM, 3D renders, schematics)
2. CI discovers renders (`.png` in `3D/`) and downloads (BOM, Gerbers, etc.)
3. KiBot outputs are copied into Hugo's `static/` directory
4. Hugo builds the site with `--baseURL` set to `/<version>/`
5. The built site deploys to `gh-pages/<version>/`
6. A root `versions.json` is updated for the version picker
7. Root `index.html` redirects to `latest/`

Each version is a complete, self-contained Hugo site. The version picker
fetches `versions.json` from the site root and navigates between versions
while staying on the same page.

## Granit example (KiCad files in hardware/ subdirectory)

```yaml
jobs:
  site:
    uses: laenzlinger/hugo-kicad-site/.github/workflows/kicad-site.yml@main
    with:
      project_name: "granit"
      schematic: "granit.kicad_sch"
      pcb: "granit.kicad_pcb"
      kicad_dir: "hardware"
      kibot_config: "granit.kibot.yaml"
      container_image: "ghcr.io/inti-cmnb/kicad10_auto_full:dev"
      assembly_dir: "mechanical"
      site_base_url: "https://laenzlinger.github.io/granit"
```
