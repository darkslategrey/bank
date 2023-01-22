import { Flex } from '@chakra-ui/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Layout = ({children}) => {
  return (
    <Flex direction="column">
      <Header />
      {children}
      <Footer />
    </Flex>
  )
}

export default Layout
