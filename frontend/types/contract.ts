export interface Player {
  id: string
  name: string
  avatar: string
  tag: string
}

export interface Team {
  id: string
  name: string
  logo: string
}

export interface Contract {
  id: string
  player: Player
  team: Team
  startDate: string
  endDate: string
  salary: string
  status: 'active' | 'pending' | 'expired'
  fileUrl?: string
  createdAt?: string
  updatedAt?: string
}