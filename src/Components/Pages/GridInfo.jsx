import React from 'react'

const GridInfo = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-1 sideLineGrid gap-y-6 lg:gap-0">
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>100+ </h5>
                <p className='text__18 text-[#525252]'> Secure Locations and Growing</p>
            </div>
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>30+</h5>
                <p className='text__18 text-[#525252]'>Convenient Parking Spots Reserved</p>
            </div>
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>24/7</h5>
                <p className='text__18 text-[#525252]'>Instant Booking & Access</p>
            </div>
            <div className="relative px-2 sm;px-4">
               
                <p className='text__18 text-[#525252]'>Sustainable & Efficient Urban Mobility</p>
            </div>
        </div>
    )
}

export default GridInfo
