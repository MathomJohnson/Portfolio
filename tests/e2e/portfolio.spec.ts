import { expect, test, type Page } from "@playwright/test";

const SECTION_ORDER = ["hero", "about", "skills", "experience", "contact"];

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
      page.getByText("CS + Data Science @ UW–Madison", { exact: false }).first(),
    ).toBeAttached();

    await expect(
      page.getByRole("link", { name: "Resume" }).first(),
    ).toHaveAttribute("href", "/resume.pdf");

    const heroSocials = page
      .getByRole("list", { name: "Social links" })
      .first()
      .getByRole("link");
    await expect(heroSocials).toHaveCount(3);
  });

  test("every experience entry is reachable in the rendered layout", async ({
    page,
  }) => {
    await page.goto("/");

    const organizations = [
      "Plexus",
      "U.S. Bank",
      "Praxora Education, Inc.",
      "Ehrlich Lab, UW–Madison",
      "PersonaXR (UW Tech Exploration Lab)",
    ];

    for (const organization of organizations) {
      await expect(
        page.getByRole("heading", { name: organization }),
      ).toHaveCount(1);
    }
  });

  test("contact offers a mailto action and mirrors the hero social row", async ({
    page,
  }) => {
    await page.goto("/");

    const mailto = page.locator('#contact a[href^="mailto:"]').first();
    await expect(mailto).toBeVisible();

    const footerSocials = page
      .locator("#contact")
      .getByRole("list", { name: "Social links" })
      .getByRole("link");
    await expect(footerSocials).toHaveCount(3);
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

    await expect(page.locator("#experience ol > li")).toHaveCount(5);
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
  });

  test("spotlight field writes cursor coordinates", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop project only");

    await page.goto("/");

    const field = page.locator(".spotlight-field");
    await field.scrollIntoViewIfNeeded();

    const box = await field.boundingBox();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(200);

    const custom = await field.evaluate((element) => ({
      x: element.style.getPropertyValue("--x"),
      opacity: element.style.getPropertyValue("--spotlight-opacity"),
    }));

    expect(custom.x).not.toBe("");
    expect(custom.opacity).toBe("1");
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
