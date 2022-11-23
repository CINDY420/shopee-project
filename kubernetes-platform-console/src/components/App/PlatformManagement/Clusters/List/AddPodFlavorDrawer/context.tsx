import React from 'react'

export interface IFormContext {
  isFormValid: boolean
  updateFormValid: (isFormValid: boolean) => void
}

export const FormContext = React.createContext<IFormContext>({} as IFormContext)
