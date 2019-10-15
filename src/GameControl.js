

import React from 'react'
import LZRFrame from './LZRFrame.js'

import ActiveConnection from './GameConnection.js'


class GameControl extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gamePhase: "Idle",
			gameName: "None",

			gameTimer: 0,
		}
	}

	componentDidMount = () => {
		ActiveConnection.hook_in(this);
	}
	componentWillUnmount = () => {
		ActiveConnection.hook_out(this);
	}

	onGameUpdate = () => {
		this.setState({
			gamePhase: ActiveConnection.game.currentPhase,
			gameName:  ActiveConnection.game.current,
			gameTimer: ActiveConnection.game.timer,
		})
	}

	render = () => {

		return <LZRFrame className="GameControlContainer">
			<p className="GameName">
				Game: {this.state.gameName}
			</p>

			<p className="PhaseTitle">
				Phase
			</p>
			<p className="PhaseName">
				{this.state.gamePhase}
			</p>

			<p className="GameTimer">
				{this.state.gameTimer}
			</p>
		</LZRFrame>
	}
}

export default GameControl;
