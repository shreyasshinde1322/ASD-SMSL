import { describe, test, expect } from "vitest";
import { validateLogin } from "./loginValidation";

describe("User Login Validation", () => {

    test("should accept valid email and password", () => {
        expect(
            validateLogin(
                "user@example.com",
                "password123"
            )
        ).toBe("Login successful");
    });

    test("should reject empty email", () => {
        expect(
            validateLogin(
                "",
                "password123"
            )
        ).toBe("Email/Username is required");
    });

    test("should reject empty password", () => {
        expect(
            validateLogin(
                "user@example.com",
                ""
            )
        ).toBe("Password is required");
    });

});
