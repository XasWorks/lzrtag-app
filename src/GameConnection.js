
import React from 'react';
import mqtt from 'mqtt';

class GameConnection {
	constructor() {
		this.mClient = mqtt.connect('mqtt://192.168.6.27');

		this.mClient.on('connect', ()=> {
			this.mClient.subscribe('Lasertag/#');
		})

		this.mClient.on('message', this.parse_mqtt);

		console.log("Opening MQTT!");

		this.players = {};
		this.game = {
			current: "",
			available: [],
			currentPhase: "",
			availablePhases: [],
			timer: 0,
			participatingPlayers: [],
		};

		this.toUpdateComponents = [];
	}

	hook_in = (component) => {
		this.toUpdateComponents.push(component);
	}
	hook_out = (component) => {
		this.toUpdateComponents = this.toUpdateComponents
			.filter(comp => comp !== component)
	}

	init_player = () => {
		return {
			deviceID: "",
			life: 0,
			dead: false,
			team: 0,
			brightness: 0,
			gunNo: 0,
			name: "",
			ping: 0,
			battery: 0,
			connected: false,
		}
	}

	ensure_player = (playerID) => {
		if(!this.players[playerID]) {
			console.log(`Init new player ${playerID}!`);

			let newPlayers = Object.assign({}, this.players);
			newPlayers[playerID] = this.init_player();
			newPlayers[playerID].deviceID = playerID;
			newPlayers[playerID].name = playerID;

			this.players = newPlayers;

			this.toUpdateComponents.forEach(component => {
				if(component.onPlayerChange)
					component.onPlayerChange(playerID);
			});
		}
	}

	check_value_changed = (player, vString, data) => {
		let nValue = parseFloat(data.toString()) || 0;
		if(nValue === player[vString])
			return false;

		player[vString] = nValue;
		return true;
	}

	parse_player = (topicSplit, data) => {
		const playerID = topicSplit[2];
		this.ensure_player(playerID);

		let nPlayerData = Object.assign({}, this.players[playerID]);

		switch(topicSplit.slice(3).join("/")) {
			case "Connection":
				nPlayerData.connected = (data.toString() === "OK");
			break;
			case "CFG/Team":
				if(!this.check_value_changed(nPlayerData, "team", data))
					return;
			break;
			case "CFG/Brightness":
				if(!this.check_value_changed(nPlayerData, "brightness", data))
					return;
			break;
			case "CFG/Name":
				let nName = data.toString();
				if(nName === nPlayerData.name)
					return;
				nPlayerData.name = nName;
			break;
			case "CFG/Icon":
				nPlayerData.icon = data.toString();
			break;

			case "Stats/HP":
				if(!this.check_value_changed(nPlayerData, "life", data))
					return;
			break;
			case "CFG/Dead":
				nPlayerData.dead = data.toString() === "1";
			break;

			case "HW/Ping":
				nPlayerData.ping = data.readInt32LE(8);
				nPlayerData.battery = data.readInt32LE(0) / 1000.0;
			break;

			default: return;
		}

		let newPlayers = Object.assign({}, this.players);
		newPlayers[playerID] = nPlayerData;
		this.players = newPlayers;

		this.toUpdateComponents.forEach(component => {
			if(component.onPlayerUpdate)
				component.onPlayerUpdate();
		});
	}

	parse_game_data = (topicSplit, data) => {
		let nGameData = Object.assign({}, this.game);

		switch(topicSplit.slice(2).join("/")) {
			default: return;

			case "ParticipatingPlayers":
				nGameData.participatingPlayers = JSON.parse(data.toString());
			break;

			case "CurrentGame":
				nGameData.current = data.toString();
			break;

			case "Phase/Current":
				nGameData.currentPhase = data.toString();
			break;

			case "Timer":
				nGameData.timer = parseFloat(data.toString());
			break;
		}

		this.toUpdateComponents.forEach(component => {
			if(component.onGameUpdate)
				component.onGameUpdate();
		});

	}

	parse_mqtt = (topic, message) => {
		let tSplit = topic.split("/");
		if(tSplit[1] === "Players") {
			this.parse_player(tSplit, message);
		}
		if(tSplit[1] === "Game") {
			this.parse_game_data(tSplit, message);
		}
	}

	get_player = (pID) => {
		if(this.players[pID]) {
			return this.players[pID];
		}

		return this.init_player();
	}

	get_player_color = (player) => {
		return [	"grey", "red", "green", "orange",
		"blue", "purple", "cyan", "white"][player.team];
	}

	render() {
		return null;
	}
}

const ActiveConnection = new GameConnection();

export default ActiveConnection;
