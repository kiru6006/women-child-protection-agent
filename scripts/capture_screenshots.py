import os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4173/women-child-protection-agent"
OUT_DIR = "docs/screenshots"
os.makedirs(OUT_DIR, exist_ok=True)

SCREENS = [
    ("01-home-governance-hub.png", "/"),
    ("02-minister-command-centre.png", "/dashboards?role=MINISTER"),
    ("03-secretary-dashboard.png", "/dashboards?role=SECRETARY"),
    ("04-women-protection.png", "/women?tab=overview"),
    ("05-child-protection.png", "/child?tab=overview"),
    ("06-matter-360-overview.png", "/matter-360?id=MTR-2026-W-001"),
    ("07-police-coordination.png", "/matter-360?id=MTR-2026-W-002&tab=police"),
    ("08-litigation-coordination.png", "/matter-360?id=MTR-2026-W-002&tab=litigation"),
    ("09-court-order-compliance.png", "/matter-360?id=MTR-2026-W-003&tab=litigation"),
    ("10-department-convergence.png", "/convergence"),
    ("11-raci-ownership.png", "/ownership"),
    ("12-dependency-360.png", "/dependencies"),
    ("13-financial-intelligence.png", "/finance"),
    ("14-fund-allocation.png", "/dashboards?role=FINANCE"),
    ("15-ngo-community.png", "/ngo-community"),
    ("16-ai-intelligence.png", "/ai-intelligence?tab=centre"),
    ("17-alerts-escalation.png", "/alerts"),
    ("18-district-dashboard.png", "/dashboards?role=COLLECTOR"),
    ("19-outcome-verification.png", "/outcomes"),
    ("20-governance-excellence.png", "/excellence"),
    ("21-help-knowledge-centre.png", "/help"),
]


def main():
    errors = []
    overflows = []
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
        except Exception:
            browser = p.chromium.launch(channel="chrome", headless=True)

        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.on("pageerror", lambda err: errors.append(str(err)))

        for fname, route in SCREENS:
            page.goto(f"{BASE}{route}", wait_until="networkidle")
            page.wait_for_timeout(200)
            page.screenshot(path=os.path.join(OUT_DIR, fname), full_page=True)

        # Responsive overflow checks on Home & Matter 360
        for vw, vh in [(1280, 800), (768, 1024), (375, 812)]:
            page.set_viewport_size({"width": vw, "height": vh})
            for route in ["/", "/matter-360", "/my-work", "/help"]:
                page.goto(f"{BASE}{route}", wait_until="networkidle")
                sw = page.evaluate("document.documentElement.scrollWidth")
                iw = page.evaluate("window.innerWidth")
                if sw > iw:
                    overflows.append(f"{route}@{vw}x{vh}: scrollWidth={sw} > innerWidth={iw}")

        browser.close()

    print(f"CAPTURED={len(SCREENS)} ERRORS={len(errors)} OVERFLOWS={len(overflows)}")
    for e in errors:
        print("PAGEERROR:", e)
    for o in overflows:
        print("OVERFLOW:", o)


if __name__ == "__main__":
    main()
