const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer");

const root = process.cwd();
const output = path.join(root, "facebook-cv-cover-hq.png");
const scale = 2;

function imageData(filename) {
  const file = path.join(root, filename);
  const base64 = fs.readFileSync(file).toString("base64");
  return `data:image/png;base64,${base64}`;
}

const images = {
  modern: imageData("modern-cv-sample.png"),
  creative: imageData("creative-cv-sample.png"),
  minimal: imageData("minimal-cv-sample.png"),
};

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        background: #eef3f8;
      }

      .cover {
        position: relative;
        width: 1640px;
        height: 624px;
        overflow: hidden;
        background:
          radial-gradient(circle at 12% 10%, rgba(37, 99, 235, 0.16), transparent 26%),
          linear-gradient(135deg, #f8fbff 0%, #eef4f9 52%, #fdfaf2 100%);
      }

      .cover::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(118deg, rgba(13, 35, 67, 0.06) 0 32%, transparent 32% 100%),
          linear-gradient(165deg, transparent 0 54%, rgba(5, 150, 105, 0.13) 54% 100%);
      }

      .text {
        position: absolute;
        left: 108px;
        top: 116px;
        z-index: 4;
        width: 560px;
        color: #162033;
      }

      .eyebrow {
        margin: 0 0 22px;
        color: #2563eb;
        font-size: 26px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        color: #111827;
        font-size: 78px;
        font-weight: 900;
        line-height: 0.98;
        letter-spacing: 0;
      }

      .subtitle {
        margin: 28px 0 0;
        max-width: 520px;
        color: #45556a;
        font-size: 30px;
        font-weight: 600;
        line-height: 1.28;
      }

      .badge-row {
        display: flex;
        gap: 14px;
        margin-top: 36px;
      }

      .badge {
        border: 1px solid rgba(22, 32, 51, 0.13);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.74);
        color: #1f2a3d;
        font-size: 22px;
        font-weight: 800;
        padding: 12px 20px;
        box-shadow: 0 16px 45px rgba(30, 41, 59, 0.08);
      }

      .templates {
        position: absolute;
        right: 50px;
        top: 26px;
        z-index: 3;
        width: 900px;
        height: 680px;
      }

      .page {
        position: absolute;
        width: 318px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 34px 70px rgba(15, 23, 42, 0.24);
      }

      .page img {
        display: block;
        width: 100%;
        height: auto;
      }

      .page.modern {
        left: 40px;
        top: 78px;
        transform: rotate(-9deg);
      }

      .page.creative {
        left: 294px;
        top: 22px;
        width: 356px;
        transform: rotate(2.5deg);
        box-shadow: 0 42px 90px rgba(15, 23, 42, 0.29);
        z-index: 2;
      }

      .page.minimal {
        left: 608px;
        top: 92px;
        transform: rotate(9deg);
      }

      .label {
        position: absolute;
        right: 90px;
        bottom: 34px;
        z-index: 5;
        border-radius: 999px;
        background: #111827;
        color: #fff;
        font-size: 24px;
        font-weight: 900;
        letter-spacing: 0.03em;
        padding: 18px 28px;
        box-shadow: 0 22px 50px rgba(17, 24, 39, 0.24);
      }
    </style>
  </head>
  <body>
    <section class="cover">
      <div class="text">
        <p class="eyebrow">CV Online</p>
        <h1>Stand Out With a Better CV</h1>
        <p class="subtitle">Modern, Creative, and Minimal templates for a polished professional profile.</p>
        <div class="badge-row">
          <span class="badge">Modern</span>
          <span class="badge">Creative</span>
          <span class="badge">Minimal</span>
        </div>
      </div>
      <div class="templates">
        <div class="page modern"><img src="${images.modern}" alt="Modern CV template" /></div>
        <div class="page creative"><img src="${images.creative}" alt="Creative CV template" /></div>
        <div class="page minimal"><img src="${images.minimal}" alt="Minimal CV template" /></div>
      </div>
      <div class="label">Ready-to-use CV templates</div>
    </section>
  </body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-crash-reporter", "--disable-crashpad"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1640, height: 624, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: output, clip: { x: 0, y: 0, width: 1640, height: 624 } });
  await browser.close();
})();
