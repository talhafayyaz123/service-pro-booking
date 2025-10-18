export const UserIcon = ({
  iconUrl,
  size = '48',
  className,
}: {
  iconUrl?: string
  className?: string
  size?:
    | '18'
    | '24'
    | '28'
    | '40'
    | '42'
    | '44'
    | '48'
    | '50'
    | '56'
    | '60'
    | '64'
    | '72'
    | '80'
    | '100'
    | '128'
}) => {
  const sizeConfig = {
    18: 'h-[18px] w-[18px] border-[1.5px] !border-white !shadow-xl',
    24: 'h-[24px] w-[24px]',
    28: 'h-[28px] w-[28px]',
    40: 'h-[40px] w-[40px]',
    42: 'h-[42px] w-[42px]',
    44: 'h-[44px] w-[44px]',
    48: 'h-[48px] w-[48px]',
    50: 'h-[50px] w-[50px]',
    56: 'h-[56px] w-[56px]',
    60: 'h-[60px] w-[60px]',
    64: 'h-[64px] w-[64px]',
    72: 'h-[72px] w-[72px]',
    80: 'h-[80px] w-[80px]',
    100: 'h-[100px] w-[100px]',
    128: 'h-[128px] w-[128px]',
  }
  return (
    <div
      className={`border bg-lightGray ${sizeConfig[size]} bg-cover bg-center  flex-shrink-0 overflow-hidden  border-white bg-white rounded-full ${className}`}
      style={{
        backgroundImage: iconUrl ? `url(${iconUrl})` : undefined,
      }}
    />
  )
}
