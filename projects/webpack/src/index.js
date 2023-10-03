import { render } from "preact";
import { useState } from "preact/hooks";
import CompatCounter from "./compat.js";

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div id="counter-app">
			<p>
				<span id="bundler">Webpack</span> Count: <span id="count">{count}</span>
			</p>
			<button id="increment" onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}

function App() {
	return (
		<>
			<Counter />
			<CompatCounter />
		</>
	);
}

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);
render(<App />, rootElement);
