import axios from "axios";

export interface Staff {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  type: string;
  specialite: string;
  numeroLicence: string;
  actif: boolean;
  dateEmbauche: string | null; // LocalDateTime ISO
}

const API_URL = "http://localhost:9088/staffs";

export const getAllStaffs = () => axios.get(API_URL);

export const getStaffById = (id: number) =>
  axios.get(`${API_URL}/${id}`);

export const createStaff = (data: Staff) =>
  axios.post(API_URL, data);

export const updateStaff = (id: number, data: Staff) =>
  axios.put(`${API_URL}/${id}`, data);

export const deleteStaff = (id: number) =>
  axios.delete(`${API_URL}/${id}`);
