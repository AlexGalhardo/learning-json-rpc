import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { faker } from "@faker-js/faker";

export default class JwtToken {
    static create(userId: string = crypto.randomUUID(), userName: string = faker.internet.userName()): string {
        return jwt.sign({ userId, userName }, "secretKey", { expiresIn: "1h" });
    }

    static verify(token?: string): { userId: string; userName: string } {
        if (!token) throw new Error("No token provided");

        try {
            const decodedToken = jwt.verify(token, "secretKey") as { userId: string; userName: string };
            console.log("User ID: ", decodedToken.userId);
            console.log("User Name: ", decodedToken.userName);
            return decodedToken;
        } catch (error) {
            throw new Error(`Error decoding token: ${error}`);
        }
    }
}
