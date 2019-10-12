
import React from 'react';
import './GenericBar.css';

function GenericBar(props) {
	let barStyles = [];

	for(let x=0; x < 20; x++) {
		barStyles.push(
			<div className="GenericBarStyle" style={{transform: `translate(${x*2.3 - 1.5}vmin, 1vmin) rotate(80deg)`}} />
		);
	}

	return <div className="GenericBarContainer" style={props["style"]}>
		<div className="GenericBar">
			<div className="GenericBarFill" style={{"background-color": props["fillColor"], width: `${props["fillPercent"]}%`}}>
			</div>
			{barStyles}
		</div>
		<div>
			{props["txtValue"]}
		</div>
	</div>;
}


export default GenericBar;
