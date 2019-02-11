import { objectSchema, joi } from "../../lib/validation";
import { IApiAdditionalAuth } from ".";

export const schemaIApiAdditionalAuth = objectSchema<IApiAdditionalAuth>({
    needLogin: joi.boolean().optional(),
    needPassword: joi.boolean().optional(),
    needRegister: joi.boolean().optional()
});