import aedes from "aedes";
import ClientManager from "./ClientManager";
import { Logger } from "../types";

const MQTTHandler = (
	broker: aedes.Aedes,
	clientManager: ClientManager,
	logger: Logger
) => {
	broker.on("client", client => {
		logger.log(`new client: ${client.id}`);
		clientManager.registClient(client);
		client.publish({
			cmd: "publish",
			topic: "device/status",
			payload: "device is registered",
		});
	});

	broker.on("clientDisconnect", client => {
		logger.log(`disconnect client: ${client.id}`);
		clientManager.removeClient(client.id);
	});

	broker.on("publish", (packet, client) => {
		logger.log(`recieved message. topic:${packet.topic}`);
		if (client) {
			if ((packet.topic as string).slice(-7) === "/result") {
				logger.log(
					`${client.id}: ${(packet.payload as Buffer).toString(
						"utf8"
					)}`
				);
			} else {
				logger.log(
					`client message: ${
						client.id
					} : ${(packet.payload as Buffer).toString("utf8")}`
				);
				logger.log({ packet });
				console.log("");
			}
		} else {
			logger.log(`client message: none :`);
			logger.log(
				`parsed string: ${(packet.payload as Buffer).toString("utf8")}`
			);
			logger.log({ packet });
			console.log("");
		}
	});

	broker.on("clientError", (client, err) => {
		logger.error(`client error: ${client.id} : ${err}\n`);
	});
};

export default MQTTHandler;
