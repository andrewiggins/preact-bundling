import assert from "node:assert";
import { spawn } from "node:child_process";
import path from "node:path";
import { describe, it, before, beforeEach, afterEach, after } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";
import stripAnsi from "strip-ansi";

const DEBUG = process.env.DEBUG === "true" || process.env.DEBUG === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = (...args) => path.join(__dirname, "..", ...args);
const urlRegex = /http:\/\/localhost:\d+\/?/;

describe("bundling projects", () => {
	/** @type {import('puppeteer').Browser} */
	let browser;

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {import('node:child_process').ChildProcessWithoutNullStreams} */
	let server;

	/** @type {Promise<void>} */
	let serverExit;

	/**
	 * @param {import('child_process').ChildProcess} childProcess
	 * @returns {Promise<void>}
	 */
	async function waitForExit(childProcess) {
		return new Promise((resolve, reject) => {
			childProcess.once("exit", (code, signal) => {
				if (code === 0 || signal == "SIGINT") {
					resolve();
				} else {
					reject(new Error("Exit with error code: " + code));
				}
			});

			childProcess.once("error", (err) => {
				reject(err);
			});
		});
	}

	/**
	 * @param {string} projectPath The directory of the project to run
	 * @returns {Promise<URL>}
	 */
	async function startServer(projectPath, timeoutMs = 10e3) {
		return new Promise((resolve, reject) => {
			// Can't do `npm run serve` because it won't exit when we send it the
			// SIGINT signal
			server = spawn(
				process.execPath,
				[p("./node_modules/sirv-cli/bin.js"), p(projectPath, "dist"), "--dev"],
				{ cwd: p(projectPath) },
			);

			serverExit = waitForExit(server);

			let timeout;
			if (timeoutMs > 0) {
				timeout = setTimeout(() => {
					reject(new Error("Timed out waiting for server to get set up"));
				}, timeoutMs);
			}

			function onData(data) {
				data = data.toString("utf8");

				if (DEBUG) {
					process.stdout.write(stripAnsi(data));
				}

				let match = data.match(urlRegex);
				if (match) {
					cleanup();
					resolve(new URL(match[0]));
				}
			}

			function onExit(code) {
				cleanup();
				reject(
					new Error("Server unexpectedly exited with error code: " + code),
				);
			}

			function cleanup() {
				server.stdout.off("data", onData);
				server.off("exit", onExit);
				clearTimeout(timeout);
			}

			server.stdout.on("data", onData);
			server.once("exit", onExit);
		});
	}

	/** @type {(framework: string, url: string) => Promise<void>} */
	async function runTest(framework, url = "http://localhost:8080") {
		async function _runTestImpl(compat = false) {
			const prefix = compat ? "compat-" : "";
			const bundlerId = `#${prefix}bundler`;
			const countId = `#${prefix}count`;
			const incrementId = `#${prefix}increment`;
			const expectedFramework = `${prefix}${framework}`;

			await page.waitForSelector(bundlerId);
			let actualFramework = await page.$eval(bundlerId, (el) => el.textContent);
			assert.equal(actualFramework, expectedFramework);

			let count = await page.$eval(countId, (el) => el.textContent);
			assert.equal(count, "0");

			await page.click(incrementId);

			count = await page.$eval(countId, (el) => el.textContent);
			assert.equal(count, "1");
		}

		await page.goto(url);
		await _runTestImpl();
		await _runTestImpl(true);
	}

	before(async () => {
		if (!DEBUG) {
			browser = await puppeteer.launch({ headless: "new" });
		} else {
			browser = await puppeteer.launch({
				headless: false,
				devtools: true,
			});
		}
	});

	beforeEach(async () => {
		page = await browser.newPage();
		page.setDefaultTimeout(10e3);
	});

	afterEach(async () => {
		await page?.close();

		if (server) {
			// Log a message if server takes a while to close
			let logMsg = () => console.log("Waiting for server to exit...");
			let t = setTimeout(logMsg, 5e3);

			try {
				server?.kill("SIGINT");
				await serverExit;
			} catch (error) {
				console.error("Error waiting for server to exit:", error);
			} finally {
				clearTimeout(t);
			}

			if (DEBUG) {
				console.log("Server:", {
					pid: server?.pid,
					spawnfile: server?.spawnfile,
					spawnargs: server?.spawnargs,
					connected: server?.connected,
					killed: server?.killed,
					exitCode: server?.exitCode,
					signalCode: server?.signalCode,
				});
			}
		}

		server = null;
		serverExit = null;
		page = null;
	});

	after(async () => {
		browser?.close();
		browser = null;
	});

	it("vite works", async () => {
		const url = await startServer("projects/vite");
		await runTest("Vite", url.href);
	});

	it("rollup works", async () => {
		const url = await startServer("projects/rollup");
		await runTest("Rollup", url.href);
	});

	it("parcel works", async () => {
		const url = await startServer("projects/parcel");
		await runTest("Parcel", url.href);
	});

	it("webpack works", async () => {
		const url = await startServer("projects/webpack");
		await runTest("Webpack", url.href);
	});

	it("rspack works", async () => {
		const url = await startServer("projects/rspack");
		await runTest("Rspack", url.href);
	});
});
