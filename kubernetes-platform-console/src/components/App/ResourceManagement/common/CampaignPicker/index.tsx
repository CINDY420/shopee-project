import { Col, DatePicker, Row } from 'infrad'
import moment, { Moment } from 'moment'
import React from 'react'
import {
  PanelContainer,
  Panel,
  PanelHeader,
  PanelContent,
  Empty,
  PannelInner,
  PrevIcon,
  NextIcon
} from 'components/App/ResourceManagement/common/CampaignPicker/style'
import { ResourceContext } from 'components/App/ResourceManagement/useResourceContext'
import { IBigSale } from 'swagger-api/v1/models'
import useDeepEqualEffect from 'hooks/useDeepEqualEffect'

interface ICampaignPickerProps {
  style?: React.CSSProperties
  value?: [string, string]
  onChange?: (value: [string, string]) => void
}

const MAX_OPTIONAL_NUM = 4

const CampaignPicker: React.FC<ICampaignPickerProps> = ({ style, value, onChange }) => {
  const { state } = React.useContext(ResourceContext)
  const { bigSales } = state

  const [year, setYear] = React.useState(moment().year())
  const [selectedDate, setSelectedDate] = React.useState<[Moment, Moment]>([undefined, undefined])
  const [selectedBigSaleIds, setSelectedBigSaleIds] = React.useState<[string, string]>([undefined, undefined])
  const [open, setOpen] = React.useState(false)
  const [mouseOverDate, setMouseOverDate] = React.useState<IBigSale>()
  const hasSelectedAllTime = selectedDate.filter(Boolean).length === 2

  const bigSaleNemeList = React.useMemo(() => {
    return Object.values(bigSales).reduce((acc: string[], curr) => {
      const bigSalesEachYear = curr.map(bigSale => `${bigSale.year}.${bigSale.month}.${bigSale.day}`)
      return acc.concat(bigSalesEachYear)
    }, [])
  }, [bigSales])

  const formatBigSaleToDate = (bigSale: IBigSale) => {
    if (bigSale === undefined) return undefined
    const { year, month, day } = bigSale
    return moment(`${year}.${month}.${day}`)
  }

  // initialize
  useDeepEqualEffect(() => {
    if (!value) return

    const [start, end] = value
    const bigSaleList = Object.values(bigSales).reduce((acc, curr) => {
      return acc.concat(curr)
    }, [])
    const startBigSale = bigSaleList.find(item => item.bigSaleId === start)
    const endBigSale = bigSaleList.find(item => item.bigSaleId === end)
    setSelectedDate([formatBigSaleToDate(startBigSale), formatBigSaleToDate(endBigSale)])
    setSelectedBigSaleIds(value)
  }, [bigSales, value])

  const handleSelectBigSale = (bigSale: IBigSale) => {
    const [startDate, endDate] = hasSelectedAllTime ? [undefined, undefined] : selectedDate
    const [startBigSaleId, endBigSaleId] = hasSelectedAllTime ? [undefined, undefined] : selectedBigSaleIds
    const date = formatBigSaleToDate(bigSale)
    if (startDate) {
      setSelectedDate([startDate, date])
      setSelectedBigSaleIds([startBigSaleId, bigSale.bigSaleId])
    } else {
      setSelectedDate([date, endDate])
      setSelectedBigSaleIds([bigSale.bigSaleId, endBigSaleId])
    }
  }

  // exchange data if startDate is after endDate and close the panel when finish select
  React.useEffect(() => {
    if (hasSelectedAllTime) {
      setOpen(false)
      const [startDate, endDate] = selectedDate
      const [startBigSaleId, endBigSaleId] = selectedBigSaleIds
      onChange?.(selectedBigSaleIds)
      if (startDate.isAfter(endDate)) {
        setSelectedDate([endDate, startDate])
        setSelectedBigSaleIds([endBigSaleId, startBigSaleId])
        onChange?.([endBigSaleId, startBigSaleId])
      }
    }
  }, [hasSelectedAllTime, onChange, selectedBigSaleIds, selectedDate])

  const handleChange = () => {
    // allowClear
    setSelectedDate([undefined, undefined])
    setSelectedBigSaleIds([undefined, undefined])
    onChange?.(undefined)
    setYear(moment().year())
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open && !hasSelectedAllTime) {
      setSelectedDate([undefined, undefined])
      setSelectedBigSaleIds([undefined, undefined])
      onChange?.(undefined)
    }
  }

  const onMouseOver = (bigSale: IBigSale) => {
    const [start, end] = selectedDate
    if (start && !end) {
      setMouseOverDate(bigSale)
    }
  }

  const isBigSaleInSpecifyRange = (bigSale: IBigSale, range: [Moment, Moment]) => {
    const formattedDate = formatBigSaleToDate(bigSale)
    const [start, end] = range
    const isAfterStart = start && formattedDate.isSameOrAfter(start)
    const isBeforeEnd = end && formattedDate.isSameOrBefore(end)

    return isAfterStart && isBeforeEnd
  }

  const isBigSaleInSelectingRange = (bigSale: IBigSale) => {
    const [start] = selectedDate
    if (!mouseOverDate || !start) return false
    const formattedSelectingDate = formatBigSaleToDate(mouseOverDate)
    if (start.isSame(formattedSelectingDate)) return false

    return (
      isBigSaleInSpecifyRange(bigSale, [start, formattedSelectingDate]) ||
      isBigSaleInSpecifyRange(bigSale, [formattedSelectingDate, start])
    )
  }

  const isBigSaleSelectable = (bigSale: IBigSale) => {
    const bigSaleDate = formatBigSaleToDate(bigSale)
    const [start] = selectedDate
    if (!start) return true

    const startDateString = start.format('YYYY.M.D')
    const formattedBigSaleDateString = bigSaleDate.format('YYYY.M.D')
    const bigSaleIndex = bigSaleNemeList.indexOf(startDateString)
    const startIndex = bigSaleIndex <= MAX_OPTIONAL_NUM ? 0 : bigSaleIndex - MAX_OPTIONAL_NUM - 1
    const endIndex =
      bigSaleIndex + MAX_OPTIONAL_NUM > bigSaleNemeList.length
        ? bigSaleNemeList.length + 1
        : bigSaleIndex + MAX_OPTIONAL_NUM
    const selectableBigSaleList = bigSaleNemeList.slice(startIndex, endIndex)
    return selectableBigSaleList.includes(formattedBigSaleDateString)
  }

  const renderPanel = (panelYear: number, position: 'left' | 'right') => {
    const bigSaleList = bigSales[panelYear]
    return (
      <Panel>
        <PanelHeader>
          <PrevIcon
            onClick={() => setYear(year - 1)}
            style={{ visibility: position === 'left' ? 'unset' : 'hidden' }}
          />
          {panelYear} Campaign
          <NextIcon
            onClick={() => setYear(year + 1)}
            style={{ visibility: position === 'right' ? 'unset' : 'hidden' }}
          />
        </PanelHeader>
        <PanelContent>
          {bigSaleList ? (
            <Row gutter={[0, 8]}>
              {bigSaleList.map(bigSale => (
                <Col key={bigSale.bigSaleId} span={6}>
                  <PannelInner
                    key={bigSale.bigSaleId}
                    selected={selectedDate.some(time => formatBigSaleToDate(bigSale).isSame(time))}
                    selectable={isBigSaleSelectable(bigSale)}
                    isInRange={isBigSaleInSpecifyRange(bigSale, selectedDate) || isBigSaleInSelectingRange(bigSale)}
                    onClick={() => handleSelectBigSale(bigSale)}
                    onMouseOver={() => onMouseOver(bigSale)}
                    onMouseOut={() => setMouseOverDate(undefined)}
                  >
                    {bigSale.month}.{bigSale.day}
                  </PannelInner>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty>No Campaign</Empty>
          )}
        </PanelContent>
      </Panel>
    )
  }

  const panelRender = () => {
    return (
      <PanelContainer className='ant-picker-panel-container'>
        {renderPanel(year - 1, 'left')}
        {renderPanel(year, 'right')}
      </PanelContainer>
    )
  }

  return (
    <DatePicker.RangePicker
      open={open}
      onChange={handleChange}
      onOpenChange={handleOpenChange}
      format={(value: Moment) => `${value.format('M.D')} Campaign ${value.format('YYYY')}`}
      value={selectedDate}
      placeholder={['Start', 'End']}
      panelRender={panelRender}
      style={style}
    />
  )
}

export default CampaignPicker
