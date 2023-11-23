import { isDesktop, isMobileOnly, isIOS } from 'react-device-detect'
import myWeb3 from '@/utils/web3'
import { notification, Col } from 'antd'
import { NETWORK, TOKEN } from '@/config/type'
import errorHandler from '@/utils/errorHandler'
import { useTranslation } from 'react-i18next'
import { useGlobal } from '@/context/GlobalProvider'

const Home = () => {
  const { t, i18n } = useTranslation()
  const [curNetwork, setCurNetwork] = useState<string>('mainnet')
  const [showConnectors, setShowConnectors] = useState<boolean>(false)
  const { lang, address, setAddress } = useGlobal()

  const changeLang = lang => {
    i18n.changeLanguage(lang)
    localStorage.setItem('langToken', lang)
  }

  const isInMobileBrowser = isMobileOnly && !window.ethereum

  useEffect(() => {
    if (lang !== localStorage.getItem('langToken')) {
      changeLang(lang)
    }
  }, [lang])

  useEffect(() => {
    // 在移动端内才自动连接
    isMobileOnly && window.ethereum && connect()
  }, [])
  const connect = async () => {
    const [addr] = await myWeb3.connectWallet()
    addr && setAddress(addr)
  }
  const addNetwork = async (network: NETWORK) => {
    const { chainId } = network
    try {
      if (!window.ethereum) throw new Error(isDesktop ? t('home.missProvider') : t('home.missApp'))
      const curId = await myWeb3.getChianId()
      if (`0x${Number(chainId).toString(16)}` === curId)
        return notification.warning({ message: 'Failed', description: t('home.alreadyAddNet') })
      if (!address) await connect()
      await myWeb3.switchNetwork(network)
    } catch (error) {
      errorHandler(error)
    }
  }
  const showSuccessMsg = () =>
    notification.success({
      message: 'Succeeded',
      description: 'Added to wallet successfully!',
    })
  const showFailedMsg = (msg: string) => notification.error({ message: 'Failed', description: msg })

  const isBitgetWallet = (provider: any) => provider?.isBitKeep || provider?.isBitEthereum
  const isTrustWallet = (provider: any) => provider?.isTrust || provider?.isTrustWallet
  const isTokenPocket = (provider: any) => provider?.isTokenPocket
  const isOkxWallet = () => window.okxwallet || window.okxwallet
  const isCoinbaseWallet = (provider: any) => provider?.isCoinbaseWallet
  const isParticleWallet = (provider: any) => provider?.isParticle || provider?.isParticleNetwork

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

    if (provider?.isUniPassProvider || isParticleWallet(provider) || provider?.isWalletConnect) {
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

  const addToken = async (network: NETWORK, token: TOKEN) => {
    try {
      if (!window.ethereum) throw new Error(isDesktop ? t('home.missProvider') : t('home.missApp'))
      if (!address) await connect()
      const chainId = await myWeb3.getChianId()
      if (network.chainId !== chainId) await myWeb3.switchNetwork(network)
      const result = await myWeb3.addToken(token)
      const cb = getResolvedCb(result, myWeb3.provider)
      cb()
    } catch (error) {
      console.log('error', error)
      const cb = getRejectedCb(error, myWeb3.provider)
      cb()
    }
  }

  const networkData = useMemo(() => supportList[curNetwork], [supportList, curNetwork])

  return (
    <div className="flex flex-col">
      <div className="flex-between lt-md:flex-col px-[24px]">
        <div className="flex flex-col gap-[12px] lt-md:mt-[24px] ">
          <p className="font-b text-[24px] leading-[24px]">{t('home.connectTo')} PlatON</p>
          <p className="text-[#999] text-[14px] leading-[14px]">{t('home.slogan')}</p>
        </div>
        <div className="flex relative bg-[#000] border-[1px] m-[2px] border-solid border-[#fff] w-[210px] h-[40px] lt-md:mt-[30px] lt-md:w-[100%]">
          <div
            onClick={() => {
              setCurNetwork('mainnet')
            }}
            className={`flex-1 flex-center font-m text-[14px] leading-[16px] pointer`}
          >
            Mainnet
          </div>
          <div
            onClick={() => {
              setCurNetwork('devnet')
            }}
            className={`flex-1 flex-center font-m text-[14px] leading-[16px] pointer`}
          >
            Devnet
          </div>
          <div
            className={`${
              curNetwork === 'mainnet' ? 'left-[2px]' : isMobileOnly ? 'left-[calc(50%-2px)]' : 'left-[104px]'
            } transition-all-200  w-[102px] bg-[#fff] absolute top-[2px] h-[34px] flex-center font-m text-[14px] leading-[16px] pointer text-[#000] lt-md:w-[50%]`}
          >
            {curNetwork === 'mainnet' ? 'Mainnet' : 'Devnet'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[30px] mt-[80px] mb-[65px] lt-md:mt-[30px]">
        {/* {supportList[curNetwork].map(item => {
          return ( */}
        <div className="bg-[#111] p-[40px] lt-md:p-[24px]" key={networkData.id}>
          <div className="flex justify-between mb-[22px]">
            <div className="flex-center gap-[18px]">
              <img src={networkData.icon} alt="" />
              <p className="text-[20px] font-b">{networkData.netLabel}</p>
            </div>
            {isMobileOnly ? (
              ''
            ) : (
              <div
                className="btn w-btn"
                onClick={() => {
                  // 非mobile端，点击按钮直接连接
                  addNetwork(networkData)
                }}
              >
                {t('home.addToWallet')}
              </div>
            )}
          </div>
          <div className="flex-col">
            <div className="b-base w-full flex px-[40px] py-[20px] mb-[20px] lt-xxl:flex-wrap lt-md:p-0">
              <div className="cell col">
                <p>{t('home.chainId')}</p>
                <p>{networkData.chainId}</p>
              </div>
              <div className="cell col">
                <p>{t('home.currency')}</p>
                <p>{networkData.currencyLabel}</p>
              </div>
              <div className="cell col">
                <p>{t('home.rpc')}</p>
                <p>{networkData.rpc}</p>
              </div>
              <div className="cell col">
                <p>{t('home.explorer')}</p>
                <a href={networkData.explorer} target="_blank" rel="nofollow noopener noreferrer">
                  {networkData.explorer}
                </a>
              </div>
              {networkData.faucet && (
                <div className="cell col">
                  <p>{t('home.faucet')}</p>
                  <a href={networkData.faucet} target="_blank" rel="nofollow noopener noreferrer">
                    {networkData.faucet}
                  </a>
                </div>
              )}
            </div>
            {isMobileOnly ? (
              <div
                className="btn w-btn important-w-full mb-[30px]"
                onClick={() => {
                  // mobile端，点击按钮弹出连接框
                  if (window.ethereum) {
                    //已在钱包内
                    setShowConnectors(true)
                  } else {
                    addNetwork(networkData)
                  }
                }}
              >
                {t('home.addToWallet')}
              </div>
            ) : (
              ''
            )}
            <div className="flex flex-col gap-[20px]">
              {networkData.tokens &&
                networkData.tokens.map(i => {
                  return (
                    <div
                      className="bg-[#222] flex w-full p-[34px] lt-xl:flex-wrap lt-xl:gap-[20px] lt-md:p-[20px]"
                      key={i.id}
                    >
                      <Col span={isMobileOnly ? 24 : 6} className="cell flex-start gap-[12px] min-w-[200px]">
                        <img src={i.icon} alt="" />
                        <p className="whitespace-nowrap font-b text-[20px]">{i.label}</p>
                      </Col>
                      <Col span={isMobileOnly ? 24 : 10} className="cell">
                        <p>{t('home.contractAddress')}</p>
                        <p
                          onClick={() => {
                            copyFn(i.contractAddress)
                          }}
                          className="contractAddress pointer"
                        >
                          {i.contractAddress}
                        </p>
                      </Col>
                      <Col span={isMobileOnly ? 24 : 2} className="cell min-w-[200px]">
                        <p>{t('home.decimal')}</p>
                        <p>{i.decimal}</p>
                      </Col>
                      <Col span={isMobileOnly ? 24 : 6} className="flex justify-end">
                        <div
                          className="btn b-btn lt-md:important-w-full shrink-0"
                          onClick={() => {
                            if (isInMobileBrowser) {
                              setShowConnectors(true)
                            } else {
                              addToken(networkData, i)
                            }
                          }}
                        >
                          {t('home.addToWallet')}
                        </div>
                      </Col>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
        {/* )
        })} */}
      </div>
      <Connector showConnectors={showConnectors} setShowConnectors={setShowConnectors} />
    </div>
  )
}

export default Home
