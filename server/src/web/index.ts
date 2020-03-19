import { WebRouter, Logger } from "../types";
import ClientManager from "../mqtt/ClientManager";

const createRouter = (
	clientManager: ClientManager,
	logger: Logger,
): WebRouter => (app, opts, done) => {
	app.get("/", async (req, res) => {
		res.sendFile("index.html");
	});

	app.get("/devices", async (req, res) => {
		const deviceIds = Object.keys(clientManager.clients);

		res.status(200).send(deviceIds);
	});

	app.post("/status", async (req, res) => {
		const reqBody = JSON.parse(req.body);
		const deviceId = reqBody?.deviceId ?? null;
		if (!deviceId) {
			res.status(400).send("required device id");
		}

		const client = clientManager.getClient(deviceId);
		if (!client) {
			res.status(400).send("device not found");
		}

		const status = clientManager.getStatus(deviceId);
		res.status(200).send(JSON.stringify({ status }));
	});

	app.get("/LED=:status", async (req, res) => {
		const deviceId = req.query.id ?? null;
		const ledStatus = req.params.status as string;
		if (!deviceId) {
			res.status(400).send("required device id");
		}

		const client = clientManager.getClient(deviceId);
		if (!client) {
			res.status(400).send("device not found");
		}

		if (!["0", "1"].includes(ledStatus)) {
			res.status(400).send("LED Status is not ");
		}
		const payload = Buffer.alloc(ledStatus.length);
		payload.write(ledStatus);

		client.publish({
			cmd: "publish" as const,
			topic: "led/status",
			payload: payload,
			dup: true,
			qos: 1,
			retain: false,
		});

		res.status(200).send(`send ${ledStatus} to ${deviceId}`);
	});

	app.get("/SERVO=:status", async (req, res) => {
		const deviceId = req.query.id ?? null;
		const servoStatus = parseInt(req.params.status);
		if (!deviceId) {
			res.status(400).send("required device id");
		}

		const client = clientManager.getClient(deviceId);
		if (!client) {
			res.status(400).send("device not found");
		}

		client.publish({
			cmd: "publish" as const,
			topic: "servo/status",
			payload: servoStatus.toString(),
			dup: true,
			qos: 1,
			retain: false,
		});

		res.status(200).send(`send ${servoStatus} to ${deviceId}`);
	});

	app.post("/OPEN", async (req, res) => {
		const reqBody = JSON.parse(req.body);
		const deviceId = reqBody?.deviceId ?? null;
		if (!deviceId) {
			res.status(400).send("required device id");
		}

		const client = clientManager.getClient(deviceId);
		if (!client) {
			res.status(400).send("device not found");
		}

		clientManager.setStatus(deviceId, "OPEN");

		const servoStatus = "90";

		client.publish({
			cmd: "publish" as const,
			topic: "led/status",
			payload: "1",
			dup: true,
			qos: 1,
			retain: false,
		});
		client.publish({
			cmd: "publish" as const,
			topic: "servo/status",
			payload: servoStatus,
			dup: true,
			qos: 1,
			retain: false,
		});

		res.status(200).send(`Open to ${deviceId}`);
	});

	app.post("/LOCK", async (req, res) => {
		const reqBody = JSON.parse(req.body);
		const deviceId = reqBody?.deviceId ?? null;
		if (!deviceId) {
			res.status(400).send("required device id");
		}

		const client = clientManager.getClient(deviceId);
		if (!client) {
			res.status(400).send("device not found");
		}

		clientManager.setStatus(deviceId, "LOCK");

		const servoStatus = "0";

		await client.publish({
			cmd: "publish" as const,
			topic: "led/status",
			payload: "0",
			dup: true,
			qos: 1,
			retain: false,
		});
		await client.publish({
			cmd: "publish" as const,
			topic: "servo/status",
			payload: servoStatus,
			dup: true,
			qos: 1,
			retain: false,
		});

		res.status(200).send(`lock to ${deviceId}`);
	});

	done();
};

export default createRouter;
