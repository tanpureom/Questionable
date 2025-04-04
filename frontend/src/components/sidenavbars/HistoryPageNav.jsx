import React from 'react'


const HistoryPageNav = ({ prompts }) => {

  return (
    <div className='w-full h-full z-50 flex flex-col border-r border-grey-100 md:border-none overflow-y-auto pt-1 pb-16 scrollbar-none'>

      {prompts.length === 0 ? (
        <p className='pl-6'>No prompts available</p>
      ) : (
        <ul className='flex flex-col gap-1'>
          {
            prompts.map((singleprompt, index) => (
              <li
                key={index}
                className='text-grey-950 w-full py-3 px-6 hover:bg-grey-300 hover:text-grey-50 rounded-tr-md rounded-br-md bg-grey-200 truncate'
              >
                {singleprompt.prompt}
              </li>
            ))
          }
        </ul>
      )}
    </div>
  )
}

export default HistoryPageNav