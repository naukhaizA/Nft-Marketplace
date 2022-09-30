import React from 'react'
import Link from 'next/link'

function index() {
  return (
    <>
    <div className='bg-b6 bg-cover' style={{height : 560}}>
    <h1 className='ml-20 pt-28 mr-48 text-6xl  font-bold text-[#98071f]'>NFT MARKETPLACE</h1>

      <h1 className='ml-20 pt-5 mr-80 text-2xl text-white' style={{width : 520}} >A Platform that makes it Simple to  Create, Store, List and Sell your digital assets at very low gas fee!</h1>
      <Link href = "/homepage">
        <button className='hover:animate-spin transition ease-in-out delay-150  hover:scale-105  duration-200 border rounded-full px-10 py-2.5 ml-20 mt-28 text-white text-xl hover:bg-red-900'>Explore</button>
      </Link> 
      <Link href = "/create-item">
        <button className='hover:animate-spin  transition ease-in-out delay-150   hover:scale-105  duration-200 border rounded-full px-10 py-2.5 ml-8 mt-28 text-white text-xl hover:bg-red-900'>Create</button>
      </Link> 
    </div>
    </>
      
    
  )
}

export default index
