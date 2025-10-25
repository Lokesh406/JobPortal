import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { toast } from 'sonner';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {applicants} = useSelector(store=>store.application);
    const {user} = useSelector(store=>store.auth);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                // Set axios defaults for credentials
                axios.defaults.withCredentials = true;
                
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (res.data.success) {
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (error) {
                console.error('Error fetching applicants:', error);
                if (error.response?.status === 401) {
                    toast.error('Please login to view applicants');
                    navigate('/login');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to fetch applicants');
                }
            }
        }
        
        // Only fetch if user is logged in and is a recruiter
        if (user && user.role === 'recruiter') {
            fetchAllApplicants();
        } else if (!user) {
            toast.error('Please login as recruiter to view applicants');
            navigate('/login');
        }
    }, [params.id, user]);
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length}</h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants