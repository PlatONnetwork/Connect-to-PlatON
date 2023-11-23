import { Modal, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import walletList from '@/connectors/injectWallet'

const Connector = (props: any) => {
  const { t } = useTranslation()
  const { showConnectors, setShowConnectors } = props
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 0,
          colorBgElevated: `rgba(26, 26, 26, 1)`,
          colorText: `#fff`,
          colorIcon: `#fff`,
          fontFamily: `font-b`,
        },
      }}
    >
      <Modal
        destroyOnClose
        onCancel={() => setShowConnectors(false)}
        footer={null}
        title={t('home.chooseWallet')}
        open={showConnectors}
      >
        <ul className="flex-col flex-center gap-[12px] my-[30px]">
          {walletList.map(item => {
            return (
              <li
                onClick={() => {
                  item.connect()
                  setShowConnectors(false)
                }}
                key={item.id}
                className="w-[250px] h-[64px] pointer bg-[#000] flex-center text-left rounded-[30px]"
              >
                <p className="w-[120px] flex items-center gap-[20px]">
                  <img className="w-[32px] h-[32px]" src={item.icon} alt="" />
                  <span>{item.name}</span>
                </p>
              </li>
            )
          })}
        </ul>
      </Modal>
    </ConfigProvider>
  )
}

export default Connector
