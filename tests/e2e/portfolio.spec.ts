import { expect, test, type Page } from "@playwright/test";

const SECTION_ORDER = ["hero", "about", "skills", "experience", "contact"];

/**
 * Horizontal component of the drift AuraFollow applies to its outermost layer.
 * The transform sits on the layer's parent: the parent carries the cursor
 * drift, the layer itself carries the CSS shape animation.
 */
function auraDriftX(page: Page) {
  return page.evaluate(() => {
    const layer = document.querySelector("#hero .aura-layer--glow");
    if (!layer?.parentElement) return null;

    const { transform } = getComputedStyle(layer.parentElement);
    return transform === "none" ? 0 : new DOMMatrix(transform).m41;
  });
}

/**
 * Skill lines that TERMINAL_PRINT has already printed. Unprinted lines stay in
 * the DOM with `visibility: hidden` so the column reserves its height, which is
 * exactly what Playwright's visibility check filters out.
 */
function printedLines(page: Page, filename: string) {
  return page
    .locator(`[data-terminal-column="${filename}"] li:visible`)
    .count();
}

/**
 * Horizontal extent of everything actually drawn in the hero, plus the centre of
 * the scroll cue to compare it against.
 *
 * Measured from text ranges rather than element boxes. A wrapped heading's box
 * is as wide as the space it was offered; its client rects are only as wide as
 * the glyphs painted. Asserting on boxes is what let a visibly off-centre hero
 * pass previously.
 *
 * Runs in the browser via page.evaluate, so it has to be self-contained.
 */
function measureHeroInk() {
  const scope = document.querySelector("#hero .section-inner")!;
  let left = Infinity;
  let right = -Infinity;

  const extend = (rect: DOMRect) => {
    if (rect.width <= 0 || rect.height <= 0) return;
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.right);
  };

  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent?.trim()) continue;
    if (node.parentElement?.closest(".sr-only")) continue;

    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) extend(rect);
  }

  // The portrait and the bordered links paint past their text.
  for (const element of Array.from(scope.querySelectorAll("img, a"))) {
    extend(element.getBoundingClientRect());
  }

  const cue = document
    .querySelector("#hero > [aria-hidden='true']")!
    .querySelector(".mono-label")!
    .getBoundingClientRect();

  return {
    left,
    right,
    cueCentre: (cue.left + cue.right) / 2,
    viewportWidth: window.innerWidth,
  };
}

/** Fails the test if the page logs an error or throws while loading. */
function collectPageErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

test.describe("content and structure", () => {
  test("renders the five sections in order with no console errors", async ({
    page,
  }) => {
    const errors = collectPageErrors(page);

    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    const ids = await page
      .locator("main > section, main > div > section")
      .evaluateAll((sections) => sections.map((section) => section.id));

    expect(ids).toEqual(SECTION_ORDER);
    expect(errors).toEqual([]);
  });

  test("hero exposes the name, subtitle, resume and social links", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toHaveText(/\S/);
    await expect(
      page
        .getByText("Computer Science & Data Science @ UW—Madison", {
          exact: false,
        })
        .first(),
    ).toBeAttached();

    const resume = page.getByRole("link", { name: "Resume" }).first();
    await expect(resume).toHaveAttribute("href", "/mathom_resume.pdf");
    await expect(resume).toHaveAttribute("target", "_blank");

    const heroSocials = page
      .getByRole("list", { name: "Social links" })
      .first()
      .getByRole("link");
    await expect(heroSocials).toHaveCount(3);
    await expect(
      page.getByRole("link", { name: "YouTube channel" }),
    ).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UCPgHcSZgy6dNjFx23H2LWQg",
    );
    await expect(page.locator("#hero a[href^='mailto:']")).toHaveCount(0);
  });

  test("the hero photo and copy are centred as one group", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "two-column layout only");

    await page.goto("/");

    // Checked at several widths because the failure mode is width-dependent:
    // the copy column only over-reports its width while there is leftover space
    // for it to be handed.
    for (const width of [768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(150);

      const ink = await page.evaluate(measureHeroInk);

      const inkCentre = (ink.left + ink.right) / 2;
      expect(
        Math.abs(inkCentre - ink.viewportWidth / 2),
        `hero ink should be centred at ${width}px`,
      ).toBeLessThan(8);

      // The scroll cue is the reference the mismatch is visible against, so it
      // is asserted directly rather than assumed to be at the centre.
      expect(
        Math.abs(inkCentre - ink.cueCentre),
        `hero ink should line up with the scroll cue at ${width}px`,
      ).toBeLessThan(8);
    }
  });

  test("the subtitle decode is still resolving well past two seconds", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "reduced-motion",
      "the scramble does not run under reduced motion",
    );

    const start = Date.now();
    await page.goto("/");

    const subtitle = page.locator('#hero p span[aria-hidden="true"]');
    const resolved = "Computer Science & Data Science @ UW—Madison";

    // The 2.6s mark discriminates the intended pace from the old one: at the
    // previous fixed 0.035s per character the line had already settled by ~2.1s.
    await page.waitForTimeout(Math.max(0, 2600 - (Date.now() - start)));
    expect(await subtitle.textContent()).not.toBe(resolved);

    await expect(subtitle).toHaveText(resolved, { timeout: 6000 });
  });

  test("every experience entry is reachable in the rendered layout", async ({
    page,
  }) => {
    await page.goto("/");

    const organizations = [
      "Plexus",
      "U.S. Bank",
      "Praxora Education, Inc.",
      "Morgridge Institute for Research",
      "Ehrlich Lab, UW–Madison",
      "WEC Energy Group",
    ];

    for (const organization of organizations) {
      await expect(
        page.getByRole("heading", { name: organization }),
      ).toHaveCount(1);
    }

    await expect(
      page.locator("#experience img[alt$='logo']").filter({ visible: true }),
    ).toHaveCount(6);
  });

  test("contact offers a mailto action, LinkedIn, and a back-to-top control", async ({
    page,
  }) => {
    await page.goto("/");

    const mailto = page.locator('#contact a[href^="mailto:"]').first();
    await expect(mailto).toBeVisible();

    await expect(
      page.locator("#contact").getByRole("list", { name: "Social links" }),
    ).toHaveCount(0);

    const backToTop = page.getByRole("link", { name: "Back to top" });
    await expect(backToTop).toBeVisible();
    await expect(backToTop).toHaveAttribute("href", "#hero");
  });

  test("sections are at least a full viewport tall", async ({ page }) => {
    await page.goto("/");

    const viewportHeight = page.viewportSize()!.height;

    for (const id of ["hero", "about", "skills", "contact"]) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(viewportHeight - 1);
    }
  });

  test("images and the page have no horizontal overflow", async ({ page }) => {
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("scroll reveals resolve", () => {
  /**
   * Regression guard. SIGNAL_REVEAL and WIPE_MASK mask their content with
   * clip-path, and a clipped element reports an intersectionRatio of 0 even when
   * it is on screen. Observing the masked element itself deadlocks: it can never
   * be seen, so it is never revealed, and the content stays invisible forever.
   */
  test("scroll-revealed headings and images become visible", async ({
    page,
  }) => {
    await page.goto("/");

    for (const id of ["about", "skills", "contact"]) {
      const heading = page.locator(`#${id} h2`).first();
      await heading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      await expect(heading).toBeVisible();

      const revealed = await heading.evaluate((element) => {
        const inner = element.firstElementChild as HTMLElement | null;
        const target = inner ?? element;
        const clip = getComputedStyle(target).clipPath;
        return {
          clip,
          opacity: getComputedStyle(target).opacity,
          width: target.getBoundingClientRect().width,
        };
      });

      // A fully masked reveal keeps a 100% inset on one edge.
      expect(revealed.clip).not.toContain("100%");
      expect(revealed.opacity).toBe("1");
      expect(revealed.width).toBeGreaterThan(0);
    }
  });

  test("the about photo finishes its wipe", async ({ page }) => {
    await page.goto("/");
    await page.locator("#about img").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const wiped = await page
      .locator("#about img")
      .evaluate((image) => {
        const masked = image.closest("[style*='clip-path']") as HTMLElement | null;
        return masked ? getComputedStyle(masked).clipPath : "none";
      });

    // The hidden state collapses the polygon to zero width on the left edge.
    expect(wiped).not.toBe("polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)");
  });
});

test.describe("keyboard access", () => {
  test("interactive elements are reachable and show a visible focus ring", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    const focusedTag = await page.evaluate(
      () => document.activeElement?.tagName,
    );
    expect(focusedTag).toBe("A");

    const outline = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement;
      const styles = getComputedStyle(element);
      return { width: styles.outlineWidth, color: styles.outlineColor };
    });

    expect(outline.width).not.toBe("0px");
    // --accent-signal, #E8A33D
    expect(outline.color).toBe("rgb(232, 163, 61)");
  });

  test("all links have an accessible name", async ({ page }) => {
    await page.goto("/");

    const unnamed = await page.locator("a").evaluateAll((links) =>
      links
        .filter((link) => {
          const label =
            link.getAttribute("aria-label") ?? link.textContent?.trim() ?? "";
          return label.length === 0;
        })
        .map((link) => link.outerHTML),
    );

    expect(unnamed).toEqual([]);
  });
});

test.describe("experience layout selection", () => {
  test("exactly one experience layout is displayed", async ({ page }) => {
    await page.goto("/");

    const desktopVisible = await page
      .locator(".experience-desktop")
      .isVisible();
    const mobileVisible = await page.locator(".experience-mobile").isVisible();

    expect(desktopVisible).not.toBe(mobileVisible);
  });
});

test.describe("mobile", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "chromium only");

  test("uses the vertical list and does not pin", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");

    await page.goto("/");

    await expect(page.locator(".experience-mobile")).toBeVisible();
    await expect(page.locator(".experience-desktop")).toBeHidden();

    const pinned = await page.locator("#experience .pin-spacer").count();
    expect(pinned).toBe(0);

    await expect(page.locator("#experience ol > li")).toHaveCount(6);
  });

  test("tags are visible without hover", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");

    await page.goto("/");

    const firstTag = page
      .getByRole("list", { name: "Plexus tech stack" })
      .getByRole("listitem")
      .first();

    await expect(firstTag).toBeVisible();
    await expect(firstTag).toHaveCSS("opacity", "1");
  });
});

test.describe("reduced motion", () => {
  test("falls back to the vertical experience layout and no cursor trace", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "reduced-motion project only",
    );

    await page.goto("/");

    await expect(page.locator(".experience-mobile")).toBeVisible();
    await expect(page.locator(".experience-desktop")).toBeHidden();
    expect(await page.locator("#experience .pin-spacer").count()).toBe(0);

    // Content still resolves to its end state rather than staying hidden.
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");

    await page.mouse.move(500, 400);
    await page.waitForTimeout(200);
    expect(await page.locator("div.fixed.inset-0.z-50 > span").count()).toBe(0);
  });

  test("the hero aura renders but does not track the cursor", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "reduced-motion project only",
    );

    await page.goto("/");

    // Present, unlike the pointer-only affordances: the aura is part of the
    // hero's composition, so reduced motion stills it rather than removing it.
    await expect(page.locator("#hero .aura-layer--glow")).toHaveCount(1);

    await page.mouse.move(1380, 400);
    await page.waitForTimeout(600);

    expect(await auraDriftX(page)).toBe(0);
  });

  test("scroll position responds normally", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "reduced-motion project only",
    );

    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(200);

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  });
});

test.describe("desktop signature interactions", () => {
  test("experience pins and scrubs cards horizontally", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop project only");

    await page.goto("/");

    const track = page.locator(".experience-desktop .flex.gap-6").first();
    await expect(track).toBeVisible();

    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const before = await track.evaluate(
      (element) => getComputedStyle(element).transform,
    );

    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(800);

    const after = await track.evaluate(
      (element) => getComputedStyle(element).transform,
    );

    expect(after).not.toBe(before);
    expect(await page.locator("#experience .pin-spacer").count()).toBe(1);
  });

  test("trace nodes light up as the scrub advances", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop project only");

    await page.goto("/");
    await page.locator("#experience").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(800);

    const activeNodes = await page
      .locator('[data-trace-node][data-active="true"]')
      .count();

    expect(activeNodes).toBeGreaterThan(1);
    expect(await page.locator("[data-trace-node]").count()).toBe(6);
    expect(
      await page.locator(".experience-desktop .w-24").count(),
    ).toBe(0);
  });

  test("the skills columns print one after another, left to right", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "reduced-motion",
      "reduced motion resolves every column at once",
    );

    await page.goto("/");
    await page.locator("#skills").scrollIntoViewIfNeeded();

    // The last column starting is the ordering assertion: by the time it prints
    // anything, the first column must already be finished. Polling rather than
    // sampling a fixed delay keeps this independent of when the section is
    // scrolled into view.
    await expect
      .poll(() => printedLines(page, "tools"), { timeout: 20_000 })
      .toBeGreaterThan(0);

    expect(await printedLines(page, "languages")).toBe(9);

    for (const filename of [
      "languages",
      "frameworks",
      "databases",
      "infra",
      "tools",
    ]) {
      await expect(
        page.locator(`[data-terminal-column="${filename}"] p`),
      ).toHaveText(`$ cat ${filename}`, { timeout: 20_000 });
    }

    await expect
      .poll(() => printedLines(page, "tools"), { timeout: 15_000 })
      .toBe(5);
  });

  test("reduced motion shows the finished dump without the print", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "reduced-motion",
      "reduced-motion project only",
    );

    await page.goto("/");
    await page.locator("#skills").scrollIntoViewIfNeeded();

    // Well inside the animated timeline, which takes several seconds to reach
    // the last column.
    await page.waitForTimeout(400);

    expect(await printedLines(page, "languages")).toBe(9);
    expect(await printedLines(page, "frameworks")).toBe(9);
    expect(await printedLines(page, "databases")).toBe(5);
    expect(await printedLines(page, "infra")).toBe(7);
    expect(await printedLines(page, "tools")).toBe(5);
  });

  test("the hero aura leans toward the cursor and the portrait stays put", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop project only");

    await page.goto("/");
    await expect(page.locator("#hero .aura-layer--glow")).toHaveCount(1);

    const photo = page.locator("#hero img");
    const photoAtRest = await photo.boundingBox();

    await page.mouse.move(60, 400);
    await page.waitForTimeout(900);
    const pulledLeft = await auraDriftX(page);

    await page.mouse.move(1380, 400);
    await page.waitForTimeout(900);
    const pulledRight = await auraDriftX(page);

    expect(pulledLeft).toBeLessThan(0);
    expect(pulledRight).toBeGreaterThan(0);

    // Only the light moves. The portrait is not magnetic any more.
    const photoAfter = await photo.boundingBox();
    expect(photoAfter!.x).toBeCloseTo(photoAtRest!.x, 0);
    expect(photoAfter!.y).toBeCloseTo(photoAtRest!.y, 0);
  });

  test("cursor trace mounts on pointer devices", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop project only");

    await page.goto("/");
    await page.mouse.move(400, 400);
    await page.waitForTimeout(200);

    const dots = await page.locator("div.fixed.inset-0.z-50 > span").count();
    expect(dots).toBe(2);
  });
});
