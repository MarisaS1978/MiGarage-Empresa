export type AppMode = 'enterprise';

export type UserRole = 'propietario' | 'chofer';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  driverId?: string; // Links to Driver.id when role === 'chofer'
  avatarUrl?: string;
  title?: string;
}

export interface Workshop {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  contactPerson?: string;
  email?: string;
  notes?: string;
}

export type VehicleType = 'automóvil' | 'camioneta' | 'motocicleta' | 'utilitario' | 'otro';

export type FuelType = 'nafta' | 'diesel' | 'gnc' | 'híbrido' | 'eléctrico';

export type VehicleStatus = 'disponible' | 'en_uso' | 'mantenimiento' | 'fuera_de_servicio';

export type GeneralStatus = 'optimo' | 'atencion' | 'urgente';

export interface Vehicle {
  id: string;
  mode: 'enterprise' | 'family' | 'both';
  brand: string;
  model: string;
  version?: string;
  year: number;
  plate: string; // Patente
  color: string;
  currentMileage: number;
  type: VehicleType;
  fuelType: FuelType;
  photoUrl?: string;
  generalStatus: GeneralStatus;
  fleetStatus?: VehicleStatus;
  assignedDriverId?: string;
  assignedDriverName?: string;
  costCenter?: string;
  notes?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseCategory: string; // e.g. B1, C, E1
  licenseExpiry: string; // ISO date
  assignedVehicleId?: string;
  status: 'activo' | 'licencia' | 'inactivo';
  notes?: string;
}

export type ReminderCategory = 'mantenimiento' | 'seguro' | 'documentación' | 'neumáticos' | 'combustible' | 'otro';

export interface Reminder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  title: string;
  category: ReminderCategory;
  dueDate?: string; // ISO date
  dueMileage?: number;
  notes?: string;
  completed: boolean;
  priority: 'alta' | 'media' | 'baja';
  createdAt: string;
}

export type MaintenanceType =
  | 'cambio de aceite'
  | 'filtros'
  | 'frenos'
  | 'neumáticos'
  | 'batería'
  | 'distribución'
  | 'suspensión'
  | 'electricidad'
  | 'aire acondicionado'
  | 'service general'
  | 'otro';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  mileage: number;
  type: MaintenanceType;
  description: string;
  workshop: string;
  cost: number;
  parts?: string;
  notes?: string;
  isPreventive?: boolean;
  // Enterprise fields
  laborCost?: number;
  partsCost?: number;
  downtimeHours?: number;
  responsible?: string;
  nextInterventionKm?: number;
  nextInterventionDate?: string;
  invoiceNumber?: string;
}

export type DocumentType = 'cédula' | 'seguro' | 'vtv' | 'licencia' | 'factura' | 'comprobante' | 'manual' | 'otros';

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  vehicleName: string;
  title: string;
  type: DocumentType;
  expiryDate?: string;
  issueDate?: string;
  description?: string;
  fileName?: string;
  fileSize?: string;
  createdAt: string;
}

export interface InsurancePolicy {
  id: string;
  vehicleId: string;
  vehicleName: string;
  company: string;
  policyNumber: string;
  coverageType: string; // e.g. Terceros completo, Todo riesgo con franquicia
  startDate: string;
  expiryDate: string;
  assistancePhone: string;
  emergencyPhone: string;
  monthlyPremium?: number;
  notes?: string;
}

export type ExpenseCategory =
  | 'combustible'
  | 'mantenimiento'
  | 'seguro'
  | 'documentación'
  | 'neumáticos'
  | 'reparación'
  | 'lavado'
  | 'peajes'
  | 'otros';

export interface Expense {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vendor?: string;
  costCenter?: string;
  invoiceUrl?: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  mileage: number;
  liters: number;
  totalPrice: number;
  pricePerLiter: number;
  station: string; // YPF, Shell, Axion, Puma, etc.
  fuelType: FuelType;
  fullTank: boolean;
  notes?: string;
}

export type IncidentType =
  | 'accidente'
  | 'choque'
  | 'daño estacionado'
  | 'robo'
  | 'intento de robo'
  | 'daño climático'
  | 'otro';

export type IncidentStatus =
  | 'pendiente'
  | 'denunciado'
  | 'en investigación'
  | 'en reparación'
  | 'resuelto'
  | 'rechazado';

export interface ThirdPartyInfo {
  name: string;
  phone: string;
  email?: string;
  dni?: string;
  plate?: string;
  vehicleModel?: string;
  insuranceCompany?: string;
  policyNumber?: string;
}

export interface Incident {
  id: string;
  vehicleId: string;
  vehicleName: string;
  date: string;
  time: string;
  location: string;
  type: IncidentType;
  description: string;
  status: IncidentStatus;
  thirdParty?: ThirdPartyInfo;
  claimNumber?: string; // Número de denuncia aseguradora
  policeReportNumber?: string;
  photosCount: number;
  photos?: string[];
  // Enterprise fields
  driverId?: string;
  driverName?: string;
  estimatedCost?: number;
  finalCost?: number;
  internalResponsible?: string;
  repairWorkshop?: string;
  daysOutOfService?: number;
}

export interface IncidentShareConfig {
  includeVehicle: boolean;
  includeInsurance: boolean;
  includeOwner: boolean;
  includePhone: boolean;
  includeDni: boolean;
  includeAddress: boolean;
  includeDocs: boolean;
  includePhotos: boolean;
  expirationHours: 1 | 24 | 168; // 1 hr, 24 hrs, 7 days
  pinCode?: string;
}

export type ExpirationAlertType = 'seguro' | 'vtv' | 'mantenimiento' | 'licencia';
export type AlertUrgency = 'critico' | 'urgente' | 'aviso' | 'optimo';

export interface ExpirationAlert {
  id: string;
  type: ExpirationAlertType;
  title: string;
  vehicleName: string;
  vehicleId: string;
  dueDate?: string;
  daysRemaining?: number;
  kmRemaining?: number;
  urgency: AlertUrgency;
  detail: string;
  read: boolean;
  createdAt: string;
  actionTab?: string;
}

export interface NotificationSettings {
  webPushEnabled: boolean;
  soundEnabled: boolean;
  notifyInsurance: boolean;
  notifyVtv: boolean;
  notifyMaintenance: boolean;
  notifyDriverLicenses: boolean;
  alertDaysAdvance: number; // 30, 15, 7
  permissionStatus: 'default' | 'granted' | 'denied' | 'unsupported';
}

// ==========================================
// SOC 2 Type II & ISO/IEC 27001:2022 Types
// ==========================================

export type AuditActionCategory =
  | 'AUTH'          // Logins, Logouts, Password changes, Role escalations
  | 'ACCESS_CONTROL'// Driver reassignment, user modifications
  | 'FLEET'         // Vehicle additions, updates, deletions
  | 'COMPLIANCE'    // Document upload, verification, policies
  | 'FINANCIAL'     // Fuel and operational expense entries
  | 'INCIDENT'      // Safety reports, insurance claims
  | 'DATA_INTEGRITY'// Backups, JSON exports, schema validations;

export type AuditSeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 UTC
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: AuditActionCategory;
  severity: AuditSeverity;
  entityType?: 'vehicle' | 'driver' | 'expense' | 'maintenance' | 'document' | 'insurance' | 'incident' | 'security';
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  integrityHash?: string; // SHA-256 / HMAC for tamper-evidence (SOC 2 CC7.2)
}

export interface SecurityPolicySettings {
  sessionTimeoutMinutes: number; // 15, 30, 60
  requireMfaOnAdmin: boolean;
  strictPasswordPolicy: boolean; // min 10 chars, symbols, numbers
  auditLogRetentionDays: number; // 90, 180, 365
  tamperProtectionEnabled: boolean;
  dataClassificationLevel: 'Confidential' | 'Restricted' | 'Internal';
  lastSecurityAuditDate: string;
  encryptionStandard: string; // 'AES-256-GCM / TLS 1.3'
}


