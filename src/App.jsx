import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Layout from './components/Layout/Layout';
import { Provider } from 'react-redux';
import store from './store/store';
import InterviewPractice from './pages/InterviewPractice/InterviewPractice.JSX';
import DemoPage from './pages/DemoPage/DemoPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'interview-practice', element: <InterviewPractice /> },
      { path: '/demo', element: <DemoPage /> }
    ],
  },
]);

const App = () => {
  return <Provider store={store}>
    <RouterProvider router={router} />;
  </Provider>
};

export default App