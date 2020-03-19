import { IncomingMessage, ServerResponse, Server } from "http";
import { Plugin, ServerOptions } from "fastify";
import { mqttLogger, webLogger } from "./utils";

export type Logger = typeof mqttLogger | typeof webLogger;

export type WebRouter = Plugin<
	Server,
	IncomingMessage,
	ServerResponse,
	ServerOptions
>;
