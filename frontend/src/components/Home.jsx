import React from 'react'
import home from "../assets/home.jpg"

const Home = () => {
    return (
        <div>
            <div className='min-h-screen mb-4 bg-cover bg-center flex items-center w-full overflow-hidden' style={{ backgroundImage: `url(${home})` }} id='Header'  >

                <div className='container text-center mx-auto py-4 px-6 md:px-20 lg:px-32 text-white '  >
                    <h2 className='text-5xl sm:text-6xl md:text-[60px] inline-block max-w-3xl font-semibold pt-20' >Empowering Communities, Improving Cities - Together we Identify, Track, and Resolve Civic Issues for a Better Tomorrow</h2>
                    <div className='space-x-6 mt-16' >
                        <a href="#" className='border border-white px-8 py-3 rounded '>Map</a>
                        <a href="#" className='bg-blue-500 px-8 py-3 rounded' >Issues</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home