# SmartLock

## Requirements
### Arduino
+ ESP8266 Compatible board
	- Recommended LoLin NodeMCU
+ Servo Mortor
	- Recommended SG-90/SG-92R
+ LED
### Server
+ Node.js
	- Maybe worked on > v11 (developed by v12.14.1)
+ Open Port TCP/UDP 9100, 9101
### Other
+ Joint parts to `Servo - Door Lock`
	- Use 3D Printer is best.
	- Finally, no problem if Servo Mortor can turn to the lock
+ Some Parts to Secure Servo Mortor to door
	- same too

## Directories
```
.
├── arduino : arduino source code
│   ├── example : demo source code
│   └── smartlock : product code
└── server : device management, web api server
```

## Setup
1. Clone this git repository.
### 2. server
1. Open your terminal and cd server folder
2. Run `npm i`
3. Run `npm start`
### 3. arduino
1. Open arduino/smartlock/smartlock.ino
2. Write following property
	- `line6: ssid`: Your Wifi SSID(2.4Ghz only)
	- `line7: password`: Your Wifi password
	- `line8: mqtt_server`: Your server IP address from `Setup: 2. server`
3. and if you required, You can change property
	- `line11: SERVO_PIN`: GPIO PIN Number of connected Servo Mortor
	- `line12: LED_PIN`: GPIO PIN Number of connected LED
4. Write sketch to your ESP8266.
### 4. installation
1. Secure Hadware assembly to door

