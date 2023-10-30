export type NETWORK = {
  id: number
  network: string
  netLabel: string
  icon: string
  chainId: number
  currency: string
  rpc: string
  explorer: string
  faucet?: string
  tokens: TOKEN[]
  decimal: number
  currencyLabel: string
}

export type TOKEN = {
  id: number
  icon: string
  label: string
  contractAddress: string
  decimal: number
  symbol: string
}
