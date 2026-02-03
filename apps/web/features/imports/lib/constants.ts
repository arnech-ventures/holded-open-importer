export const ENTITY_TYPES = [
  'CONTACTS',
  'PRODUCTS',
  'EMPLOYEES',
  'CHART_OF_ACCOUNTS',
  'DOCUMENTS',
  'ASSETS',
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_LABELS: Record<EntityType, string> = {
  CONTACTS: 'Contactos',
  PRODUCTS: 'Productos',
  EMPLOYEES: 'Empleados',
  CHART_OF_ACCOUNTS: 'Plan contable',
  DOCUMENTS: 'Documentos',
  ASSETS: 'Activos fijos',
};

export const IMPORT_STATUSES = {
  PENDING: 'Pendiente',
  PROCESSING: 'Procesando',
  COMPLETED: 'Completado',
  FAILED: 'Fallido',
} as const;
