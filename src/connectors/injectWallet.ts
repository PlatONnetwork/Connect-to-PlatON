import CallApp from 'callapp-lib'
import metamaskIcon from '@/assets/img/wallets/metamask.png'
import tokenPocketIcon from '@/assets/img/wallets/tp-icon-32.png'
import bitgetIcon from '@/assets/img/wallets/bitget-icon-60.png'
import imTokenIcon from '@/assets/img/wallets/imToken.png'
import coin98Icon from '@/assets/img/wallets/c98-logo.png'
import okexWalletIcon from '@/assets/img/wallets/okc-icon-32.png'
import coinbaseIcon from '@/assets/img/wallets/coinbase-icon-32.png'

export const callMetamaskApp = () =>
  window.open(`https://metamask.app.link/dapp/${window.location.host}`, '_blank', 'noopener noreferrer')

export const callImTokenWalletApp = () =>
  new CallApp({
    scheme: {
      protocol: 'imtokenv2',
    },
    appstore: 'https://token.im/download',
    fallback: 'https://token.im/download',
  }).open({
    path: 'navigate/DappView',
    param: {
      url: window.location.href,
    },
  })

export const callBitgetApp = () =>
  window.open(
    `https://bkcode.vip?action=dapp&url=${encodeURI(window.location.origin)}`,
    '_blank',
    'noopener noreferrer'
  )

export const callTpWalletApp = () =>
  new CallApp({
    scheme: {
      protocol: 'tpdapp',
    },
    appstore: 'https://www.tokenpocket.pro/en/download/app',
    fallback: 'https://www.tokenpocket.pro/en/download/app',
  }).open({
    path: 'open',
    param: {
      params: encodeURI(JSON.stringify({ url: window.location.origin })),
    },
  })

// export const callTrustWalletApp = () =>
//   new CallApp({
//     scheme: {
//       protocol: 'trust',
//     },
//     appstore: 'https://trustwallet.com/download',
//     fallback: 'https://trustwallet.com/download',
//   }).open({
//     path: '/',
//     param: {
//       url: window.location.origin,
//     },
//   })

export const callOkxWalletApp = () =>
  new CallApp({
    scheme: {
      protocol: 'okx',
    },
    appstore: 'https://www.okx.com/cn/download',
    fallback: 'https://www.okx.com/cn/download',
  }).open({
    path: 'wallet/dapp/details',
    param: {
      dappUrl: window.location.origin,
    },
  })

export const callCoinbaseWalletApp = () =>
  window.open(`https://go.cb-w.com/dapp?cb_url=${encodeURI(window.location.origin)}`, '_blank', 'noopener noreferrer')

export const callCoin98WalletApp = () =>
  window.open(`https://coin98.com/dapp/${window.location.host}/1`, '_blank', 'noopener noreferrer')

const walletList = [
  {
    id: 1,
    name: 'Metamask',
    icon: metamaskIcon,
    connect: callMetamaskApp,
  },
  {
    id: 2,
    name: 'TokenPocket',
    icon: tokenPocketIcon,
    connect: callTpWalletApp,
  },
  {
    id: 3,
    name: 'Bitget',
    icon: bitgetIcon,
    connect: callBitgetApp,
  },
  // {
  //   id: 4,
  //   name: 'ImToken',
  //   icon: imTokenIcon,
  //   connect: callImTokenWalletApp,
  // },
  {
    id: 5,
    name: 'Coin98',
    icon: coin98Icon,
    connect: callCoin98WalletApp,
  },
  {
    id: 6,
    name: 'OkexWallet',
    icon: okexWalletIcon,
    connect: callOkxWalletApp,
  },
  {
    id: 7,
    name: 'Coinbase',
    icon: coinbaseIcon,
    connect: callCoinbaseWalletApp,
  },
]

export default walletList
