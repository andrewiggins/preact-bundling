import { render } from "preact";
import { useState } from "preact/hooks";
import CompatCounter from "./compat.jsx";

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div id="counter-app">
			<p>
				<span id="bundler">esbuild</span> Count: <span id="count">{count}</span>
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

render(<App />, document.getElementById("root"));
