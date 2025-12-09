// Data Models matching the prompt's specifications

export interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female';
  mrn: string; // Medical Record Number
  lastVisit: string;
  status: 'Admitted' | 'Outpatient' | 'Discharged';
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  doctor: string;
  content: string; // The raw text for AI analysis
  diagnosisCodes: ICDCode[];
}

export interface ICDCode {
  code: string;
  description: string;
  confidence?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Medicine' | 'Consumable' | 'Equipment';
  batchNumber: string;
  expiryDate: string;
  stockLevel: number;
  unit: string;
  reorderLevel: number;
  monthlyUsage: number[]; // History for AI prediction
}

export interface PredictionResult {
  itemId: string;
  itemName: string;
  predictedDemand: number;
  recommendation: string;
  reasoning: string;
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Claim Submitted';
  insuranceProvider?: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EMR = 'EMR',
  PHARMACY = 'PHARMACY',
  BILLING = 'BILLING',
}