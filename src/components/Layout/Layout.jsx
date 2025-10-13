import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import './Layout.css'
const Layout = () => {
    return (
        <>
            <div className=" d-flex flex-column" style={{ minHeight: '100vh' }} >
                <Header />
                <div className='layout-content' >
                    <Outlet />
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Layout