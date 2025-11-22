export type Program = {
  id: string;
  name: string;
  description: string;
  image: string; // Assuming 'image' is a URL string
  startDate: string; // Using string, often ISO 8601 format (e.g., "YYYY-MM-DD")
  endDate: string; // Using string, often ISO 8601 format (e.g., "YYYY-MM-DD")
};

export type Cohort = {
  id: string;
  program: string;
  name: string;
  description: string;
  image: string; // Assuming 'image' is a URL string
  startDate: string; // Using string, often ISO 8601 format (e.g., "YYYY-MM-DD")
  endDate: string; // Using string, often ISO 8601 format (e.g., "YYYY-MM-DD")
};

export type Company = {
  id: string;
  cohort: string;
  name: string;
};
