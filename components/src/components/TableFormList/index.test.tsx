import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TableFormList, { IAddNewRender, IActionRender } from '@/components/TableFormList'
import { Form, Input, InputNumber, Button, Table } from 'infrad'
import { FormListFieldData } from 'infrad/lib/form/FormList'
import { ColumnsType } from 'infrad/lib/table'
import styled from 'styled-components'

const { Item } = Form

const mockNameInputPlaceholder = 'mocked placeholder'
const mockColumns: ColumnsType<FormListFieldData> = [
  {
    title: 'Name',
    key: 'name',
    render: (_, { name, ...restField }) => (
      <Item
        {...restField}
        name={[name, 'name']}
        rules={[{ required: true, message: 'mock name is required' }]}
      >
        <Input placeholder={mockNameInputPlaceholder} />
      </Item>
    ),
  },
  {
    title: 'Age',
    key: 'age',
    render: (_, { name, ...restField }) => (
      <Item
        {...restField}
        name={[name, 'age']}
        rules={[{ required: true, message: 'mock age is required' }]}
      >
        <InputNumber addonAfter="years old" />
      </Item>
    ),
  },
]
const mockInitialFormValues = { members: [{ name: 'test1', age: 12 }] }

describe('TableFormList', () => {
  test('Basic Usage', async () => {
    // Arrange
    const { getByText, getAllByPlaceholderText, queryAllByPlaceholderText, queryAllByText } =
      render(
        <Form name="test">
          <TableFormList name="members" columns={mockColumns} />
        </Form>,
      )
    const addNewButton = getByText('Add')

    // Act
    await userEvent.click(addNewButton)
    const currentItemsAfterAdded = getAllByPlaceholderText(mockNameInputPlaceholder)
    const removeButtons = queryAllByText('IconMock')
    await userEvent.click(removeButtons[0])
    const currentItemsAfterRemove = queryAllByPlaceholderText(mockNameInputPlaceholder)

    // Assert
    expect(currentItemsAfterAdded).toHaveLength(1)
    expect(currentItemsAfterRemove).toHaveLength(0)
  })

  test('rules prop', async () => {
    // Arrange
    const mockValidatorFn = jest.fn()
    const MockTableFormListWithRules = () => {
      const [form] = Form.useForm()
      const handleSubmit = async () => {
        await form.validateFields()
      }

      return (
        <>
          <Form name="test" form={form} initialValues={mockInitialFormValues}>
            <TableFormList
              name="members"
              columns={mockColumns}
              rules={[
                {
                  validator: (_, values) => {
                    mockValidatorFn(values)
                  },
                },
              ]}
            />
          </Form>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      )
    }
    const { getByText } = render(<MockTableFormListWithRules />)
    const submitButton = getByText('Submit')

    // Act
    await userEvent.click(submitButton)

    // Assert
    expect(mockValidatorFn).toHaveBeenCalledTimes(1)
    expect(mockValidatorFn).toHaveBeenCalledWith(mockInitialFormValues.members)
  })

  test('style prop', () => {
    const { container } = render(
      <Form name="test" id="test">
        <TableFormList
          className="mock-class-name"
          name="members"
          columns={mockColumns}
          style={{ backgroundColor: 'yellow' }}
        />
      </Form>,
    )
    expect(getComputedStyle(container.children[0].children[0]).backgroundColor).toBe('yellow')
  })

  test('AntdTable prop', () => {
    const StyledTable: typeof Table = styled(Table)`
      table {
        border: 1px solid black;
      }
    `
    const screen = render(
      <Form>
        <TableFormList name="members" columns={mockColumns} AntdTable={StyledTable} />
      </Form>,
    )
    const table = screen.getByRole('table')
    expect(getComputedStyle(table).border).toBe('1px solid black')
  })

  test('addNewVisible prop', () => {
    const { queryByText } = render(
      <Form name="test">
        <TableFormList name="members" columns={mockColumns} addNewVisible={false} />
      </Form>,
    )
    const addNewButton = queryByText('Add')
    expect(addNewButton).not.toBeInTheDocument()
  })

  test('actionVisible prop', () => {
    const { queryAllByText } = render(
      <Form name="test">
        <TableFormList name="members" columns={mockColumns} actionVisible={false} />
      </Form>,
    )
    const removeButtons = queryAllByText('IconMock')
    expect(removeButtons).toHaveLength(0)
  })

  test('addNewColSpanKeys prop', () => {
    const columns: ColumnsType<FormListFieldData> = [
      {
        title: 'Name',
        key: 'name',
        render: (_, { name, ...restField }) => (
          <Item {...restField} name={[name, 'name']}>
            <Input />
          </Item>
        ),
      },
      {
        title: 'Age',
        key: 'age',
        render: (_, { name, ...restField }) => (
          <Item {...restField} name={[name, 'age']}>
            <InputNumber addonAfter="years old" />
          </Item>
        ),
      },
      {
        title: 'Address',
        key: 'address',
        render: (_, { name, ...restField }) => (
          <Item {...restField} name={[name, 'address']}>
            <Input />
          </Item>
        ),
      },
    ]
    const { queryByText } = render(
      <Form name="test">
        <TableFormList name="members" columns={columns} addNewColSpanKeys={['name', 'age']} />
      </Form>,
    )
    const addNewButton = queryByText('Add')
    const addNewButtonWrapper = addNewButton?.parentElement?.parentElement
    expect(addNewButtonWrapper).toBeDefined()
    expect(addNewButtonWrapper instanceof HTMLTableCellElement).toBeTruthy()
    if (addNewButtonWrapper instanceof HTMLTableCellElement) {
      expect(addNewButtonWrapper.colSpan).toBe(2)
    }
  })

  test('addNewRender prop', async () => {
    const addNewRender: IAddNewRender = (triggerAdd) => <Button onClick={triggerAdd}>my add</Button>
    const { getByText, getAllByPlaceholderText } = render(
      <Form name="test">
        <TableFormList name="members" columns={mockColumns} addNewRender={addNewRender} />
      </Form>,
    )
    const addNewButton = getByText('my add')

    await userEvent.click(addNewButton)
    expect(getAllByPlaceholderText(mockNameInputPlaceholder)).toHaveLength(1)
  })

  test('actionRender prop', async () => {
    const actionRender: IActionRender = (triggerRemove) => (
      <Button onClick={triggerRemove}>my remove</Button>
    )
    const { getByText, getAllByText, getAllByPlaceholderText, queryAllByPlaceholderText } = render(
      <Form name="test">
        <TableFormList name="members" columns={mockColumns} actionRender={actionRender} />
      </Form>,
    )

    const addNewButton = getByText('Add')

    await userEvent.click(addNewButton)

    const itemsAfterAdded = getAllByPlaceholderText(mockNameInputPlaceholder)
    const removeButtons = getAllByText('my remove')
    await userEvent.click(removeButtons[0])
    const itemsAfterRemoved = queryAllByPlaceholderText(mockNameInputPlaceholder)

    expect(itemsAfterAdded).toHaveLength(1)
    expect(itemsAfterRemoved).toHaveLength(0)
  })

  test('beforeAddNew prop when current list is empty', async () => {
    const mockBeforeAddNewFn = jest.fn()
    const MockTableFormListWithBeforeAddNew = () => {
      const [form] = Form.useForm()
      const handleBeforeAddNew = () => {
        const { members } = form.getFieldsValue()
        if (!members || members?.length <= 0) return
        mockBeforeAddNewFn(members)
      }
      return (
        <Form name="test" form={form}>
          <TableFormList name="members" columns={mockColumns} beforeAddNew={handleBeforeAddNew} />
        </Form>
      )
    }

    const { getByText } = render(<MockTableFormListWithBeforeAddNew />)
    const addNewButton = getByText('Add')

    await userEvent.click(addNewButton)
    expect(mockBeforeAddNewFn).not.toHaveBeenCalled()
  })

  test('beforeAddNew prop when current list is not empty', async () => {
    const mockBeforeAddNewFn = jest.fn()
    const MockTableFormListWithBeforeAddNew = () => {
      const [form] = Form.useForm()
      const handleBeforeAddNew = () => {
        const { members } = form.getFieldsValue()
        if (!members || members?.length <= 0) return
        mockBeforeAddNewFn(members)
      }
      return (
        <Form name="test" form={form} initialValues={mockInitialFormValues}>
          <TableFormList name="members" columns={mockColumns} beforeAddNew={handleBeforeAddNew} />
        </Form>
      )
    }

    const { getByText } = render(<MockTableFormListWithBeforeAddNew />)
    const addNewButton = getByText('Add')

    await userEvent.click(addNewButton)

    expect(mockBeforeAddNewFn).toHaveBeenCalledTimes(1)
    expect(mockBeforeAddNewFn).toHaveBeenCalledWith(mockInitialFormValues.members)
  })
})
