import myWeb3 from '@/utils/web3'
import { Dropdown, ConfigProvider } from 'antd'
import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import metamask from '@/assets/img/metamask.png'
import { NETWORK, TOKEN } from '@/config/type'
import { Col, Row } from 'antd'

const Home = () => {
  const [address, setAddress] = useState('')
  const connect = async () => {
    const [addr] = await myWeb3.connectWallet()
    addr && setAddress(addr)
  }

  useEffect(() => {
    !address && connect()
  }, [])

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

  const addNetwork = async (network: NETWORK) => {
    try {
      if (!address) await connect()
      await myWeb3.switchNetwork(network)
    } catch (error) {
      console.log('error:', error)
    }
  }

  const addToken = async (network: NETWORK, token: TOKEN) => {
    try {
      if (!address) await connect()
      const chainId = await myWeb3.getChianId()
      if (network.chainId !== chainId) await myWeb3.switchNetwork(network)
      const res = await myWeb3.addToken(token)
      console.log('res', res)
    } catch (error) {}
  }

  return (
    <div className="flex flex-col">
      <div className="flex-between">
        <div className="flex flex-col gap-[12px]">
          <p className="font-b text-[24px] leading-[24px]">Connect to PlatON</p>
          <p className="text-[#999] text-[14px] leading-[14px]">
            After connecting your wallet, you can quickly add the PlatON network and tokens to your wallet.
          </p>
        </div>
        <div className="h-[40px] leading-[40px] pointer w-btn w-auto">
          {address ? (
            <ConfigProvider
              theme={{
                token: {
                  borderRadius: 0,
                },
              }}
            >
              <Dropdown overlayClassName={`address-dropdown-box`} menu={{ items }}>
                <div className="flex-center px-[20px] gap-[8px]">
                  <img className="w-[24px]" src={metamask} alt="" />
                  {getAddress(address)}
                  <DownOutlined />
                </div>
              </Dropdown>
            </ConfigProvider>
          ) : (
            <div className="flex-center px-[20px] gap-[8px]" onClick={connect}>{`Connect Wallet`}</div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[30px] mt-[30px]">
        {supportList.map(item => {
          return (
            <div className="bg-[#111] p-[40px]" key={item.id}>
              <div className="flex justify-between mb-[22px]">
                <div className="flex-center gap-[18px]">
                  <img src={item.icon} alt="" />
                  <p className="text-[20px] font-b">{item.network}</p>
                </div>
                <div className="btn w-btn" onClick={() => addNetwork(item)}>
                  Add to Wallet
                </div>
              </div>
              <div className="flex-col">
                <div className="b-base w-full flex px-[40px] py-[20px] mb-[20px]">
                  <div className="cell col">
                    <p>ChainID</p>
                    <p>{item.chainId}</p>
                  </div>
                  <div className="cell col">
                    <p>Currency</p>
                    <p>{item.currency}</p>
                  </div>
                  <div className="cell col">
                    <p>RPC URL</p>
                    <a href={item.rpc} target="_blank" rel="nofollow noopener noreferrer">
                      {item.rpc}
                    </a>
                  </div>
                  <div className="cell col">
                    <p>Block Explorer URL</p>
                    <a href={item.explorer} target="_blank" rel="nofollow noopener noreferrer">
                      {item.explorer}
                    </a>
                  </div>
                  {item.faucet && (
                    <div className="cell col">
                      <p>Faucet</p>
                      <a href={item.faucet} target="_blank" rel="nofollow noopener noreferrer">
                        {item.faucet}
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-[20px]">
                  {item.tokens &&
                    item.tokens.map(i => {
                      return (
                        <div className="bg-[#222] flex w-full p-[34px]" key={i.id}>
                          <Col span={6} className="cell flex-start gap-[12px]">
                            <img src={i.icon} alt="" />
                            <p className="whitespace-nowrap">{i.label}</p>
                          </Col>
                          <Col span={10} className="cell">
                            <p>Contract Address</p>
                            <p>{i.contractAddress}</p>
                          </Col>
                          <Col span={2} className="cell">
                            <p>Decimal</p>
                            <p>{i.decimal}</p>
                          </Col>
                          <Col span={6} className="flex justify-end">
                            <div
                              className="btn b-btn"
                              onClick={() => {
                                addToken(item, i)
                              }}
                            >
                              Add to Wallet
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
    </div>
  )
}

export default Home
