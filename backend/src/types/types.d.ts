import { AuthObject } from '@clerk/clerk-sdk-node';
//import { AuthObject } from "@clerk/backend";


declare global {
    namespace Express {
        export interface Request {
            auth?: AuthObject;
        }
    }
}
