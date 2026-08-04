import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { importCSV } from '../services/api';
import * as XLSX from 'xlsx';

function ImportCSV() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setErrors([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        setLoading(true);
        try {
            const response = await importCSV(file);
            setMessage(response.data.message);
            if (response.data.errors && response.data.errors.length) {
                setErrors(response.data.errors);
                console.error('Import errors:', response.data.errors);
            }
            if (response.data.message.includes('Successfully')) {
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            setMessage('Error importing file: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                employee_type: 'office',
                employee_name: 'John Doe',
                employee_id: 'EMP001',
                designation: 'Software Engineer',
                promotion_designation: 'Senior Software Engineer',
                letter_date: '2026-04-20',
                effective_date: '2026-04-01',
                gross_a_revised_salary: 100000,
                retention_bonus_annual: 50000,
                telephone_allowance: 2000,
                pf_employer: 5000,
                food_allowance: 1000,
                pf_employee: 5000,
                professional_tax: 200,
                insurance_premium: 500,
                meal_card_deduction: 1000,
                variable_pay_fy2026_27: 75000,
                variable_pay_fy2025_26: 60000,
            }
        ];
        
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'increment_letter_template.xlsx');
    };

    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title mb-4">Import Increment Letters from CSV/Excel</h3>
                
                <button className="btn btn-info mb-4" onClick={downloadTemplate}>
                    <i className="bi bi-download"></i> Download Excel Template
                </button>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Select CSV or Excel File</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            accept=".csv,.xlsx,.xls" 
                            onChange={handleFileChange} 
                        />
                        <div className="form-text">
                            Upload a file with columns matching the template format.
                            <br />
                            <strong>Note:</strong> Basic Salary, HRA, Special Allowance, and Gratuity will be auto-calculated.
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Importing...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-upload me-2"></i>
                                Import
                            </>
                        )}
                    </button>
                    
                    {message && (
                        <div className={`alert ${message.includes('Successfully') ? 'alert-success' : 'alert-danger'} mt-3`}>
                            {message}
                        </div>
                    )}
                    
                    {errors.length > 0 && (
                        <div className="alert alert-warning mt-3">
                            <h6>Import Errors:</h6>
                            <ul className="mb-0">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </form>
                
                <div className="mt-4">
                    <h5>Instructions:</h5>
                    <ul>
                        <li>Download the template to see the required columns</li>
                        <li><strong>User Input Fields:</strong>
                            <ul>
                                <li><code>gross_a_revised_salary</code> - Gross A / Revised Salary</li>
                                <li><code>retention_bonus_annual</code> - Retention Bonus (Annual)</li>
                                <li><code>telephone_allowance</code> - Telephone Allowance (Monthly)</li>
                                <li><code>pf_employer</code> - PF Employer (Monthly)</li>
                                <li><code>food_allowance</code> - Food Allowance (Monthly)</li>
                                <li><code>pf_employee</code> - PF Employee (Monthly)</li>
                                <li><code>professional_tax</code> - Professional Tax (Monthly)</li>
                                <li><code>insurance_premium</code> - Insurance Premium (Monthly)</li>
                                <li><code>meal_card_deduction</code> - Meal Card Deduction (Monthly)</li>
                                <li><code>variable_pay_fy2026_27</code> - Variable Pay FY 2026-27 (Annual)</li>
                                <li><code>variable_pay_fy2025_26</code> - Variable Pay FY 2025-26 (Annual)</li>
                            </ul>
                        </li>
                        <li><strong>Auto-Calculated Fields:</strong>
                            <ul>
                                <li><code>basic_salary</code> = 40% of Gross A</li>
                                <li><code>hra</code> = 50% of Basic Salary</li>
                                <li><code>special_allowance</code> = Basic Salary</li>
                                <li><code>gratuity_provision</code> = (Basic × 15/26)/12 (Monthly)</li>
                            </ul>
                        </li>
                        <li>For Site Employees, set <code>employee_type = 'site'</code></li>
                        <li>All monetary values should be in Indian Rupees (₹)</li>
                        <li>Dates should be in YYYY-MM-DD format</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ImportCSV;