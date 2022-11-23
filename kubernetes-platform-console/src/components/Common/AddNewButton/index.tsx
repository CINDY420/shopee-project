import React from 'react'
import { Button } from 'infrad'
import { PlusOutlined } from 'infra-design-icons'
import { ButtonProps } from 'infrad/lib/button'

const AddNewButton: React.FC<ButtonProps> = ({ children, ...others }) => {
  return (
    <Button type='link' style={{ border: '1px dashed #2673DD' }} block icon={<PlusOutlined />} {...others}>
      {children}
    </Button>
  )
}

export default AddNewButton
