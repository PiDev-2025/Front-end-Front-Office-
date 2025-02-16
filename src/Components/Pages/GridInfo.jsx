import React from 'react'

const GridInfo = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-1 sideLineGrid gap-y-6 lg:gap-0">
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>45+</h5>
                <p className='text__18 text-[#525252]'>Locations and counting</p>
            </div>
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>20M</h5>
                <p className='text__18 text-[#525252]'>Clean miles driven</p>
            </div>
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>200K+</h5>
                <p className='text__18 text-[#525252]'>Integrated chargers</p>
            </div>
            <div className="relative px-2 sm;px-4">
                <h5 className='font-bold text__48 mb-2'>2M+ KG</h5>
                <p className='text__18 text-[#525252]'>CO2 emissions avoided</p>
            </div>
        </div>
    )
}

export default GridInfo
