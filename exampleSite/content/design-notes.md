---
title: Design Notes
weight: 40
---

This page demonstrates a **custom markdown page** — any content that doesn't fit the built-in page types.

Use these for assembly guides, design notes, project history, or anything else.

## Connector Placement

The Arduino Uno shield template places all pin headers along the board edges to match the standard Arduino form factor:

| Connector | Pins | Function |
|-----------|------|----------|
| J1 | 1×8 | Digital I/O 0–7 |
| J2 | 1×6 | Analog inputs A0–A5 |
| J3 | 1×10 | Digital I/O 8–13 + GND/AREF |

## Mounting Holes

Four M3.2 mounting holes match the Arduino Uno board-to-board spacing. Use 11mm standoffs for proper clearance.

## Resources

- [Arduino Uno Rev3 Schematic](https://docs.arduino.cc/resources/schematics/A000066-schematics.pdf)
- [KiCad Documentation](https://docs.kicad.org/)
- [hugo-kicad-site Theme](https://github.com/laenzlinger/hugo-kicad-site)
