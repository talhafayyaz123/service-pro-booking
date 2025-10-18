import Image from 'next/image'

export const ProfileSlide = ({ image }: { image: string }) => {
  return (
    <div
      className={`bg-cover h-[459px] w-full tablet:w-[400px] laptop:w-[600px] desktop:w-[850px] small:h-[520px] bg-center mx-1   ${
        image ? '' : 'bg-lightGray '
      } `}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
      }}
    />
  )
}

export const ProfileSlideImage = ({ image }: { image: string }) => {
  return (
    <div className="relative bg-cover bg-center h-[459px] w-full tablet:w-[400px] laptop:w-[600px] desktop:w-[850px] small:h-[520px] mx-1">
      <Image
        src={image}
        alt="slide"
        layout="fill"
        objectFit="cover"
        className="rounded-md w-[375px] tablet:w-[400px] laptop:w-[600px] desktop:w-[850px] overflow-hidden"
      />
    </div>
  )
}
