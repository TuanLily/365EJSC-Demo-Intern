import { IStudent, Students } from "../Types/Students.types";
import http from "../utils/http";
import { AxiosResponse } from 'axios';


export const getStudents = ({ page, limit }: { page: string, limit: string }) => {
    return http.get(`/students?page=${page}&limit=${limit}`);
};
export const getStudentById = (id: number | string) => http.get<IStudent>(`students/${id}`);

export const addStudent = (student: Omit<IStudent, 'id'>) => http.post<IStudent>('/students', student);

export const deleteStudent = (id: number | string) => http.delete<{}>(`students/${id}`)

export const updateStudent = (id: string | number, data: Omit<IStudent, 'id'>) => {
    return http.patch(`/students/${id}`, data);
};

