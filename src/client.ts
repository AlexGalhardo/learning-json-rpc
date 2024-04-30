import {
	JSONRPCClient,
	JSONRPCID,
	JSONRPCErrorResponse,
	createJSONRPCErrorResponse,
	JSONRPCRequest,
} from "json-rpc-2.0";
import JwtToken from "./utils/JwtToken";
import { generateRandomEmail, generateRandomFullName } from "./utils/generate";

const client = new JSONRPCClient(async (jsonRPCRequest: JSONRPCRequest, { token }) => {
	try {
		const response = await fetch("http://localhost:4444/json-rpc", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(jsonRPCRequest),
		});

		if (response.status === 200) {
			const jsonRPCResponse = await response.json();
			if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) {
				throw new Error("Invalid JSON-RPC response");
			}
			return client.receive(jsonRPCResponse);
		} else if (jsonRPCRequest.id !== undefined) {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

const createTimeoutJSONRPCErrorResponse = (id: JSONRPCID): JSONRPCErrorResponse =>
	createJSONRPCErrorResponse(id, 400, "Request timed out after 10s");

client
	.timeout(10 * 1000, createTimeoutJSONRPCErrorResponse)
	.request("echo", { message: "Testandooo", username: "alex" }, { token: JwtToken.create() })
	.then((result) => console.log(result))
	.catch((error) => console.error("Error: ", error));

client.notify(
	"log",
	{ message: "Log" },
	{
		token: JwtToken.create(),
	},
);

client
	.timeout(10 * 1000, createTimeoutJSONRPCErrorResponse)
	.request("sum", { x: 15, y: 27 }, { token: JwtToken.create() })
	.then((result) => console.log(result))
	.catch((error) => console.error("Error: ", error));

const clientSignup = new JSONRPCClient(async (jsonRPCRequest: JSONRPCRequest) => {
	try {
		const response = await fetch("http://localhost:4444/signup", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(jsonRPCRequest),
		});

		if (response.status === 200) {
			const jsonRPCResponse = await response.json();
			if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) {
				throw new Error("Invalid JSON-RPC response");
			}
			return clientSignup.receive(jsonRPCResponse);
		} else if (jsonRPCRequest.id !== undefined) {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

for(let i = 0; i < 100; i++) {
	clientSignup
		.timeout(10 * 1000, createTimeoutJSONRPCErrorResponse)
		.request("signup", { name: generateRandomFullName(), email: generateRandomEmail(), password: 'passwordtesteBR@123' })
		.then((result) => console.log(result))
		.catch((error) => console.error("Error: ", error));
}

