import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
        toast.success("Đăng xuất thành công", {
            autoClose: 3000,
            onClose: () => navigate('/login')
        });
    }


    return (
        <header className="d-flex justify-content-center py-3">
            <ul className="nav nav-pills">
                <li className="nav-item">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        aria-current="page"
                    >
                        Trang chủ
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/student/list"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Quản lý sinh viên
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink
                        to="/student/create"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Thêm mới sinh viên
                    </NavLink>
                </li>
            </ul>
            {user ? (
                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Xin chào, {user.email}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li><Link className="dropdown-item" to="/profile">Trang cá nhân</Link></li>
                        <li><button className="dropdown-item" onClick={() => handleLogout()}>Đăng xuất</button></li>
                    </ul>
                </div>

            ) : (
                <Link to={'/login'} className='btn btn-primary rounded-pill mx-5'>Đăng nhập</Link>
            )}

        </header>

    );
};

export default Header;
