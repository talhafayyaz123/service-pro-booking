import classNames from 'classnames'
import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Input } from '@/components/common/Input'
import { H14, H16, H20 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { TUseBaseInfo } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { buttonsPercent } from '@/features/paymentLink/constants'

export const TipSection = memo(
  (
    props: Pick<
      TUseBaseInfo,
      'tipPercent' | 'setStore' | 'currency' | 'tipAmount' | 'data'
    >
  ) => {
    const { tipPercent, setStore, currency, tipAmount, data } = props

    return (
      <CardWrapper className={'mt-6 p-5 tablet:p-8 mx-5 desktop:mx-0'}>
        <H20 className={'!font-extrabold  text-center'}>Select tip amount</H20>
        <H14 className="mt-2 leading-5 text-center">
          <p>Select tip percent, enter custom amount, or skip this</p>
          <p>option</p>
        </H14>

        <article className={'grid grid-cols-3 gap-3 mt-5'}>
          {buttonsPercent.map((item) => (
            <button
              className={classNames(
                'cursor-pointer shadow-xl rounded-[10px] gap-1 py-2 px-3 flex flex-col items-center',
                { ['bg-orange']: item === tipPercent }
              )}
              key={item}
              onClick={() => {
                setStore({
                  tipAmount: null,
                  tipPercent: item === tipPercent ? null : item,
                  tipAmountFinal:
                    item === tipPercent
                      ? null
                      : (data?.totalAmount ?? 0) * (item / 100),
                })
              }}
            >
              <H16
                className={classNames(
                  '!font-extrabold text-center !text-black',
                  {
                    ['!text-white']: item === tipPercent,
                  }
                )}
              >
                {item}%
              </H16>
              <H14
                data-testid={`tip-section-in-price-by-${item}`}
                className={classNames({
                  ['!text-white']: item === tipPercent,
                })}
              >
                {formatPrice({
                  price: (data?.totalAmount ?? 0) * (item / 100),
                  currency,
                })}
              </H14>
            </button>
          ))}
        </article>
        <Input
          inputClassName={'pl-8'}
          className="mt-4 tablet:mt-5"
          leftLabel={
            <span className={'text-gray'}>
              {getCurrencySignByName(currency)}
            </span>
          }
          onChange={(e) => {
            let value = e.target.value

            if (value.includes('.') || value.includes(',')) {
              const separator = value.includes('.') ? '.' : ','
              const [integerPart, decimalPart] = value.split(separator)

              if (decimalPart && decimalPart.length > 2) {
                value = integerPart + separator + decimalPart.slice(0, 2)
              }
            }

            const parsedValue = parseFloat(value)

            setStore({
              tipPercent: null,
              tipAmount: e.target.value ? parsedValue : null,
              tipAmountFinal: e.target.value ? parsedValue : null,
            })
          }}
          placeholder="Enter custom gratuity"
          type="number"
          value={tipAmount ?? ''}
        />
      </CardWrapper>
    )
  }
)
