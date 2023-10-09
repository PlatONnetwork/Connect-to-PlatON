import { Modal, ConfigProvider } from 'antd'
import { useTranslation } from 'react-i18next'
import metamaskWallet from '@/assets/img/metamaskWallet.png'

const Connector = (props: any) => {
  const { t } = useTranslation()
  const { open, setOpen } = props

  console.log('open', open)

  const walletList = [
    {
      id: 0,
      label: 'METAMASK',
      icon: metamaskWallet,
    },
  ]

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
      <Modal destroyOnClose onCancel={() => setOpen(false)} footer={null} title={t('home.connectWallet')} open={open}>
        <ul className="flex-center gap-[12px] my-[60px]">
          {walletList.map(item => {
            return (
              <li key={item.id} className="w-[250px] h-[64px] pointer bg-[#000] flex-center rounded-[30px]">
                <img src={item.icon} alt="" />
              </li>
            )
          })}
        </ul>
      </Modal>
    </ConfigProvider>
  )
}

export default Connector
