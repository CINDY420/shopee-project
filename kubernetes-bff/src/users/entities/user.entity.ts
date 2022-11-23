export interface IUser {
  userid: string
  name: string
  email: string
  position: string
  main_department: number
  role: string
}

export interface IWhiteListUser {
  email: string
  position: string
  depart: string
}
