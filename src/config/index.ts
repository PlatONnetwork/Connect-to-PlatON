import usdc from '@/assets/img/usdc-logo.png'
import usdt from '@/assets/img/usdt-logo.png'
import dus from '@/assets/img/dus-logo.png'
import platon from '@/assets/img/platon-logo.png'
import { NETWORK } from '@/config/type'
export const supportList: NETWORK[] = [
  {
    id: 1,
    network: 'PlatON Mainnet',
    icon: platon,
    chainId: 210425,
    currency: 'LAT',
    rpc: 'https://openapi2.platon.network/rpc',
    explorer: 'https://scan.platon.network',
    tokens: [
      {
        id: 11,
        icon: dus,
        label: 'DUS（Mainnet)',
        contractAddress: '0x8c171d2e96619fa18b8f49fdbf3eb5589b97a97d',
        decimal: 6,
      },
      {
        id: 12,
        icon: usdt,
        label: 'USDT（Mainnet)',
        contractAddress: '0xeac734fb7581D8eB2CE4949B0896FC4E76769509',
        decimal: 6,
      },
      {
        id: 13,
        icon: usdc,
        label: 'USDC（Mainnet)',
        contractAddress: '0xdA396A3C7FC762643f658B47228CD51De6cE936d',
        decimal: 6,
      },
    ],
  },
  {
    id: 2,
    network: '',
    icon: '',
    chainId: 210425,
    currency: 'LAT',
    rpc: 'https://openapi2.platon.network/rpc',
    explorer: 'https://scan.platon.network',
    faucet: 'https://devnet2faucet.platon.network/faucet',
    tokens: [
      {
        id: 21,
        icon: dus,
        label: 'DUS（Devnet)',
        contractAddress: '0x085d18AB4FFD350d32025bc6a641E27C2Ea806a9',
        decimal: 6,
      },
      {
        id: 22,
        icon: usdt,
        label: 'USDT（Devnet) ',
        contractAddress: '0x1e6E4b48F6F57Aa7cefd8239e8515694D110386B',
        decimal: 6,
      },
      {
        id: 23,
        icon: usdc,
        label: 'USDC（Devnet)',
        contractAddress: '0x229b68722bF16CCc7186Dc8760b3D8C5980fe609',
        decimal: 6,
      },
    ],
  },
]
