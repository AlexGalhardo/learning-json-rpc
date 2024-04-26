import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { JSONRPCServer, TypedJSONRPCServer } from "json-rpc-2.0";
import JwtToken from "./utils/JwtToken";
import { exceptionMiddleware, logMiddleware } from "./utils/middleware";

type Methods = {
    echo(params: { message: string; username: string }): string;
    log(params: { message: string }): void;
    sum(params: { x: number; y: number }): string;
};

const server: TypedJSONRPCServer<Methods> = new JSONRPCServer({
    errorListener: (message, data) => {
        console.log(message, data);
    },
});

server.applyMiddleware(logMiddleware, exceptionMiddleware);
server.addMethod("echo", ({ message, username }) => `Username: ${username} Message: ${message}`);
server.addMethod("log", ({ message }) => console.log(message));
server.addMethod("sum", ({ x, y }) => `The sum of ${x} and ${y} is ${x + y}`);

express()
    .use(bodyParser.json())
    .post("/json-rpc", async (req, res) => {
        try {
            const jsonRPCRequest = req.body;

            JwtToken.verify(req.headers?.authorization?.replace(/^Bearer\s/, ""));

            const jsonRPCResponse = await server.receive(jsonRPCRequest);

            if (jsonRPCResponse) return res.status(200).json(jsonRPCResponse);

            return res.sendStatus(204);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    })
    .listen(process.env.PORT || 3333, () =>
        console.log(`\n\nJSON RPC SERVER listening on http://localhost:${process.env.PORT || 3333}\n\n`),
    );
