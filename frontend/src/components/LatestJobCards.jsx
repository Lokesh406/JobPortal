import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Bookmark, BookmarkCheck } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { savedJobs = [] } = useSelector(store => store.auth);
    const isSaved = savedJobs.includes(job._id);

    const handleSave = async (e) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/save-job/${job._id}`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save job');
        }
    }

    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer relative'>
            <div className='absolute top-2 right-2'>
                <button onClick={handleSave} className='text-gray-500 hover:text-blue-600'>
                    {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                </button>
            </div>
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>India</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards