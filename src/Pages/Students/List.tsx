import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteStudent, getStudents } from '../../Apis/Student.apis';
import { IStudent } from '../../Types/Students.types';
import Spinner from '../../Components/Spinner/Spinner';
import { useNavigate } from 'react-router-dom';


function List() {
    const navigate = useNavigate();


    const results = useQuery({
        queryKey: ['students'],
        queryFn: () => getStudents(),
    });

    const { data, error, isLoading } = results;



    const deleteStudentMutation = useMutation({
        mutationFn: (id: string | number) => deleteStudent(id),
        onSuccess: (_, id) => {
            alert(`Xóa tài khoản thành công với id = ${id}!`);
        }
    })

    const handleDelete = (id: number | string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
            deleteStudentMutation.mutate(id);
        }
    };

    if (isLoading) return <Spinner />;
    if (error) return <p>Error: {(error as Error).message}</p>;

    return (
        <>
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
                    {data?.data.map((student: IStudent, index: number) => (
                        <tr key={student.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{student.first_name} {student.last_name}</td>
                            <td>{student.email}</td>
                            <td>
                                {student.address}
                            </td>
                            <td>
                                <button className="btn btn-warning btn-sm mx-2">Sửa</button>
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
        </>
    );
}

export default List;
