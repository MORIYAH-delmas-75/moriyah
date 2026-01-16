
export interface MemberData {
  id?: string;
  lastName: string;
  firstName: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  maritalStatus: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  churchJoinDate: string;
  baptismDate: string;
  baptismPlace: string;
  prevChurch: string;
  spouseName: string;
  childCount: number;
  childNames: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  photoUrl?: string;
  photoBase64?: string;
  photoName?: string;
  registrationDate?: string;
}

export type ViewMode = 'login' | 'register' | 'edit' | 'success' | 'search' | 'dashboard' | 'profile';

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: MemberData | MemberData[] | any;
}
