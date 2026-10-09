import { describe, test, expect } from "vitest";
import { validateShipment } from "./shipmentValidation";

describe("Shipment Validation", () => {

  test("should accept valid shipment details", () => {
    expect(
      validateShipment(
        "Rahul Sharma",
        "Amit Patil",
        "Documents",
        "Sangli",
        "Satara"
      )
    ).toBe("Shipment is valid");
  });

  test("should reject empty sender name", () => {
    expect(
      validateShipment(
        "",
        "Amit Patil",
        "Documents",
        "Sangli",
        "Satara"
      )
    ).toBe("Sender Name is required");
  });

  test("should reject empty receiver name", () => {
    expect(
      validateShipment(
        "Rahul Sharma",
        "",
        "Documents",
        "Sangli",
        "Satara"
      )
    ).toBe("Receiver Name is required");
  });

  test("should reject empty destination", () => {
    expect(
      validateShipment(
        "Rahul Sharma",
        "Amit Patil",
        "Documents",
        "Sangli",
        ""
      )
    ).toBe("Destination is required");
  });

});