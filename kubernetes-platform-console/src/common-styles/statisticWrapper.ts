import styled from 'styled-components'
import { Statistic as AntStatistic } from 'infrad'

export const Statistic: any = styled(AntStatistic)`
  min-width: 10em;
  width: ${(props: any) => props.width || ''};

  .ant-statistic-content {
    color: #555;
  }

  .ant-statistic-title {
    margin-bottom: -5px;
  }

  .ant-statistic-content-value {
    font-size: ${(props: any) => props.fontSize || '1.1em'};
  }

  .ant-statistic-content-suffix {
    font-size: ${(props: any) => props.suffixSize || '0.75em'};
    color: rgba(0, 0, 0, 0.45);
    display: ${(props: any) => props.suffixDisplay || ''};
  }
`
