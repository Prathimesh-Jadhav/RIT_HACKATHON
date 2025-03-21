import React from 'react'
import FeatureCard from '../components/FeatureCard'

const Feautres = () => {
  return (
    <div className='lg:px-[95px]'>
        <FeatureCard title={'Notes Generation'} description={'Generate notes from text or images'} image={'/notes.png'}/>
    </div>
  )
}

export default Feautres
