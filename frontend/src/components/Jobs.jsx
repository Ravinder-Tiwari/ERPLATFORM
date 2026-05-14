import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  Clock3,
  IndianRupee,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
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

const Jobs = () => {
  useGetAllJobs()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { allJobs, searchedQuery } = useSelector((store) => store.job)
  const { user } = useSelector((store) => store.auth)

  const [searchValue, setSearchValue] = useState(searchedQuery || '')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedSalary, setSelectedSalary] = useState('all')
  const [filteredJobs, setFilteredJobs] = useState(allJobs)

  const locationOptions = Array.from(
    new Set((allJobs || []).map((job) => job?.location).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second))

  const roleOptions = Array.from(
    new Set((allJobs || []).map((job) => job?.title).filter(Boolean))
  ).sort((first, second) => first.localeCompare(second))

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

  const handleSearchChange = (event) => {
    const { value } = event.target
    setSearchValue(value)
    dispatch(setSearchedQuery(value))
  }

  const handleClearFilters = () => {
    setSearchValue('')
    setSelectedLocation('all')
    setSelectedRole('all')
    setSelectedSalary('all')
    dispatch(setSearchedQuery(''))
  }

  useEffect(() => {
    setSearchValue(searchedQuery || '')
  }, [searchedQuery])

  useEffect(() => {
    const nextJobs = Array.isArray(allJobs) ? [...allJobs] : []
    const normalizedSearch = searchValue.trim().toLowerCase()
    const salaryRange = salaryRanges.find((range) => range.value === selectedSalary)

    const results = nextJobs.filter((job) => {
      const matchesSearch =
        !normalizedSearch ||
        (job?.title || '').toLowerCase().includes(normalizedSearch) ||
        (job?.description || '').toLowerCase().includes(normalizedSearch) ||
        (job?.location || '').toLowerCase().includes(normalizedSearch)

      const matchesLocation =
        selectedLocation === 'all' ||
        (job?.location || '').toLowerCase() === selectedLocation.toLowerCase()

      const matchesRole =
        selectedRole === 'all' ||
        (job?.title || '').toLowerCase() === selectedRole.toLowerCase()

      const salary = Number(job?.salary) || 0
      const matchesSalary =
        !salaryRange || selectedSalary === 'all'
          ? true
          : salary >= salaryRange.min && salary <= salaryRange.max

      return matchesSearch && matchesLocation && matchesRole && matchesSalary
    })

    setFilteredJobs(results)
  }, [allJobs, searchValue, selectedLocation, selectedRole, selectedSalary])

  useEffect(() => {
    if (user && user.role === 'recruiter') {
      navigate('/admin/jobs')
    }
  }, [user, navigate])

  const activeFilters = [
    searchValue ? `Search: ${searchValue}` : null,
    selectedLocation !== 'all' ? selectedLocation : null,
    selectedRole !== 'all' ? selectedRole : null,
    selectedSalary !== 'all'
      ? salaryRanges.find((range) => range.value === selectedSalary)?.label
      : null
  ].filter(Boolean)

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-light pb-14 pt-24 text-gray-900 dark:bg-mesh-dark dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-20 h-64 w-64 rounded-full bg-red-500/12 blur-[110px]" />
        <div className="absolute right-[-10%] top-32 h-72 w-72 rounded-full bg-indigo-300/12 blur-[130px] dark:bg-indigo-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-white/20 blur-[150px] dark:bg-white/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="glass-card overflow-hidden rounded-[28px] border border-white/60 p-4 sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col gap-4 border-b border-gray-200/80 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                Jobs Board
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-[2.2rem]">
                Discover roles with a cleaner, faster job search experience.
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-white/60">
                Search by role, narrow by location and salary, and scan every
                open position with the details that matter before you click in.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                  Listed Jobs
                </p>
                <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{allJobs.length}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                  Filtered
                </p>
                <p className="mt-1.5 text-xl font-bold text-gray-900 dark:text-white">{filteredJobs.length}</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white px-4 py-3 dark:border-red-500/20 dark:bg-gradient-to-br dark:from-red-500/10 dark:to-transparent sm:col-span-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500 dark:text-white/45">
                  Search State
                </p>
                <p className="mt-1.5 text-sm font-semibold text-gray-800 dark:text-white/85">
                  {activeFilters.length > 0 ? `${activeFilters.length} filters active` : 'Browsing all active jobs'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white/70 px-4 py-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-center gap-3 text-gray-700 dark:text-white/75">
              <SlidersHorizontal className="h-4 w-4 text-red-400" />
              <p className="text-sm font-medium tracking-wide">
                Search and filter jobs without losing the current working behavior.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))]">
              <div className="relative lg:col-span-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <Input
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Filter by name, role"
                  className={`${controlClassName} pl-11 placeholder:text-gray-400 dark:placeholder:text-white/35`}
                />
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
                <BriefcaseBusiness className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/45" />
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  className={`${controlClassName} w-full appearance-none pl-11`}
                >
                  <option value="all">Role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role} className="text-black">
                      {role}
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
              <div className="flex flex-wrap items-center gap-2">
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
                    No extra filters applied. Showing all active roles.
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
                Open roles for you
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                Responsive cards with the current job details, preserved search,
                and a faster scan path.
              </p>
            </div>
          </div>

          {filteredJobs.length <= 0 ? (
            <div className="mt-7 rounded-[24px] border border-dashed border-gray-300 bg-white/60 px-6 py-14 text-center dark:border-white/14 dark:bg-white/[0.03]">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">No jobs found</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-white/55">
                Try changing the role, location, or salary filters to widen the
                search.
              </p>
              <Button
                onClick={handleClearFilters}
                className="mt-6 rounded-full bg-red-600 px-6 text-white hover:bg-red-500"
              >
                Reset filters
              </Button>
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
                    <Badge className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700 shadow-none dark:border-red-500/30 dark:bg-red-500/12 dark:text-red-200">
                      {job?.jobType}
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

                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
                    <div className="col-span-2 rounded-[16px] border border-gray-200 bg-white/65 p-2.5 dark:border-white/10 dark:bg-white/[0.03] sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/38">
                        Salary
                      </p>
                      <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <IndianRupee className="h-4 w-4 text-red-300" />
                        {job?.salary} LPA
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

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-white/8">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-white/35">
                      <CalendarDays className="h-4 w-4" />
                      Posted {new Date(job?.createdAt).toLocaleDateString()}
                    </div>
                    <Button
                      onClick={() => navigate(`/description/${job?._id}`)}
                      className="h-9 rounded-full bg-red-600 px-4 text-white transition hover:bg-red-500"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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

export default Jobs
