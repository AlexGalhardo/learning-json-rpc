import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import jsonRPCServer from "./config/jsonRPCServer";

const expressPostRequest = async (req: Request, res: Response) => {
    try {
        const jsonRPCResponse = await jsonRPCServer.receive(req.body);
        if (jsonRPCResponse) return res.status(200).json(jsonRPCResponse);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

express()
    .use(bodyParser.json())
    .post("/signup", async (req, res) => expressPostRequest(req, res))
    .post("/login", async (req, res) => expressPostRequest(req, res))
    .post("/checkout", async (req, res) => expressPostRequest(req, res))
    .listen(Bun.env.PORT || 4444, () =>
        console.log(`\n\nJSON RPC SERVER listening on http://localhost:${Bun.env.PORT || 4444}\n\n`),
    );
