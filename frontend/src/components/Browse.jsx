import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery, setLocationFilter, setIndustryFilter, setSalaryFilter } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    const [salaryMin, setSalaryMin] = useState(0);
    const [salaryMax, setSalaryMax] = useState(Number.MAX_VALUE);

    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
            dispatch(setLocationFilter(""));
            dispatch(setIndustryFilter(""));
            dispatch(setSalaryFilter({ min: 0, max: Number.MAX_VALUE }));
        }
    },[])

    const handleLocationFilter = (value) => {
        dispatch(setLocationFilter(value === "all" ? "" : value));
    }

    const handleIndustryFilter = (value) => {
        dispatch(setIndustryFilter(value === "all" ? "" : value));
    }

    const handleSalaryChange = () => {
        dispatch(setSalaryFilter({ min: salaryMin, max: salaryMax }));
    }

    const clearFilters = () => {
        dispatch(setLocationFilter(""));
        dispatch(setIndustryFilter(""));
        dispatch(setSalaryFilter({ min: 0, max: Number.MAX_VALUE }));
        setSalaryMin(0);
        setSalaryMax(Number.MAX_VALUE);
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex flex-col lg:flex-row gap-4 mb-6'>
                    <div className='flex-1'>
                        <h1 className='font-bold text-xl mb-4'>Filter Jobs</h1>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            <div>
                                <label className='block text-sm font-medium mb-2'>Location</label>
                                <Select onValueChange={handleLocationFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Locations" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            <SelectItem value="delhi ncr">Delhi NCR</SelectItem>
                                            <SelectItem value="bangalore">Bangalore</SelectItem>
                                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                                            <SelectItem value="pune">Pune</SelectItem>
                                            <SelectItem value="mumbai">Mumbai</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-2'>Industry</label>
                                <Select onValueChange={handleIndustryFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Industries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="all">All Industries</SelectItem>
                                            <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                                            <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                                            <SelectItem value="FullStack Developer">FullStack Developer</SelectItem>
                                            <SelectItem value="Data Science">Data Science</SelectItem>
                                            <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                                            <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                                            <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
                                            <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                                            <SelectItem value="Product Manager">Product Manager</SelectItem>
                                            <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-2'>Min Salary (LPA)</label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={salaryMin}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (!isNaN(value) && value >= 0) {
                                            setSalaryMin(value);
                                            handleSalaryChange();
                                        } else if (e.target.value === '') {
                                            setSalaryMin(0);
                                            handleSalaryChange();
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-2'>Max Salary (LPA)</label>
                                <Input
                                    type="number"
                                    placeholder="No limit"
                                    value={salaryMax === Number.MAX_VALUE ? '' : salaryMax}
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setSalaryMax(Number.MAX_VALUE);
                                            handleSalaryChange();
                                        } else {
                                            const value = Number(e.target.value);
                                            if (!isNaN(value) && value > 0) {
                                                setSalaryMax(value);
                                                handleSalaryChange();
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <Button onClick={clearFilters} variant="outline" className="mt-4">
                            Clear Filters
                        </Button>
                    </div>
                </div>

                <h1 className='font-bold text-xl my-10'>Search Results ({allJobs.length})</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                        allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse