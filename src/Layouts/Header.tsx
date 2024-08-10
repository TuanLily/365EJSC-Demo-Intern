import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
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
        </header>
    );
};

export default Header;
