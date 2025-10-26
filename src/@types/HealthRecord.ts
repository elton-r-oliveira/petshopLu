// src/types/HealthRecord.ts
export interface HealthRecord {
  id: string;
  type: 'vaccine' | 'dewormer' | 'antiparasitic';
  name: string;
  date: string;
  nextDate?: string | null;
  notes?: string | null;
  petId: string;
  userId: string;
  createdAt?: any;
  updatedAt?: any;
}
