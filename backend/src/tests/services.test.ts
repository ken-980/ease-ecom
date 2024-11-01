import { expect, test } from "@jest/globals"
import { passwordDecode } from '../services/password-decode';



test("test user token", async () => {
    const testPassword = "strongpass";
    const hash = "$2b$12$T.H7bW87LNfmptCyPUgo2uYxOjiXGN62VVoI5iFI4N7t9LZZVnEnW";

    const data = await passwordDecode(testPassword, hash);

    expect(data).toBe(true);

})



