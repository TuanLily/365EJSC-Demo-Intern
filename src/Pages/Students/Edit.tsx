import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById, updateStudent } from '../../Apis/Student.apis';
import { IStudent } from '../../Types/Students.types';
import { toast } from 'react-toastify';

type FormStateType = Omit<IStudent, "id">;

const initialFormState: FormStateType = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    password: '',
};

const Edit: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm<FormStateType>({
        defaultValues: initialFormState,
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const { data, error, isLoading } = useQuery({
        queryKey: ['student', id],
        queryFn: () => getStudentById(id as string),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (formData: Omit<IStudent, 'id'>) => {
            if (id) {
                return updateStudent(id, formData);
            }
            throw new Error('ID không hợp lệ');
        },
        onSuccess: () => {
            toast.success("Cập nhật dữ liệu thành công", {
                autoClose: 3000,
                onClose: () => navigate('/student/list') // Điều hướng sau khi toast đóng
            });
        },
        onError: (error: any) => {
            console.error('Có lỗi xảy ra khi cập nhật dữ liệu:', error);
            setError('email', { message: 'Có lỗi xảy ra khi gửi dữ liệu' });
            toast.error('Lỗi khi cập nhật dữ liệu')
        }
    });

    useEffect(() => {
        if (data) {
            // Cập nhật dữ liệu cho form
            reset({
                first_name: data.data.first_name,
                last_name: data.data.last_name,
                email: data.data.email,
                address: data.data.address,
                password: data.data.password,
            });
        }
    }, [data, reset]);

    const onSubmit = (formData: Omit<IStudent, 'id'>) => {
        mutation.mutate(formData);
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
                    Cập nhật
                </button>
            </form>
        </div>
    );
};

export default Edit;
