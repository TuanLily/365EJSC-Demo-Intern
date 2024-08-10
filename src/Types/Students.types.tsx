export interface IStudent {
    id: number | string
    first_name: string
    last_name: string
    email: string
    password: string
    address: string
}

export type Students = Pick<IStudent, 'id' | 'email' | 'address' | 'last_name' | 'first_name' | 'password'>[]
