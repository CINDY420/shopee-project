export interface IESTicket {
  displayId?: string
  id: string
  tenant: number
  type: string
  permissionGroup?: number
  applicant: number
  status: string
  approver?: number
  project?: string
  purpose?: string
  createdAt: string
  updatedAt: string
}
