import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Accordion } from '@/components/common/Accordion'
import { H16, H20 } from '@/components/typography'
import { AskAQuestionsMobile } from '@/features/profile/components/common/AskAQuestions'
import { profileAboutSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const QuestionsTab = () => {
  const { data } = useAppSelector(profileAboutSelector)

  return data.faq?.length ? (
    <CardWrapper className="mt-3">
      <H20 className="!font-bold mb-5">FAQ</H20>
      {(data?.faq || []).length > 0 &&
        (data?.faq || []).map(({ answer, question }, index, arr) => (
          <Accordion
            className={`bg-white py-5 ${index === 0 ? '!pt-0' : ''}  ${
              index === arr.length - 1 ? '!pb-0' : 'border-b border-lightGray'
            }`}
            key={index}
            title={<H16>{question}</H16>}
            text={
              <H16 color="text-gray" className="mt-4s">
                {answer}
              </H16>
            }
          />
        ))}
      <AskAQuestionsMobile />
    </CardWrapper>
  ) : null
}
