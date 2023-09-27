const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-between">
        <div className="flex flex-col gap-[12px]">
          <p className="font-b text-[24px] leading-[24px]">Connect to PlatON</p>
          <p className="text-[#999] text-[14px] leading-[14px]">
            After connecting your wallet, you can quickly add the PlatON network and tokens to your wallet.
          </p>
        </div>
        <div className="btn w-btn">Connect Wallet</div>
      </div>
      <div className="flex flex-col gap-[30px]">
        {supportList.map(item => {
          return <div key={item.id}></div>
        })}
      </div>
    </div>
  )
}

export default Home
