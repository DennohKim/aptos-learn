import Image from 'next/image'
import AptosLearnLogo from '/public/img/aptos.png'

const Logo = () => {
  return <Image src={AptosLearnLogo} alt="logo" width={130} height={130} />
}

export default Logo
