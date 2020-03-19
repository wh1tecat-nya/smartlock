import { green, blue, yellow, red, white, cyan } from "colors";

const MQTT = green("[mqtt]");
const WEB = blue("[web]");

const LOG = white("[log]");
const INFO = cyan("[info]");
const ERROR = red("[error]");

export const mqttLogger = {
	log: (log: any) => {
		if (typeof log === "object") {
			console.log(`${MQTT}${LOG}:`);
			console.log(log);
		} else {
			console.log(`${MQTT}${LOG}${log}`);
		}
	},
	info: (info: any) => {
		console.info(`${MQTT}${INFO}${info}`);
	},
	error: (error: any) => {
		console.error(`${MQTT}${ERROR}${error}`);
	},
};

export const webLogger = {
	log: (log: any) => {
		console.log(`${WEB}${LOG}${log}`);
	},
	info: (info: any) => {
		console.info(`${WEB}${INFO}${info}`);
	},
	error: (error: any) => {
		console.error(`${WEB}${ERROR}${error}`);
	},
};
