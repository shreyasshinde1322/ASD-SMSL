import { describe, test, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../server.js";

let token;

beforeAll(async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "demo@example.com",
      password: "Demo@123"
    });

  expect(response.status).toBe(200);
  token = response.body.data.token;
});

describe("Shipment Integration Test", () => {

  test("should create a new shipment successfully", async () => {

    const response = await request(app)
      .post("/api/shipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sender_name: "Rahul Sharma",
        receiver_name: "Amit Patil",
        package_details: "Documents",
        source: "Sangli",
        destination: "Satara"
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.shipment_id).toBeTruthy();

  });

  test("should update an existing shipment successfully", async () => {

    const created = await request(app)
      .post("/api/shipments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sender_name: "Rahul Sharma",
        receiver_name: "Amit Patil",
        package_details: "Electronics",
        source: "Pune",
        destination: "Mumbai"
      });

    const shipmentId = created.body.data.shipment_id;

    const updatedShipment = {
      source: "Sangli",
      destination: "Satara",
      package_details: "Heart"
    };

    const response = await request(app)
      .put(`/api/shipments/${shipmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedShipment);

    expect([200, 201]).toContain(response.status);

    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.data.source).toBe("Sangli");
    expect(response.body.data.destination).toBe("Satara");
    expect(response.body.data.package_details).toBe("Heart");

  });

  test("should return 404 when updating an unknown shipment", async () => {

    const response = await request(app)
      .put("/api/shipments/SHP-9999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        source: "Sangli",
        destination: "Satara",
        package_details: "Heart"
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);

  });

  test("should reject update without an auth token", async () => {

    const response = await request(app)
      .put("/api/shipments/SHP-1001")
      .send({
        source: "Sangli",
        destination: "Satara",
        package_details: "Heart"
      });

    expect(response.status).toBe(401);

  });

});