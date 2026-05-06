# Migration Guide: PaperMod → Hextra

This guide covers the changes needed in your site's `hugo.yaml` when upgrading to the Hextra-based version of hugo-kicad-site.

## Update the theme module

Run this in your site directory to pull the latest version:

```sh
hugo mod get -u github.com/laenzlinger/hugo-kicad-site
```

## Module import (no change)

Your module import stays the same:

```yaml
module:
  imports:
    - path: github.com/laenzlinger/hugo-kicad-site
```

## Menu configuration

### Internal links: `url` → `pageRef`

Hextra uses `pageRef` for internal links (enables active page highlighting):

```yaml
# Before (PaperMod)
menu:
  main:
    - name: Board
      url: /board/
      weight: 20

# After (Hextra)
menu:
  main:
    - name: Board
      pageRef: /board/
      weight: 20
```

### GitHub icon: inline SVG → `params.icon`

```yaml
# Before (PaperMod)
    - name: GitHub
      pre: '<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg> '
      url: https://github.com/org/repo
      weight: 100

# After (Hextra)
    - name: GitHub
      url: https://github.com/org/repo
      params:
        icon: github
      weight: 100
```

### Theme toggle (optional)

Add a dark/light mode toggle to the navbar:

```yaml
    - name: Theme Toggle
      weight: 110
      params:
        type: theme-toggle
```

## Remove PaperMod-specific params

Remove these from your `params:` section — they are no longer used:

```yaml
# Remove these
params:
  env: production          # ← remove
  socialIcons:             # ← remove
    - name: github
      url: "..."
```

## Optional Hextra params

These are optional but recommended:

```yaml
params:
  navbar:
    displayTitle: true
    displayLogo: false
    width: wide            # full | wide | normal
  page:
    width: wide            # full | wide | normal
  theme:
    default: system        # light | dark | system
    displayToggle: false   # false if using navbar menu toggle
  footer:
    displayCopyright: false
    displayPoweredBy: false
```

## Content pages (no change)

Your content pages (`board.md`, `release.md`, `assembly.md`, etc.) require **no changes**. All front matter (`type`, `title`, `weight`) works the same.

## New features available

After migrating, you get these features for free:

- **Built-in search** — FlexSearch, works offline
- **Dark/light mode** — with system detection
- **Table of contents** — on every page (disable per-page with `toc: false` in front matter)
- **Wider layout** — better use of screen space for viewers and galleries

## Full example

```yaml
baseURL: https://my-org.github.io/my-project/
languageCode: en-us
title: My KiCad Project

module:
  imports:
    - path: github.com/laenzlinger/hugo-kicad-site

params:
  projectName: "My KiCad Project"
  repoURL: "https://github.com/org/repo"
  license: "MIT"
  oshwaID: "US000000"
  navbar:
    displayTitle: true
    width: wide
  page:
    width: wide
  theme:
    default: system
    displayToggle: false
  footer:
    displayCopyright: false
    displayPoweredBy: false

menu:
  main:
    - name: Board
      pageRef: /board/
      weight: 20
    - name: Release
      pageRef: /release/
      weight: 30
    - name: Assembly
      pageRef: /assembly/
      weight: 40
    - name: GitHub
      url: https://github.com/org/repo
      params:
        icon: github
      weight: 100
    - name: Theme Toggle
      weight: 110
      params:
        type: theme-toggle
```
