window.addEventListener("load", async () => {
	const deviceList = document.getElementById("device_list");
	const lockStatus = document.getElementById("status");
	const openButton = document.getElementById("open");
	const lockButton = document.getElementById("lock");

	const sendOpenSignal = async () => {
		const sendData = {
			deviceId: deviceList.value,
		};

		await fetch("OPEN", {
			method: "POST",
			body: JSON.stringify(sendData),
		});

		getStatus();
	};

	const sendLockSignal = async () => {
		const sendData = {
			deviceId: deviceList.value,
		};

		await fetch("LOCK", {
			method: "POST",
			body: JSON.stringify(sendData),
		});

		getStatus();
	};

	const changeHandler = () => {
		getStatus();
	};

	const getStatus = async () => {
		const sendData = {
			deviceId: deviceList.value,
		};

		const status = await fetch("status", {
			method: "POST",
			body: JSON.stringify(sendData),
		}).then(data => data.json());

		lockStatus.textContent = status.status;
	};

	deviceList.addEventListener("change", changeHandler);
	openButton.addEventListener("click", sendOpenSignal);
	lockButton.addEventListener("click", sendLockSignal);

	const deviceIds = await fetch("devices").then(data => data.json());
	for (const deviceId of deviceIds) {
		const deviceDom = document.createElement("option");
		deviceDom.value = deviceId;
		deviceDom.text = deviceId;
		deviceList.appendChild(deviceDom);
	}
	getStatus();
});
