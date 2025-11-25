import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import DemoPage from './pages/DemoPage/DemoPage';
import HomePage from './pages/Home/HomePage';
import InterviewPractice from './pages/InterviewPractice/InterviewPractice.JSX';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Signup from './pages/Signup/Signup';
import store from './store/store';
import VideoRag from './pages/VideoRag/VideoRag';
import VerfiyEmail from './pages/VerfiyEmail/VerfiyEmail';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import CVBuilder from './pages/CVBuilder/CVBuilder';
import GoogleDrivePicker from './pages/GoogleDrivePicker';
import InstructorAssistant from './pages/InstructorAssistant/InstructorAssistant';
import SkillsAssessment from './pages/SkillsAssessment/SkillsAssessment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'interview-practice', element: <InterviewPractice /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/profile', element: <Profile /> },
      { path: '/demo', element: <DemoPage /> },
      { path: '/video-bot', element: <VideoRag /> },
      { path: '/verify-email', element: <VerfiyEmail /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/cv-builder', element: <CVBuilder /> },
      { path: '/google-drive-picker', element: <GoogleDrivePicker /> },
      { path: '/instructor-assistant', element: <InstructorAssistant /> },
      { path: '/quiz-form', element: <SkillsAssessment /> },
      
    ],
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
};

export default App