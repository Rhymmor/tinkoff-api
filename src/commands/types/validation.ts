import { objectSchema, joi } from "../../lib/validation";
import { IApiAdditionalAuth } from ".";

export const schemaIApiAdditionalAuth = objectSchema<IApiAdditionalAuth>({
    needLogin: joi.boolean().required(),
    needPassword: joi.boolean().required(),
    needRegister: joi.boolean().required()
});