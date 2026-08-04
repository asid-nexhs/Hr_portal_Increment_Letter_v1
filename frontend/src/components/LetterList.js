import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLetters, deleteLetter, downloadPDF } from '../services/api';
import LetterPreview from './LetterPreview';

function LetterList() {
    const [letters, setLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadLetters();
    }, []);

    const loadLetters = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getLetters();
            
            // Check if response.data is an array, if not, try to extract it
            let lettersData = response.data;
            
            // If response.data is not an array, check for common pagination patterns
            if (response.data && typeof response.data === 'object') {
                // Check if it's a paginated response (Django REST Framework default)
                if (response.data.results && Array.isArray(response.data.results)) {
                    lettersData = response.data.results;
                } 
                // Check if it's an object with data property
                else if (response.data.data && Array.isArray(response.data.data)) {
                    lettersData = response.data.data;
                }
                // If it's a single object, wrap it in an array
                else if (!Array.isArray(response.data) && response.data.id) {
                    lettersData = [response.data];
                }
                // If it's an object with numeric keys, convert to array
                else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
                    const values = Object.values(response.data);
                    if (values.length > 0 && values.some(v => typeof v === 'object' && v.id)) {
                        lettersData = values;
                    } else {
                        lettersData = [];
                    }
                }
                // Default to empty array if we can't determine
                else {
                    lettersData = [];
                }
            }
            
            // Ensure we have an array
            setLetters(Array.isArray(lettersData) ? lettersData : []);
        } catch (error) {
            console.error('Error loading letters:', error);
            setError('Failed to load letters. Please try again.');
            setLetters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this increment letter?')) {
            try {
                await deleteLetter(id);
                loadLetters();
            } catch (error) {
                console.error('Error deleting letter:', error);
                alert('Failed to delete letter');
            }
        }
    };

    const handlePreview = (letter) => {
        setSelectedLetter(letter);
        setShowPreview(true);
    };

    const handleDownloadPDF = async (letter) => {
        setDownloadingId(letter.id);
        try {
            const response = await downloadPDF(letter.id);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Increment_Letter_${letter.employee_id}_${letter.employee_name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF download error:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error Loading Letters</h4>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={loadLetters}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Increment Letters</h2>
                <div>
                    <button 
                        className="btn btn-outline-secondary me-2" 
                        onClick={loadLetters}
                        title="Refresh"
                    >
                        <i className="bi bi-arrow-repeat"></i> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/create')}>
                        + Create New Letter
                    </button>
                </div>
            </div>

            {!Array.isArray(letters) || letters.length === 0 ? (
                <div className="alert alert-info">
                    <h5>No increment letters found</h5>
                    <p>Click "Create New Letter" to add your first increment letter.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Reference No.</th>
                                <th>Employee Name</th>
                                <th>Employee ID</th>
                                <th>Type</th>
                                <th>Designation</th>
                                <th>Effective Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {letters.map((letter) => (
                                <tr key={letter.id}>
                                    <td>
                                        <span className="badge bg-secondary">
                                            {letter.ref_no || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{letter.employee_name}</td>
                                    <td>{letter.employee_id}</td>
                                    <td>
                                        <span className={`badge ${letter.employee_type === 'office' ? 'bg-primary' : 'bg-success'}`}>
                                            {letter.employee_type === 'office' ? 'Office Staff' : 'Site Employee'}
                                        </span>
                                    </td>
                                    <td>{letter.designation}</td>
                                    <td>{letter.effective_date}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info me-1"
                                            onClick={() => handlePreview(letter)}
                                            title="Preview"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-warning me-1"
                                            onClick={() => navigate(`/edit/${letter.id}`)}
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger me-1"
                                            onClick={() => handleDelete(letter.id)}
                                            title="Delete"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => handleDownloadPDF(letter)}
                                            disabled={downloadingId === letter.id}
                                            title="Download PDF"
                                        >
                                            {downloadingId === letter.id ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Gen...
                                                </>
                                            ) : (
                                                <i className="bi bi-download"></i>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && selectedLetter && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowPreview(false);
                    }}
                >
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Increment Letter Preview - {selectedLetter.employee_name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowPreview(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <LetterPreview letter={selectedLetter} />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowPreview(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.print()}
                                >
                                    Print
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        handleDownloadPDF(selectedLetter);
                                        setShowPreview(false);
                                    }}
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LetterList;