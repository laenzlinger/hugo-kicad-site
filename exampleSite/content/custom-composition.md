---
title: Custom Composition
weight: 55
---

This page demonstrates how to **compose pages from Markdown** using the `call-partial` shortcode — no custom HTML templates needed.

## How it works

Instead of using a fixed layout type like `board` or `assembly`, you can insert any partial directly in your Markdown:

```markdown
{{</* call-partial "kicanvas.html" */>}}
{{</* call-partial "gallery.html" */>}}
{{</* call-partial "ibom.html" */>}}
```

This lets you mix and match components freely, add your own content between them, and control the order.

---

## Schematic & PCB

{{< call-partial "kicanvas.html" >}}

## 3D Renders

{{< call-partial "gallery.html" >}}

## Interactive BOM

{{< call-partial "ibom.html" >}}

## 3D Assembly

{{< call-partial "assembly.html" >}}

---

## Why use this?

- **Full control** over page structure and content order
- **No Go/HTML knowledge** required — pure Markdown
- **Mix components** with your own prose, tables, images, etc.
- Works with any partial: `gallery.html`, `kicanvas.html`, `ibom.html`
