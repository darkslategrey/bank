import { useEffect } from "react";


import { useBalance } from 'wagmi'

const Balance = ({address}) => {
  const { data, isError, isLoading } = useBalance({
    address: address,
    watch: true
  })

  useEffect(() => {}, [data])

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>

  document.getElementById("boom")

  return (
    <div>
      Balance: {data?.formatted} {data?.symbol}
    </div>
  )
}
export default Balance
