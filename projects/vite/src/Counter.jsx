import { useState } from "preact/hooks";

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<div id="counter-app">
			<p>
				<span id="bundler">Vite</span> Count: <span id="count">{count}</span>
			</p>
			<button id="increment" onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}
