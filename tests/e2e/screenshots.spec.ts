import { expect, test } from "@playwright/test";

/**
 * Visual capture pass. These are review aids rather than assertions: they render
 * each section at desktop and mobile so the layout can be checked by eye.
 */
test.describe("visual capture", () => {
  test("captures each section", async ({ page }, testInfo) => {
    const suffix = testInfo.project.name;
    await page.goto("/");
    await page.waitForTimeout(1500);

    for (const id of ["hero", "about", "skills", "experience", "contact"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await page.screenshot({
        path: `screenshots/${suffix}-${id}.png`,
      });
    }

    // Mid-scrub state of the pinned Experience section.
    if (suffix === "desktop") {
      await page.locator("#experience").scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await page.mouse.wheel(0, 1600);
      await page.waitForTimeout(900);
      await page.screenshot({ path: "screenshots/desktop-experience-scrub.png" });
    }

    expect(true).toBe(true);
  });
});
