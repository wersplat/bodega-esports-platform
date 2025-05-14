export type League = {
  id: string;
  name: string;
  description: string;
  // Add other league properties as needed
};

export type Registration = {
  id: string;
  team: {
    id: string;
    name: string;
    logo: string;
  };
  status: string;
  // Add other registration properties as needed
};
