
import * as isEmail from "isemail";

import { Credentials } from "../repositories/student.repository";
import { HttpErrors } from "@loopback/rest"; 

export function validateCredentials(credentials:Credentials) {
if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity("invalid Email id")
}

if (credentials.password.length<8) {
    
    throw new HttpErrors.UnprocessableEntity("invalid password length should be greater than 8")
}

}