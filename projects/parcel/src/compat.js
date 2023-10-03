import { useState } from "react";

export default function CompatCounter() {
	const [count, setCount] = useState(0);

	return (
		<div id="compat-counter-app">
			<p>
				<span id="compat-bundler">compat-Parcel</span> Count:{" "}
				<span id="compat-count">{count}</span>
			</p>
			<button id="compat-increment" onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	);
}
