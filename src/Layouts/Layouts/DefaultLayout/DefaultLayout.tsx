import React from 'react';
import Header from '../../Header';
import Footer from '../../Footer';
import { Outlet } from 'react-router-dom';


const DefaultLayout: React.FC = () => {
    return (
        <div className='wrapper'>
            <Header />
            <div className='container'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
