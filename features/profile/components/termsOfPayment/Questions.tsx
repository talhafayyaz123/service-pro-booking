import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Accordion } from '@/components/common/Accordion'
import { H16, H18, H40 } from '@/components/typography'
import { AskAQuestions } from '@/features/profile/components/common/AskAQuestions'
import { profileAboutSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const Questions = () => {
  const { data } = useAppSelector(profileAboutSelector)
  return data.faq?.length ? (
    <div className="grid grid-cols-1  laptop:grid-cols-[400px_1fr] gap-10 laptop:gap-[150px] container">
      <div>
        <H40 className="!font-bold">Frequently asked questions</H40>
        <H18 color={'text-gray'} className={'mt-5 mb-8'}>
          Have more questions? You can find answers here or click the button
          below to send a message
        </H18>
        <AskAQuestions />
      </div>
      {(data?.faq || []).length > 0 && (
        <CardWrapper className="grid grid-cols-1 px-10 py-8 h-fit">
          {(data?.faq || []).map(({ question, answer }, index, arr) => (
            <Accordion
              className={`bg-white  py-6 ${index === 0 ? '!pt-0' : ''} ${
                index === arr.length - 1 ? '!pb-0' : 'border-b border-lightGray'
              }`}
              key={index}
              title={<H18>{question}</H18>}
              text={
                <H16 color="text-gray" className="mt-4">
                  {answer}
                </H16>
              }
            />
          ))}
        </CardWrapper>
      )}
    </div>
  ) : null
}
