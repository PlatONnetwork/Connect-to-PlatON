import { isDesktop, isMobile, isIOS } from 'react-device-detect'
import myWeb3 from '@/utils/web3'
import { notification, Col, message } from 'antd'
import { NETWORK, TOKEN } from '@/config/type'
import errorHandler from '@/utils/errorHandler'
import { useTranslation } from 'react-i18next'
import { useGlobal } from '@/context/GlobalProvider'

const Home = () => {
  const { t, i18n } = useTranslation()
  const [curNetwork, setCurNetwork] = useState('mainnet')
  const [open, setOpen] = useState(false)
  const { lang, address, setAddress } = useGlobal()

  const changeLang = lang => {
    i18n.changeLanguage(lang)
    localStorage.setItem('langToken', lang)
  }

  useEffect(() => {
    if (lang !== localStorage.getItem('langToken')) {
      changeLang(lang)
    }
  }, [lang])

  useEffect(() => {
    // 在移动端内才自动连接
    isMobile && window.ethereum && connect()
  }, [])
  const connect = async () => {
    // if (isMobile && !window.ethereum) // 不一定是metamask
    //   return (window.location.href = 'https://metamask.app.link/dapp/uataddnetwork.platon.network/')
    const [addr] = await myWeb3.connectWallet()
    addr && setAddress(addr)
  }
  const addNetwork = async (network: NETWORK) => {
    const { chainId } = network
    try {
      if (!window.ethereum) throw new Error('missing provider')
      const curId = await myWeb3.getChianId()
      if (`0x${Number(chainId).toString(16)}` === curId) return message.warning(t('home.alreadyAddNet'))
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
      if (!address) await connect()
      if (!window.ethereum) throw new Error('missing provider')
      const chainId = await myWeb3.getChianId()
      if (network.chainId !== chainId) await myWeb3.switchNetwork(network)
      const result = await myWeb3.addToken(token)
      console.log('result', result)
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
        {/* <div className="h-[40px] leading-[40px] pointer b-btn w-auto lt-md:w-full lt-md:mt-[16px]">
          {address ? (
            <ConfigProvider
              theme={{
                token: {
                  borderRadius: 0,
                  colorBgElevated: `rgba(17, 17, 17, 1)`,
                  colorText: `#fff`,
                  controlPaddingHorizontal: 14,
                  controlItemBgHover: `rgba(255,255,255,0.1)`,
                },
              }}
            >
              <Dropdown overlayClassName={`address-dropdown-box`} menu={{ items }}>
                <div className="flex-center px-[20px] gap-[20px]">
                  <img className="w-[24px]" src={metamask} alt="" />
                  {getAddress(address)}
                  <DownOutlined />
                </div>
              </Dropdown>
            </ConfigProvider>
          ) : (
            <div className="flex-center px-[20px] gap-[8px]" onClick={() => setOpen(true)}>
              {t('home.connectWallet')}
            </div>
          )}
        </div> */}
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
              curNetwork === 'mainnet' ? 'left-[2px]' : isMobile ? 'left-[calc(50%-2px)]' : 'left-[104px]'
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
            {isMobile ? (
              ''
            ) : (
              <div className="btn w-btn" onClick={() => addNetwork(networkData)}>
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
            {isMobile ? (
              <div className="btn w-btn important-w-full mb-[30px]" onClick={() => addNetwork(networkData)}>
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
                      <Col span={isMobile ? 24 : 6} className="cell flex-start gap-[12px] min-w-[200px]">
                        <img src={i.icon} alt="" />
                        <p className="whitespace-nowrap font-b text-[20px]">{i.label}</p>
                      </Col>
                      <Col span={isMobile ? 24 : 10} className="cell">
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
                      <Col span={isMobile ? 24 : 2} className="cell min-w-[200px]">
                        <p>{t('home.decimal')}</p>
                        <p>{i.decimal}</p>
                      </Col>
                      <Col span={isMobile ? 24 : 6} className="flex justify-end">
                        <div
                          className="btn b-btn lt-md:important-w-full shrink-0"
                          onClick={() => {
                            addToken(networkData, i)
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
      <Connector open={open} setOpen={setOpen} connect={connect} />
    </div>
  )
}

export default Home
