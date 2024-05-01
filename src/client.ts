import {
	JSONRPCClient,
	JSONRPCID,
	JSONRPCErrorResponse,
	createJSONRPCErrorResponse,
	JSONRPCRequest,
} from "json-rpc-2.0";
import "dotenv/config";
import JwtToken from "./utils/JwtToken";
import { generateRandomEmail, generateRandomFullName } from "./utils/generate";

const createTimeoutJSONRPCErrorResponse = (id: JSONRPCID): JSONRPCErrorResponse =>
	createJSONRPCErrorResponse(id, 400, "Request timed out after 10s");

const clientLogin = new JSONRPCClient(async (jsonRPCRequest: JSONRPCRequest, { jwt_token }: { jwt_token: string }) => {
	try {
		const response = await fetch("http://localhost:4444/login", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${jwt_token}`,
			},
			body: JSON.stringify(jsonRPCRequest),
		});

		if (response.status === 200) {
			const jsonRPCResponse = await response.json();
			if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) {
				throw new Error("Invalid JSON-RPC response");
			}
			return clientLogin.receive(jsonRPCResponse);
		} else if (jsonRPCRequest.id !== undefined) {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

// clientLogin
//     .timeout(20 * 1000, createTimeoutJSONRPCErrorResponse)
//     .request(
//         "login",
//         {
//             email: "pedrinho@gmail.com",
//             password: "passwordqweBR@123",
//         },
//         {
//             jwt_token:
//                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Yzg5YjY3Mi04ZmIxLTQ2YTQtYjY0Yy1kNTBlODIzODU0YzciLCJ1c2VyRW1haWwiOiJwZWRyaW5ob0BnbWFpbC5jb20iLCJpYXQiOjE3MTQ1MDcyNjgsImV4cCI6MTcxNDUxMDg2OH0.JG7WXoC0ncQxFspt1lAzOVRn20Fg9q_34xDkiRphgZo",
//         },
//     )
//     .then((result) => console.log(result))
//     .catch((error) => console.error("Error: ", error));

const clientSignup = new JSONRPCClient(async (jsonRPCRequest: JSONRPCRequest) => {
	try {
		const response = await fetch("http://localhost:4444/signup", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(jsonRPCRequest),
		});

		if (response.status === 200) {
			const jsonRPCResponse = await response.json();
			// if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) throw new Error("Invalid JSON-RPC response");
			return clientSignup.receive(jsonRPCResponse);
		} else if (jsonRPCRequest.id !== undefined) {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

// clientSignup
// 	.timeout(20 * 1000, createTimeoutJSONRPCErrorResponse)
// 	.request("signup", { name: 'testando user', email: 'pedrinho@gmail.com', password: 'passwordqweBR@123' })
// 	.then((result) => console.log(result))
// 	.catch((error) => console.error("Error: ", error));

// for(let i = 0; i < 1; i++) {
// 	clientSignup
// 		.timeout(10 * 1000, createTimeoutJSONRPCErrorResponse)
// 		.request("signup", { name: generateRandomFullName(), email: generateRandomEmail(), password: 'passwordtesteBR@123' })
// 		.then((result) => console.log(result))
// 		.catch((error) => console.error("Error: ", error));
// }

const clientCheckout = new JSONRPCClient(async (jsonRPCRequest: JSONRPCRequest) => {
	try {
		const response = await fetch("http://localhost:4444/checkout", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(jsonRPCRequest),
		});

		if (response.status === 200) {
			const jsonRPCResponse = await response.json();
			if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) throw new Error("Invalid JSON-RPC response");
			return clientCheckout.receive(jsonRPCResponse);
		} else if (jsonRPCRequest.id !== undefined) {
			throw new Error(response.statusText);
		}
	} catch (error) {
		throw new Error(error.message);
	}
});

for (let i = 0; i < 1000; i++) {
	clientCheckout
		.timeout(20 * 1000, createTimeoutJSONRPCErrorResponse)
		.request("checkout", { product_id: process.env.PRODUCT_ID })
		.then((result) => console.log(result))
		.catch((error) => console.error("Error: ", error));
}
