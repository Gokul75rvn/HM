import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add token to headers
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - Handle token refresh and errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              const response = await this.client.post('/auth/refresh', { refreshToken });
              const newAccessToken = response.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);
              return this.client(error.config);
            } catch {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // Auth endpoints
  register(data: { firstName: string; lastName: string; email?: string; phone?: string; password: string; role: string }) {
    return this.client.post('/auth/register', data);
  }

  login(registrationId: string, password: string) {
    return this.client.post('/auth/login', { registrationId, password });
  }

  logout() {
    return this.client.post('/auth/logout');
  }

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return this.client.post('/auth/change-password', { currentPassword, newPassword, confirmPassword });
  }

  // Users endpoints
  getUsers(page = 1, limit = 10) {
    return this.client.get(`/users?page=${page}&limit=${limit}`);
  }

  getUserById(id: string) {
    return this.client.get(`/users/${id}`);
  }

  createUser(data: any) {
    return this.client.post('/users', data);
  }

  updateUser(id: string, data: any) {
    return this.client.put(`/users/${id}`, data);
  }

  deleteUser(id: string) {
    return this.client.delete(`/users/${id}`);
  }

  // Patients endpoints
  getPatients(page = 1, limit = 10) {
    return this.client.get(`/patients?page=${page}&limit=${limit}`);
  }

  getPatientById(id: string) {
    return this.client.get(`/patients/${id}`);
  }

  createPatient(data: any) {
    return this.client.post('/patients', data);
  }

  updatePatient(id: string, data: any) {
    return this.client.put(`/patients/${id}`, data);
  }

  searchPatients(query: string) {
    return this.client.get(`/patients/search?q=${query}`);
  }

  // Doctors endpoints
  getDoctors(page = 1, limit = 10) {
    return this.client.get(`/doctors?page=${page}&limit=${limit}`);
  }

  getDoctorById(id: string) {
    return this.client.get(`/doctors/${id}`);
  }

  getDoctorsBySpecialization(specialization: string) {
    return this.client.get(`/doctors/specialization/${specialization}`);
  }

  createDoctor(data: any) {
    return this.client.post('/doctors', data);
  }

  updateDoctor(id: string, data: any) {
    return this.client.put(`/doctors/${id}`, data);
  }

  // Departments endpoints
  getDepartments() {
    return this.client.get('/departments');
  }

  getDepartmentById(id: string) {
    return this.client.get(`/departments/${id}`);
  }

  createDepartment(data: any) {
    return this.client.post('/departments', data);
  }

  // Appointments endpoints
  getAppointments(page = 1, limit = 10) {
    return this.client.get(`/appointments?page=${page}&limit=${limit}`);
  }

  getAppointmentById(id: string) {
    return this.client.get(`/appointments/${id}`);
  }

  getPatientAppointments(patientId: string) {
    return this.client.get(`/appointments/patient/${patientId}`);
  }

  getDoctorAppointments(doctorId: string) {
    return this.client.get(`/appointments/doctor/${doctorId}`);
  }

  createAppointment(data: any) {
    return this.client.post('/appointments', data);
  }

  updateAppointmentStatus(id: string, status: string) {
    return this.client.put(`/appointments/${id}/status`, { status });
  }

  // Admissions
  getAdmissions(page = 1, limit = 10) {
    return this.client.get(`/admissions?page=${page}&limit=${limit}`);
  }

  dischargeAdmission(id: string, data: any) {
    return this.client.patch(`/admissions/${id}/discharge`, data);
  }

  // Reports
  getReportsOverview() {
    return this.client.get('/reports/overview');
  }

  // Lab
  getLabOrders(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.client.get(`/lab/orders${query}`);
  }

  createLabOrder(data: any) {
    return this.client.post('/lab/orders', data);
  }

  updateLabOrderStatus(id: string, status: string) {
    return this.client.patch(`/lab/orders/${id}/status`, { status });
  }

  uploadLabResult(data: any) {
    return this.client.post('/lab/results', data);
  }

  // Prescriptions
  createPrescription(data: any) {
    return this.client.post('/prescriptions', data);
  }

  getPrescriptionById(id: string) {
    return this.client.get(`/prescriptions/${id}`);
  }

  getPrescriptionsByPatient(patientId: string) {
    return this.client.get(`/prescriptions/patient/${patientId}`);
  }

  updatePrescriptionStatus(id: string, status: string) {
    return this.client.patch(`/prescriptions/${id}/status`, { status });
  }

  // Medicines & Pharmacy
  getMedicines(query?: string) {
    return this.client.get(`/medicines${query ? `?q=${query}` : ''}`);
  }

  getLowStockMedicines() {
    return this.client.get('/medicines/low-stock');
  }

  createMedicine(data: any) {
    return this.client.post('/medicines', data);
  }

  updateMedicine(id: string, data: any) {
    return this.client.patch(`/medicines/${id}`, data);
  }

  getPharmacyQueue(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.client.get(`/pharmacy/queue${query}`);
  }

  dispensePrescription(data: any) {
    return this.client.post('/pharmacy/dispense', data);
  }

  // Billing & Payments
  generateBill(data: any) {
    return this.client.post('/billing/generate', data);
  }

  getBills(patientId?: string) {
    const query = patientId ? `?patientId=${patientId}` : '';
    return this.client.get(`/billing${query}`);
  }

  getBillById(id: string) {
    return this.client.get(`/billing/${id}`);
  }

  updateBillStatus(id: string, status: string) {
    return this.client.patch(`/billing/${id}/status`, { status });
  }

  recordPayment(data: any) {
    return this.client.post('/payments/pay', data);
  }

  getPayments(patientId?: string) {
    const query = patientId ? `?patientId=${patientId}` : '';
    return this.client.get(`/payments${query}`);
  }

  // Insurance
  createInsurancePolicy(data: any) {
    return this.client.post('/insurance/policies', data);
  }

  getInsurancePolicies(patientId?: string) {
    const query = patientId ? `?patientId=${patientId}` : '';
    return this.client.get(`/insurance/policies${query}`);
  }

  createInsuranceClaim(data: any) {
    return this.client.post('/insurance/claims', data);
  }

  getInsuranceClaims(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.client.get(`/insurance/claims${query}`);
  }

  updateInsuranceClaimStatus(id: string, payload: any) {
    return this.client.patch(`/insurance/claims/${id}/status`, payload);
  }

  // Notifications
  getNotifications() {
    return this.client.get('/notifications');
  }

  markNotificationRead(id: string) {
    return this.client.patch(`/notifications/${id}/read`, {});
  }
}

export default new ApiService();
