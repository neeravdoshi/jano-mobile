export type DataPoint = {
  date: string;
  value: number;
};

export type ParameterCategory = 'Nephrology' | 'CBC Test' | 'Kidney Function';

export type TrendParameter = {
  id: string;
  name: string;
  unit: string;
  referenceRange: { low: number; high: number; label: string };
  category: ParameterCategory;
  clinicalLabel: string;
  isKeyParameter: boolean;
  severityScore: number;
  dataPoints: DataPoint[];
};
