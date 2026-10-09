import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../server.js";

describe("Login Integration Test", () => {

  test("should successfully login with valid credentials", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "demo@example.com",
        password: "Demo@123"
      });

    expect([200, 201]).toContain(response.status);

    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeTruthy();

  });

  test("should reject login with invalid credentials", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "demo@example.com",
        password: "wrong-password"
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);

  });

  test("should reject login when email is missing", async () => {

    const response = await request(app)
      .post("/api/auth/login")
      .send({ password: "Demo@123" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);

  });

});