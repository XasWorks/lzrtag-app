

import React from 'react'
import './LZRFrame.css'

import Color from 'color'

function LZRFrame(props) {
	let border_color = props.border_color || "grey";
	let shadow_color = Color(border_color).lighten(0.1);

	if(border_color === "grey" || props.noGlow) {
		shadow_color = "transparent";
		border_color = Color(border_color).darken(0.3);
	}

	let combinedStyle = Object.assign(props.style || {}, {
		"border-color": border_color,
		"--box-shadow-color": shadow_color,
	})


	return <div className={["LZRFrame", props.className].join(' ')} style={combinedStyle}>
		{props.children}
	</div>
}


export default LZRFrame;
