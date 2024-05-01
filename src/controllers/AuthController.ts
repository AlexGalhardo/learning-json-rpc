import Bcrypt from "src/utils/bcrypt";
import { prisma } from "../config/prisma";
import { validateSignupValidate } from "src/utils/validateSignupPayload";
import JwtToken from "src/utils/JwtToken";

export interface AuthControllerResponse {
    success: boolean;
    user?: any;
    message?: string;
}
interface SignupDTO {
    name: string;
    email: string;
    password: string;
}
interface LoginDTO {
    email: string;
    password: string;
}

export default class AuthController {
    static async signup(signupPayload: SignupDTO): Promise<AuthControllerResponse> {
        try {
            validateSignupValidate(signupPayload);

            let { name, email, password } = signupPayload;

            const emailAlreadyRegistred = await prisma.users.findUnique({ where: { email } });

            if (emailAlreadyRegistred) return { success: false, message: "Email already registred!" };

            password = await Bcrypt.hash(password);

            const jwt_token = JwtToken.create(email);

            await prisma.$transaction(async (trx) => {
                const user = await trx.users.create({ data: { name, email, password, jwt_token } });

                return {
                    success: true,
                    user,
                };
            });
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

    static async login(loginPayload: LoginDTO): Promise<AuthControllerResponse> {
        try {
            const { email, password } = loginPayload;

            const user = await prisma.users.findUnique({ where: { email } });

            if (!user) return { success: false, message: "Email and/or password invalid!" };

            if (!Bcrypt.compare(password, user.password))
                return { success: false, message: "Email and/or password invalid!" };

            return {
                success: true,
                user,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}
