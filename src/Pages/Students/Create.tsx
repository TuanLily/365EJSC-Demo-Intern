import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IStudent } from '../../Types/Students.types';
import { addStudent } from '../../Apis/Student.apis';
import { useNavigate } from 'react-router-dom';

const Create: React.FC = () => {
    const { register, handleSubmit, setValue, formState: { errors }, reset, setError } = useForm<IStudent>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IStudent> = async (data) => {
        try {
            await addStudent(data);
            reset();
            navigate('/student/list');
            alert("Thêm mới thành công");

        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error);
            setError('email', { message: 'Có lỗi xảy ra khi gửi dữ liệu' });
        }
    };


    return (
        <div className="container mt-5">
            <h2 className="text-center">Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="first_name">Họ</label>
                    <input
                        type="text"
                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                        id="first_name"
                        {...register('first_name', { required: "Họ là bắt buộc" })}
                    />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="last_name">Tên</label>
                    <input
                        type="text"
                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                        id="last_name"
                        {...register('last_name', { required: "Tên là bắt buộc" })}
                    />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        {...register('email', {
                            required: "Email là bắt buộc",
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "Email không hợp lệ"
                            }
                        })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        {...register('password', {
                            required: "Mật khẩu là bắt buộc",
                            minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                        })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        {...register('address', { required: "Địa chỉ là bắt buộc" })}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary">
                    Đăng ký
                </button>
            </form>
        </div>
    );
};

export default Create;
