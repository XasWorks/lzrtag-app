import React from 'react';
import logo from './logo.svg';
import './App.css';

import ActiveConnection from './GameConnection.js'

import GenericBar from './GenericBar.js'

import {SmallPlayerWidget, PlayerList} from './PlayerWidgets.js'

import GameControl from './GameControl.js'

var gameConn = ActiveConnection;

function PlayerTableRow(player) {
	let className = [];
	if(!player.connected)
		className.push("GreyedOut");

	return <tr key={player.deviceID} className={className.join(" ")}>
		<td> {player.deviceID} </td>
		<td> {player.name} </td>
		<td> {player.team} </td>
		<td> {player.life} </td>
		<td> {player.brightness} </td>

		<td> {player.ping} </td>
		<td> {player.battery} </td>
	</tr>
}

function compPlayers(a, b) {
	const partPlayers = gameConn.game.participatingPlayers;

	if(a.deviceID === "Test")
		return 1;

	if(a.connected !== b.connected)
		return a.connected ? -1 : 1;
	if(partPlayers.includes(a) !== partPlayers.includes(b))
		return partPlayers.includes(a) ? -1 : 1;
	if(a.team !== b.team)
		return (a.team < b.team) ? -1 : 1;
	else
		return (a.deviceID > b.deviceID);
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			players: [],
			targetPlayer: gameConn.get_player("BC.DD.C2.D0.63.F8"),
		}
	}

	componentDidMount = () => {
		gameConn.hook_in(this);
	}

	onPlayerUpdate = () => {
		this.setState({players: gameConn.players, targetPlayer: gameConn.get_player("BC.DD.C2.D0.63.F8")});
	}

	render() {
		let playerList = [].concat(Object.values(this.state.players));
		playerList.sort(compPlayers);

		let playerListItems = playerList.map((player) =>
			PlayerTableRow(player)
		);

		return (
			<div className="App">

				<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />

				<GameControl />

				<PlayerList players={playerList} listName={"Connected Players"}/>
				<table className="PlayerTable">
					<thead>
						<tr>
							<th> Device ID </th>
							<th> Name </th>
							<th> Team </th>
							<th> Life </th>
							<th> Brightness </th>
							<th> Ping </th>
							<th> VBat </th>
						</tr>
					</thead>
					<tbody>
						{playerListItems}
					</tbody>
				</table>
			</header>
			</div>
		);
	}
}

export default App;
