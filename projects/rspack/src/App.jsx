import { useState } from "preact/hooks";
import reactLogo from "./assets/preact.svg";
import "./App.css";
import CompatCounter from "./CompatCounter.jsx";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<div>
				<a href="https://reactjs.org" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Rspack + React</h1>
			<div className="card">
				<button id="increment" onClick={() => setCount((count) => count + 1)}>
					<span id="bundler">Rspack</span> count is{" "}
					<span id="count">{count}</span>
				</button>
				<CompatCounter />
				<p>
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Rspack and React logos to learn more
			</p>
		</div>
	);
}

export default App;
