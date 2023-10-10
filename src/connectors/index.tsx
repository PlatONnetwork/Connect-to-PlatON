import myWeb3 from '@/utils/web3'
import metamaskWallet from '@/assets/img/metamaskWallet.png'

export const connectToMetamask = async () => await myWeb3.connectWallet()

const walletList = [
  {
    id: 0,
    label: 'METAMASK',
    icon: metamaskWallet,
    connect: connectToMetamask,
  },
]

export default walletList
