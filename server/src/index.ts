import net from "net";
import path from "path";
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import aedes from "aedes";

import ClientManager from "./mqtt/ClientManager";
import { mqttLogger, webLogger } from "./utils";

// import routes;
import createWebRouter from "./web";
import createMQTTRouter from "./mqtt";

// declare constant value;
const WEB_PORT = 9100;
const MQTT_PORT = 9101;

// init server application instance
const app = fastify();
const broker = aedes();
const clientManager = new ClientManager();

// set middleware
app.register(fastifyStatic, {
	root: path.resolve(__dirname, "web", "resources"),
});

// set server handlers
app.register(createWebRouter(clientManager, webLogger));
createMQTTRouter(broker, clientManager, mqttLogger);

// create server instance
const mqttServer = net.createServer(broker.handle);

// listen server
app.listen(WEB_PORT, () => {
	webLogger.info(`Server is listen: ${WEB_PORT}`);
});
mqttServer.listen(MQTT_PORT, () => {
	mqttLogger.info(`Server is listen: ${MQTT_PORT}`);
});
