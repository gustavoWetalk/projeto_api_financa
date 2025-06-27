"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
const validateData = (schema, genericMessage) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
            return;
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                if (genericMessage) {
                    res.status(400).json({ message: genericMessage });
                    return;
                }
                const messages = error.errors.map((err) => err.message);
                res.status(400).json({ errors: messages });
                return;
            }
            next(error);
            return;
        }
    };
};
exports.validateData = validateData;
