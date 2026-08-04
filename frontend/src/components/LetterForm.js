import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLetter, createLetter, updateLetter } from '../services/api';
import { formatIndianCurrency } from '../utils/numberFormatter';

function LetterForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        employee_type: 'office',
        employee_name: '',
        employee_id: '',
        designation: '',
        promotion_designation: '',
        letter_date: new Date().toISOString().split('T')[0],
        effective_date: new Date().toISOString().split('T')[0],
        ref_no: '',
        gross_a_revised_salary: '',
        retention_bonus_annual: '',
        telephone_allowance: '',
        pf_employer: '',
        food_allowance: '',
        pf_employee: '',
        professional_tax: '',
        insurance_premium: '',
        meal_card_deduction: '',
        // Variable Pay fields
        variable_pay_fy2026_27: '',
        variable_pay_fy2025_26: '',
    });

    const [calculated, setCalculated] = useState({
        basic_salary: 0,
        hra: 0,
        special_allowance: 0,
        gratuity_provision: 0,
        gross_a_monthly: 0,
        gross_a_annual: 0,
        gross_b_monthly: 0,
        gross_b_annual: 0,
        total_deductions_monthly: 0,
        total_deductions_annual: 0,
        net_pay_monthly: 0,
        net_pay_annual: 0,
        total_ctc: 0,
    });

    useEffect(() => {
        if (id) {
            loadLetter();
        }
    }, [id]);

    const loadLetter = async () => {
        try {
            const response = await getLetter(id);
            setFormData(response.data);
            calculateValues(response.data);
        } catch (error) {
            console.error('Error loading letter:', error);
        }
    };

    const calculateValues = (data) => {
        const grossA = parseFloat(data.gross_a_revised_salary) || 0;
        const basic = grossA * 0.4;
        const hra = basic / 2;
        const special = basic;
        const gratuity = (basic * 15 / 26) / 12;
        
        const retentionMonthly = (parseFloat(data.retention_bonus_annual) || 0) / 12;
        const grossBMonthly = retentionMonthly + 
                           (parseFloat(data.telephone_allowance) || 0) + 
                           (parseFloat(data.pf_employer) || 0) + 
                           (parseFloat(data.food_allowance) || 0) + 
                           gratuity;
        
        const deductionsMonthly = (parseFloat(data.pf_employee) || 0) + 
                                (parseFloat(data.professional_tax) || 0) + 
                                (parseFloat(data.insurance_premium) || 0) + 
                                (parseFloat(data.meal_card_deduction) || 0);
        
        const grossAMonthly = basic + hra + special;
        const grossAAnnual = grossAMonthly * 12;
        const grossBAnnual = grossBMonthly * 12;
        const deductionsAnnual = deductionsMonthly * 12;
        const netPayMonthly = grossAMonthly - deductionsMonthly;
        const netPayAnnual = netPayMonthly * 12;
        const totalCTC = grossAAnnual + grossBAnnual;

        setCalculated({
            basic_salary: basic,
            hra: hra,
            special_allowance: special,
            gratuity_provision: gratuity,
            gross_a_monthly: grossAMonthly,
            gross_a_annual: grossAAnnual,
            gross_b_monthly: grossBMonthly,
            gross_b_annual: grossBAnnual,
            total_deductions_monthly: deductionsMonthly,
            total_deductions_annual: deductionsAnnual,
            net_pay_monthly: netPayMonthly,
            net_pay_annual: netPayAnnual,
            total_ctc: totalCTC,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...formData, [name]: value };
        setFormData(newData);
        
        // Recalculate whenever any numeric field changes
        if (['gross_a_revised_salary', 'retention_bonus_annual', 'telephone_allowance', 
             'pf_employer', 'food_allowance', 'pf_employee', 'professional_tax', 
             'insurance_premium', 'meal_card_deduction', 'variable_pay_fy2026_27',
             'variable_pay_fy2025_26'].includes(name)) {
            calculateValues(newData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare data - remove calculated fields as they'll be auto-calculated
            const submitData = { ...formData };
            if (id) {
                await updateLetter(id, submitData);
            } else {
                await createLetter(submitData);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving letter:', error);
            alert('Failed to save letter');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">{id ? 'Edit' : 'Create'} Increment Letter</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="text-primary">Employee Information</h5>
                        <div className="mb-3">
                            <label className="form-label">Employee Type *</label>
                            <select 
                                name="employee_type" 
                                className="form-select" 
                                value={formData.employee_type} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="office">Office Staff</option>
                                <option value="site">Site Employee</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Employee Name *</label>
                            <input 
                                type="text" 
                                name="employee_name" 
                                className="form-control" 
                                value={formData.employee_name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Employee ID *</label>
                            <input 
                                type="text" 
                                name="employee_id" 
                                className="form-control" 
                                value={formData.employee_id} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Current Designation *</label>
                            <input 
                                type="text" 
                                name="designation" 
                                className="form-control" 
                                value={formData.designation} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Promotion Designation</label>
                            <input 
                                type="text" 
                                name="promotion_designation" 
                                className="form-control" 
                                value={formData.promotion_designation} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Letter Date</label>
                            <input 
                                type="date" 
                                name="letter_date" 
                                className="form-control" 
                                value={formData.letter_date} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Effective Date</label>
                            <input 
                                type="date" 
                                name="effective_date" 
                                className="form-control" 
                                value={formData.effective_date} 
                                onChange={handleChange} 
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Reference No. (Auto-generated if left blank)</label>
                            <input 
                                type="text" 
                                name="ref_no" 
                                className="form-control" 
                                value={formData.ref_no} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h5 className="text-primary">Salary Components</h5>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold text-primary">Gross A / Revised Salary *</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="form-control" 
                                name="gross_a_revised_salary" 
                                value={formData.gross_a_revised_salary} 
                                onChange={handleChange} 
                                required 
                            />
                            <small className="text-muted">This will auto-calculate Basic, HRA, and Special Allowance</small>
                        </div>

                        <div className="card bg-light mb-3">
                            <div className="card-body">
                                <h6 className="text-primary">Auto-Calculated from Gross A:</h6>
                                <div className="row mb-1">
                                    <div className="col-6">Basic Salary (40%)</div>
                                    <div className="col-6 text-end">{formatIndianCurrency(calculated.basic_salary)}</div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col-6">HRA (50% of Basic)</div>
                                    <div className="col-6 text-end">{formatIndianCurrency(calculated.hra)}</div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col-6">Special Allowance</div>
                                    <div className="col-6 text-end">{formatIndianCurrency(calculated.special_allowance)}</div>
                                </div>
                                <div className="row mb-1">
                                    <div className="col-6">Gratuity ((Basic × 15/26)/12)</div>
                                    <div className="col-6 text-end">{formatIndianCurrency(calculated.gratuity_provision)}</div>
                                </div>
                                <hr />
                                <div className="row fw-bold">
                                    <div className="col-6">Gross A (Monthly)</div>
                                    <div className="col-6 text-end text-primary">{formatIndianCurrency(calculated.gross_a_monthly)}</div>
                                </div>
                                <div className="row fw-bold">
                                    <div className="col-6">Gross A (Annual)</div>
                                    <div className="col-6 text-end text-primary">{formatIndianCurrency(calculated.gross_a_annual)}</div>
                                </div>
                            </div>
                        </div>

                        <h6 className="text-success mt-3">Gross B Components</h6>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Retention Bonus (Annual)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="retention_bonus_annual" 
                                    value={formData.retention_bonus_annual} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Telephone Allowance (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="telephone_allowance" 
                                    value={formData.telephone_allowance} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">PF Employer (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="pf_employer" 
                                    value={formData.pf_employer} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Food Allowance (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="food_allowance" 
                                    value={formData.food_allowance} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="row fw-bold text-success">
                            <div className="col-6">Gross B (Monthly)</div>
                            <div className="col-6 text-end">{formatIndianCurrency(calculated.gross_b_monthly)}</div>
                        </div>
                        <div className="row fw-bold text-success">
                            <div className="col-6">Gross B (Annual)</div>
                            <div className="col-6 text-end">{formatIndianCurrency(calculated.gross_b_annual)}</div>
                        </div>

                        <h6 className="text-danger mt-3">Deductions</h6>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">PF Employee (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="pf_employee" 
                                    value={formData.pf_employee} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Professional Tax (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="professional_tax" 
                                    value={formData.professional_tax} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Insurance Premium (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="insurance_premium" 
                                    value={formData.insurance_premium} 
                                    onChange={handleChange} 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Meal Card Deduction (Monthly)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="meal_card_deduction" 
                                    value={formData.meal_card_deduction} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="row fw-bold text-danger">
                            <div className="col-6">Total Deductions (Monthly)</div>
                            <div className="col-6 text-end">{formatIndianCurrency(calculated.total_deductions_monthly)}</div>
                        </div>
                        <div className="row fw-bold text-danger">
                            <div className="col-6">Total Deductions (Annual)</div>
                            <div className="col-6 text-end">{formatIndianCurrency(calculated.total_deductions_annual)}</div>
                        </div>

                        <h6 className="text-info mt-3">Variable Pay (Annual)</h6>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Variable Pay FY 2026-27</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="variable_pay_fy2026_27" 
                                    value={formData.variable_pay_fy2026_27} 
                                    onChange={handleChange} 
                                    placeholder="e.g., 75000"
                                />
                                <small className="text-muted">Payable in April 2027</small>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Variable Pay FY 2025-26</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    className="form-control" 
                                    name="variable_pay_fy2025_26" 
                                    value={formData.variable_pay_fy2025_26} 
                                    onChange={handleChange} 
                                    placeholder="e.g., 60000"
                                />
                                <small className="text-muted">Payable in April 2026</small>
                            </div>
                        </div>

                        <hr />
                        <div className="row fw-bold">
                            <div className="col-6">Net Pay (Monthly)</div>
                            <div className="col-6 text-end text-primary">{formatIndianCurrency(calculated.net_pay_monthly)}</div>
                        </div>
                        <div className="row fw-bold">
                            <div className="col-6">Net Pay (Annual)</div>
                            <div className="col-6 text-end text-primary">{formatIndianCurrency(calculated.net_pay_annual)}</div>
                        </div>
                        <div className="row fw-bold">
                            <div className="col-6">Total CTC (Annual)</div>
                            <div className="col-6 text-end text-success">{formatIndianCurrency(calculated.total_ctc)}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Letter'
                        )}
                    </button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LetterForm;