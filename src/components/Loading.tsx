import loadingImg from '@/assets/img/loading-200px.gif'

const Loading = () => {
  return (
    <div className="w-full min-h-[100vh] flex-center">
      <img src={loadingImg} alt="" />
    </div>
  )
}

export default Loading
