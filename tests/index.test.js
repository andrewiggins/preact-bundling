import assert from "node:assert";
import path from "node:path";
import { describe, it, before, beforeEach, afterEach, after } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const DEBUG = process.env.DEBUG === "true" || process.env.DEBUG === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = (args) => path.join(__dirname, "..", args);

describe("bundling projects", () => {
	/** @type {import('puppeteer').Browser} */
	let browser;

	/** @type {import('puppeteer').Page} */
	let page;

	async function runTest(url) {
		await page.goto(url);
		await page.waitForSelector("#root");
		let count = await page.$eval("#count", (el) => el.textContent);
		assert.equal(count, "0");
		await page.click("#increment");
		count = await page.$eval("#count", (el) => el.textContent);
		assert.equal(count, "1");
	}

	before(async () => {
		if (!DEBUG) {
			browser = await puppeteer.launch({ headless: "new" });
		} else {
			browser = await puppeteer.launch({
				headless: false,
				slowMo: 100,
				devtools: true,
			});
		}
	});

	beforeEach(async () => {
		page = await browser.newPage();
	});

	afterEach(async () => page?.close());
	after(async () => browser?.close());

	it("vite works", async () => {
		const url = pathToFileURL(p("projects/vite/dist/index.html"));
		// TODO: Run vite server
		await runTest(url);
	});

	it("rollup works", async () => {
		const url = pathToFileURL(p("projects/rollup/dist/index.html"));
		await runTest(url);
	});

	it("parcel works", async () => {
		const url = pathToFileURL(p("projects/rollup/dist/index.html"));
		// TODO: Run parcel server
		await runTest(url);
	});
});
