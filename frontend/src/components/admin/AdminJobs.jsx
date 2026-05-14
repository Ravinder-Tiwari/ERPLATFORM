import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { removeJobFromAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import { errorToast, successToast } from '@/utils/toast'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  Eye,
  FilePlus2,
  IndianRupee,
  MapPin,
  Search,
  Sparkles,
  Trash2,
  Users,
  X
} from 'lucide-react'

const salaryRanges = [
  { label: 'Salary', value: 'all', min: 0, max: Number.POSITIVE_INFINITY },
  { label: '0 - 3 LPA', value: '0-3', min: 0, max: 3 },
  { label: '3 - 7 LPA', value: '3-7', min: 3, max: 7 },
  { label: '7 - 15 LPA', value: '7-15', min: 7, max: 15 },
  { label: '15+ LPA', value: '15+', min: 15, max: Number.POSITIVE_INFINITY }
]

const controlClassName =
  'h-11 rounded-2xl border border-gray-200 bg-white/80 px-4 text-sm text-gray-900 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100 dark:border-white/10 dark:bg-white/5 dark:text-white'

const AdminJobs = () => {
  useGetAllAdminJobs()

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { allAdminJobs } = useSelector((store) => store.job)

  const [searchValue, setSearchValue] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedSalary, setSelectedSalary] = useState('all')
  const [filteredJobs, setFilteredJobs] = useState(allAdminJobs || [])

  const companyOptions = Array.from(
    new Set((allAdminJobs || []).map((job) => job?.company?.name).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second))

  const locationOptions = Array.from(
    new Set((allAdminJobs || []).map((job) => job?.location).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second))

  const totalOpenings = (allAdminJobs || []).reduce(
    (sum, job) => sum + (Number(job?.position) || 0),
    0
  )

  const totalApplicants = (allAdminJobs || []).reduce(
    (sum, job) => sum + (job?.applications?.length || 0),
    0
  )

  const totalSalaryBudget = (allAdminJobs || []).reduce(
    (sum, job) => sum + (Number(job?.salary) || 0),
    0
  )

  const daysAgoLabel = (dateValue) => {
    const createdAt = new Date(dateValue)
    const today = new Date()
    const difference = Math.floor(
      (today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (difference <= 0) {
      return 'Today'
    }

    if (difference === 1) {
      return '1 day ago'
    }

    return `${difference} days ago`
  }

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true
      })

      if (res.data.success) {
        dispatch(removeJobFromAllAdminJobs(jobId))
        successToast(res.data.message || 'Job removed')
      }
    } catch (error) {
      errorToast(error.response?.data?.message || 'Failed to delete job')
    }
  }

  const handleClearFilters = () => {
    setSearchValue('')
    setSelectedCompany('all')
    setSelectedLocation('all')
    setSelectedSalary('all')
  }

  useEffect(() => {
    const normalizedSearch = searchValue.trim().toLowerCase()
    const selectedSalaryRange = salaryRanges.find(
      (range) => range.value === selectedSalary
    )

    const results = (allAdminJobs || []).filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        (job?.title || '').toLowerCase().includes(normalizedSearch) ||
        (job?.company?.name || '').toLowerCase().includes(normalizedSearch) ||
        (job?.description || '').toLowerCase().includes(normalizedSearch) ||
        (job?.location || '').toLowerCase().includes(normalizedSearch)

      const matchesCompany =
        selectedCompany === 'all' ||
        (job?.company?.name || '').toLowerCase() === selectedCompany.toLowerCase()

      const matchesLocation =
        selectedLocation === 'all' ||
        (job?.location || '').toLowerCase() === selectedLocation.toLowerCase()

      const salary = Number(job?.salary) || 0
      const matchesSalary =
        !selectedSalaryRange || selectedSalary === 'all'
          ? true
          : salary >= selectedSalaryRange.min &&
            salary <= selectedSalaryRange.max

      return matchesSearch && matchesCompany && matchesLocation && matchesSalary
    })

    setFilteredJobs(results)
  }, [allAdminJobs, searchValue, selectedCompany, selectedLocation, selectedSalary])

  const activeFilters = [
    searchValue ? `Search: ${searchValue}` : null,
    selectedCompany !== 'all' ? selectedCompany : null,
    selectedLocation !== 'all' ? selectedLocation : null,
    selectedSalary !== 'all'
      ? salaryRanges.find((range) => range.value === selectedSalary)?.label
      : null
  ].filter(Boolean)

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-light pb-14 pt-24 text-gray-900 dark:bg-mesh-dark dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-20 h-64 w-64 rounded-full bg-red-500/12 blur-[110px]" />
        <div className="absolute right-[-8%] top-24 h-72 w-72 rounded-full bg-emerald-300/12 blur-[130px] dark:bg-emerald-500/10" />
        <div className="absolute bottom-0 left-1/4 h-84 w-84 rounded-full bg-white/20 blur-[150px] dark:bg-white/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="glass-card overflow-hidden rounded-[28px] border border-white/60 p-4 sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col gap-5 border-b border-gray-200/80 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                Recruiter Jobs
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-[2.2rem]">
                Manage every active opening from one cleaner jobs board.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-white/60">
                Review live positions, scan applicant activity, and jump into
                hiring actions without leaving the jobs page.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate('/admin/jobs/create')}
                className="h-12 rounded-full bg-red-600 px-6 text-white hover:bg-red-500"
              >
                <FilePlus2 className="mr-2 h-4 w-4" />
                New Job
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Listed Jobs
              </p>
              <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{allAdminJobs.length}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Open Positions
              </p>
              <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{totalOpenings}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Applicants
              </p>
              <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{totalApplicants}</p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white px-4 py-3 dark:border-red-500/20 dark:bg-gradient-to-br dark:from-red-500/10 dark:to-transparent">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                Salary Scope
              </p>
              <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{totalSalaryBudget} LPA</p>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-gray-200 bg-white/70 px-4 py-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center gap-3 text-gray-700 dark:text-white/75">
              <BriefcaseBusiness className="h-4 w-4 text-red-400" />
              <p className="text-sm font-medium tracking-wide">
                Keep the current admin job filtering behavior, now in a full top-bar layout.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Filter by company, role"
                  className={`${controlClassName} pl-11 placeholder:text-gray-400 dark:placeholder:text-white/35`}
                />
              </div>

              <div className="relative">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <select
                  value={selectedCompany}
                  onChange={(event) => setSelectedCompany(event.target.value)}
                  className={`${controlClassName} w-full appearance-none pl-11`}
                >
                  <option value="all">Company</option>
                  {companyOptions.map((company) => (
                    <option key={company} value={company} className="text-black">
                      {company}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
              </div>

              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <select
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className={`${controlClassName} w-full appearance-none pl-11`}
                >
                  <option value="all">Location</option>
                  {locationOptions.map((location) => (
                    <option key={location} value={location} className="text-black">
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
              </div>

              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <select
                  value={selectedSalary}
                  onChange={(event) => setSelectedSalary(event.target.value)}
                  className={`${controlClassName} w-full appearance-none pl-11`}
                >
                  {salaryRanges.map((range) => (
                    <option key={range.value} value={range.value} className="text-black">
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {activeFilters.length > 0 ? (
                  activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:border-white/12 dark:bg-white/5 dark:text-white/80"
                    >
                      {filter}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-white/45">
                    No extra filters applied. Showing every live recruiter job.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-red-200 hover:bg-red-50 dark:border-white/12 dark:bg-white/5 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
                Clear all
              </button>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                Active recruiter listings
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                Every card keeps the important job details visible while giving you direct management actions.
              </p>
            </div>
          </div>

          {filteredJobs.length <= 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-gray-300 bg-white/60 px-6 py-14 text-center dark:border-white/14 dark:bg-white/[0.03]">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">No admin jobs found</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-white/55">
                Try clearing the filters or create a new job posting.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={handleClearFilters}
                  className="rounded-full bg-white px-6 text-black hover:bg-white/90"
                >
                  Reset filters
                </Button>
                <Button
                  onClick={() => navigate('/admin/jobs/create')}
                  className="rounded-full bg-red-600 px-6 text-white hover:bg-red-500"
                >
                  Create Job
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
              {filteredJobs.map((job, index) => (
                <motion.article
                  key={job?._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="glass-card group flex h-full flex-col rounded-[22px] border border-white/70 p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/38">
                        {daysAgoLabel(job?.createdAt)}
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold leading-tight text-gray-900 dark:text-white sm:text-[1.15rem]">
                        {job?.title}
                      </h3>
                    </div>
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 shadow-none dark:border-emerald-500/30 dark:bg-emerald-500/12 dark:text-emerald-200">
                      Live
                    </Badge>
                  </div>

                  <div className="mb-3 flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white/70 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <Avatar className="h-11 w-11 border border-gray-200 dark:border-white/10">
                      <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
                        {job?.company?.name?.charAt(0) || 'J'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white/90">
                        <Building2 className="h-4 w-4 text-gray-400 dark:text-white/45" />
                        <span className="truncate">{job?.company?.name}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-white/52">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{job?.location}</span>
                      </p>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-gray-600 dark:text-white/68">
                    {job?.description}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    <div className="rounded-[16px] border border-gray-200 bg-white/65 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                        Salary
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <IndianRupee className="h-4 w-4 text-red-300" />
                        {job?.salary} LPA
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-gray-200 bg-white/65 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                        Experience
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Clock3 className="h-4 w-4 text-red-300" />
                        {job?.experienceLevel} years
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-gray-200 bg-white/65 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                        Openings
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Users className="h-4 w-4 text-red-300" />
                        {job?.position} positions
                      </p>
                    </div>
                    <div className="rounded-[16px] border border-gray-200 bg-white/65 p-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                        Applicants
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <Eye className="h-4 w-4 text-red-300" />
                        {job?.applications?.length || 0} applied
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                      Requirements
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {(job?.requirements || []).slice(0, 2).map((requirement) => (
                        <span
                          key={requirement}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 dark:border-white/12 dark:bg-white/[0.04] dark:text-white/72"
                        >
                          {requirement}
                        </span>
                      ))}
                      {(job?.requirements || []).length > 2 ? (
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 dark:border-white/12 dark:bg-white/[0.04] dark:text-white/50">
                          +{job.requirements.length - 2} more
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-3 dark:border-white/8">
                    <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/35">
                      <CalendarDays className="h-4 w-4" />
                      Posted {new Date(job?.createdAt).toLocaleDateString()}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Button
                        onClick={() => navigate(`/admin/jobs/${job?._id}`)}
                        className="h-9 rounded-full bg-red-600 text-white transition hover:bg-red-500"
                      >
                        Manage Job
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => navigate(`/admin/jobs/${job?._id}/applicants`)}
                        variant="outline"
                        className="h-9 rounded-full border-gray-200 bg-white text-gray-800 hover:bg-red-50 hover:text-red-700 dark:border-white/18 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-white"
                      >
                        View Applicants
                      </Button>
                      <Button
                        onClick={() => navigate(`/description/${job?._id}`)}
                        variant="outline"
                        className="h-9 rounded-full border-gray-200 bg-white text-gray-800 hover:bg-red-50 hover:text-red-700 dark:border-white/18 dark:bg-transparent dark:text-white dark:hover:bg-white/[0.08] dark:hover:text-white"
                      >
                        Public Preview
                      </Button>
                      <Button
                        onClick={() => handleDeleteJob(job?._id)}
                        variant="outline"
                        className="h-9 rounded-full border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20 dark:hover:text-white"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Job
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AdminJobs
