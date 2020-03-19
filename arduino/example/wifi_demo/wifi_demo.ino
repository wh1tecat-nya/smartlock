#include <ESP8266WiFi.h>
#include <Servo.h>
#include <PubSubClient.h>

const char* ssid = "STCN_Wireless2";
const char* password = "Ik3awI_yeKCSI";
const char* mqtt_server = "localhost:9101";

const int SERVO_PIN = 1;
const int LED_PIN = 3;

Servo servo;
WiFiServer server(80);

void setup() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); 

  delay(10);

  servo.attach(SERVO_PIN);
  servo.write(0);

  delay(10);

  Serial.begin(74880);

  delay(1000);

  Serial.println("\nConnecting to " + String(ssid));

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");

  server.begin();

  Serial.println("Server started");
  Serial.println("Use this URL to connect: http://" + WiFi.localIP().toString() + "/");
}

void setup_wifi(){

}

void loop() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }
  Serial.println("new client");

  while(!client.available()){
    delay(1);
  } 
  String request = client.readStringUntil('\r');

  Serial.println(request);
  client.flush(); 

  int servoDegree = 0;
  int value = LOW;

  if (request.indexOf("/SERVO=") != 1) {
    servoDegree = request.substring(7).toInt();
    Serial.println(servoDegree);
    servo.write(servoDegree);
  }

  if (request.indexOf("/LED=ON") != -1) {
    digitalWrite(LED_PIN, HIGH);
    value = HIGH;
  }

  if (request.indexOf("/LED=OFF") != -1) {
    digitalWrite(LED_PIN, LOW);
    value = LOW;
  }

  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html\n\n\n");

  client.print("Led is : "); 
  if(value == HIGH) {
    client.print("On\n");
  } else {
    client.print("Off\n");
  }
  client.println("\n");
  client.println("servo:" + servoDegree);

  delay(1);
  Serial.println("Client disconnected\n");
}
