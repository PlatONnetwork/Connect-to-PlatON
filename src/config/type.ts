export type NETWORK = {
  id: number
  network: string
  icon: string
  chainId: number
  currency: string
  rpc: string
  explorer: string
  faucet?: string
  tokens: TOKEN[]
  decimal: number
}

export type TOKEN = {
  id: number
  icon: string
  label: string
  contractAddress: string
  decimal: number
  symbol: string
}
