import React, { useState } from 'react';
import { downloadPayslip } from '../api';
import { useNavigate } from 'react-router-dom';
import './PayslipDownload.css';

const PayslipDownload = () => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDownload = async (e) => {
        e.preventDefault();
        
        if (!month || !year) {
            setError('Please select both month and year');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser._id) {
                navigate('/login');
                return;
            }
            console.log("working")

            const response = await downloadPayslip(storedUser._id, month, year);

            // Create a blob URL for the PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payslip_${month}_${year}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error('Error downloading payslip:', error);
            setError('Failed to download payslip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payslip-container">
            <h2>Download Payslip</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleDownload}>
                <div className="form-group">
                    <label>Month:</label>
                    <select 
                        value={month} 
                        onChange={(e) => setMonth(e.target.value)}
                        required
                    >
                        <option value="">Select Month</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Year:</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min="2000"
                        max={new Date().getFullYear()}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Downloading...' : 'Download Payslip'}
                </button>
            </form>
        </div>
    );
};

export default PayslipDownload;
