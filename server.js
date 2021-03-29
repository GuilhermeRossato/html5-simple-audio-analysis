const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const ip = "localhost" || getNetworkAdapterIp();
const port = 8081;

http.createServer(function onConnection(req, res) {
	console.log(`[${(new Date()).toISOString()}] - Request for ${req.url} from ${JSON.stringify(req.connection.remoteAddress)}`);
	try {
		if (req.url.includes("..")) {
			res.writeHead(404);
			res.end();
			return;
		}
		const destination_path = path.join(__dirname, req.url);
		if (fs.existsSync(destination_path)) {
			if (fs.statSync(destination_path).isDirectory()) {
				res.setHeader("Content-Type", "text/html");
				res.end("<pre>" + fs.readdirSync(destination_path).map(file => `<a href="${path.join(req.url, file)}">${file}</a>`).join("\n") + "</pre>");
			} else {
				const content_type = mime.lookup(destination_path) || "application/octet-stream";
				res.setHeader("Content-Type", content_type);
				fs.createReadStream(destination_path).pipe(res);
			}
		} else {
			res.writeHead(404);
			res.end();
			return;
		}
	} catch (err) {
		res.setHeader("Content-Type", "text/html");
		res.end("<pre>" + err.stack.toString() + "</pre>");
	}
}).listen(port, ip, null, function onServerStart() {
	console.log(`[${(new Date()).toISOString()}] - Server listening at http://${ip}:${port}`);
}).on("error", function(err) {
	console.log(`Server error when listening at http://${ip}:${port}`);
	console.log(err);
	console.log("Server failed");
	process.exit(1);
})

function getNetworkAdapterIp(adapter_name = "Adaptador de Rede sem Fio Wi-Fi", ip_version = 4, cp = require("child_process")) {
	process.stdout.setEncoding("utf-8");
	/** @type {Buffer} */
	const ipconfig_output = cp.spawnSync("C:\\Windows\\System32\\ipconfig.exe", ["/all"]).output[1];
	const adapter_config = ipconfig_output.toString("utf-8").split(adapter_name + ":")[1];
	if (!adapter_config) {
		return "ERROR - could not find adapter on output:\n" + (JSON.stringify(ipconfig_output.toString("utf-8")));
	} else {
		const ip_config = adapter_config.split("IPv" + ip_version + ". . . . . . . .  . . . . . . . :")[1];
		if (!ip_config) {
			return "ERROR - could not find ipv" + ip_version + " from adapter string:\n" + (JSON.stringify(adapter_config));
		} else {
			return (ip_config.split("\n")[0].split("(")[0].trim());
		}
	}
}