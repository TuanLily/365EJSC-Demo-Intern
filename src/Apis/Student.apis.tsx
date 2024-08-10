import { IStudent, Students } from "../Types/Students.types";
import http from "../utils/http";

export const getStudents = () => http.get<Students>('students');

export const addStudent = (student: Omit<IStudent, 'id'>) => http.post<IStudent>('/students', student);

export const deleteStudent = (id: number | string) => http.delete<{}>(`students/${id}`)
