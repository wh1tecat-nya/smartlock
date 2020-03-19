#include <ESP8266WiFi.h>
#include <Servo.h>
#include <PubSubClient.h>
#include <ESP8266TrueRandom.h>

const char* ssid = ""; // Your Wifi SSID(2.4GHz only)
const char* password = ""; // Your Wifi Password
const char* mqtt_server = "192.168.1.1"; // Your Smartlock server IP
const int MQTT_PORT = 9101;

const int SERVO_PIN = 13;
const int LED_PIN = 15;

Servo servo;
WiFiClient espClient;
PubSubClient client(espClient);

byte uuid_array[16];
String uuid;

long lastMsg = 0;
String msg;
int value = 0;

void setup() {
	delay(100);
	pinMode(LED_PIN, OUTPUT);
	digitalWrite(LED_PIN, LOW); 
	delay(10);

	servo.attach(SERVO_PIN);
	servo.write(0);
	delay(1000);

	Serial.begin(74880);
	delay(1000);

	ESP8266TrueRandom.uuid(uuid_array);
	uuid = ESP8266TrueRandom.uuidToString(uuid_array);

	setup_wifi();

	Serial.println("uuid:" + uuid);

	client.setServer(mqtt_server, MQTT_PORT);
	client.setCallback(callback);
}

void setup_wifi(){
	Serial.println("\nConnecting to " + (String)ssid);

	WiFi.begin(ssid, password);

	while (WiFi.status() != WL_CONNECTED) {
	delay(500);
	Serial.print(".");
	}

	Serial.println("\nWiFi connected");
	Serial.println("IP address:"+ WiFi.localIP().toString());
}

void callback(char* topic, byte* payload, unsigned int length) {
	payload[length] = '\0';
	String payloadString = (char*)payload;

	Serial.println("Receieved Topic:" + (String)topic);
	Serial.print("payload:" + payloadString + "\n");

	if ((String)topic == "led/status") {
		if (payloadString == "1") {
			digitalWrite(LED_PIN, HIGH);
			delay(10);
			Serial.println("Turn on LED\n");
			client.publish("led/result", "Change LED status: HIGH");
		} else {
			digitalWrite(LED_PIN, LOW);
			delay(10);
			Serial.println("Turn off LED\n");
			client.publish("led/result", "Change LED status: LOW");
		}
	} else if ((String)topic == "servo/status") {
		int angle = payloadString.toInt();
		if (angle>180||angle<0) return;

		Serial.println(angle);
		servo.write(angle);
		delay(2000);
		Serial.println("Turn Servo to " + payloadString + "\n");
		client.publish("servo/result", String("Change Servo status:" + payloadString).c_str());
	}


}

void reconnect() {
	while (!client.connected()) {
		Serial.println("trying MQTT Connecting");
		if (client.connect(uuid.c_str())) {
			Serial.println("connected");
			client.publish("connect_info", "reconnect");

			client.subscribe("led/status");
		} else {
			Serial.println("failed rc=" + (String)client.state() + (String)"try again in 5sec.");
			delay(5000);
		}
	}
}

void loop() {
	if (!client.connected()) {
		reconnect();
	}
	client.loop();
	delay(2000);
}
