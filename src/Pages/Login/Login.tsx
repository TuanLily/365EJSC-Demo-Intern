
import './Login.module.css'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { loginAccount } from '../../Apis/Student.apis';
import Spinner from '../../Components/Spinner/Spinner';
import { useAuth } from '../../Context/AuthContext';

type FormData = {
    email: string;
    password: string;
};

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { setUser } = useAuth(); // Sử dụng context API


    const mutation = useMutation({
        mutationFn: (data: FormData) => loginAccount(data.email, data.password),
        onMutate: () => {
            setIsLoading(true); // Bắt đầu hiển thị loading khi bắt đầu gửi yêu cầu
        },
        onSuccess: (data) => {
            console.log(data)
            setIsLoading(false); // Ẩn loading sau khi yêu cầu thành công
            // Lưu accessToken vào localStorage
            localStorage.setItem('accessToken', data.data.accessToken);

            // Lưu thông tin người dùng vào context
            setUser({ email: data.data.user.last_name, token: data.data.accessToken });

            // Điều hướng tới trang danh sách sinh viên sau khi đăng nhập thành công
            navigate('/student/list');
        },
        onError: (error: any) => {
            setIsLoading(false); // Ẩn loading khi có lỗi
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    if (isLoading) {
        <Spinner />
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Đăng Nhập</h3>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        placeholder="Nhập email của bạn"
                                        {...register('email', {
                                            required: 'Email là bắt buộc',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Email không hợp lệ'
                                            }
                                        })}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Ghi nhớ tôi
                                        </label>
                                    </div>
                                    <a href="#" className="text-primary">Quên mật khẩu?</a>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>
                            </form>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <p>Bạn chưa có tài khoản? <a href="#" className="text-primary">Đăng ký ngay</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
