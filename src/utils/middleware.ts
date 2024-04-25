import { createJSONRPCErrorResponse } from "json-rpc-2.0";

export const logMiddleware = (next, request, serverParams) => {
    console.log(`Received ${JSON.stringify(request)}`);
    return next(request, serverParams).then((response) => {
        console.log(`Responding ${JSON.stringify(response)}\n\n`);
        return response;
    });
};

export const exceptionMiddleware = async (next, request, serverParams) => {
    try {
        return await next(request, serverParams);
    } catch (error) {
        if (error.code) {
            return createJSONRPCErrorResponse(request.id, error.code, error.message);
        } else {
            throw error;
        }
    }
};
