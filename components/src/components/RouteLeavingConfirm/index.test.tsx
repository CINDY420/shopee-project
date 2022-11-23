import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Router, Link, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import RouteLeavingConfirm from '@/components/RouteLeavingConfirm'

const mockConfirmContent = 'Are you sure to leave?'
const mockLinkText = 'Click me to change route'
const MockHomePage = () => <span>home mock</span>
const MockAPage = () => <span>a mock</span>
const MockBPage = () => <span>b mock</span>

describe('RouteLeavingConfirm', () => {
  /**
   * Clean the JSDOM document after each test run, otherwise the "confirm" modals will affect each other
   * Refer to https://stackoverflow.com/questions/42805128/does-jest-reset-the-jsdom-document-after-every-suite-or-test
   */
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = ''
  })

  test('Confirm before route leaving', async () => {
    // Arrange
    const { getByText } = render(
      <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
        <RouteLeavingConfirm
          title="Notification"
          content={mockConfirmContent}
          okText="Confirm"
          cancelText="Cancel"
        />
        <Route exact path="/" component={MockHomePage} />
        <Route exact path="/a" component={MockAPage} />
        <Route exact path="/b" component={MockBPage} />
        <Link to="/a">{mockLinkText}</Link>
      </Router>,
    )

    const linkElement = getByText(mockLinkText)

    // Act
    await userEvent.click(linkElement)

    // Assert
    expect(getByText(mockConfirmContent)).toBeInTheDocument()
  })

  test('No confirm before route leaving if "when" is false', async () => {
    // Arrange
    const { getByText, queryByText } = render(
      <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
        <RouteLeavingConfirm
          when={false}
          title="Notification"
          content={mockConfirmContent}
          okText="Confirm"
          cancelText="Cancel"
        />
        <Route exact path="/" component={MockHomePage} />
        <Route exact path="/a" component={MockAPage} />
        <Route exact path="/b" component={MockBPage} />
        <Link to="/a">{mockLinkText}</Link>
      </Router>,
    )

    const linkElement = getByText(mockLinkText)

    // Act
    await userEvent.click(linkElement)

    // Assert
    expect(queryByText(mockConfirmContent)).toBeFalsy()
  })

  test('Route changes when click Confirm', async () => {
    // Arrange
    const { getByText } = render(
      <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
        <RouteLeavingConfirm
          title="Notification"
          content={mockConfirmContent}
          okText="Confirm"
          cancelText="Cancel"
        />
        <Route exact path="/" component={MockHomePage} />
        <Route exact path="/a" component={MockAPage} />
        <Route exact path="/b" component={MockBPage} />
        <Link to="/a">{mockLinkText}</Link>
      </Router>,
    )

    const linkElement = getByText(mockLinkText)

    // Act
    await userEvent.click(linkElement)
    await userEvent.click(getByText('Confirm'))

    // Assert
    expect(getByText('a mock')).toBeInTheDocument()
  })

  test('Route not change when click Cancel', async () => {
    // Arrange
    const { getByText } = render(
      <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
        <RouteLeavingConfirm
          title="Notification"
          content={mockConfirmContent}
          okText="Confirm"
          cancelText="Cancel"
        />
        <Route exact path="/" component={MockHomePage} />
        <Route exact path="/a" component={MockAPage} />
        <Route exact path="/b" component={MockBPage} />
        <Link to="/a">{mockLinkText}</Link>
      </Router>,
    )

    const linkElement = getByText(mockLinkText)

    // Act
    await userEvent.click(linkElement)
    await userEvent.click(getByText('Cancel'))

    // Assert
    expect(getByText('home mock')).toBeInTheDocument()
  })
})
