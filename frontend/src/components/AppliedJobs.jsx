import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const AppliedJobs = () => {
    useGetAppliedJobs();
    const navigate = useNavigate();
    const { allAppliedJobs } = useSelector(store => store.job);

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='font-bold text-2xl'>Applied Jobs</h1>
                    <Button onClick={() => navigate('/browse')} variant="outline">
                        Browse More Jobs
                    </Button>
                </div>

                {allAppliedJobs.length === 0 ? (
                    <div className='text-center py-10'>
                        <h2 className='text-xl font-semibold text-gray-600 mb-4'>No Applications Yet</h2>
                        <p className='text-gray-500 mb-6'>You haven't applied to any jobs yet. Start exploring opportunities!</p>
                        <Button onClick={() => navigate('/browse')}>
                            Browse Jobs
                        </Button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {allAppliedJobs.map((application) => (
                            <div key={application._id} className='p-6 border border-gray-200 rounded-lg shadow-md bg-white'>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='flex items-center gap-3'>
                                        <img
                                            src={application.job?.company?.logo}
                                            alt={application.job?.company?.name}
                                            className='w-12 h-12 rounded-full object-cover'
                                        />
                                        <div>
                                            <h3 className='font-semibold text-lg'>{application.job?.title}</h3>
                                            <p className='text-gray-600'>{application.job?.company?.name}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(application.status)}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </Badge>
                                </div>

                                <div className='space-y-2 mb-4'>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Applied:</span> {new Date(application.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Location:</span> {application.job?.location}
                                    </p>
                                    <p className='text-sm text-gray-600'>
                                        <span className='font-medium'>Salary:</span> ₹{application.job?.salaryRange?.min}L - ₹{application.job?.salaryRange?.max}L
                                    </p>
                                </div>

                                {application.status === 'accepted' && (
                                    <div className='bg-green-50 border border-green-200 rounded-md p-3 mb-4'>
                                        <p className='text-green-800 text-sm font-medium'>
                                            🎉 Congratulations! Your application has been accepted.
                                        </p>
                                    </div>
                                )}

                                {application.status === 'rejected' && (
                                    <div className='bg-red-50 border border-red-200 rounded-md p-3 mb-4'>
                                        <p className='text-red-800 text-sm font-medium'>
                                            We appreciate your interest, but this position wasn't the right fit.
                                        </p>
                                    </div>
                                )}

                                <div className='flex gap-2'>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/description/${application.job?._id}`)}
                                        className="flex-1"
                                    >
                                        View Job
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate('/profile')}
                                        className="flex-1"
                                    >
                                        Update Profile
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppliedJobs
