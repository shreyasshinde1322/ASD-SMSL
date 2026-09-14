const express = require('express');
const { getDb } = require('../database/database');

const router = express.Router();

function generateShipmentId() {
  const db = getDb();
  try {
    const last = db.prepare('SELECT shipment_id FROM shipments ORDER BY id DESC LIMIT 1').get();
    if (!last) return 'SHP-1001';
    const lastNum = parseInt(last.shipment_id.split('-')[1], 10);
    return `SHP-${String(lastNum + 1).padStart(4, '0')}`;
  } finally {
    db.close();
  }
}

router.post('/', (req, res) => {
  try {
    const { sender_name, receiver_name, package_details, destination } = req.body;

    if (!sender_name || !sender_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Sender name is required.'
      });
    }

    if (!receiver_name || !receiver_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Receiver name is required.'
      });
    }

    if (!package_details || !package_details.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Package details are required.'
      });
    }

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required.'
      });
    }

    const shipmentId = generateShipmentId();
    const db = getDb();

    try {
      const stmt = db.prepare(
        'INSERT INTO shipments (shipment_id, sender_name, receiver_name, package_details, destination) VALUES (?, ?, ?, ?, ?)'
      );
      const result = stmt.run(
        shipmentId,
        sender_name.trim(),
        receiver_name.trim(),
        package_details.trim(),
        destination.trim()
      );

      const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(result.lastInsertRowid);

      return res.status(201).json({
        success: true,
        message: 'Shipment created successfully.',
        data: shipment
      });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Create shipment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

router.get('/:shipmentId', (req, res) => {
  try {
    const { shipmentId } = req.params;
    const db = getDb();

    try {
      const shipment = db.prepare('SELECT * FROM shipments WHERE shipment_id = ?').get(shipmentId.trim());

      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found.'
        });
      }

      return res.json({
        success: true,
        data: shipment
      });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Get shipment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

router.put('/:shipmentId', (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { destination, package_details } = req.body;

    if (!destination || !destination.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required.'
      });
    }

    if (!package_details || !package_details.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Package details are required.'
      });
    }

    const db = getDb();

    try {
      const existing = db.prepare('SELECT * FROM shipments WHERE shipment_id = ?').get(shipmentId.trim());

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Shipment not found.'
        });
      }

      db.prepare(
        "UPDATE shipments SET destination = ?, package_details = ?, updated_at = datetime('now') WHERE shipment_id = ?"
      ).run(destination.trim(), package_details.trim(), shipmentId.trim());

      const updated = db.prepare('SELECT * FROM shipments WHERE shipment_id = ?').get(shipmentId.trim());

      return res.json({
        success: true,
        message: 'Shipment updated successfully.',
        data: updated
      });
    } finally {
      db.close();
    }
  } catch (error) {
    console.error('Update shipment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
});

module.exports = router;
