import { css } from 'styled-components'

/**
 * tag function which is similar to "css" from 'styled-components'
 * only when props[key] is defined, it will add the css property
 *
 * eg:
 *   ${(props) => ifPropsDefined(props, 'width')`
 *     .foo {
 *       width: ${props.width};
 *     }
 *   `}
 * equal to:
 *  ${(props) => props.width !== undefined &&
 *   css`
 *      .foo {
 *       width: ${props.width};
 *     }
 *   `
 *  }
 *
 * @param props
 * @param key
 */
export const ifPropsDefined = <TPropsType>(props: TPropsType, key: keyof TPropsType) => {
  if (props[key] !== undefined) {
    return css
  }
  return () => css``
}

/**
 * tag function which is similar to "css" from 'styled-components'
 * only when props[key] is true, it will add the css property
 *
 * eg:
 *   ${(props) => ifPropsDefined(props, 'isBar')`
 *     .foo {
 *       width: auto;
 *     }
 *   `}
 * equal to:
 *  ${(props) => props.isBar === true &&
 *   css`
 *      .foo {
 *       width: auto;
 *     }
 *   `
 *  }
 *
 * @param props
 * @param key
 */
export const ifPropsTruthy = <TPropsType>(props: TPropsType, key: keyof TPropsType) => {
  if (props[key]) {
    return css
  }
  return () => css``
}

/**
 * return some style for reset annoying css initial style
 * usage: style.div`
 *  ${() => resetCSS()}
 * `
 */
export const resetCSS = () => css`
  p {
    margin: 0;
  }

  ol,
  ul {
    list-style: none;
  }
`
