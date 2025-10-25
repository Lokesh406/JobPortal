import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery, locationFilter, industryFilter, salaryFilter} = useSelector(store=>store.job);

    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                let url = `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`;

                if (locationFilter) {
                    url += `&location=${locationFilter}`;
                }
                if (industryFilter) {
                    url += `&industry=${industryFilter}`;
                }
                if (salaryFilter.min > 0) {
                    url += `&salaryMin=${salaryFilter.min}`;
                }
                if (salaryFilter.max < Number.MAX_VALUE) {
                    url += `&salaryMax=${salaryFilter.max}`;
                }

                const res = await axios.get(url, {withCredentials:true});
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [searchedQuery, locationFilter, industryFilter, salaryFilter])
}

export default useGetAllJobs