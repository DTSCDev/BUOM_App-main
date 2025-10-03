
export interface LegacyPlanningItem {
  id: string;
  member_id: string;
  planning_type: 'will_not_arranged' | 'will_testament' | 'power_of_attorney' | 'expression_of_wish' | 'digital_will_provider';
  provider_name?: string;
  provider_contact?: string;
  document_date?: string;
  review_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LegacyPlanningInput {
  planning_type: 'will_not_arranged' | 'will_testament' | 'power_of_attorney' | 'expression_of_wish' | 'digital_will_provider';
  provider_name?: string;
  provider_contact?: string;
  document_date?: string;
  review_date?: string;
  notes?: string;
}

export const LEGACY_PLANNING_TYPES = {
  will_not_arranged: 'Will not arranged yet',
  will_testament: 'Will & Last Testament',
  power_of_attorney: 'Power of Attorney',
  expression_of_wish: 'Expression of Wish',
  digital_will_provider: 'Digital Will Provider'
} as const;
