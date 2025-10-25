import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Eye, Download, Mail, Phone, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
    const [currentResumeUrl, setCurrentResumeUrl] = useState('');
    const [currentApplicantName, setCurrentApplicantName] = useState('');

    // Handle opening Google Drive resume link
    const handleOpenResume = (resumeLink, applicantName) => {
        if (!resumeLink) {
            toast.error('No resume link available for this applicant');
            return;
        }
        
        // Open Google Drive link in new tab
        window.open(resumeLink, '_blank', 'noopener,noreferrer');
        toast.success(`Opening resume for ${applicantName}...`);
    };

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

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
            <Table>
                <TableCaption>A list of applicants for this job</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Expected Salary</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || item?.phone || 'N/A'}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item?.skills?.slice(0, 3)?.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {item?.skills?.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{item.skills.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {item?.expectedSalary ? `₹${item.expectedSalary}L` : 'Not specified'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(item?.status)}>
                                        {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(item?.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        {item?.resume && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleOpenResume(item?.resume, item?.applicant?.fullname)}
                                                title="Open Resume Link"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Application Details - {item?.applicant?.fullname}</DialogTitle>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Application ID: {item?._id}
                                                    </p>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <h4 className="font-semibold">Personal Information</h4>
                                                            <p><strong>Name:</strong> {item?.applicant?.fullname}</p>
                                                            <p><strong>Email:</strong> {item?.applicant?.email}</p>
                                                            <p><strong>Phone:</strong> {item?.phone || item?.applicant?.phoneNumber || 'N/A'}</p>
                                                            <p><strong>Education:</strong> {item?.education || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold">Application Details</h4>
                                                            <p><strong>Applied Date:</strong> {new Date(item?.createdAt).toLocaleDateString()}</p>
                                                            <p><strong>Expected Salary:</strong> {item?.expectedSalary ? `₹${item.expectedSalary}L` : 'Not specified'}</p>
                                                            <p><strong>Availability:</strong> {item?.availabilityDate ? new Date(item.availabilityDate).toLocaleDateString() : 'Not specified'}</p>
                                                            <p><strong>Status:</strong>
                                                                <Badge className={getStatusColor(item?.status)} ml-2>
                                                                    {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
                                                                </Badge>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold">Cover Letter</h4>
                                                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                                                            {item?.coverLetter || 'No cover letter provided'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold">Experience</h4>
                                                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                                                            {item?.experience || 'No experience details provided'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold">Skills</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item?.skills?.map((skill, index) => (
                                                                <Badge key={index} variant="secondary">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold">Additional Information</h4>
                                                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                                                            {item?.additionalInfo || 'No additional information provided'}
                                                        </p>
                                                    </div>

                                                    {/* Resume Section */}
                                                    <div className="border-t pt-4">
                                                        <h4 className="font-semibold mb-2">Resume Link</h4>
                                                        {item?.resume ? (
                                                            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                                                                <div className="flex items-start gap-2">
                                                                    <Badge variant="outline" className="bg-white">
                                                                        Link Provided
                                                                    </Badge>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium">
                                                                            Resume provided by: <span className="text-blue-600">{item?.applicant?.fullname}</span>
                                                                        </p>
                                                                        <p className="text-xs text-gray-600 mt-1">
                                                                            Email: {item?.applicant?.email}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 mt-1 break-all">
                                                                            Link: <a href={item?.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item?.resume}</a>
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Submitted on: {new Date(item?.createdAt).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        onClick={() => handleOpenResume(item?.resume, item?.applicant?.fullname)}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-1" />
                                                                        Open Resume Link
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">No resume uploaded</p>
                                                        )}
                                                        {item?.linkedin && (
                                                            <Button variant="outline" asChild>
                                                                <a href={item?.linkedin} target="_blank" rel="noopener noreferrer">
                                                                    LinkedIn Profile
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {item?.portfolio && (
                                                            <Button variant="outline" asChild>
                                                                <a href={item?.portfolio} target="_blank" rel="noopener noreferrer">
                                                                    Portfolio
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                {
                                                    shortlistingStatus.map((status, index) => {
                                                        return (
                                                            <div
                                                                onClick={() => statusHandler(status, item?._id)}
                                                                key={index}
                                                                className='flex w-fit items-center my-2 cursor-pointer hover:bg-gray-100 p-2 rounded'
                                                            >
                                                                <span>{status}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            {/* Resume Viewer Modal */}
            <Dialog open={resumeViewerOpen} onOpenChange={setResumeViewerOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Resume - {currentApplicantName}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto">
                        {currentResumeUrl ? (
                            <iframe
                                src={currentResumeUrl}
                                className="w-full h-[70vh] border-0"
                                title={`Resume of ${currentApplicantName}`}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-gray-500">Loading resume...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                        <Button 
                            variant="outline" 
                            onClick={() => window.open(currentResumeUrl, '_blank')}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Open in New Tab
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = currentResumeUrl;
                                link.download = `${currentApplicantName}_resume.pdf`;
                                link.click();
                            }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={() => setResumeViewerOpen(false)}
                            className="ml-auto"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ApplicantsTable