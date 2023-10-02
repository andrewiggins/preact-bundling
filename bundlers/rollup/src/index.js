import { render } from "preact";
import { useState } from "preact/hooks";

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div id="counter-app">
			<p>
				Count: <span id="count">{count}</span>
			</p>
			<button id="increment" onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}

render(<Counter />, document.getElementById("root"));
