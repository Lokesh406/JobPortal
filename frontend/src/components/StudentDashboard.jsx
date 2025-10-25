import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import {
    Contact,
    Mail,
    Pen,
    Briefcase,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    Eye,
    Calendar,
    MapPin,
    DollarSign,
    Trash2
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import UpdateProfileDialog from './UpdateProfileDialog'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const StudentDashboard = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Calculate application statistics
    const totalApplications = allAppliedJobs.length;
    const pendingApplications = allAppliedJobs.filter(job => job.status === 'pending').length;
    const acceptedApplications = allAppliedJobs.filter(job => job.status === 'accepted').length;
    const rejectedApplications = allAppliedJobs.filter(job => job.status === 'rejected').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: Are you sure you want to delete your account?\n\nThis will permanently delete:\n• Your profile information\n• All your job applications\n• All saved data\n\nThis action CANNOT be undone!'
        );
        
        if (confirmed) {
            try {
                const res = await axios.delete(`${USER_API_END_POINT}/profile/delete`, {
                    withCredentials: true
                });
                
                if (res.data.success) {
                    toast.success(res.data.message);
                    dispatch(setUser(null)); // Clear user from Redux
                    navigate('/signup');
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || 'Failed to delete account');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                                    alt="profile"
                                />
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.fullname}</h1>
                                <p className="text-gray-600">{user?.profile?.bio || "Software Developer"}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Contact className="h-4 w-4" />
                                        <span>{user?.phoneNumber || "Not provided"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center gap-2">
                            <Pen className="h-4 w-4" />
                            Update Profile
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalApplications}</div>
                            <p className="text-xs text-muted-foreground">
                                Jobs you've applied to
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{pendingApplications}</div>
                            <p className="text-xs text-muted-foreground">
                                Under review
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{acceptedApplications}</div>
                            <p className="text-xs text-muted-foreground">
                                Congratulations!
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Acceptance rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Applications */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Recent Applications
                                </CardTitle>
                                <CardDescription>
                                    Your latest job applications and their status
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {totalApplications === 0 ? (
                                    <div className="text-center py-8">
                                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No applications yet
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            Start applying to jobs to see them here
                                        </p>
                                        <Button onClick={() => navigate('/browse')}>
                                            Browse Jobs
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {allAppliedJobs.slice(0, 5).map((application) => (
                                            <div
                                                key={application._id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Briefcase className="h-6 w-6 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">
                                                            {application.job?.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {application.job?.company?.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <MapPin className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                {application.job?.location}
                                                            </span>
                                                            <DollarSign className="h-3 w-3 text-gray-400 ml-2" />
                                                            <span className="text-xs text-gray-500">
                                                                ₹{application.job?.salaryRange?.min}L - ₹{application.job?.salaryRange?.max}L
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={`${getStatusColor(application.status)} border`}>
                                                        <div className="flex items-center gap-1">
                                                            {getStatusIcon(application.status)}
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </div>
                                                    </Badge>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/description/${application.job?._id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {totalApplications > 5 && (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => navigate('/applied-jobs')}
                                            >
                                                View All Applications ({totalApplications})
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Frequently used features
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => navigate('/browse')}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Browse Jobs
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => navigate('/profile')}
                                >
                                    <Pen className="h-4 w-4 mr-2" />
                                    Update Profile
                                </Button>
                                <Button
                                    className="w-full justify-start"
                                    variant="outline"
                                    onClick={() => navigate('/applied-jobs')}
                                >
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    View Applications
                                </Button>
                                
                                <div className="pt-3 border-t">
                                    <Button
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        variant="ghost"
                                        onClick={handleDeleteAccount}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Completion */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Status</CardTitle>
                                <CardDescription>
                                    Complete your profile to improve your chances
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Profile Completion</span>
                                        <span>75%</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    {user?.profile?.skills?.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Skills added</span>
                                        </div>
                                    )}
                                    {user?.profile?.resume && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Resume uploaded</span>
                                        </div>
                                    )}
                                    {user?.phoneNumber && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Contact info</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills Summary */}
                        {user?.profile?.skills?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Skills</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {user.profile.skills.slice(0, 6).map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                        {user.profile.skills.length > 6 && (
                                            <Badge variant="outline">
                                                +{user.profile.skills.length - 6} more
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default StudentDashboard
