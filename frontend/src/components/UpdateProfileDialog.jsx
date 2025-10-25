import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { Loader2, Camera } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.map(skill => skill) || "",
        resumeLink: user?.profile?.resume || "",
        profilePhoto: null
    });
    
    const [photoPreview, setPhotoPreview] = useState(user?.profile?.profilePhoto || "");
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const photoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file });
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("resumeLink", input.resumeLink);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            setLoading(false);
        }
        setOpen(false);
        console.log(input);
    }



    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-5 py-4'>
                            {/* Profile Photo Upload */}
                            <div className='flex flex-col items-center gap-4 pb-4 border-b border-gray-200'>
                                <Avatar className="h-28 w-28 border-4 border-gray-100 shadow-md">
                                    <AvatarImage src={photoPreview || 'https://via.placeholder.com/150'} alt="Profile" />
                                </Avatar>
                                <div className='flex flex-col items-center gap-2'>
                                    <Label htmlFor="profilePhoto" className="cursor-pointer">
                                        <div className='flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-lg transition-all duration-200 shadow-sm hover:shadow'>
                                            <Camera className="h-4 w-4 text-gray-700" />
                                            <span className='text-sm font-medium text-gray-700'>Change Photo</span>
                                        </div>
                                    </Label>
                                    <Input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        onChange={photoChangeHandler}
                                        className="hidden"
                                    />
                                    <p className='text-xs text-gray-500'>JPG, PNG or GIF (Max 5MB)</p>
                                </div>
                            </div>
                            
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right font-medium">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your full name"
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="your.email@example.com"
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right font-medium">Phone</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    placeholder="+91 1234567890"
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right font-medium">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    placeholder="Tell us about yourself"
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right font-medium">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    placeholder="React, Node.js, Python (comma separated)"
                                    className="col-span-3"
                                />
                            </div>
                            
                            <div className='border-t border-gray-200 pt-4'>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="resumeLink" className="text-right font-medium">Resume</Label>
                                    <Input
                                        id="resumeLink"
                                        name="resumeLink"
                                        type="url"
                                        value={input.resumeLink}
                                        onChange={changeEventHandler}
                                        placeholder="https://drive.google.com/file/d/..."
                                        className="col-span-3"
                                    />
                                </div>
                                <div className='grid grid-cols-4 gap-4 mt-1'>
                                    <div className='col-start-2 col-span-3'>
                                        <p className='text-xs text-gray-500 leading-relaxed'>
                                            💡 Paste your Google Drive link (ensure it's set to "Anyone with the link can view")
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-2">
                            {
                                loading ? (
                                    <Button className="w-full" disabled>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Updating Profile...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                                        Update Profile
                                    </Button>
                                )
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog