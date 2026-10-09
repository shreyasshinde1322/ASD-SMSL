export function validateShipment(
  senderName,
  receiverName,
  packageDetails,
  source,
  destination
) {
  if (!senderName || senderName.trim() === "") {
    return "Sender Name is required";
  }

  if (!receiverName || receiverName.trim() === "") {
    return "Receiver Name is required";
  }

  if (!packageDetails || packageDetails.trim() === "") {
    return "Package Details are required";
  }

  if (!source || source.trim() === "") {
    return "Source is required";
  }

  if (!destination || destination.trim() === "") {
    return "Destination is required";
  }

  return "Shipment is valid";
}