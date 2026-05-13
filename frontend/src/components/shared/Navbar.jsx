import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Menu, X, LayoutDashboard } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { AUTH_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { successToast, errorToast } from '@/utils/toast'
import ThemeToggle from '../ThemeToggle'

const Navbar = () => {
  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (user && user.role === 'recruiter' && location.pathname === '/login') {
      navigate('/admin')
    }
  }, [user, location, navigate])

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${AUTH_API_END_POINT}/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setUser(null))
        navigate("/")
        successToast(res.data.message || 'Successfully logged out!')
      }
    } catch (error) {
      console.log(error)
      errorToast(error.response?.data?.message || 'Failed to logout. Please try again.')
    }
  }

  const NavLinks = ({ isMobile }) => {
    const linkClass = isMobile
      ? 'block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200'
      : 'text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 px-1 py-0.5 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full'

    if (user && user.role === 'recruiter') {
      return (
        <>
          <Link to="/admin" className={linkClass}>
            <span className='flex items-center'>
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </span>
          </Link>
          <Link to="/admin/jobs" className={linkClass}>Jobs</Link>
          <Link to="/contact" className={linkClass}>Contact</Link>
        </>
      )
    } else {
      return (
        <>
          <Link to="/" className={linkClass}>Home</Link>
          {/* <Link to="/jobs" className={linkClass}>Jobs</Link> */}
          <Link to="/browse" className={linkClass}>Jobs</Link>
          <Link to="/roadmap" className={linkClass}>Roadmap</Link>
          <Link to="/about" className={linkClass}>About</Link>
          <Link to="/contact" className={linkClass}>Contact</Link>
        </>
      )
    }
  }

  return (
    <nav className='glass-nav sticky top-0 left-0 right-0 z-50 w-full text-gray-800 dark:text-gray-100'>
      <div className='w-[100%] max-w-[1920px] mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to={user && user.role === 'recruiter' ? "/admin" : "/"} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-lg sm:text-xl">P</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              prep<span className="text-red-600">4</span>Job
            </h1>
          </Link>

          {/* Desktop menu */}
          <div className='hidden md:flex items-center space-x-4 lg:space-x-6'>
            <NavLinks isMobile={false} />
            <ThemeToggle />
            {!user ? (
              <div className='flex items-center space-x-3 ml-4'>
                <Link to="/login">
                  <Button variant="outline" className='text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300'>Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300">Signup</Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-red-500 hover:border-red-600 transition-colors duration-300">
                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3'>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                      </Avatar>
                      <div>
                        <h4 className='font-medium text-lg'>{user?.fullname}</h4>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>{user?.profile?.bio}</p>
                      </div>
                    </div>
                    {user.role === 'student' && (
                      <Button variant="outline" className='w-full text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors duration-300' onClick={() => navigate('/profile')}>
                        <User2 className="mr-2 h-4 w-4" /> View Profile
                      </Button>
                    )}
                    {user.role === 'recruiter' && (
                      <Button variant="outline" className='w-full text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors duration-300' onClick={() => navigate('/admin')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                      </Button>
                    )}
                    <Button variant="outline" className='w-full hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300' onClick={logoutHandler}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 p-2'
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden glass border-t border-white/20 dark:border-white/5 animate-fadeIn w-full'>
          <div className='w-[100%] max-w-[1920px] mx-auto px-4'>
            <div className='w-[95%] mx-auto px-2 pt-2 pb-3 space-y-1'>
              <NavLinks isMobile={true} />
            </div>
            <div className='pt-4 pb-3 border-t border-gray-200/60 dark:border-gray-700/60'>
              <div className='px-4 flex items-center justify-between'>
                <ThemeToggle />
                {!user ? (
                  <div className='flex items-center space-x-2'>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className='text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-300'>Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300">Signup</Button>
                    </Link>
                  </div>
                ) : (
                  <div className='flex items-center space-x-3'>
                    <Avatar className="h-10 w-10 border-2 border-red-500">
                      <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                    </Avatar>
                    <div>
                      <h4 className='font-semibold text-gray-900 dark:text-white'>{user?.fullname}</h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>{user?.email}</p>
                    </div>
                  </div>
                )}
              </div>
              {user && (
                <div className='mt-3 px-4 space-y-1'>
                  {user.role === 'student' && (
                    <Button variant="ghost" className='w-full justify-start text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors duration-300' onClick={() => {
                      navigate('/profile')
                      setIsMenuOpen(false)
                    }}>
                      <User2 className="mr-2 h-4 w-4" /> View Profile
                    </Button>
                  )}
                  {user.role === 'recruiter' && (
                    <Button variant="ghost" className='w-full justify-start text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors duration-300' onClick={() => {
                      navigate('/admin')
                      setIsMenuOpen(false)
                    }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
                    </Button>
                  )}
                  <Button variant="ghost" className='w-full justify-start hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300' onClick={() => {
                    logoutHandler()
                    setIsMenuOpen(false)
                  }}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
