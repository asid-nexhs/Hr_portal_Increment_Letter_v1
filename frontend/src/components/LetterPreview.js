// LetterPreview.js
import React from 'react';
import { formatIndianCurrency } from '../utils/numberFormatter';

function LetterPreview({ letter }) {
    // Convert all numeric values (they might come as strings from API)
    const toNumber = (val) => parseFloat(val) || 0;

    const grossA = toNumber(letter.gross_a_revised_salary);
    const basicSalary = toNumber(letter.basic_salary);
    const hra = toNumber(letter.hra);
    const specialAllowance = toNumber(letter.special_allowance);
    const telephoneAllowance = toNumber(letter.telephone_allowance);
    const pfEmployer = toNumber(letter.pf_employer);
    const gratuityProvision = toNumber(letter.gratuity_provision);
    const foodAllowance = toNumber(letter.food_allowance);
    const pfEmployee = toNumber(letter.pf_employee);
    const professionalTax = toNumber(letter.professional_tax);
    const insurancePremium = toNumber(letter.insurance_premium);
    const mealCardDeduction = toNumber(letter.meal_card_deduction);
    const retentionBonusAnnual = toNumber(letter.retention_bonus_annual);
    const variablePay2627 = toNumber(letter.variable_pay_fy2026_27);
    const variablePay2526 = toNumber(letter.variable_pay_fy2025_26);

    const grossA_monthly = basicSalary + hra + specialAllowance;
    const grossA_annual = grossA_monthly * 12;
    
    const retentionMonthly = retentionBonusAnnual / 12;
    const grossB_monthly = retentionMonthly + telephoneAllowance + pfEmployer + gratuityProvision + foodAllowance;
    const grossB_annual = grossB_monthly * 12;
    
    const deductions_monthly = pfEmployee + professionalTax + insurancePremium + mealCardDeduction;
    const deductions_annual = deductions_monthly * 12;
    
    const netPay_monthly = grossA_monthly - deductions_monthly;
    const netPay_annual = netPay_monthly * 12;
    
    const totalCTC = grossA_annual + grossB_annual;

    return (
        <div className="letter-preview">
            <p className="text-end"><u>PRIVATE & CONFIDENTIAL</u></p>
            
            <p><strong>Date:</strong> {letter.letter_date}</p>
            <p><strong>Name:</strong> {letter.employee_name}</p>
            <p><strong>Employee ID:</strong> {letter.employee_id}</p>
            <p><strong>Designation:</strong> {letter.designation}</p>
            <p><strong>Ref. No.:</strong> {letter.ref_no || 'NEXHS/HRD/2026/0001'}</p>
            
            <h2 className="text-center mt-4 mb-4">Increment Letter</h2>
            
            <p>Dear <strong>{letter.employee_name}</strong>,</p>
            
            <p>As we embark on another year of excellence, we sincerely thank you for your valuable contributions and dedicated efforts towards the organization's performance during the financial year <strong>2025–26</strong>. Your commitment and consistent performance are highly appreciated.</p>
            
            <p>In recognition of your performance and continued efforts, we are pleased to inform you that your <strong>gross salary has been revised to {formatIndianCurrency(grossA)} per month</strong>, along with a <strong>Retention Bonus</strong> of {formatIndianCurrency(retentionBonusAnnual)} annually, effective from <strong>{letter.effective_date}</strong>.</p>
            
            {letter.promotion_designation && (
                <p>Additionally, in recognition of your contributions, we are pleased to inform you of your <strong>promotion</strong>, and you are hereby <strong>Promoted as "{letter.promotion_designation}"</strong>, effective from <strong>{letter.effective_date}</strong>.</p>
            )}
            
            <h4 className="mt-4">Annexure - A: Compensation Details - FY 2026-27</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Per Month (₹)</th>
                        <th>Per Annum (₹)</th>
                        <th>Taxable/Non-Taxable</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Gross A / Revised Salary</td><td>{formatIndianCurrency(grossA)}</td><td>{formatIndianCurrency(grossA * 12)}</td><td>Taxable</td></tr>
                    <tr><td>Basic Salary (40% of Gross A)</td><td>{formatIndianCurrency(basicSalary)}</td><td>{formatIndianCurrency(basicSalary * 12)}</td><td>Taxable</td></tr>
                    <tr><td>House Rent Allowance (50% of Basic)</td><td>{formatIndianCurrency(hra)}</td><td>{formatIndianCurrency(hra * 12)}</td><td>Taxable</td></tr>
                    <tr><td>Special Allowance</td><td>{formatIndianCurrency(specialAllowance)}</td><td>{formatIndianCurrency(specialAllowance * 12)}</td><td>Taxable</td></tr>
                    <tr style={{fontWeight:'bold', backgroundColor:'#e6f3ff'}}><td>Gross (A)</td><td>{formatIndianCurrency(grossA_monthly)}</td><td>{formatIndianCurrency(grossA_annual)}</td><td></td></tr>
                    
                    <tr><td>Retention Bonus</td><td>{formatIndianCurrency(retentionMonthly)}</td><td>{formatIndianCurrency(retentionBonusAnnual)}</td><td>Paid Annually</td></tr>
                    <tr><td>Telephone Allowance</td><td>{formatIndianCurrency(telephoneAllowance)}</td><td>{formatIndianCurrency(telephoneAllowance * 12)}</td><td></td></tr>
                    <tr><td>Provident Fund (Employer)</td><td>{formatIndianCurrency(pfEmployer)}</td><td>{formatIndianCurrency(pfEmployer * 12)}</td><td></td></tr>
                    <tr><td>Gratuity Provision</td><td>{formatIndianCurrency(gratuityProvision)}</td><td>{formatIndianCurrency(gratuityProvision * 12)}</td><td></td></tr>
                    <tr><td>Food Allowance</td><td>{formatIndianCurrency(foodAllowance)}</td><td>{formatIndianCurrency(foodAllowance * 12)}</td><td></td></tr>
                    <tr style={{fontWeight:'bold', backgroundColor:'#e6ffe6'}}><td>Gross (B)</td><td>{formatIndianCurrency(grossB_monthly)}</td><td>{formatIndianCurrency(grossB_annual)}</td><td></td></tr>
                    
                    <tr style={{fontWeight:'bold', backgroundColor:'#f0f0f0'}}><td>Gross TCTC (A+B)</td><td>{formatIndianCurrency(grossA_monthly + grossB_monthly)}</td><td>{formatIndianCurrency(totalCTC)}</td><td></td></tr>
                    
                    <tr><td>Provident Fund (Employee)</td><td>{formatIndianCurrency(pfEmployee)}</td><td>{formatIndianCurrency(pfEmployee * 12)}</td><td></td></tr>
                    <tr><td>Professional Tax</td><td>{formatIndianCurrency(professionalTax)}</td><td>{formatIndianCurrency(professionalTax * 12)}</td><td></td></tr>
                    <tr><td>Insurance Premium</td><td>{formatIndianCurrency(insurancePremium)}</td><td>{formatIndianCurrency(insurancePremium * 12)}</td><td></td></tr>
                    <tr><td>Meal Card Deduction</td><td>{formatIndianCurrency(mealCardDeduction)}</td><td>{formatIndianCurrency(mealCardDeduction * 12)}</td><td></td></tr>
                    <tr style={{fontWeight:'bold', backgroundColor:'#ffe6e6'}}><td>Deductions (C)</td><td>{formatIndianCurrency(deductions_monthly)}</td><td>{formatIndianCurrency(deductions_annual)}</td><td></td></tr>
                    
                    <tr style={{fontWeight:'bold', backgroundColor:'#e6f7ff'}}><td>Net Pay (A-C)</td><td>{formatIndianCurrency(netPay_monthly)}</td><td>{formatIndianCurrency(netPay_annual)}</td><td></td></tr>
                </tbody>
            </table>
            
            <h4 className="mt-4">Annexure - B: Performance Linked Variable Pay (FY 2026-27)</h4>
            <table className="table table-bordered">
                <tbody>
                    <tr><th>Particulars</th><th>Per Month (₹)</th><th>Per Annum (₹)</th></tr>
                    <tr><td>Variable Pay</td><td>{formatIndianCurrency(variablePay2627 / 12)}</td><td>{formatIndianCurrency(variablePay2627)}</td></tr>
                    <tr><td colSpan="2">Payable in April 2027</td></tr>
                </tbody>
            </table>
            
            <h4 className="mt-4">Annexure - C: Performance Linked Variable Pay (FY 2025-26)</h4>
            <table className="table table-bordered">
                <tbody>
                    <tr><th>Particulars</th><th>Per Month (₹)</th><th>Per Annum (₹)</th></tr>
                    <tr><td>Variable Pay</td><td>{formatIndianCurrency(variablePay2526 / 12)}</td><td>{formatIndianCurrency(variablePay2526)}</td></tr>
                    <tr><td colSpan="2">Payable in April 2026</td></tr>
                </tbody>
            </table>
            
            <div className="signature-section mt-5" style={{display:'flex', justifyContent:'space-between'}}>
                <div>
                    <p>For NeXHS Renewables Pvt. Ltd.,</p>
                    <p>_________________________</p>
                    <p><strong>Sudhansu Bhusan Prusty</strong></p>
                    <p>Managing Director</p>
                </div>
                <div>
                    <p>_________________________</p>
                    <p><strong>HR Manager</strong></p>
                </div>
            </div>
        </div>
    );
}

// This is the key line - make sure it's exported as default
export default LetterPreview;