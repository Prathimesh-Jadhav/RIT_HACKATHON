import React from 'react'
import FeatureCard from '../components/FeatureCard'

const Feautres = () => {
  return (
    <div id='features' >
      <div className='flex justify-center mb-8 text-4xl font-bold text-white tracking-wide'>
        Our &nbsp;Features 
      </div>
      <div className='lg:px-[95px] flex justify-around mt-16'>
          <FeatureCard title={'Chat With Notes'} description={'Generate notes from the pdf at the tip your fingers'} iconName='FileText'/>
          <FeatureCard title={'Quizes Generation'} description={'Start testing yourself with the engaging quizes'} iconName='HelpCircle' />
          <FeatureCard title={'Maths Visualization'} description={'Start visualizing maths to learn more'} iconName='Calculator'/>
      </div>
    </div>
  )
}

export default Feautres
