import Bcrypt from "src/utils/bcrypt";
import { validateSignupPayload } from "src/utils/validateSignupPayload";
import JwtToken from "src/utils/JwtToken";
import { User } from "src/config/mongoose";

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
			validateSignupPayload(signupPayload);

			let { name, email, password } = signupPayload;

			const emailAlreadyRegistered = await User.findOne({ email });

			if (emailAlreadyRegistered) return { success: false, message: "Email already registered!" };

			password = await Bcrypt.hash(password);
			const jwt_token = JwtToken.create(email);

			const user = new User({ name, email, password, jwt_token });
			await user.save();

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

    static async login(loginPayload: LoginDTO): Promise<AuthControllerResponse> {
        try {
            const { email, password } = loginPayload;

			const user = await User.findOne({ email });

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

