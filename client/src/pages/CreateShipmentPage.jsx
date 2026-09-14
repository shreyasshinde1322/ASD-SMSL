import { useState } from 'react';
import { shipmentAPI } from '../services/api';

function CreateShipmentPage() {
  const [formData, setFormData] = useState({
    sender_name: '',
    receiver_name: '',
    package_details: '',
    destination: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setServerError('');
    setSuccess(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.sender_name.trim()) newErrors.sender_name = 'Sender name is required.';
    if (!formData.receiver_name.trim()) newErrors.receiver_name = 'Receiver name is required.';
    if (!formData.package_details.trim()) newErrors.package_details = 'Package details are required.';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await shipmentAPI.create(formData);
      setSuccess(response.data);
      setFormData({ sender_name: '', receiver_name: '', package_details: '', destination: '' });
      setErrors({});
    } catch (err) {
      setServerError(err.message || 'Failed to create shipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ sender_name: '', receiver_name: '', package_details: '', destination: '' });
    setErrors({});
    setServerError('');
    setSuccess(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div>
          <h1 className="page-title">Create Shipment</h1>
          <p className="page-subtitle">Enter shipment information to create a new shipment.</p>
        </div>
      </div>

      {success && (
        <div className="success-card">
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="success-title">Shipment Created Successfully</h2>
          <div className="success-details">
            <div className="success-detail">
              <span className="success-detail-label">Shipment ID</span>
              <span className="success-detail-value">{success.shipment_id}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Status</span>
              <span className="success-detail-value status-badge">{success.status}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Destination</span>
              <span className="success-detail-value">{success.destination}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Receiver</span>
              <span className="success-detail-value">{success.receiver_name}</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Another Shipment
          </button>
        </div>
      )}

      {!success && (
        <form className="form-card" onSubmit={handleSubmit}>
          {serverError && (
            <div className="alert alert-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {serverError}
            </div>
          )}

          <div className="form-section">
            <h3 className="form-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Sender Information
            </h3>
            <div className="form-group">
              <label className="form-label">Sender Name</label>
              <input
                type="text"
                className={`form-input ${errors.sender_name ? 'input-error' : ''}`}
                placeholder="e.g. Rahul Sharma"
                value={formData.sender_name}
                onChange={(e) => handleChange('sender_name', e.target.value)}
              />
              {errors.sender_name && <span className="form-error">{errors.sender_name}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Receiver Information
            </h3>
            <div className="form-group">
              <label className="form-label">Receiver Name</label>
              <input
                type="text"
                className={`form-input ${errors.receiver_name ? 'input-error' : ''}`}
                placeholder="e.g. Amit Patil"
                value={formData.receiver_name}
                onChange={(e) => handleChange('receiver_name', e.target.value)}
              />
              {errors.receiver_name && <span className="form-error">{errors.receiver_name}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Package Information
            </h3>
            <div className="form-group">
              <label className="form-label">Package Details</label>
              <input
                type="text"
                className={`form-input ${errors.package_details ? 'input-error' : ''}`}
                placeholder="e.g. Electronics, Documents, Clothing"
                value={formData.package_details}
                onChange={(e) => handleChange('package_details', e.target.value)}
              />
              {errors.package_details && <span className="form-error">{errors.package_details}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Destination
            </h3>
            <div className="form-group">
              <label className="form-label">Destination</label>
              <input
                type="text"
                className={`form-input ${errors.destination ? 'input-error' : ''}`}
                placeholder="e.g. Pune, Mumbai, Delhi"
                value={formData.destination}
                onChange={(e) => handleChange('destination', e.target.value)}
              />
              {errors.destination && <span className="form-error">{errors.destination}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Shipment
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CreateShipmentPage;
