import {
    JSONRPCClient,
    JSONRPCID,
    JSONRPCErrorResponse,
    createJSONRPCErrorResponse,
    JSONRPCRequest,
} from "json-rpc-2.0";
import JwtToken from "./utils/JwtToken";

const client = new JSONRPCClient((jsonRPCRequest: JSONRPCRequest, { token }) =>
    fetch("http://localhost:3333/json-rpc", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonRPCRequest),
    }).then((response) => {
        if (response.status === 200) {
            return response.json().then((jsonRPCResponse) => {
                if (!jsonRPCResponse?.jsonrpc || !jsonRPCResponse?.id) {
                    return Promise.reject(new Error("Invalid JSON-RPC response"));
                }
                return client.receive(jsonRPCResponse);
            });
        } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
        }
    }),
);

const createTimeoutJSONRPCErrorResponse = (id: JSONRPCID): JSONRPCErrorResponse =>
    createJSONRPCErrorResponse(id, 400, "Custom error message");

client
    .timeout(10 * 1000, createTimeoutJSONRPCErrorResponse)
    .request("echo", { message: "Testandooo", username: "alex" }, { token: JwtToken.create() })
    .then((result) => console.log(result))
    .catch((error) => console.error("Error:", error));

client.notify(
    "log",
    { message: "Log" },
    {
        token: JwtToken.create(),
    },
);
