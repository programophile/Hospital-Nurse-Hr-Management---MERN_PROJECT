// frontend/src/components/NurseProfile.js
import React, { useState, useEffect } from 'react';
import { fetchNurses, createNurse } from '../api';

const NurseProfile = () => {
    const [nurses, setNurses] = useState([]);
    const [name, setName] = useState('');
    const [qualifications, setQualifications] = useState('');
    const [certifications, setCertifications] = useState('');

    const loadNurses = async () => {
        const response = await fetchNurses();
        setNurses(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createNurse({ name, qualifications, certifications: certifications.split(',') });
        loadNurses();
        setName('');
        setQualifications('');
        setCertifications('');
    };

    useEffect(() => {
        loadNurses();
    }, []);

    return (
        <div>
            <h2>Nurse Profiles</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Qualifications" value={qualifications} onChange={(e) => setQualifications(e.target.value)} />
                <input type="text" placeholder="Certifications (comma separated)" value={certifications} onChange={(e) => setCertifications(e.target.value)} />
                <button type="submit">Add Nurse</button>
            </form>
            <ul>
                {nurses.map((nurse) => (
                    <li key={nurse._id}>{nurse.name} - {nurse.qualifications}</li>
                ))}
            </ul>
        </div>
    );
};

export default NurseProfile;