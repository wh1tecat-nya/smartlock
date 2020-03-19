import { Client } from "aedes";

class ClientManager {
	clients: {
		[clientId: string]: {
			client: Client;
			status: "OPEN" | "LOCK";
		};
	};

	constructor() {
		this.clients = {};
	}

	registClient = (client: Client) => {
		this.clients[client.id] = { client: client, status: "LOCK" };
	};

	removeClient = (clientId: string) => {
		delete this.clients[clientId];
	};

	getClient = (clientId: string) => {
		return this.clients[clientId].client;
	};

	getStatus = (clientId: string) => {
		return this.clients[clientId].status;
	};

	setStatus = (clientId: string, status: "OPEN" | "LOCK") => {
		this.clients[clientId].status = status;
	};
}

export default ClientManager;
