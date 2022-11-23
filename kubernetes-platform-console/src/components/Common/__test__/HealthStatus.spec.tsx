import * as React from 'react'
import { render, screen } from '@testing-library/react'
import HealthyStatus from 'components/Common/HealthyStatus'
import { CLUSTER_STATUS } from 'constants/cluster'

describe('HealthyStatus render UI result', () => {
  it('should display healthy style correctly', () => {
    render(<HealthyStatus status={CLUSTER_STATUS.healthy} />)

    expect(screen.getByText(`${CLUSTER_STATUS.healthy}`)).toBeTruthy()
    const contentDiv = screen.getByText(`${CLUSTER_STATUS.healthy}`)
    const style = window.getComputedStyle(contentDiv)
    expect(style.color).toBe('rgb(111, 201, 202)')
  })

  it('should display unhealthy style correctly', () => {
    render(<HealthyStatus status={CLUSTER_STATUS.unhealthy} />)

    expect(screen.getByText(`${CLUSTER_STATUS.unhealthy}`)).toBeTruthy()
    const contentDiv = screen.getByText(`${CLUSTER_STATUS.unhealthy}`)
    const style = window.getComputedStyle(contentDiv)
    expect(style.color).toBe('rgb(245, 34, 45)')
  })

  it('should display unknown style correctly', () => {
    render(<HealthyStatus status={CLUSTER_STATUS.unknown} />)

    expect(screen.getByText(`${CLUSTER_STATUS.unknown}`)).toBeTruthy()
    const contentDiv = screen.getByText(`${CLUSTER_STATUS.unknown}`)
    const style = window.getComputedStyle(contentDiv)
    expect(style.color).toBe('rgb(136, 136, 136)')
  })
})
