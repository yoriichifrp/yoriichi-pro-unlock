const { chromium } = require('/opt/appjet/browser/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const out = {};

  for (const vp of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'laptop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    let ok = false;
    for (let i = 0; i < 6 && !ok; i += 1) {
      try {
        await page.goto('http://127.0.0.1:8080/', { waitUntil: 'load', timeout: 8000 });
        ok = true;
      } catch {
        await page.waitForTimeout(800);
      }
    }
    if (!ok) {
      out[vp.name] = { error: 'server not reachable' };
      await ctx.close();
      continue;
    }

    await page.waitForSelector('.hero-ref', { timeout: 15000 });
    await page.waitForTimeout(1500);

    out[vp.name] = await page.evaluate(() => {
      const rect = (el) => (el ? el.getBoundingClientRect() : null);
      const hero = document.querySelector('.hero-ref');
      const art = document.querySelector('.hero-art');
      const title = document.querySelector('.hero-title-ref .title-main');
      const sub = document.querySelector('.hero-title-ref .title-sub span');
      const device = document.querySelector('.hero-device');
      const svg = document.querySelector('.device-svg');
      const portrait = document.querySelector('.hero-portrait');
      const img = document.querySelector('.hero-portrait-img');
      const h = rect(hero);
      const a = rect(art);
      const t = rect(title);
      const d = rect(device);

      return {
        hero: h ? { w: Math.round(h.width), h: Math.round(h.height) } : null,
        art: a ? { w: Math.round(a.width), x: Math.round(a.x), right: Math.round(a.right), h: Math.round(a.height) } : null,
        artPct: h && a ? +((a.width / h.width) * 100).toFixed(1) : null,
        title: t ? { font: getComputedStyle(title).fontSize, x: Math.round(t.x), right: Math.round(t.right), w: Math.round(t.width) } : null,
        sub: sub ? { font: getComputedStyle(sub).fontSize, w: Math.round(sub.getBoundingClientRect().width) } : null,
        device: d ? { w: Math.round(d.width), x: Math.round(d.x), right: Math.round(d.right) } : null,
        devicePct: h && d ? +((d.width / h.width) * 100).toFixed(1) : null,
        svgW: svg ? Math.round(rect(svg).width) : null,
        portraitSource: portrait ? portrait.getAttribute('data-portrait-source') : null,
        imgNaturalWidth: img ? img.naturalWidth : null,
        gapArtToTitle: a && t ? Math.round(t.x - a.right) : null,
        gapTitleToDevice: t && d ? Math.round(d.x - t.right) : null,
        overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    await page.screenshot({ path: `/tmp/hero-${vp.name}.png` });
    await ctx.close();
  }

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
