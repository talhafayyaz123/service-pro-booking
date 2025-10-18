import Tippy, { TippyProps } from '@tippyjs/react'

export const ReviewImageWithTooltip = ({ imgSrc }: { imgSrc: string }) => {
  const props: TippyProps = {
    animation: 'fade',
    interactive: true,
    maxWidth: 900,
    duration: [0, 0],
  }
  return (
    <Tippy
      {...props}
      content={
        <div className={'max-h-[600px] w-full'}>
          <img className={'object-cover h-full w-full'} src={imgSrc} alt="" />
        </div>
      }
    >
      <div
        className={
          'h-[60px] w-[60px] small:h-[64px] small:w-[64px] cursor-pointer rounded-[12px] bg-cover bg-center flex-shrink-0 '
        }
        style={{
          backgroundImage: `url(${imgSrc})`,
        }}
      />
    </Tippy>
  )
}
