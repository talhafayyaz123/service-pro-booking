import { GetServerSideProps } from 'next'

const RedirectToMobileApp = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const link = ctx.query.link as string
  return {
    props: {},
    redirect: {
      destination: `readyhubb://${link || ''}`,
      permanent: false,
    },
  }
}

export default RedirectToMobileApp
