export interface Contract {
  id: string
  player: {
    id: string
    name: string
    avatar: string
    tag: string
  }
  team: {
    id: string
    name: string
    logo: string
  }
  startDate: string
  endDate: string
  salary: string
  status: "active" | "pending" | "expired" | string
  fileUrl?: string
} 