
export interface ISubscription {
  id: number;
  firstName?: string;
  lastName?: string;
  company?: string;
  email: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  userDidConsent: boolean;
  settings?: object;
  elistId: number;
}