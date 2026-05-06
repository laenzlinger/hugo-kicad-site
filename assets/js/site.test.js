import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const publicDir = join(__dirname, '../../exampleSite/public');

beforeAll(() => {
  execSync('hugo --source exampleSite', {
    cwd: join(__dirname, '../..'),
    stdio: 'pipe',
  });
}, 30000);

function readPage(path) {
  return readFileSync(join(publicDir, path), 'utf-8');
}

describe('Hugo build', () => {
  it('produces output directory', () => {
    expect(existsSync(publicDir)).toBe(true);
  });

  it('generates all expected pages', () => {
    const pages = ['index.html', 'board/index.html', 'release/index.html', 'assembly/index.html'];
    for (const page of pages) {
      expect(existsSync(join(publicDir, page)), `missing ${page}`).toBe(true);
    }
  });
});

describe('Board page', () => {
  let html;
  beforeAll(() => { html = readPage('board/index.html'); });

  it('contains KiCanvas embed', () => {
    expect(html).toContain('kicanvas-embed');
  });

  it('contains fullscreen button', () => {
    expect(html).toContain('viewer-fullscreen-btn');
  });

  it('has section heading anchors', () => {
    expect(html).toContain('id="schematic--pcb"');
  });
});

describe('Assembly page', () => {
  let html;
  beforeAll(() => { html = readPage('assembly/index.html'); });

  it('shows no-models message when none configured', () => {
    expect(html).toContain('No assembly models available');
  });
});

describe('Release page', () => {
  let html;
  beforeAll(() => { html = readPage('release/index.html'); });

  it('contains release card', () => {
    expect(html).toContain('release-card');
  });
});

describe('Layout structure (all pages)', () => {
  let html;
  beforeAll(() => { html = readPage('index.html'); });

  it('uses Hextra navbar', () => {
    expect(html).toContain('hextra-nav-container');
  });

  it('contains version picker script', () => {
    expect(html).toContain('version-select');
  });

  it('contains footer badges', () => {
    expect(html).toContain('footer-badges');
  });

  it('does not use PaperMod classes', () => {
    expect(html).not.toContain('post-single');
    expect(html).not.toContain('logo-switches');
  });
});

describe('CSS output', () => {
  it('compiled CSS contains custom styles', () => {
    const cssFiles = execSync(`find ${publicDir}/css -name "*.css"`, { encoding: 'utf-8' }).trim().split('\n');
    const css = cssFiles.map(f => readFileSync(f, 'utf-8')).join('');
    expect(css).toContain('gallery-grid');
    expect(css).toContain('viewer-fullscreen-btn');
    expect(css).toContain('release-card');
    expect(css).toContain('kicad-bg');
  });
});
