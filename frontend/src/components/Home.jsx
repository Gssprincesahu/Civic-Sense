import React from 'react'
import home from "../assets/home.jpg"

const Home = () => {
    return (
        <div>
            <div className='min-h-screen mb-4 bg-cover bg-center flex items-center  overflow-hidden' style={{ backgroundImage: `url(${home})` }} id='Header'  >
            <div className='min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden relative' style={{ backgroundImage: `url(${home})` }} id='Header'>
                {/* Dark overlay */}
                <div className='absolute inset-0  bg-opacity-100'></div>
                
                <div className='container text-left mx-auto py-4 px-6 md:px-20 lg:px-32 text-white relative z-10'>
                    <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-[56px] max-w-4xl font-bold leading-tight mb-4'>
                        Empowering Communities, Improving Cities
                    </h1>
                    
                    <p className='text-lg sm:text-xl md:text-2xl max-w-3xl mb-6'>
                        Together we Identify, Track, and Resolve Civic Issues for a Better Tomorrow
                    </p>
                    
                    <div className='flex flex-wrap gap-4  mt-12'>
                        <a href="/Map" className='border-2 border-white px-8 py-3 rounded hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold text-lg'>
                            Map
                        </a>
                        <a href="/Issue" className='bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded font-semibold text-lg transition-all duration-300'>
                            Report an Issue
                        </a>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Home