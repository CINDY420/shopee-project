import * as React from 'react'
import { Typography } from 'infrad'

import googleImg from 'assets/google.png'
import wechatLinkImg from 'assets/wechat_link.png'
import bgHumanImg from 'assets/bg_human.svg'
import { Root, Content, Logo, Guide, Line } from './style'

const { Text, Title } = Typography

const WechatGuidePage = () => {
  return (
    <Root>
      <Content>
        <Line>
          <Guide>
            <Text>Click </Text>
            <img src={googleImg} height='25' width='auto' />
            <Text>on top right corner</Text>
            <img src={wechatLinkImg} height='30' width='auto' />
          </Guide>
        </Line>
        <Line>
          <Text type='secondary'>Please open URL to view details in Chrome</Text>
        </Line>
        <Line>
          <Logo>
            <div />
            <Title level={3}>Kubernetes Platform</Title>
          </Logo>
        </Line>
        <Line>
          <img src={bgHumanImg} width='35%' height='auto' />
        </Line>
      </Content>
    </Root>
  )
}

export default WechatGuidePage
