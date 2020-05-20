import { createGlobalStyle } from 'styled-components'

import { colors } from 'utils/style/colors'
import { largerThan } from 'utils/style/responsive'

const GlobalStyle = createGlobalStyle`
  @charset "UTF-8";
  *,
  :after,
  :before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body,
  html {
    height: 100%;
  }
  img {
    vertical-align: middle;
    border: 0;
    max-width: 100%;
  }
  body {
    color: ${colors.black};
    display: flex;
    flex-direction: column;
    font-family: Vazir, Helvetica Neue;
    font-size: 14px;
    letter-spacing: 0.01em;
    line-height: 1.8;
    margin: 0;
    padding: 0;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
    color: ${colors.black};
  }
  h1 {
    font-size: 2.2rem;
    @media ${largerThan.mobile} {
      font-size: 2.5rem;
    }
  }
  h2 {
    font-size: 1.8rem;
    @media ${largerThan.mobile} {
      font-size: 2rem;
    }
  }
  h3 {
    font-size: 1.3rem;
    @media ${largerThan.mobile} {
      font-size: 1.5rem;
    }
  }
  h4 {
    font-size: 1.1rem;
    @media ${largerThan.mobile} {
      font-size: 1.2rem;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0px;
    margin-bottom: 1rem;
    font-weight: 700;
    line-height: 1.4
  }
  b {
    font-weight: 700;
  }
  p {
    font-size: 1rem;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    height: 0;
    width: 100%;
    box-sizing: initial;
    border-top: 1px solid #eee;
  }
  div > svg {
    display: block;
  }
  textarea {
    resize: none;
  }
  button {
    background-color: initial;
    border: 0;
    padding: 0;
  }
  input,
  select,
  textarea,
  button {
    font-family:inherit;
  }
  table {
    border-collapse: initial;
    border-spacing: 2px;
    width: 100%;
    margin-bottom: 1.25rem;
    table-layout: auto;
  }
  table thead th,
  table tr td {
    padding: 0.5625rem 0.625rem;
  }
  @font-face {
    font-family: Vazir;
    src: url('assets/fonts/vazir/Vazir.eot');
    src: url('assets/fonts/vazir/Vazir.eot?#iefix') format('embedded-opentype'),
      url('assets/fonts/vazir/Vazir.woff2') format('woff2'),
      url('assets/fonts/vazir/Vazir.woff') format('woff'),
      url('assets/fonts/vazir/Vazir.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: Vazir;
    src: url('assets/fonts/vazir/Vazir-Bold.eot');
    src: url('assets/fonts/vazir/Vazir-Bold.eot?#iefix') format('embedded-opentype'),
      url('assets/fonts/vazir/Vazir-Bold.woff2') format('woff2'),
      url('assets/fonts/vazir/Vazir-Bold.woff') format('woff'),
      url('assets/fonts/vazirfonts/vazir/Vazir-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
  }
`

export default GlobalStyle
