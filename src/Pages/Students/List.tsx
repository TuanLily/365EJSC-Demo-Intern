import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteStudent, getStudents } from '../../Apis/Student.apis';
import { IStudent } from '../../Types/Students.types';
import Spinner from '../../Components/Spinner/Spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';


function List() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    const results = useQuery({
        queryKey: ['students', page, limit, search],
        queryFn: () => getStudents({ page, limit, search }),
    });
    const { data, error, isLoading } = results;
    const totalPages = data?.data.totalPages || 1;

    const [searchTerm, setSearchTerm] = useState<string>('');


    const debouncedSearchTerm = useMemo(
        () => debounce((value: any) => {
            setSearchParams({ page: '1', limit, search: value });
        }, 1000),
        [limit, setSearchParams]
    );

    useEffect(() => {
        debouncedSearchTerm(searchTerm);
        return () => {
            debouncedSearchTerm.cancel(); // Cancel debounce on component unmount
        };
    }, [searchTerm, debouncedSearchTerm]);

    const deleteStudentMutation = useMutation({
        mutationFn: (id: string | number) => deleteStudent(id),
        onSuccess: (_, id) => {

            toast.success(`Xóa tài khoản thành công với id = ${id}!`, {
                autoClose: 3000,
            });
            queryClient.invalidateQueries({
                queryKey: ['students', page, limit]
            })
        }
    })

    const handleDelete = (id: number | string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
            deleteStudentMutation.mutate(id);
        }
    };

    const handleEdit = (id: string | number) => {
        navigate(`/student/edit/${id}`);
    }

    if (isLoading) return <Spinner />;
    if (error) return <p>Error: {(error as Error).message}</p>;

    return (
        <>
            <div className='d-flex float-end my-2'>
                <TextField
                    variant="outlined"
                    size='small'
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setSearchParams({ page: '1', limit, search: searchTerm })}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <table className="table table-bordered table-responsive">
                <thead className="table-warning">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Họ Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data.students.map((student: IStudent, index: number) => (
                        <tr key={student.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{student.first_name} {student.last_name}</td>
                            <td>{student.email}</td>
                            <td>
                                {student.address}
                            </td>
                            <td>
                                <button className="btn btn-warning btn-sm mx-2" onClick={() => handleEdit(student.id)}>Sửa</button>
                                <button
                                    className="btn btn-danger ml-2"
                                    onClick={() => handleDelete(student.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center">
                <Pagination
                    count={totalPages || 1}
                    page={parseInt(page, 10)}
                    onChange={(event, value) => {
                        setSearchParams({ page: value.toString(), limit, search });
                    }}
                    color='primary'
                />
            </div>
        </>
    );
}

export default List;
