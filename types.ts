
export enum UserRole {
  CLIENT = 'client',
  OWNER = 'owner',
}

export enum PetSize {
  PEQUENO = 'Pequeno',
  MEDIO = 'Médio',
  GRANDE = 'Grande',
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  weight: number;
  size: PetSize;
  observations: string;
}

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  pets: Pet[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  prices: { [key in PetSize]: number };
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  workingHours: string;
}

export enum AppointmentStatus {
  AGENDADO = 'Agendado',
  CONFIRMADO = 'Confirmado',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  serviceId: string;
  employeeId?: string;
  dateTime: Date;
  status: AppointmentStatus;
  taxiDog: boolean;
  paymentMethod: 'Pix' | 'Na Loja';
  totalPrice: number;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    date: Date;
}
