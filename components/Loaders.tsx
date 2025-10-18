export const Spinner = () => {
  return <div className={'loader_spinner'}></div>
}

// export const SpinnerForLazy = ({ className }: { className?: string }) => {
//   return (
//     <div className={`w-full flex items-center justify-center ${className}`}>
//       <div className={'loader_spinner'} />
//     </div>
//   )
// }

export const SpinnerFullScreen = ({ className }: { className?: string }) => {
  return (
    <div
      className={`z-[100000] top-0 fixed w-full h-screen  flex items-center justify-center ${className}`}
    >
      <div className={'loader_spinner'} />
    </div>
  )
}
