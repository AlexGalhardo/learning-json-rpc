import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";

import { JSONRPCServer, TypedJSONRPCServer } from "json-rpc-2.0";
import JwtToken from "./utils/JwtToken";
import { exceptionMiddleware, logMiddleware } from "./utils/middleware";

type Methods = {
    echo(params: { message: string; username: string }): string;
    log(params: { message: string }): void;
    sum(params: { x: number; y: number }): number;
};

const server: TypedJSONRPCServer<Methods> = new JSONRPCServer({
    errorListener: (message, data) => {
        console.log(message, data);
    },
});

server.applyMiddleware(logMiddleware, exceptionMiddleware);
server.addMethod("echo", ({ message, username }) => `Username: ${username} Message: ${message}`);
server.addMethod("log", ({ message }) => console.log(message));

const app = express().use(bodyParser.json());

app.post("/json-rpc", (req, res) => {
    const jsonRPCRequest = req.body;
    JwtToken.verify(req.headers?.authorization?.replace(/^Bearer\s/, ""));
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
        } else {
            res.sendStatus(204);
        }
    });
});

app.listen(process.env.PORT || 3333, () =>
    console.log(`\n\nJSON RPC SERVER listening on http://localhost:${process.env.PORT || 3333}\n\n`),
);
