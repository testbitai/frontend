import apiClient from '@/lib/apiClient';

export interface TutorRegistrationData {
  name: string;
  email: string;
  password: string;
  instituteName: string;
  examFocus: string[];
  subjects: string[];
  bio: string;
  experience: number;
  qualifications: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  planType: 'starter' | 'pro';
  paymentMethod?: string;
}

export interface TutorProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isEmailVerified: boolean;
  isActive: boolean;
  tutorDetails: {
    instituteName: string;
    bio: string;
    experience: number;
    qualifications: string;
    subjects: string[];
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
    planType: 'starter' | 'pro';
    subscriptionStatus: 'active' | 'inactive' | 'pending' | 'cancelled';
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    examFocus: string[];
    students: string[];
    inviteCodes: Array<{
      code: string;
      password: string;
      expiresAt: string;
    }>;
    isProfileComplete: boolean;
    isVerified: boolean;
    totalStudents: number;
    totalTests: number;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TutorDashboardData {
  user: TutorProfile;
  stats: {
    totalStudents: number;
    totalTests: number;
    rating: number;
    subscriptionStatus: string;
    subscriptionEndDate: string;
  };
}

class TutorApiService {
  /**
   * Send OTP for tutor email verification
   */
  async sendOTP(email: string): Promise<{ email: string }> {
    const response = await apiClient.post('/tutor/send-otp', { email });
    return response.data.data;
  }

  /**
   * Verify tutor email with OTP
   */
  async verifyEmail(email: string, otp: string): Promise<{ verified: boolean }> {
    const response = await apiClient.post('/tutor/verify-email', { email, otp });
    return response.data.data;
  }

  /**
   * Register a new tutor
   */
  async register(data: TutorRegistrationData): Promise<{
    user: TutorProfile;
    tokens: {
      accessToken: string;
      refreshToken: string;
      accessTokenExpires: string;
      refreshTokenExpires: string;
    };
  }> {
    const response = await apiClient.post('/tutor/register', data);
    return response.data.data;
  }

  /**
   * Get tutor profile
   */
  async getProfile(): Promise<{ user: TutorProfile }> {
    const response = await apiClient.get('/tutor/profile');
    return response.data.data;
  }

  /**
   * Update tutor profile
   */
  async updateProfile(data: Partial<TutorRegistrationData>): Promise<TutorProfile> {
    const response = await apiClient.put('/tutor/profile', data);
    return response.data.data;
  }

  /**
   * Get tutor dashboard data
   */
  async getDashboard(): Promise<TutorDashboardData> {
    const response = await apiClient.get('/tutor/dashboard');
    return response.data.data;
  }

  /**
   * Generate invite code for students
   */
  async generateInviteCode(expiresInDays: number = 30, maxUses: number = 50): Promise<{
    code: string;
    password: string;
  }> {
    const response = await apiClient.post('/tutor/invite-code', {
      expiresInDays,
      maxUses,
    });
    return response.data.data;
  }

  // Admin functions
  /**
   * Get all tutors (admin only)
   */
  async getAllTutors(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}): Promise<{
    results: TutorProfile[];
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  }> {
    const response = await apiClient.get('/tutor/admin/all', { params });
    return response.data.data;
  }

  /**
   * Get tutor by ID (admin only)
   */
  async getTutorById(tutorId: string): Promise<TutorDashboardData> {
    const response = await apiClient.get(`/tutor/admin/${tutorId}`);
    return response.data.data;
  }

  /**
   * Verify/unverify tutor (admin only)
   */
  async verifyTutor(tutorId: string, isVerified: boolean): Promise<TutorProfile> {
    const response = await apiClient.patch(`/tutor/admin/${tutorId}/verify`, {
      isVerified,
    });
    return response.data.data;
  }

  /**
   * Update tutor subscription status (admin only)
   */
  async updateSubscription(
    tutorId: string,
    status: 'active' | 'inactive' | 'pending' | 'cancelled',
    paymentId?: string
  ): Promise<TutorProfile> {
    const response = await apiClient.patch(`/tutor/admin/${tutorId}/subscription`, {
      status,
      paymentId,
    });
    return response.data.data;
  }
}

export const tutorApi = new TutorApiService();
export default tutorApi;
