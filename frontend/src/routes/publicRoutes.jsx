import { lazy } from 'react';
import MainLayout from '../layouts/MainLayout';
import Roadmap from '@/components/Roadmap';
import ProtectedFeature from '@/components/shared/ProtectedFeature';
import CodeEditor from '@/components/CodeEditor';

const Home = lazy(() => import('../components/Home'));
const Login = lazy(() => import('../components/auth/Login'));
const Signup = lazy(() => import('../components/auth/Signup'));
const Jobs = lazy(() => import('../components/Jobs'));
const Browse = lazy(() => import('../components/Browse'));
const Profile = lazy(() => import('../components/Profile'));
const JobDescription = lazy(() => import('../components/JobDescription'));
const About = lazy(() => import('../components/About'));
const Contact = lazy(() => import('../components/Contact'));
const CreateResume = lazy(() => import('../components/resume/CreateResume'));
const AtsHome = lazy(() => import('../components/atsscore/AtsHome'));
const SavedJobs = lazy(() => import('../components/SavedJobs'));
const ViewResumeTemplate = lazy(() => import('../components/atsscore/components/ViewResumeTemplate'));
const NotFound = lazy(() => import('../components/NotFound'));
const AIAssistant = lazy(() => import('../components/ai/AIAssistant'));

export const publicRoutes = [
  {
    path: '/',
    element: <MainLayout><Home /></MainLayout>
  },
  {
    path: '/login',
    element: <MainLayout><Login /></MainLayout>
  },
  {
    path: '/signup',
    element: <MainLayout><Signup /></MainLayout>
  },
  {
    path: '/jobs',
    element: <MainLayout><Jobs /></MainLayout>
  },
  {
    path: "/roadmap",
    element: <MainLayout><ProtectedFeature message="Sign in to view learning roadmap"><Roadmap /></ProtectedFeature></MainLayout>
  },

  {
    path: '/saved-jobs',
    element: <MainLayout><SavedJobs /></MainLayout>
  },
  {
    path: '/description/:id',
    element: <MainLayout><JobDescription /></MainLayout>
  },
  {
    path: '/browse',
    element: <MainLayout><ProtectedFeature message="Sign in to browse and apply for jobs"><Browse /></ProtectedFeature></MainLayout>
  },
  {
    path: '/resume-builder',
    element: <MainLayout><CreateResume /></MainLayout>
  },
  {
    path: '/ats-score',
    element: <MainLayout><AtsHome /></MainLayout>
  },
  {
    path: '/resume-templates',
    element: <MainLayout><ViewResumeTemplate /></MainLayout>
  },
  {
    path: '/profile',
    element: <MainLayout><Profile /></MainLayout>
  },
  {
    path: '/about',
    element: <MainLayout><About /></MainLayout>
  },
  {
    path: '/contact',
    element: <MainLayout><Contact /></MainLayout>
  },
  {
    path: '/ai-assistant',
    element: <MainLayout><AIAssistant /></MainLayout>
  },
  {
    path: '/*',
    element: <MainLayout><NotFound /></MainLayout>
  }
]; 