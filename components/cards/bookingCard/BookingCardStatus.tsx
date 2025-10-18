import { H14 } from '@/components/typography'
import { TBookingCardStatus, TRefundStatus } from '@/types/booking'

export const BookingCardStatus = ({
  status,
}: {
  status?: TBookingCardStatus | TRefundStatus | string
}) => {
  const style: Record<
    TBookingCardStatus | TRefundStatus,
    { text: string; className: string }
  > = {
    PENDING: {
      text: 'Pending',
      className: 'bg-pending',
    },
    CONFIRMED: {
      text: 'Confirmed',
      className: 'bg-confirmed',
    },
    ONGOING: {
      text: 'Ongoing',
      className: 'bg-ongoing',
    },
    COMPLETED: {
      text: 'Completed',
      className: 'bg-completed',
    },
    APPROVED: {
      text: 'Approved',
      className: 'bg-completed',
    },
    CANCELLED: {
      text: 'Cancelled',
      className: 'bg-cancelled',
    },
    DECLINED: {
      text: 'Declined',
      className: 'bg-cancelled',
    },
    NO_SHOW: {
      text: 'No show',
      className: 'bg-noShow',
    },
    PAYMENT_FAILED: {
      text: 'Payment failed',
      className: 'bg-paymentFailed',
    },
    DEPOSIT_REQUESTED: {
      text: 'Deposit requested',
      className: 'bg-pending',
    },
  }

  // Ensure status is a key of the style object
  const statusStyle =
    status && style[status as TBookingCardStatus | TRefundStatus]

  return statusStyle ? (
    <div
      className={`px-3 py-[7px] h-fit rounded-[5px] w-fit ${statusStyle.className}`}
    >
      <H14
        color="text-white"
        className="block maxSmall:!text-[12px] maxSmall:!leading-[14px] whitespace-nowrap"
      >
        {statusStyle.text}
      </H14>
    </div>
  ) : null
}
