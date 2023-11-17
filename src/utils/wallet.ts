import { isDesktop, isIOS } from 'react-device-detect'
import { notification } from 'antd'

type Provider = any
type AssetProps = {
  address: string
  symbol: string
  name: string
  decimals: number
  icon?: string
  avatar?: string
  chainId?: string | number
}
type ChainProps = {
  chainId: number
  name: string
  rpcUrl: string
  scanUrl: string
  icon: string
  currencySymbol?: string
  status?: number
}

/**
 * Prompt the user to add PLATON as a network on Metamask, or switch to PLATON if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (
  chainConfig: ChainProps,
  externalProvider?: Provider
) => {
  const provider = externalProvider || window.ethereum
  if (!provider) {
    throw new Error('missing provider')
  }
  const chainId = Number(chainConfig.chainId)
  const switchChain = () =>
    provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: chainConfig.name,
          nativeCurrency: {
            name: chainConfig.currencySymbol,
            symbol: chainConfig.currencySymbol,
            decimals: 18
          },
          rpcUrls: [chainConfig.rpcUrl],
          blockExplorerUrls: [chainConfig.scanUrl]
        }
      ]
    })

  return provider
    .request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }]
    })
    .then((r: any) => {
      // sb coin98 插件切换失败时是 resolve 而非 reject, coinbase 的添加网络也有问题，已经添加还会继续报未添加的错， 拒绝了也不会 reject
      if ([-32603, 4902].includes(r?.code)) {
        return switchChain()
      }

      return r
    })
    .catch((e: any) => {
      // -32603 为手机端 metamask app 报错的 code
      if ([-32603, 4902].includes(e?.code)) {
        return switchChain()
      }

      return Promise.reject(e)
    })
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const watchAsset = async (
  token: AssetProps,
  externalProvider?: Provider
) => {
  const provider = externalProvider || window.ethereum
  if (!provider) {
    throw new Error('missing provider')
  }
  const tokenAdded = await provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: token.icon
      }
    }
  })

  return tokenAdded
}

const showSuccessMsg = () =>
  notification.success({
    message: 'Succeeded',
    description: 'Added to wallet successfully!'
  })
const showFailedMsg = (msg: string) =>
  notification.error({ message: 'Failed', description: msg })

const isBitgetWallet = (provider: any) =>
  provider?.isBitKeep || provider?.isBitEthereum
const isTrustWallet = (provider: any) =>
  provider?.isTrust || provider?.isTrustWallet
const isTokenPocket = (provider: any) => provider?.isTokenPocket
const isOkxWallet = () => window.okxwallet || window.okxwallet
const isCoinbaseWallet = (provider: any) => provider?.isCoinbaseWallet
const isParticleWallet = (provider: any) =>
  provider?.isParticle || provider?.isParticleNetwork

const ALREADY_ADDED_MSG = 'Already added!'
const REJECT_MSG = 'User reject the request.'
const FAILED_TO_ADD_MSG = 'Failed to add to wallet.'
const UNSUPPORTED_MSG = 'Adding token is not supported by the wallet.'

const getResolvedCb = (result: any, provider: any) => {
  if (isDesktop) {
    if (isTrustWallet(provider)) {
      return showSuccessMsg
    }

    if (isTokenPocket(provider) || isCoinbaseWallet(provider)) {
      return () => {
        if (result === true) {
          showSuccessMsg()
        } else {
          showFailedMsg(REJECT_MSG)
        }
      }
    }

    // 默认按照 metamask 返回的结果逻辑
    return () => {
      if (result === true) {
        showSuccessMsg()
      } else {
        showFailedMsg(FAILED_TO_ADD_MSG)
      }
    }
  } else {
    // app 浏览器端
    if (isBitgetWallet(provider)) {
      // bitget app 返回的东西无法分清成功失败，全依赖于内部的提示
      return () => {}
    }

    if (isOkxWallet()) {
      return () => {
        if (isIOS) {
          showSuccessMsg()
        } else {
          if (result === true) {
            showSuccessMsg()
          } else {
            showFailedMsg(FAILED_TO_ADD_MSG)
          }
        }
      }
    }

    if (isCoinbaseWallet(provider)) {
      return () => {
        if (result === true) {
          showSuccessMsg()
        } else {
          showFailedMsg(REJECT_MSG)
        }
      }
    }

    // 默认按照 metamask 返回的结果逻辑
    return () => {
      if (result === true) {
        showSuccessMsg()
      } else {
        showFailedMsg(FAILED_TO_ADD_MSG)
      }
    }
  }
}

const getRejectedCb = (error: any, provider: any) => {
  const msg = typeof error === 'string' ? error : error?.message
  const errMsg = msg || FAILED_TO_ADD_MSG

  if (
    provider?.isUniPassProvider ||
    isParticleWallet(provider) ||
    provider?.isWalletConnect
  ) {
    return () => {
      showFailedMsg(UNSUPPORTED_MSG)
    }
  }

  if (isDesktop) {
    if (isTrustWallet(provider)) {
      return () => {
        if (error?.code === -32602) {
          showFailedMsg(ALREADY_ADDED_MSG)
        } else {
          showFailedMsg(errMsg)
        }
      }
    }
  }

  return () => {
    showFailedMsg(errMsg)
  }
}

export const onWatchAsset = async (
  chainConfig: ChainProps,
  tokenInfo: AssetProps,
  provider: any
) => {
  try {
    await setupNetwork(chainConfig, provider)

    const result = await watchAsset(tokenInfo, provider)
    const cb = getResolvedCb(result, provider)

    cb()
  } catch (error: any) {
    const cb = getRejectedCb(error, provider)

    cb()
  }
}
