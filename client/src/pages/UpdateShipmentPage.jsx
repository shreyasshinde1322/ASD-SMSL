import { useState } from 'react';
import { shipmentAPI } from '../services/api';

function UpdateShipmentPage() {
  const [shipmentId, setShipmentId] = useState('');
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    package_details: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [serverError, setServerError] = useState('');
  const [found, setFound] = useState(false);

  const handleLookup = async () => {
    if (!shipmentId.trim()) {
      setErrors({ shipment_id: 'Please enter a shipment ID.' });
      return;
    }

    setLookupLoading(true);
    setServerError('');
    setSuccess(null);
    setFound(false);

    try {
      const response = await shipmentAPI.getByShipmentId(shipmentId.trim());
      const shipment = response.data;
      setFormData({
        source: shipment.source,
        destination: shipment.destination,
        package_details: shipment.package_details,
      });
      setFound(true);
      setErrors({});
    } catch (err) {
      if (err.status === 404) {
        setServerError('Shipment not found. Please check the shipment ID.');
      } else {
        setServerError(err.message || 'Failed to look up shipment.');
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!shipmentId.trim()) newErrors.shipment_id = 'Shipment ID is required.';
    if (!found) newErrors.shipment_id = 'Please look up a valid shipment first.';
    if (!formData.source.trim()) newErrors.source = 'Source is required.';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required.';
    if (!formData.package_details.trim()) newErrors.package_details = 'Package details are required.';
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
      const response = await shipmentAPI.update(shipmentId.trim(), formData);
      setSuccess(response.data);
    } catch (err) {
      if (err.status === 404) {
        setServerError('Shipment not found. Please check the shipment ID.');
      } else {
        setServerError(err.message || 'Failed to update shipment.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShipmentId('');
    setFormData({ source: '', destination: '', package_details: '' });
    setErrors({});
    setServerError('');
    setSuccess(null);
    setFound(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
        <div>
          <h1 className="page-title">Update Shipment</h1>
          <p className="page-subtitle">Modify shipment information using the shipment ID.</p>
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
          <h2 className="success-title">Shipment Updated Successfully</h2>
          <div className="success-details">
            <div className="success-detail">
              <span className="success-detail-label">Shipment ID</span>
              <span className="success-detail-value">{success.shipment_id}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Source</span>
              <span className="success-detail-value">{success.source}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Destination</span>
              <span className="success-detail-value">{success.destination}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Package Details</span>
              <span className="success-detail-value">{success.package_details}</span>
            </div>
            <div className="success-detail">
              <span className="success-detail-label">Status</span>
              <span className="success-detail-value status-badge">{success.status}</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleReset}>
            Update Another Shipment
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Shipment Lookup
            </h3>
            <div className="form-group">
              <label className="form-label">Shipment ID</label>
              <div className="input-with-button">
                <input
                  type="text"
                  className={`form-input ${errors.shipment_id ? 'input-error' : ''}`}
                  placeholder="e.g. SHP-1001"
                  value={shipmentId}
                  onChange={(e) => { setShipmentId(e.target.value); setErrors({}); setFound(false); setServerError(''); }}
                  disabled={found}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleLookup}
                  disabled={lookupLoading || !shipmentId.trim()}
                >
                  {lookupLoading ? (
                    <span className="btn-spinner" />
                  ) : (
                    'Look Up'
                  )}
                </button>
              </div>
              {errors.shipment_id && <span className="form-error">{errors.shipment_id}</span>}
              {found && (
                <span className="form-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Shipment found. You can now update the details below.
                </span>
              )}
            </div>
          </div>

          {found && (
            <>
              <div className="form-section">
                <h3 className="form-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Update Information
                </h3>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <input
                    type="text"
                    className={`form-input ${errors.source ? 'input-error' : ''}`}
                    placeholder="e.g. Bangalore, Hyderabad"
                    value={formData.source}
                    onChange={(e) => { setFormData(prev => ({ ...prev, source: e.target.value })); setErrors(prev => ({ ...prev, source: '' })); }}
                  />
                  {errors.source && <span className="form-error">{errors.source}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    className={`form-input ${errors.destination ? 'input-error' : ''}`}
                    placeholder="e.g. Mumbai, Delhi"
                    value={formData.destination}
                    onChange={(e) => { setFormData(prev => ({ ...prev, destination: e.target.value })); setErrors(prev => ({ ...prev, destination: '' })); }}
                  />
                  {errors.destination && <span className="form-error">{errors.destination}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Package Details</label>
                  <input
                    type="text"
                    className={`form-input ${errors.package_details ? 'input-error' : ''}`}
                    placeholder="e.g. Electronics"
                    value={formData.package_details}
                    onChange={(e) => { setFormData(prev => ({ ...prev, package_details: e.target.value })); setErrors(prev => ({ ...prev, package_details: '' })); }}
                  />
                  {errors.package_details && <span className="form-error">{errors.package_details}</span>}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Update Shipment
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}

export default UpdateShipmentPage;
