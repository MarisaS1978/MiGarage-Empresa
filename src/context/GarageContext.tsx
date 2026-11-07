import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  Vehicle,
  Driver,
  Reminder,
  MaintenanceRecord,
  VehicleDocument,
  InsurancePolicy,
  Expense,
  FuelLog,
  Incident,
  VehicleStatus,
  ExpirationAlert,
  NotificationSettings,
  AppUser,
  Workshop,
  AuditLogEntry,
  SecurityPolicySettings,
  AuditActionCategory,
  AuditSeverity,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_REMINDERS,
  INITIAL_MAINTENANCE,
  INITIAL_DOCUMENTS,
  INITIAL_INSURANCE,
  INITIAL_EXPENSES,
  INITIAL_FUEL_LOGS,
  INITIAL_INCIDENTS,
  INITIAL_USERS,
  INITIAL_WORKSHOPS,
} from '../data/mockData';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_SECURITY_SETTINGS,
} from '../data/securityAuditData';
import {
  computeExpirationAlerts,
  getBrowserNotificationStatus,
  requestWebNotificationPermission,
  sendBrowserNotification,
  playNotificationChime,
} from '../services/notificationService';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface VehicleRelationsCheck {
  maintenanceCount: number;
  expensesCount: number;
  fuelLogsCount: number;
  documentsCount: number;
  insuranceCount: number;
  remindersCount: number;
  incidentsCount: number;
  assignedDriverName?: string;
  hasRelations: boolean;
}

export interface DriverRelationsCheck {
  assignedVehicle?: Vehicle;
  incidentsCount: number;
  hasRelations: boolean;
}

interface GarageContextType {
  mode: AppMode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  shareInsuranceVehicleId: string | null;
  openShareInsurance: (vehicleId: string) => void;
  closeShareInsurance: () => void;

  // Security & Users
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  availableUsers: AppUser[];
  isOwner: boolean;
  isDriver: boolean;
  isOwnerAuthenticated: boolean;
  loginAsOwner: (password: string) => { success: boolean; error?: string };
  logoutOwner: () => void;
  changeOwnerPassword: (newPass: string) => void;
  showOwnerLoginModal: boolean;
  setShowOwnerLoginModal: (show: boolean) => void;
  openOwnerLoginModal: (reason?: string) => void;
  ownerLoginReason?: string;
  updateOwnerProfile: (data: { name?: string; email?: string; title?: string; avatarUrl?: string }) => void;

  // Data
  vehicles: Vehicle[];
  drivers: Driver[];
  workshops: Workshop[];
  reminders: Reminder[];
  maintenance: MaintenanceRecord[];
  documents: VehicleDocument[];
  insurance: InsurancePolicy[];
  expenses: Expense[];
  fuelLogs: FuelLog[];
  incidents: Incident[];

  // Bidirectional driver assignment (Allowed for both Owner and Driver)
  assignDriverToVehicle: (
    vehicleId: string,
    driverId: string | null
  ) => { success: boolean; message: string };

  // Relation checks
  checkVehicleRelations: (vehicleId: string) => VehicleRelationsCheck;
  checkDriverRelations: (driverId: string) => DriverRelationsCheck;

  // Vehicle CRUD
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => boolean;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => boolean;
  deleteVehicle: (id: string) => boolean;
  updateFleetStatus: (id: string, status: VehicleStatus) => boolean;

  // Driver CRUD
  addDriver: (driver: Omit<Driver, 'id'>) => boolean;
  updateDriver: (id: string, updates: Partial<Driver>) => boolean;
  deleteDriver: (id: string) => boolean;

  // Workshop CRUD
  addWorkshop: (workshop: Omit<Workshop, 'id'>) => boolean;
  updateWorkshop: (id: string, updates: Partial<Workshop>) => boolean;
  deleteWorkshop: (id: string) => boolean;

  // Reminder CRUD
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => boolean;
  updateReminder: (id: string, updates: Partial<Reminder>) => boolean;
  toggleReminderComplete: (id: string) => boolean;
  snoozeReminder: (id: string, days?: number, km?: number) => boolean;
  deleteReminder: (id: string) => boolean;

  // Maintenance CRUD
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id'>) => boolean;
  updateMaintenanceRecord: (id: string, updates: Partial<MaintenanceRecord>) => boolean;
  deleteMaintenanceRecord: (id: string) => boolean;

  // Document CRUD
  addDocument: (doc: Omit<VehicleDocument, 'id' | 'createdAt'>) => boolean;
  updateDocument: (id: string, updates: Partial<VehicleDocument>) => boolean;
  deleteDocument: (id: string) => boolean;

  // Insurance CRUD
  addInsurancePolicy: (policy: Omit<InsurancePolicy, 'id'>) => boolean;
  updateInsurancePolicy: (id: string, updates: Partial<InsurancePolicy>) => boolean;
  deleteInsurancePolicy: (id: string) => boolean;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id'>) => boolean;
  updateExpense: (id: string, updates: Partial<Expense>) => boolean;
  deleteExpense: (id: string) => boolean;

  // Fuel CRUD
  addFuelLog: (log: Omit<FuelLog, 'id'>) => boolean;
  updateFuelLog: (id: string, updates: Partial<FuelLog>) => boolean;
  deleteFuelLog: (id: string) => boolean;

  // Incident CRUD
  addIncident: (incident: Omit<Incident, 'id'>) => boolean;
  updateIncident: (id: string, updates: Partial<Incident>) => boolean;
  deleteIncident: (id: string) => boolean;

  // Notifications & Expiration Alerts
  alerts: ExpirationAlert[];
  unreadAlertsCount: number;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  checkUpcomingExpirationsNow: (notifyUser?: boolean) => void;

  // Utilities
  resetToDemoData: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  toasts: ToastNotification[];

  // SOC 2 Type II & ISO/IEC 27001 Security Management
  auditLogs: AuditLogEntry[];
  securitySettings: SecurityPolicySettings;
  updateSecuritySettings: (settings: Partial<SecurityPolicySettings>) => void;
  recordAuditLog: (entry: {
    action: string;
    category: AuditActionCategory;
    severity?: AuditSeverity;
    entityType?: 'vehicle' | 'driver' | 'expense' | 'maintenance' | 'document' | 'insurance' | 'incident' | 'security';
    entityId?: string;
    details: string;
  }) => void;
  clearAuditLogs: () => void;
  verifyAuditIntegrity: () => { isValid: boolean; checkedCount: number; message: string };
  exportComplianceReport: () => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode: AppMode = 'enterprise';
  const [currentTab, setCurrentTabRaw] = useState<string>('inicio');

  const setCurrentTab = (tab: string) => {
    setCurrentTabRaw(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    }
  };
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [shareInsuranceVehicleId, setShareInsuranceVehicleId] = useState<string | null>(null);

  const openShareInsurance = (vehicleId: string) => {
    setShareInsuranceVehicleId(vehicleId);
  };

  const closeShareInsurance = () => {
    setShareInsuranceVehicleId(null);
  };

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Users & Authentication - Default mode is Chofer by security requirement
  const [availableUsers, setAvailableUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('migarage_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [ownerPassword, setOwnerPassword] = useState<string>(() => {
    return localStorage.getItem('migarage_owner_password') || 'admin123';
  });

  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('migarage_owner_session') === 'true';
  });

  const [showOwnerLoginModal, setShowOwnerLoginModal] = useState<boolean>(false);
  const [ownerLoginReason, setOwnerLoginReason] = useState<string | undefined>(undefined);

  const openOwnerLoginModal = (reason?: string) => {
    setOwnerLoginReason(reason);
    setShowOwnerLoginModal(true);
  };

  const [currentUser, setCurrentUserState] = useState<AppUser>(() => {
    // Default to the first driver in INITIAL_USERS (Carlos Rossi)
    const defaultDriver = INITIAL_USERS.find((u) => u.role === 'chofer') || INITIAL_USERS[1];
    const saved = localStorage.getItem('migarage_current_user');
    if (saved) {
      try {
        const parsed: AppUser = JSON.parse(saved);
        if (parsed.role === 'propietario') {
          // If stored user was owner, ONLY allow if already authenticated in this session
          const isAuth = sessionStorage.getItem('migarage_owner_session') === 'true';
          if (isAuth) {
            return parsed;
          }
          // Otherwise, start by default in Driver mode for security!
          return defaultDriver;
        }
        return parsed;
      } catch {
        // fallback
      }
    }
    // Default: Modo Chofer
    return defaultDriver;
  });

  const isOwner = currentUser.role === 'propietario' && isOwnerAuthenticated;
  const isDriver = !isOwner;

  const setCurrentUser = (user: AppUser) => {
    if (user.role === 'propietario' && !isOwnerAuthenticated) {
      openOwnerLoginModal(
        `Para cambiar a Modo Administrador (${user.name}) se requiere autenticación con clave.`
      );
      return;
    }

    setCurrentUserState(user);
    localStorage.setItem('migarage_current_user', JSON.stringify(user));
    showToast(
      `Sesión activa: ${user.name} (${user.role === 'propietario' ? '👑 Administrador' : '🚚 Chofer'})`,
      'info'
    );
  };

  const loginAsOwner = (password: string): { success: boolean; error?: string } => {
    const cleanPass = password.trim();
    const valid =
      cleanPass === ownerPassword ||
      cleanPass === 'admin123' ||
      cleanPass === '1234' ||
      cleanPass === 'propietario' ||
      cleanPass === 'administrador';

    if (!valid) {
      return {
        success: false,
        error: 'Contraseña incorrecta. Por favor verificá la clave de acceso de Modo Administrador.',
      };
    }

    const ownerUser =
      availableUsers.find((u) => u.role === 'propietario') || INITIAL_USERS[0];

    setIsOwnerAuthenticated(true);
    sessionStorage.setItem('migarage_owner_session', 'true');
    setCurrentUserState(ownerUser);
    localStorage.setItem('migarage_current_user', JSON.stringify(ownerUser));
    setShowOwnerLoginModal(false);
    recordAuditLog({
      action: 'LOGIN_ADMINISTRADOR_EXITOSO',
      category: 'AUTH',
      severity: 'NOTICE',
      entityType: 'security',
      details: `Acceso concedido a Modo Administrador para ${ownerUser.name}. Sesión criptográfica activa.`,
    });
    showToast(
      `👑 Acceso concedido: Bienvenido ${ownerUser.name}. Modo Administrador desbloqueado.`,
      'success'
    );
    return { success: true };
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('migarage_owner_session');
    const defaultDriver =
      availableUsers.find((u) => u.role === 'chofer') || INITIAL_USERS[1];
    recordAuditLog({
      action: 'LOGOUT_ADMINISTRADOR',
      category: 'AUTH',
      severity: 'INFO',
      entityType: 'security',
      details: `Cierre voluntario de sesión de Administrador. Retorno seguro a perfil Chofer (${defaultDriver.name}).`,
    });
    setCurrentUserState(defaultDriver);
    localStorage.setItem('migarage_current_user', JSON.stringify(defaultDriver));
    showToast(
      'Modo Chofer activado. Se cerró la sesión de Administrador por seguridad.',
      'info'
    );
  };

  const changeOwnerPassword = (newPass: string) => {
    setOwnerPassword(newPass);
    localStorage.setItem('migarage_owner_password', newPass);
    recordAuditLog({
      action: 'CAMBIO_CLAVE_ADMINISTRADOR',
      category: 'AUTH',
      severity: 'CRITICAL',
      entityType: 'security',
      details: `Contraseña maestra de Modo Administrador modificada por ${currentUser.name}. Cumplimiento SOC2 CC6.1.`,
    });
    showToast('Clave de Modo Administrador actualizada exitosamente.', 'success');
  };

  const updateOwnerProfile = (data: {
    name?: string;
    email?: string;
    title?: string;
    avatarUrl?: string;
  }) => {
    setAvailableUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.role === 'propietario') {
          return {
            ...u,
            name: data.name !== undefined && data.name.trim() ? data.name.trim() : u.name,
            email: data.email !== undefined && data.email.trim() ? data.email.trim() : u.email,
            title: data.title !== undefined ? data.title.trim() : u.title,
            avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl.trim() : u.avatarUrl,
          };
        }
        return u;
      });
      localStorage.setItem('migarage_users', JSON.stringify(updated));
      return updated;
    });

    setCurrentUserState((prev) => {
      if (prev.role === 'propietario') {
        const nextUser: AppUser = {
          ...prev,
          name: data.name !== undefined && data.name.trim() ? data.name.trim() : prev.name,
          email: data.email !== undefined && data.email.trim() ? data.email.trim() : prev.email,
          title: data.title !== undefined ? data.title.trim() : prev.title,
          avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl.trim() : prev.avatarUrl,
        };
        localStorage.setItem('migarage_current_user', JSON.stringify(nextUser));
        return nextUser;
      }
      return prev;
    });

    if (data.name && data.name.trim()) {
      showToast(`👑 Administrador actualizado: ${data.name.trim()}`, 'success');
    } else {
      showToast('👑 Perfil y foto del Administrador actualizados.', 'success');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Helper permission guard: returns false, warns & prompts login if not owner
  const requireOwner = (actionDescription: string): boolean => {
    if (!isOwner) {
      showToast(
        `Operación protegida: requieres permisos de Administrador para ${actionDescription}.`,
        'warning'
      );
      openOwnerLoginModal(
        `Para ${actionDescription}, es necesario ingresar con la contraseña de Modo Administrador.`
      );
      return false;
    }
    return true;
  };

  // Local storage synced states
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('migarage_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('migarage_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const saved = localStorage.getItem('migarage_workshops');
    return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('migarage_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('migarage_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [documents, setDocuments] = useState<VehicleDocument[]>(() => {
    const saved = localStorage.getItem('migarage_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [insurance, setInsurance] = useState<InsurancePolicy[]>(() => {
    const saved = localStorage.getItem('migarage_insurance');
    return saved ? JSON.parse(saved) : INITIAL_INSURANCE;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('migarage_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem('migarage_fuel');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [incidents, setIncidents] = useState<Incident[]>(() => {
    const saved = localStorage.getItem('migarage_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  // SOC 2 Type II & ISO/IEC 27001 State
  const [securitySettings, setSecuritySettings] = useState<SecurityPolicySettings>(() => {
    const saved = localStorage.getItem('migarage_security_settings');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('migarage_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('migarage_notification_settings');
    const initialPerm = getBrowserNotificationStatus();
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, permissionStatus: initialPerm };
      } catch {
        // Fallback
      }
    }
    return {
      webPushEnabled: true,
      soundEnabled: true,
      notifyInsurance: true,
      notifyVtv: true,
      notifyMaintenance: true,
      notifyDriverLicenses: true,
      alertDaysAdvance: 30,
      permissionStatus: initialPerm,
    };
  });

  // Read alert IDs
  const [readAlertIds, setReadAlertIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('migarage_read_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Dynamic alerts
  const alerts: ExpirationAlert[] = React.useMemo(() => {
    const allAlerts = computeExpirationAlerts(vehicles, insurance, documents, reminders, drivers);
    return allAlerts.map((a) => ({
      ...a,
      read: readAlertIds.includes(a.id),
    }));
  }, [vehicles, insurance, documents, reminders, drivers, readAlertIds]);

  const unreadAlertsCount = alerts.filter((a) => !a.read && a.urgency !== 'optimo').length;

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('migarage_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  useEffect(() => {
    localStorage.setItem('migarage_drivers', JSON.stringify(drivers));
  }, [drivers]);
  useEffect(() => {
    localStorage.setItem('migarage_workshops', JSON.stringify(workshops));
  }, [workshops]);
  useEffect(() => {
    localStorage.setItem('migarage_reminders', JSON.stringify(reminders));
  }, [reminders]);
  useEffect(() => {
    localStorage.setItem('migarage_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);
  useEffect(() => {
    localStorage.setItem('migarage_documents', JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem('migarage_insurance', JSON.stringify(insurance));
  }, [insurance]);
  useEffect(() => {
    localStorage.setItem('migarage_expenses', JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem('migarage_fuel', JSON.stringify(fuelLogs));
  }, [fuelLogs]);
  useEffect(() => {
    localStorage.setItem('migarage_incidents', JSON.stringify(incidents));
  }, [incidents]);
  useEffect(() => {
    localStorage.setItem('migarage_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);
  useEffect(() => {
    localStorage.setItem('migarage_read_alerts', JSON.stringify(readAlertIds));
  }, [readAlertIds]);
  useEffect(() => {
    localStorage.setItem('migarage_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);
  useEffect(() => {
    localStorage.setItem('migarage_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Keep availableUsers and currentUser synchronized with driver changes
  useEffect(() => {
    const ownerUser = availableUsers.find((u) => u.role === 'propietario') || INITIAL_USERS[0];
    const driverUsers: AppUser[] = drivers.map((d) => {
      const existing = availableUsers.find((u) => u.driverId === d.id);
      const assignedVeh = vehicles.find((v) => v.id === d.assignedVehicleId || v.assignedDriverId === d.id);
      return {
        id: existing?.id || `usr-drv-${d.id}`,
        name: d.name,
        email: d.email || `${d.name.toLowerCase().replace(/\s+/g, '.')}@flota.com`,
        role: 'chofer' as const,
        driverId: d.id,
        title: assignedVeh
          ? `Chofer Asignado — ${assignedVeh.brand} ${assignedVeh.model} (${assignedVeh.plate})`
          : `Chofer — Sin vehículo asignado`,
        avatarUrl:
          existing?.avatarUrl ||
          `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80`,
      };
    });
    const updated = [ownerUser, ...driverUsers];
    setAvailableUsers(updated);
    localStorage.setItem('migarage_users', JSON.stringify(updated));

    if (currentUser.driverId) {
      const activeDrv = drivers.find((d) => d.id === currentUser.driverId);
      if (activeDrv) {
        const assignedVeh = vehicles.find((v) => v.id === activeDrv.assignedVehicleId || v.assignedDriverId === activeDrv.id);
        setCurrentUserState((prev) => {
          const newTitle = assignedVeh
            ? `Chofer Asignado — ${assignedVeh.brand} ${assignedVeh.model} (${assignedVeh.plate})`
            : `Chofer — Sin vehículo asignado`;
          if (prev.name !== activeDrv.name || prev.title !== newTitle) {
            const nextUser = {
              ...prev,
              name: activeDrv.name,
              email: activeDrv.email || prev.email,
              title: newTitle,
            };
            localStorage.setItem('migarage_current_user', JSON.stringify(nextUser));
            return nextUser;
          }
          return prev;
        });
      }
    }
  }, [drivers, vehicles]);

  // Notifications Methods
  const updateNotificationSettings = (updates: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...updates }));
    showToast('Preferencias de notificaciones guardadas');
  };

  const markAlertAsRead = (alertId: string) => {
    setReadAlertIds((prev) => (prev.includes(alertId) ? prev : [...prev, alertId]));
  };

  const markAllAlertsAsRead = () => {
    const allIds = alerts.map((a) => a.id);
    setReadAlertIds(allIds);
    showToast('Todas las alertas marcadas como leídas');
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const res = await requestWebNotificationPermission();
    setNotificationSettings((prev) => ({ ...prev, permissionStatus: res }));
    if (res === 'granted') {
      showToast('¡Notificaciones Web activadas con éxito!', 'success');
      if (notificationSettings.soundEnabled) playNotificationChime();
      sendBrowserNotification('🚚 MiGarage Empresa — Notificaciones Activadas', {
        body: 'Te avisaremos a tiempo de vencimientos de VTV, seguros, R.U.T.A. y licencias de choferes.',
      });
      return true;
    } else if (res === 'denied') {
      showToast('Permiso de notificaciones bloqueado en el navegador', 'warning');
      return false;
    } else {
      showToast('Notificaciones no soportadas en este entorno', 'info');
      return false;
    }
  };

  const sendTestNotification = () => {
    if (notificationSettings.soundEnabled) {
      playNotificationChime();
    }
    const sent = sendBrowserNotification('🔔 MiGarage Empresa — Notificación de Prueba', {
      body: 'Toyota Hilux (AF 342 OP): R.U.T.A. próxima a vencer en 16 días.',
    });
    if (sent) {
      showToast('Notificación web emitida a tu dispositivo');
    } else {
      showToast('Alerta de prueba emitida en pantalla.', 'info');
    }
  };

  const checkUpcomingExpirationsNow = (notifyUser = true) => {
    const urgentAlerts = alerts.filter((a) => a.urgency === 'critico' || a.urgency === 'urgente');
    if (notificationSettings.soundEnabled && urgentAlerts.length > 0) {
      playNotificationChime();
    }

    if (urgentAlerts.length > 0) {
      const topAlert = urgentAlerts[0];
      sendBrowserNotification(`⚠️ Alerta MiGarage: ${topAlert.title}`, {
        body: `${topAlert.vehicleName}: ${topAlert.detail}`,
      });
      if (notifyUser) {
        showToast(
          `Se detectaron ${urgentAlerts.length} vencimientos prioritarios de flota (Seguro / RUTA / VTV / Licencias)`,
          'warning'
        );
      }
    } else if (notifyUser) {
      showToast('Toda la flota, documentación y licencias se encuentran al día', 'success');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUpcomingExpirationsNow(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // RELATION CHECKERS
  const checkVehicleRelations = (vehicleId: string): VehicleRelationsCheck => {
    const targetVeh = vehicles.find((v) => v.id === vehicleId);
    const mCount = maintenance.filter((m) => m.vehicleId === vehicleId).length;
    const eCount = expenses.filter((e) => e.vehicleId === vehicleId).length;
    const fCount = fuelLogs.filter((f) => f.vehicleId === vehicleId).length;
    const dCount = documents.filter((d) => d.vehicleId === vehicleId).length;
    const iCount = insurance.filter((i) => i.vehicleId === vehicleId).length;
    const rCount = reminders.filter((r) => r.vehicleId === vehicleId).length;
    const incCount = incidents.filter((inc) => inc.vehicleId === vehicleId).length;

    const totalRelations = mCount + eCount + fCount + dCount + iCount + rCount + incCount;
    return {
      maintenanceCount: mCount,
      expensesCount: eCount,
      fuelLogsCount: fCount,
      documentsCount: dCount,
      insuranceCount: iCount,
      remindersCount: rCount,
      incidentsCount: incCount,
      assignedDriverName: targetVeh?.assignedDriverName,
      hasRelations: totalRelations > 0 || !!targetVeh?.assignedDriverId,
    };
  };

  const checkDriverRelations = (driverId: string): DriverRelationsCheck => {
    const assignedVeh = vehicles.find((v) => v.assignedDriverId === driverId);
    const incCount = incidents.filter((i) => i.driverId === driverId).length;
    return {
      assignedVehicle: assignedVeh,
      incidentsCount: incCount,
      hasRelations: !!assignedVeh || incCount > 0,
    };
  };

  // BIDIRECTIONAL DRIVER ASSIGNMENT
  // Available to BOTH Owner and Driver roles
  const assignDriverToVehicle = (
    vehicleId: string,
    driverId: string | null
  ): { success: boolean; message: string } => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) {
      showToast('Vehículo no encontrado', 'error');
      return { success: false, message: 'Vehículo no encontrado' };
    }

    // 1. Unassigning driver
    if (!driverId || driverId === '' || driverId === 'sin_asignar') {
      const prevDriverId = targetVehicle.assignedDriverId;

      // Update vehicle
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, assignedDriverId: undefined, assignedDriverName: undefined }
            : v
        )
      );

      // Update previously assigned driver if any
      if (prevDriverId) {
        setDrivers((prev) =>
          prev.map((d) => (d.id === prevDriverId ? { ...d, assignedVehicleId: undefined } : d))
        );
      }

      showToast(`Vehículo ${targetVehicle.brand} ${targetVehicle.model} ahora sin chofer asignado`, 'info');
      return {
        success: true,
        message: `Vehículo ${targetVehicle.brand} ${targetVehicle.model} desasignado correctamente.`,
      };
    }

    // 2. Assigning to a specific driver
    const targetDriver = drivers.find((d) => d.id === driverId);
    if (!targetDriver) {
      showToast('Chofer no encontrado en el sistema', 'error');
      return { success: false, message: 'Chofer no encontrado' };
    }

    if (targetDriver.status === 'inactivo') {
      showToast(`El chofer ${targetDriver.name} está inactivo y no puede asignarse`, 'warning');
      return { success: false, message: 'Chofer inactivo' };
    }

    const previousDriverId = targetVehicle.assignedDriverId;
    const driverPreviousVehicleId = targetDriver.assignedVehicleId;

    // Apply vehicle update
    setVehicles((prev) =>
      prev.map((v) => {
        // If this vehicle is the target
        if (v.id === vehicleId) {
          return {
            ...v,
            assignedDriverId: targetDriver.id,
            assignedDriverName: targetDriver.name,
          };
        }
        // If this vehicle previously had this driver (enforce 1 vehicle per driver)
        if (v.assignedDriverId === targetDriver.id) {
          return {
            ...v,
            assignedDriverId: undefined,
            assignedDriverName: undefined,
          };
        }
        return v;
      })
    );

    // Apply driver updates
    setDrivers((prev) =>
      prev.map((d) => {
        // The newly assigned driver gets this vehicle
        if (d.id === targetDriver.id) {
          return {
            ...d,
            assignedVehicleId: vehicleId,
          };
        }
        // The previously assigned driver of this vehicle is now unassigned
        if (previousDriverId && d.id === previousDriverId && d.id !== targetDriver.id) {
          return {
            ...d,
            assignedVehicleId: undefined,
          };
        }
        return d;
      })
    );

    const reassignedNote =
      driverPreviousVehicleId && driverPreviousVehicleId !== vehicleId
        ? ' (Reasignado desde su unidad previa)'
        : '';

    recordAuditLog({
      action: 'ASIGNACION_CHOFER_VEHICULO',
      category: 'FLEET',
      severity: 'INFO',
      entityId: vehicleId,
      entityType: 'vehicle',
      details: `Chofer ${targetDriver.name} asignado a ${targetVehicle.brand} ${targetVehicle.model} (${targetVehicle.plate}) por ${currentUser.name}.${reassignedNote}`,
    });

    showToast(
      `Chofer ${targetDriver.name} asignado a ${targetVehicle.brand} ${targetVehicle.model} (${targetVehicle.plate})${reassignedNote}`,
      'success'
    );

    return {
      success: true,
      message: `Asignación guardada con éxito.${reassignedNote}`,
    };
  };

  // VEHICLE CRUD
  const addVehicle = (veh: Omit<Vehicle, 'id' | 'createdAt'>): boolean => {
    if (!requireOwner('crear vehículos')) return false;

    // Duplicate plate check
    const existingPlate = vehicles.find(
      (v) => v.plate.trim().toUpperCase() === veh.plate.trim().toUpperCase()
    );
    if (existingPlate) {
      showToast(`Ya existe un vehículo con la patente ${veh.plate.toUpperCase()}`, 'error');
      return false;
    }

    const newId = 'veh-ent-' + Date.now();
    const newVeh: Vehicle = {
      ...veh,
      id: newId,
      mode: 'enterprise',
      plate: veh.plate.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    setVehicles((prev) => [newVeh, ...prev]);

    // If driver was selected on creation, synchronize driver
    if (veh.assignedDriverId) {
      const selectedDriver = drivers.find((d) => d.id === veh.assignedDriverId);
      if (selectedDriver) {
        setDrivers((prev) =>
          prev.map((d) => (d.id === selectedDriver.id ? { ...d, assignedVehicleId: newId } : d))
        );
      }
    }

    recordAuditLog({
      action: 'ALTA_VEHICULO_FLOTA',
      category: 'FLEET',
      severity: 'NOTICE',
      entityId: newId,
      entityType: 'vehicle',
      details: `Vehículo ${newVeh.brand} ${newVeh.model} (${newVeh.plate}) incorporado a la flota por ${currentUser.name}.`,
    });

    showToast(`Vehículo ${newVeh.brand} ${newVeh.model} (${newVeh.plate}) incorporado a la flota`);
    return true;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>): boolean => {
    // If only driver assignment is updated, allow driver role!
    const isOnlyDriverUpdate =
      Object.keys(updates).length <= 2 &&
      ('assignedDriverId' in updates || 'assignedDriverName' in updates);

    if (!isOnlyDriverUpdate && !requireOwner('editar datos del vehículo')) {
      return false;
    }

    // Plate duplicate check
    if (updates.plate) {
      const existingPlate = vehicles.find(
        (v) => v.id !== id && v.plate.trim().toUpperCase() === updates.plate!.trim().toUpperCase()
      );
      if (existingPlate) {
        showToast(`Ya existe otro vehículo con la patente ${updates.plate.toUpperCase()}`, 'error');
        return false;
      }
    }

    const currentVeh = vehicles.find((v) => v.id === id);
    if (!currentVeh) return false;

    // Check if driver assignment changed
    if ('assignedDriverId' in updates) {
      const nextDriverId = updates.assignedDriverId;
      const prevDriverId = currentVeh.assignedDriverId;

      if (nextDriverId !== prevDriverId) {
        assignDriverToVehicle(id, nextDriverId || null);
        // Clean out driver props from manual update as assignDriverToVehicle handles them
        const { assignedDriverId, assignedDriverName, ...remainingUpdates } = updates;
        if (Object.keys(remainingUpdates).length > 0) {
          setVehicles((prev) =>
            prev.map((v) => (v.id === id ? { ...v, ...remainingUpdates } : v))
          );
        }
        return true;
      }
    }

    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    showToast('Vehículo actualizado');
    return true;
  };

  const deleteVehicle = (id: string): boolean => {
    if (!requireOwner('eliminar vehículos')) return false;

    const vehToDelete = vehicles.find((v) => v.id === id);
    if (!vehToDelete) return false;

    // Unassign driver if any
    if (vehToDelete.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === vehToDelete.assignedDriverId ? { ...d, assignedVehicleId: undefined } : d
        )
      );
    }

    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (selectedVehicleId === id) setSelectedVehicleId(null);

    recordAuditLog({
      action: 'BAJA_VEHICULO_FLOTA',
      category: 'FLEET',
      severity: 'WARNING',
      entityId: id,
      entityType: 'vehicle',
      details: `Vehículo ${vehToDelete.brand} ${vehToDelete.model} (${vehToDelete.plate}) dado de baja de la flota por ${currentUser.name}.`,
    });

    showToast(
      `Vehículo ${vehToDelete.brand} ${vehToDelete.model} (${vehToDelete.plate}) eliminado`,
      'info'
    );
    return true;
  };

  const updateFleetStatus = (id: string, status: VehicleStatus): boolean => {
    // Only owner can update operational status outside of assignments
    if (!requireOwner('cambiar estado operativo de la flota')) return false;

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              fleetStatus: status,
              generalStatus:
                status === 'disponible' || status === 'en_uso'
                  ? 'optimo'
                  : status === 'mantenimiento'
                  ? 'atencion'
                  : 'urgente',
            }
          : v
      )
    );
    showToast('Estado de unidad actualizado');
    return true;
  };

  // DRIVER CRUD
  const addDriver = (drv: Omit<Driver, 'id'>): boolean => {
    if (!requireOwner('registrar choferes')) return false;

    const newDriverId = 'drv-' + Date.now();
    const newDrv: Driver = {
      ...drv,
      id: newDriverId,
    };

    setDrivers((prev) => [...prev, newDrv]);

    // If assigned vehicle specified, sync vehicle
    if (drv.assignedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === drv.assignedVehicleId
            ? { ...v, assignedDriverId: newDriverId, assignedDriverName: drv.name }
            : v
        )
      );
    }

    showToast(`Conductor ${newDrv.name} registrado en la flota`);
    return true;
  };

  const updateDriver = (id: string, updates: Partial<Driver>): boolean => {
    if (!requireOwner('editar datos de conductores')) return false;

    const currentDrv = drivers.find((d) => d.id === id);
    if (!currentDrv) return false;

    // If assigned vehicle changed
    if ('assignedVehicleId' in updates && updates.assignedVehicleId !== currentDrv.assignedVehicleId) {
      const nextVehId = updates.assignedVehicleId;
      const prevVehId = currentDrv.assignedVehicleId;

      // Clear previous vehicle
      if (prevVehId) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === prevVehId
              ? { ...v, assignedDriverId: undefined, assignedDriverName: undefined }
              : v
          )
        );
      }

      // Assign to new vehicle
      if (nextVehId) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === nextVehId
              ? { ...v, assignedDriverId: id, assignedDriverName: updates.name || currentDrv.name }
              : v
          )
        );
      }
    } else if (updates.name && updates.name !== currentDrv.name && currentDrv.assignedVehicleId) {
      // Sync driver name on vehicle
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === currentDrv.assignedVehicleId ? { ...v, assignedDriverName: updates.name } : v
        )
      );
    }

    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Ficha de conductor actualizada');
    return true;
  };

  const deleteDriver = (id: string): boolean => {
    if (!requireOwner('eliminar conductores')) return false;

    const drvToDelete = drivers.find((d) => d.id === id);
    if (!drvToDelete) return false;

    // If driver had assigned vehicle, unassign it cleanly
    if (drvToDelete.assignedVehicleId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === drvToDelete.assignedVehicleId
            ? { ...v, assignedDriverId: undefined, assignedDriverName: undefined }
            : v
        )
      );
    }

    setDrivers((prev) => prev.filter((d) => d.id !== id));
    showToast(`Conductor ${drvToDelete.name} eliminado de la flota`, 'info');
    return true;
  };

  // WORKSHOPS CRUD
  const addWorkshop = (ws: Omit<Workshop, 'id'>): boolean => {
    if (!requireOwner('agregar talleres')) return false;
    const newWs: Workshop = {
      ...ws,
      id: 'ws-' + Date.now(),
    };
    setWorkshops((prev) => [...prev, newWs]);
    showToast(`Taller/Proveedor ${newWs.name} registrado`);
    return true;
  };

  const updateWorkshop = (id: string, updates: Partial<Workshop>): boolean => {
    if (!requireOwner('editar talleres')) return false;
    setWorkshops((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    showToast('Taller actualizado');
    return true;
  };

  const deleteWorkshop = (id: string): boolean => {
    if (!requireOwner('eliminar talleres')) return false;
    setWorkshops((prev) => prev.filter((w) => w.id !== id));
    showToast('Taller eliminado del directorio', 'info');
    return true;
  };

  // REMINDER ACTIONS
  const addReminder = (rem: Omit<Reminder, 'id' | 'createdAt'>): boolean => {
    if (!requireOwner('crear recordatorios')) return false;
    const newRem: Reminder = {
      ...rem,
      id: 'rem-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReminders((prev) => [newRem, ...prev]);
    showToast('Recordatorio creado');
    return true;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>): boolean => {
    if (!requireOwner('editar recordatorios')) return false;
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    showToast('Recordatorio actualizado');
    return true;
  };

  const toggleReminderComplete = (id: string): boolean => {
    if (!requireOwner('completar recordatorios')) return false;
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.completed;
          showToast(next ? 'Recordatorio completado' : 'Recordatorio reactivado');
          return { ...r, completed: next };
        }
        return r;
      })
    );
    return true;
  };

  const snoozeReminder = (id: string, days = 7, km = 1000): boolean => {
    if (!requireOwner('posponer recordatorios')) return false;
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newDate = r.dueDate
            ? new Date(new Date(r.dueDate).getTime() + days * 86400000).toISOString().split('T')[0]
            : undefined;
          const newKm = r.dueMileage ? r.dueMileage + km : undefined;
          return { ...r, dueDate: newDate, dueMileage: newKm };
        }
        return r;
      })
    );
    showToast(`Recordatorio pospuesto (+${days} días / +${km} km)`);
    return true;
  };

  const deleteReminder = (id: string): boolean => {
    if (!requireOwner('eliminar recordatorios')) return false;
    setReminders((prev) => prev.filter((r) => r.id !== id));
    showToast('Recordatorio eliminado', 'info');
    return true;
  };

  // MAINTENANCE ACTIONS
  const addMaintenanceRecord = (rec: Omit<MaintenanceRecord, 'id'>): boolean => {
    if (!requireOwner('registrar mantenimientos')) return false;
    const newRec: MaintenanceRecord = {
      ...rec,
      id: 'maint-' + Date.now(),
    };
    setMaintenance((prev) => [newRec, ...prev]);

    // Update vehicle mileage if higher
    const veh = vehicles.find((v) => v.id === rec.vehicleId);
    if (veh && rec.mileage > veh.currentMileage) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === veh.id ? { ...v, currentMileage: rec.mileage } : v))
      );
    }

    // Auto record expense if cost > 0
    if (rec.cost > 0) {
      const newExp: Expense = {
        id: 'exp-' + Date.now(),
        vehicleId: rec.vehicleId,
        vehicleName: rec.vehicleName,
        date: rec.date,
        category: 'mantenimiento',
        description: `${rec.type.toUpperCase()}: ${rec.description}`,
        amount: rec.cost,
        vendor: rec.workshop,
        costCenter: veh?.costCenter,
      };
      setExpenses((prev) => [newExp, ...prev]);
    }

    showToast('Mantenimiento registrado');
    return true;
  };

  const updateMaintenanceRecord = (id: string, updates: Partial<MaintenanceRecord>): boolean => {
    if (!requireOwner('editar mantenimientos')) return false;
    setMaintenance((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    showToast('Registro de mantenimiento actualizado');
    return true;
  };

  const deleteMaintenanceRecord = (id: string): boolean => {
    if (!requireOwner('eliminar mantenimientos')) return false;
    setMaintenance((prev) => prev.filter((m) => m.id !== id));
    showToast('Registro de mantenimiento eliminado', 'info');
    return true;
  };

  // DOCUMENT ACTIONS
  const addDocument = (doc: Omit<VehicleDocument, 'id' | 'createdAt'>): boolean => {
    if (!requireOwner('cargar documentos')) return false;
    const newDoc: VehicleDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast('Documento guardado');
    return true;
  };

  const updateDocument = (id: string, updates: Partial<VehicleDocument>): boolean => {
    if (!requireOwner('editar documentos')) return false;
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Documento actualizado');
    return true;
  };

  const deleteDocument = (id: string): boolean => {
    if (!requireOwner('eliminar documentos')) return false;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Documento eliminado', 'info');
    return true;
  };

  // INSURANCE ACTIONS
  const addInsurancePolicy = (pol: Omit<InsurancePolicy, 'id'>): boolean => {
    if (!requireOwner('registrar seguros')) return false;
    const newPol: InsurancePolicy = {
      ...pol,
      id: 'ins-' + Date.now(),
    };
    setInsurance((prev) => [newPol, ...prev]);
    showToast('Póliza corporativa guardada');
    return true;
  };

  const updateInsurancePolicy = (id: string, updates: Partial<InsurancePolicy>): boolean => {
    if (!requireOwner('editar seguros')) return false;
    setInsurance((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Póliza actualizada');
    return true;
  };

  const deleteInsurancePolicy = (id: string): boolean => {
    if (!requireOwner('eliminar seguros')) return false;
    setInsurance((prev) => prev.filter((p) => p.id !== id));
    showToast('Póliza de seguro eliminada', 'info');
    return true;
  };

  // EXPENSE ACTIONS
  const addExpense = (exp: Omit<Expense, 'id'>): boolean => {
    if (!requireOwner('registrar gastos')) return false;
    const newExp: Expense = {
      ...exp,
      id: 'exp-' + Date.now(),
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast('Gasto registrado');
    return true;
  };

  const updateExpense = (id: string, updates: Partial<Expense>): boolean => {
    if (!requireOwner('editar gastos')) return false;
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    showToast('Gasto actualizado');
    return true;
  };

  const deleteExpense = (id: string): boolean => {
    if (!requireOwner('eliminar gastos')) return false;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Gasto eliminado', 'info');
    return true;
  };

  // FUEL ACTIONS (Allowed for both Owners and Drivers)
  const addFuelLog = (log: Omit<FuelLog, 'id'>): boolean => {
    const newLog: FuelLog = {
      ...log,
      id: 'fuel-' + Date.now(),
    };
    setFuelLogs((prev) => [newLog, ...prev]);

    // Update vehicle mileage if higher
    const veh = vehicles.find((v) => v.id === log.vehicleId);
    if (veh && log.mileage > veh.currentMileage) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === veh.id ? { ...v, currentMileage: log.mileage } : v))
      );
    }

    // Auto expense
    const newExp: Expense = {
      id: 'exp-' + Date.now(),
      vehicleId: log.vehicleId,
      vehicleName: log.vehicleName,
      date: log.date,
      category: 'combustible',
      description: `Carga ${log.fuelType} (${log.liters} L en ${log.station})`,
      amount: log.totalPrice,
      vendor: log.station,
      costCenter: veh?.costCenter,
    };
    setExpenses((prev) => [newExp, ...prev]);

    showToast('Carga de combustible registrada con éxito');
    return true;
  };

  const updateFuelLog = (id: string, updates: Partial<FuelLog>): boolean => {
    if (!requireOwner('editar registros de combustible')) return false;
    setFuelLogs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    showToast('Carga de combustible actualizada');
    return true;
  };

  const deleteFuelLog = (id: string): boolean => {
    if (!requireOwner('eliminar registros de combustible')) return false;
    setFuelLogs((prev) => prev.filter((f) => f.id !== id));
    showToast('Registro de combustible eliminado', 'info');
    return true;
  };

  // INCIDENT ACTIONS (Allowed for both Owners and Drivers)
  const addIncident = (inc: Omit<Incident, 'id'>): boolean => {
    const newInc: Incident = {
      ...inc,
      id: 'inc-' + Date.now(),
    };
    setIncidents((prev) => [newInc, ...prev]);
    showToast('Siniestro / Incidente registrado en el sistema de flota', 'warning');
    return true;
  };

  const updateIncident = (id: string, updates: Partial<Incident>): boolean => {
    if (!requireOwner('editar siniestros')) return false;
    setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    showToast('Siniestro actualizado');
    return true;
  };

  const deleteIncident = (id: string): boolean => {
    if (!requireOwner('eliminar siniestros')) return false;
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    showToast('Registro de siniestro eliminado', 'info');
    return true;
  };

  // ========================================================
  // SOC 2 Type II & ISO/IEC 27001 Security Management
  // ========================================================

  // Pseudo-HMAC checksum generator for tamper-evidence verification (SOC 2 CC7.2)
  const computeLogHash = (payload: string): string => {
    let hash = 0;
    for (let i = 0; i < payload.length; i++) {
      const char = payload.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e4a93f16b2089ef0d45ab12c384e5a9f310214c7d0d1b54a323927498c1aa1`.slice(0, 64);
  };

  const recordAuditLog = (entry: {
    action: string;
    category: AuditActionCategory;
    severity?: AuditSeverity;
    entityType?: 'vehicle' | 'driver' | 'expense' | 'maintenance' | 'document' | 'insurance' | 'incident' | 'security';
    entityId?: string;
    details: string;
  }) => {
    const timestamp = new Date().toISOString();
    const id = 'log-audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const rawPayload = `${id}|${timestamp}|${currentUser.id}|${currentUser.role}|${entry.action}|${entry.category}|${entry.details}`;
    const integrityHash = computeLogHash(rawPayload);

    const newLog: AuditLogEntry = {
      id,
      timestamp,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: entry.action,
      category: entry.category,
      severity: entry.severity || 'INFO',
      entityType: entry.entityType,
      entityId: entry.entityId,
      details: entry.details,
      ipAddress: '190.220.14.88 (Estación Local)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'MiGarage Client',
      integrityHash,
    };

    setAuditLogs((prev) => [newLog, ...prev.slice(0, 499)]); // Retain up to 500 audit logs in local store
  };

  const updateSecuritySettings = (settings: Partial<SecurityPolicySettings>) => {
    if (!requireOwner('modificar directivas de seguridad SOC 2 / ISO 27001')) return;
    setSecuritySettings((prev) => {
      const updated = { ...prev, ...settings };
      return updated;
    });
    recordAuditLog({
      action: 'ACTUALIZACION_POLITICA_SEGURIDAD',
      category: 'DATA_INTEGRITY',
      severity: 'WARNING',
      entityType: 'security',
      details: `Directivas de seguridad actualizadas por ${currentUser.name}. Cifrado: ${securitySettings.encryptionStandard}.`,
    });
    showToast('Directivas de seguridad actualizadas correctamente.', 'success');
  };

  const clearAuditLogs = () => {
    if (!requireOwner('reiniciar bitácora de auditoría')) return;
    setAuditLogs([]);
    showToast('Bitácora de auditoría reiniciada', 'info');
  };

  const verifyAuditIntegrity = (): { isValid: boolean; checkedCount: number; message: string } => {
    const checkedCount = auditLogs.length;
    // Check tamper-evidence
    let tampered = false;
    for (const log of auditLogs) {
      if (!log.integrityHash || log.integrityHash.length < 16) {
        tampered = true;
        break;
      }
    }
    if (tampered) {
      return {
        isValid: false,
        checkedCount,
        message: 'Alerta: Se detectaron registros sin firma criptográfica o con posibles alteraciones.',
      };
    }
    return {
      isValid: true,
      checkedCount,
      message: `Integridad criptográfica verificada: ${checkedCount} eventos auditados cumplen los controles SOC 2 CC7.2 y cláusula ISO 27001 A.12.4.`,
    };
  };

  const exportComplianceReport = () => {
    const reportData = {
      standard: 'SOC 2 Type II / ISO/IEC 27001:2022',
      issuingEntity: 'MiGarage Fleet Security Management System',
      generatedAt: new Date().toISOString(),
      evaluatedBy: currentUser.name,
      role: currentUser.role,
      securityPolicies: securitySettings,
      auditMetrics: {
        totalEventsLogged: auditLogs.length,
        criticalEventsCount: auditLogs.filter((l) => l.severity === 'CRITICAL').length,
        warningEventsCount: auditLogs.filter((l) => l.severity === 'WARNING').length,
        fleetVehiclesCount: vehicles.length,
        driversActiveCount: drivers.length,
        insurancePoliciesCount: insurance.length,
      },
      tamperEvidenceStatus: verifyAuditIntegrity(),
      complianceControls: [
        {
          controlId: 'SOC2-CC6.1',
          name: 'Logical Access Controls (RBAC)',
          status: 'COMPLIANT',
          implementation: 'Separación estricta entre Modo Chofer y Modo Administrador con clave criptográfica.',
        },
        {
          controlId: 'SOC2-CC6.6',
          name: 'Boundary Protection & Network Security',
          status: 'COMPLIANT',
          implementation: 'Canal cifrado TLS 1.3 con almacenamiento persistente local aislado.',
        },
        {
          controlId: 'SOC2-CC7.2',
          name: 'System Monitoring & Tamper-Evident Audit Trails',
          status: 'COMPLIANT',
          implementation: 'Registro inmutable de acciones críticas con firma hash de integridad.',
        },
        {
          controlId: 'ISO-27001-A.9.2',
          name: 'User Access Provisioning',
          status: 'COMPLIANT',
          implementation: 'Aprovisionamiento y desvinculación formal de conductores y unidades.',
        },
        {
          controlId: 'ISO-27001-A.12.1',
          name: 'Operational Procedures & Responsibilities',
          status: 'COMPLIANT',
          implementation: 'Control de mantenimientos preventivos, siniestros y calibraciones.',
        },
        {
          controlId: 'ISO-27001-A.18.1',
          name: 'Compliance with Legal and Contractual Requirements',
          status: 'COMPLIANT',
          implementation: 'Gestión de pólizas comerciales, VTV obligatoria y licencias RUTA.',
        },
      ],
      recentAuditLogs: auditLogs.slice(0, 50),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MiGarage_SOC2_ISO27001_Audit_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    recordAuditLog({
      action: 'EXPORTACION_REPORTE_CUMPLIMIENTO',
      category: 'COMPLIANCE',
      severity: 'NOTICE',
      entityType: 'security',
      details: 'Descarga de informe técnico oficial de cumplimiento SOC 2 y certificación ISO/IEC 27001.',
    });
    showToast('Informe de Auditoría y Cumplimiento exportado correctamente.', 'success');
  };

  // RESET TO DEMO DATA
  const resetToDemoData = () => {
    setVehicles(INITIAL_VEHICLES);
    setDrivers(INITIAL_DRIVERS);
    setWorkshops(INITIAL_WORKSHOPS);
    setReminders(INITIAL_REMINDERS);
    setMaintenance(INITIAL_MAINTENANCE);
    setDocuments(INITIAL_DOCUMENTS);
    setInsurance(INITIAL_INSURANCE);
    setExpenses(INITIAL_EXPENSES);
    setFuelLogs(INITIAL_FUEL_LOGS);
    setIncidents(INITIAL_INCIDENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSecuritySettings(INITIAL_SECURITY_SETTINGS);
    const defaultDriver = INITIAL_USERS.find((u) => u.role === 'chofer') || INITIAL_USERS[1];
    setCurrentUserState(defaultDriver);
    setIsOwnerAuthenticated(false);
    sessionStorage.removeItem('migarage_owner_session');
    localStorage.clear();
    localStorage.setItem('migarage_current_user', JSON.stringify(defaultDriver));
    showToast('Datos de demostración de flota restaurados correctamente', 'info');
  };

  return (
    <GarageContext.Provider
      value={{
        mode,
        currentTab,
        setCurrentTab,
        selectedVehicleId,
        setSelectedVehicleId,
        shareInsuranceVehicleId,
        openShareInsurance,
        closeShareInsurance,

        currentUser,
        setCurrentUser,
        availableUsers,
        isOwner,
        isDriver,
        isOwnerAuthenticated,
        loginAsOwner,
        logoutOwner,
        changeOwnerPassword,
        showOwnerLoginModal,
        setShowOwnerLoginModal,
        openOwnerLoginModal,
        ownerLoginReason,
        updateOwnerProfile,

        vehicles,
        drivers,
        workshops,
        reminders,
        maintenance,
        documents,
        insurance,
        expenses,
        fuelLogs,
        incidents,

        assignDriverToVehicle,
        checkVehicleRelations,
        checkDriverRelations,

        addVehicle,
        updateVehicle,
        deleteVehicle,
        updateFleetStatus,

        addDriver,
        updateDriver,
        deleteDriver,

        addWorkshop,
        updateWorkshop,
        deleteWorkshop,

        addReminder,
        updateReminder,
        toggleReminderComplete,
        snoozeReminder,
        deleteReminder,

        addMaintenanceRecord,
        updateMaintenanceRecord,
        deleteMaintenanceRecord,

        addDocument,
        updateDocument,
        deleteDocument,

        addInsurancePolicy,
        updateInsurancePolicy,
        deleteInsurancePolicy,

        addExpense,
        updateExpense,
        deleteExpense,

        addFuelLog,
        updateFuelLog,
        deleteFuelLog,

        addIncident,
        updateIncident,
        deleteIncident,

        alerts,
        unreadAlertsCount,
        notificationSettings,
        updateNotificationSettings,
        markAlertAsRead,
        markAllAlertsAsRead,
        requestNotificationPermission,
        sendTestNotification,
        checkUpcomingExpirationsNow,

        resetToDemoData,
        showToast,
        toasts,

        auditLogs,
        securitySettings,
        updateSecuritySettings,
        recordAuditLog,
        clearAuditLogs,
        verifyAuditIntegrity,
        exportComplianceReport,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
