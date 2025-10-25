import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const ApplyJob = () => {
    const [loading, setLoading] = useState(false);
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        experience: '',
        skills: '',
        education: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        expectedSalary: '',
        availabilityDate: '',
        additionalInfo: '',
        resumeLink: ''
    });

    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const { user } = useSelector(store => store.auth);

    const changeHandler = (e) => {
        setApplicationData({ ...applicationData, [e.target.name]: e.target.value });
    }

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            toast.error("Please login to apply for jobs");
            navigate("/login");
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!user) {
            toast.error("Please login to apply for jobs");
            navigate("/login");
            return;
        }

        if (!applicationData.coverLetter.trim()) {
            toast.error("Cover letter is required");
            return;
        }

        if (!applicationData.resumeLink.trim()) {
            toast.error("Resume link is required");
            return;
        }

        try {
            setLoading(true);

            // Send application data as JSON
            const payload = {
                resumeLink: applicationData.resumeLink,
                coverLetter: applicationData.coverLetter,
                experience: applicationData.experience,
                skills: applicationData.skills,
                education: applicationData.education,
                phone: applicationData.phone,
                linkedin: applicationData.linkedin,
                portfolio: applicationData.portfolio,
                expectedSalary: applicationData.expectedSalary,
                availabilityDate: applicationData.availabilityDate,
                additionalInfo: applicationData.additionalInfo
            };

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                payload,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/applied-jobs");
            }
        } catch (error) {
            console.error('Application error:', error);
            if (error.response?.status === 401) {
                toast.error("Please login to apply for jobs");
                navigate("/login");
            } else if (error.response?.status === 400) {
                toast.error(error.response.data.message || "You have already applied for this job");
            } else {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-10'>
                <form onSubmit={submitHandler} className='w-full max-w-4xl border border-gray-200 shadow-lg rounded-lg p-8 bg-white'>
                    <div className='mb-8 text-center'>
                        <h1 className='font-bold text-3xl text-gray-900'>Apply for Job</h1>
                        <p className='text-gray-600 mt-2'>Submit your application with cover letter and resume link</p>
                    </div>

                    {/* Essential Fields - Resume & Cover Letter */}
                    <div className='bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200'>
                        <h3 className='text-lg font-semibold text-blue-900 mb-4'>📋 Essential Information (Required)</h3>

                        {/* Resume Link */}
                        <div className='mb-6'>
                            <Label htmlFor="resumeLink" className="text-base font-semibold text-gray-800">Resume Link (Google Drive) *</Label>
                            <Input
                                id="resumeLink"
                                name="resumeLink"
                                type="url"
                                value={applicationData.resumeLink}
                                onChange={changeHandler}
                                placeholder="https://drive.google.com/file/d/..."
                                className="mt-2 h-12 text-base"
                                required
                            />
                            <p className="text-sm text-gray-600 mt-2 flex items-start gap-2">
                                <span className="text-blue-600">💡</span>
                                <span>Paste your Google Drive resume link. Make sure it's set to <strong>"Anyone with the link can view"</strong></span>
                            </p>
                        </div>

                        {/* Cover Letter */}
                        <div className='mb-4'>
                            <Label htmlFor="coverLetter" className="text-base font-semibold text-gray-800">Cover Letter *</Label>
                            <Textarea
                                id="coverLetter"
                                name="coverLetter"
                                value={applicationData.coverLetter}
                                onChange={changeHandler}
                                placeholder="Write a brief cover letter explaining why you're interested in this position and why you'd be a great fit..."
                                className="mt-2 text-base min-h-[150px]"
                                rows={6}
                                required
                            />
                            <p className="text-sm text-gray-600 mt-2">
                                Tell us why you're the perfect candidate for this role
                            </p>
                        </div>
                    </div>

                    {/* Additional Information - Optional Fields */}
                    <div className='bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>📝 Additional Information (Optional)</h3>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <Label htmlFor="experience">Experience</Label>
                                <Textarea
                                    id="experience"
                                    name="experience"
                                    value={applicationData.experience}
                                    onChange={changeHandler}
                                    placeholder="Describe your relevant work experience..."
                                    className="mt-1 text-base"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="skills">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={applicationData.skills}
                                    onChange={changeHandler}
                                    placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="education">Education</Label>
                                <Input
                                    id="education"
                                    name="education"
                                    value={applicationData.education}
                                    onChange={changeHandler}
                                    placeholder="e.g., B.Tech Computer Science"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={applicationData.phone}
                                    onChange={changeHandler}
                                    placeholder="Enter your phone number"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    value={applicationData.linkedin}
                                    onChange={changeHandler}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="portfolio">Portfolio/GitHub</Label>
                                <Input
                                    id="portfolio"
                                    name="portfolio"
                                    value={applicationData.portfolio}
                                    onChange={changeHandler}
                                    placeholder="https://github.com/yourusername"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="expectedSalary">Expected Salary (LPA)</Label>
                                <Input
                                    id="expectedSalary"
                                    name="expectedSalary"
                                    type="number"
                                    value={applicationData.expectedSalary}
                                    onChange={changeHandler}
                                    placeholder="Enter expected salary"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="availabilityDate">Availability Date</Label>
                                <Input
                                    id="availabilityDate"
                                    name="availabilityDate"
                                    type="date"
                                    value={applicationData.availabilityDate}
                                    onChange={changeHandler}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className='mt-6'>
                            <Label htmlFor="additionalInfo">Additional Information</Label>
                            <Textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={applicationData.additionalInfo}
                                onChange={changeHandler}
                                placeholder="Any additional information you'd like to share..."
                                className="mt-1 text-base"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className='flex items-center gap-4 mt-6'>
                        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        {
                            loading ? (
                                <Button className="flex-1" disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Submitting Application...
                                </Button>
                            ) : (
                                <Button type="submit" className="flex-1">
                                    Submit Application
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplyJob
