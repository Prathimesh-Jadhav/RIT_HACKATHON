import React, { useState } from 'react'
import image from '../assets/image.jpg'

const ChatPage = () => {
  
  const [response, setResponse] = useState('');

  
  return (
    <div className='flex xl:min-w-[700px] xl:max-w-[700px] max-xl:w-full py-8 px-6 min-h-[80%]'>
       {response.length > 0 ? (
         <p>{response}</p>
       ) : (
         <div className='min-h-[60%] w-full flex flex-col items-center justify-center gap-6'>
          <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-question"><path d="M12 17h.01"/><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/></svg>
          </div>
           <p>I am connected to server , Ask your questions</p>
         </div>
       )}
    </div>
  )
}

export default ChatPage
