
import React from 'react'
import './PlayerWidget.css'

import Color from 'color'

import GenericBar from './GenericBar.js'

import ActiveConnection from './GameConnection.js'

function SmallPlayerWidget(props) {

	let infoText = "";
	let overlayOn = false;

	if(!props.player.connected) {
		infoText = "DC"
		overlayOn = true;
	}

	let border_color = props.border_color || ActiveConnection.get_player_color(props.player);
	let shadow_color = Color(border_color).lighten(0.1);

	if(border_color === "grey" || !props.player.connected) {
		shadow_color = "transparent";
		border_color = Color(border_color).darken(0.3);
	}

	let img_source = props.player.icon;
	img_source = img_source || "https://icon-library.net/images/generic-person-icon/generic-person-icon-11.jpg";

	let combStyle = Object.assign(props.style || {},
			{	"border-color": border_color,
				"--box-shadow-color": shadow_color
			});

	return <div className="PlayerWidgetContainer" style={combStyle}>
		<div className="PlayerWidgetGrid">
			<div className="PlayerWidgetOverlay" style={{opacity: overlayOn ? 1 : 0}}>
			</div>

			<div className="PlayerWidgetImage">
				<img src={img_source}/>
			</div>
			<p className="PlayerWidgetName">
				{props.player.name}
			</p>

			<div className="PlayerWidgetData">
				{infoText}
			</div>

			<GenericBar fillColor="cyan" fillPercent={props.player.life} />
		</div>
		<div className="PlayerWidgetDead" style={{opacity: props.player.dead ? 0.7 : 0}} />
	</div>
}

function PlayerList(props) {

	let border_color = props.border_color || "grey";

	const playerHeight = 7.3 + 2 + 1;
	var   playerCount  = Math.min(props.players.length, props.maxPlayers || 3);

	var listHeight = playerHeight * playerCount;

	let combStyle = Object.assign(props.style || {},
			{	"border-color": border_color,
				"--box-shadow-color": "transparent",
			});

	let orderedPlayerList = [...props.players];
	orderedPlayerList.sort((pa, pb) => {
		return (pa.deviceID > pb.deviceID) ? -1 : 1;
	});

	let playerList = orderedPlayerList.map(player => {
		let playerPos = props.players.findIndex(p => p.deviceID === player.deviceID);
		return <li key={player.deviceID} style={{top: `${playerPos*playerHeight + 2}vmin`}}> <SmallPlayerWidget key={player.deviceID} player={player}/> </li>
	});

	return <div className="PlayerWidgetContainer" style={combStyle}>
		<p>
			{props.listName}
		</p>
		<hr />

		<ul style={{height: `${listHeight}vmin`}}>
			{playerList}
		</ul>

	</div>
}

export {SmallPlayerWidget, PlayerList};
