const canvas_height = 300;

// Linear Interpolation and De-Interpolation
// Special thanks for my math teachers
const b = (i, j, k) => i + (j - i) * k;
const ib = (i, j, k) => (k - i) / (j - i);

/**
 * @param {MouseEvent} event
 * @param {"time" | "frequency"} domain
 */
async function onButtonClick(event, domain) {
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	const analyser = audioCtx.createAnalyser();
	source = audioCtx.createMediaStreamSource(stream);
	source.connect(analyser);

	analyser.fftSize = 2048;
	const buffer_length = analyser.frequencyBinCount;
	const data_array = new Uint8Array(buffer_length);

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	let cw = canvas.width = window.innerWidth - 20;
	canvas.height = canvas_height;
	window.addEventListener("resize", function() {
		cw = canvas.width = window.innerWidth - 20;
		ctx.strokeStyle = (domain === "frequency") ? "green" : "blue";
	});
	canvas.style.border = "1px solid black";
	document.body.appendChild(canvas);
	const slice_width = cw / buffer_length;
	requestAnimationFrame(step1);
	ctx.strokeStyle = (domain === "frequency") ? "green" : "blue";
	function step1() {
		if (domain === "frequency") {
			analyser.getByteFrequencyData(data_array);
		} else {
			analyser.getByteTimeDomainData(data_array);
		}
		ctx.clearRect(0, 0, cw, canvas_height);
		ctx.beginPath();
		for(let i = 0; i < buffer_length; i++) {
			const x = cw * (i / buffer_length);
			const v = (domain === "frequency") ? ((255 - data_array[i]) / 128)  : data_array[i] / 128.0;
			const y = v * canvas_height / 2.0;
			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();
		requestAnimationFrame(step1);
	}
}