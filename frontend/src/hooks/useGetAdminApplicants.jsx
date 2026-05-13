import { setAllApplicants } from '@/redux/applicationSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAdminApplicants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAdminApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/admin`, { withCredentials: true });
                if (res.data.success) {
                    // Extract applications array from response
                    const applicants = res.data.applications || [];
                    dispatch(setAllApplicants(applicants));
                    console.log('Admin applicants fetched:', applicants);
                }
            } catch (error) {
                console.log('Error fetching admin applicants:', error);
            }
        }
        fetchAdminApplicants();
    }, [dispatch])
}

export default useGetAdminApplicants
