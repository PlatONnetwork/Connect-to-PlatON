import myWeb3 from '@/utils/web3'
import { Dropdown, ConfigProvider, MenuProps, Col, message } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import metamask from '@/assets/img/metamask.png'
import { NETWORK, TOKEN } from '@/config/type'
import errorHandler from '@/utils/errorHandler'
import useClientSize from '@/hooks/useClientSize'
import { useTranslation } from 'react-i18next'
import { useGlobal } from '@/context/GlobalProvider'

const Home = () => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const { lang, address, setAddress } = useGlobal()
  const { clientWidth } = useClientSize()
  const isMobile = useMemo(() => clientWidth <= 640, [clientWidth])

  const changeLang = lang => {
    i18n.changeLanguage(lang)
    localStorage.setItem('langToken', lang)
  }

  useEffect(() => {
    console.log('lang has changed?', lang, localStorage.getItem('langToken'))
    if (lang !== localStorage.getItem('langToken')) {
      changeLang(lang)
    }
  }, [lang])

  const items: MenuProps['items'] = [
    {
      label: <div onClick={() => copyFn(address)}>Copy Address</div>,
      key: '0',
    },
    {
      label: <div onClick={() => setAddress('')}>Disconnect</div>,
      key: '1',
    },
  ]
  const connect = async () => {
    const [addr] = await myWeb3.connectWallet()
    addr && setAddress(addr)
  }
  const addNetwork = async (network: NETWORK) => {
    try {
      if (!address) await connect()
      await myWeb3.switchNetwork(network)
      message.success(t('home.addSuccess'))
    } catch (error) {
      errorHandler(error)
    }
  }

  const addToken = async (network: NETWORK, token: TOKEN) => {
    try {
      if (!address) await connect()
      const chainId = await myWeb3.getChianId()
      if (network.chainId !== chainId) await myWeb3.switchNetwork(network)
      await myWeb3.addToken(token)
      message.success(t('home.addSuccess'))
    } catch (error) {
      errorHandler(error)
    }
  }

  return (
    <div className="flex flex-col ">
      <div className="flex-between lt-md:flex-col">
        <div className="flex flex-col gap-[12px] lt-md:mt-[24px]">
          <p className="font-b text-[24px] leading-[24px]">{t('home.connectTo')} PlatON</p>
          <p className="text-[#999] text-[14px] leading-[14px]">{t('home.slogan')}</p>
        </div>
        <div className="h-[40px] leading-[40px] pointer b-btn w-auto lt-md:w-full lt-md:mt-[16px]">
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
        </div>
      </div>
      <div className="flex flex-col gap-[30px] mt-[30px] mb-[65px]">
        {supportList.map(item => {
          return (
            <div className="bg-[#111] p-[40px] lt-md:p-[24px]" key={item.id}>
              <div className="flex justify-between mb-[22px]">
                <div className="flex-center gap-[18px]">
                  <img src={item.icon} alt="" />
                  <p className="text-[20px] font-b">{item.network}</p>
                </div>
                {isMobile ? (
                  ''
                ) : (
                  <div className="btn w-btn" onClick={() => addNetwork(item)}>
                    {t('home.addToWallet')}
                  </div>
                )}
              </div>
              <div className="flex-col">
                <div className="b-base w-full flex px-[40px] py-[20px] mb-[20px] lt-xxl:flex-wrap lt-md:p-0">
                  <div className="cell col">
                    <p>{t('home.chainId')}</p>
                    <p>{item.chainId}</p>
                  </div>
                  <div className="cell col">
                    <p>{t('home.currency')}</p>
                    <p>{item.currency}</p>
                  </div>
                  <div className="cell col">
                    <p>{t('home.rpc')}</p>
                    <a href={item.rpc} target="_blank" rel="nofollow noopener noreferrer">
                      {item.rpc}
                    </a>
                  </div>
                  <div className="cell col">
                    <p>{t('home.explorer')}</p>
                    <a href={item.explorer} target="_blank" rel="nofollow noopener noreferrer">
                      {item.explorer}
                    </a>
                  </div>
                  {item.faucet && (
                    <div className="cell col">
                      <p>{t('home.faucet')}</p>
                      <a href={item.faucet} target="_blank" rel="nofollow noopener noreferrer">
                        {item.faucet}
                      </a>
                    </div>
                  )}
                </div>
                {isMobile ? (
                  <div className="btn w-btn important-w-full mb-[30px]" onClick={() => addNetwork(item)}>
                    {t('home.addToWallet')}
                  </div>
                ) : (
                  ''
                )}
                <div className="flex flex-col gap-[20px]">
                  {item.tokens &&
                    item.tokens.map(i => {
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
                                addToken(item, i)
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
          )
        })}
      </div>
      <Connector open={open} setOpen={setOpen} connect={connect} />
    </div>
  )
}

export default Home
