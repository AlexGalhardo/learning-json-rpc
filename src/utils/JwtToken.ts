import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { faker } from "@faker-js/faker";
import 'dotenv/config';

export default class JwtToken {
    static create(userEmail: string = faker.internet.email()): string {
		return jwt.sign({ userId: crypto.randomUUID(), userEmail }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    }

    static verify(token?: string): { userId: string; userName: string } {
        if (!token) throw new Error("No token provided");

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) as { userId: string; userName: string };
            console.log("User ID: ", decodedToken.userId);
            console.log("User Name: ", decodedToken.userName);
            return decodedToken;
        } catch (error) {
            throw new Error(`Error decoding token: ${error}`);
        }
    }
}
