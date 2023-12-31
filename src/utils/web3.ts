import { NETWORK, TOKEN } from '@/config/type'
import i18n from '@/i18n'

class web3Class {
  public provider: any
  constructor() {
    if (!window.ethereum) {
      console.log(i18n.t('home.noWallet'))
    }
    this.provider = window.ethereum
  }

  connectWallet = () => this.provider.request({ method: 'eth_requestAccounts' })

  getChianId = () => this.provider.request({ method: 'eth_chainId' })

  switchNetwork = async (network: NETWORK) => {
    return new Promise(async (resolve, reject) => {
      const switch_data = {
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(network.chainId).toString(16)}` }], // A 0x-prefixed hexadecimal string
      }
      const add_data = {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainName: network.network,
            chainId: `0x${Number(network.chainId).toString(16)}`,
            rpcUrls: [network.rpc],
            nativeCurrency: {
              name: network.currency,
              symbol: network.currency,
              decimals: network.decimal,
            },
            blockExplorerUrls: [network.explorer],
          },
        ],
      }

      const addNet = async (resolve, reject) => {
        try {
          const add = await this.provider.request(add_data)
          resolve(add)
        } catch (addError) {
          reject(addError)
        }
      }

      try {
        const res = await this.provider.request(switch_data)
        console.log('switch net', res)
        if ([-32603, 4902].includes(res?.code)) {
          addNet(resolve, reject)
        }
        resolve(res)
      } catch (error) {
        if (error.code === 4902 || (error.code === -32603 && error.data.originalError.code === 4902)) {
          addNet(resolve, reject)
        } else {
          reject(error)
        }
      }
    })
  }

  addToken = async (token: TOKEN) => {
    if (!this.provider) {
      throw new Error('missing provider')
    }
    const tokenAdded = this.provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.contractAddress,
          symbol: token.symbol,
          decimals: token.decimal,
          image: token.icon,
        },
      },
    })

    return tokenAdded
  }
}

export default new web3Class()
