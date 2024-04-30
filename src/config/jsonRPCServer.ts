import { JSONRPCServer, TypedJSONRPCServer } from "json-rpc-2.0";
import { exceptionMiddleware, logMiddleware } from "../utils/middleware";
import AuthController, { AuthControllerResponse } from "../controllers/AuthController";

type Methods = {
    signup(params: { name: string; email: string; password: string }): AuthControllerResponse;
    login(params: { email: string; password: string }): AuthControllerResponse;
};

const jsonRPCServer: TypedJSONRPCServer<Methods> = new JSONRPCServer({
    errorListener: (message: string, data: any) => {
        console.log(message, data);
    },
});

jsonRPCServer.applyMiddleware(logMiddleware, exceptionMiddleware);
jsonRPCServer.addMethod("signup", async ({ name, email, password }) =>
    AuthController.signup({ name, email, password }),
);
jsonRPCServer.addMethod("login", async ({ email, password }) => AuthController.login({ email, password }));

export default jsonRPCServer;
