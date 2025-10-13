import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import Layout from './components/Layout/Layout';
import { Provider } from 'react-redux';
import store from './store/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> }
    ],
  }])

const App = () => {
  return <Provider store={store}>
    <RouterProvider router={router} />;
  </Provider>
};

export default App