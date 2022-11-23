## SegmentedProgress

`SegmentedProgress` is a segmented progress bar.

## Examples

### Basic

```tsx
import React from 'react'
import { SegmentedProgress } from '@infra/components'

const BasicUsage = () => {
  return <SegmentedProgress 
    title = 'CPU'
    segments={[
      {value: 10, color: '#4D94EB', title: 'Segment1', unit:'Cores', tooltipText: 'segment tooltip text'},
      {value: 50, color: '#A6D4FF',title: 'Segment2', unit:'Cores'}, 
      {value: 100,  color: '#F5F5F5',title: 'Total', unit:'Cores'}
    ]} 
  />
}

export default BasicUsage
```

### Multiple Segments

 When there are segments with the same value, pls provide level for these segments, the segmentedProgress will display the segment of highest level, the segments of lower level will be overwritten.

```tsx
import React from 'react'
import { SegmentedProgress } from '@infra/components'

const MultipleSegmentsUsage = () => {
  return <SegmentedProgress 
    title = 'CPU'
    segments={[
      {value: 10, color: '#20B2AA', title: 'Segment1', unit:'Cores', },
      {value: 20, color: '#4D94EB', title: 'Segment2', unit:'Cores', level: 2},
      {value: 20, color: '#40E0D0', title: 'Segment3', unit:'Cores', level: 4},
      {value: 20, color: '#FFF68F', title: 'Segment4', unit:'Cores', level: 1},
      {value: 50, color: '#A6D4FF', title: 'Segment5', unit:'Cores', level: 1},
      {value: 50, color: '#F4A460', title: 'Segment6',  level: 5},
      {value: 100,  color: '#F5F5F5', title: 'Total', unit:'Cores'}
    ]} 
  />
}

export default MultipleSegmentsUsage
```

### Custom Segment LegendRender

```tsx
import React from 'react'
import { SegmentedProgress } from '@infra/components'
import { Statistic } from 'infrad'

const CustomSegmentLegendRender = () => {
  return <SegmentedProgress 
    title = 'CPU'
    height={20}
    segments={[
      {value: 10, color: '#4D94EB', title: 'Segment1', unit:'Cores', tooltipText: 'text', legendRender: (
        <Statistic title="segment1" value={10} />
      )},
      {value: 20, color: '#A6D4FF',title: 'Segment2', unit:'Cores'}, 
      {value: 100,  color: '#F5F5F5',title: 'Total', unit:'Cores'}
    ]} 
  />
}

export default CustomSegmentLegendRender
```

### Hidden SegmentsLegend

```tsx
import React from 'react'
import { SegmentedProgress } from '@infra/components'
import { Space, Tag } from 'infrad'

const CustomSegmentProgressStyle = () => {
  return <SegmentedProgress 
    legendVisible = {false}
    title = 'CPU'
    segments={[
      {value: 10, color: '#4D94EB', title: 'Segment1', tooltipText: 'text'},
      {value: 20, color: '#A6D4FF',title: 'Segment2', unit:'Cores'}, 
      {value: 100,  color: '#F5F5F5',title: 'Total', unit:'Cores'}
    ]} 
  />
}

export default CustomSegmentProgressStyle
```

### Custom ProgressStyle

```tsx
import React from 'react'
import { SegmentedProgress } from '@infra/components'
import { Typography } from 'infrad'
const { Text } = Typography

const CustomSegmentProgressStyle = () => {
  return <SegmentedProgress 
    width={100}
    height={8}
    title = {
     <div style={{fontSize: '14px', fontWeight: '400', marginBottom: '4px'}}>1.6/8 Cores</div>
    }
    segments={[
      {value: 1.6, color: '#A6D4FF', title: 'Segment1', tooltipText: 'text', legendRender: ( <Text type="secondary" style={{marginTop: '-20px'}}>20%</Text>)},
      {value: 8,  color: '#F5F5F5',title: 'Total', unit:'Cores', legendRender: null}
    ]} 
    progressStyle={{ borderRadius: '23px'}}
  />
}

export default CustomSegmentProgressStyle
```

## Notes

The input segments should be sorted in ascending order by value.<br>

For example

```
 segments={[
      {value: 10, color: '#4D94EB', title: 'Segment1', unit:'Cores'},
      {value: 50, color: '#A6D4FF',title: 'Segment2', unit:'Cores'}, 
      {value: 100,  color: '#F5F5F5',title: 'Total', unit:'Cores'}
    ]} 
```
Instead of

```
 segments={[
      {value: 50, color: '#A6D4FF',title: 'Segment2', unit:'Cores'}, 
      {value: 10, color: '#4D94EB', title: 'Segment1', unit:'Cores'},
      {value: 100,  color: '#F5F5F5',title: 'Total', unit:'Cores'}
    ]} 
```

<API></API>

### ISegment props

Name|Description|Type|Default
---|--|---|---
value|Value of quota|`number`|`(required)`
color|Color of quota|`Color`|`(required)`
title|Title of quota|`ReactNode`|`(required)`
unit|Unit of quota|`string`|`-`
tooltipText|TooltipText of quota|`string`|`-`
legendRender|QuotaInfo to display the value and unit for quota|`ReactNode`|`-`
level|Level of segment|`number`|`-`
