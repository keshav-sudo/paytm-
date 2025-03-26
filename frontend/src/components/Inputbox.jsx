import React from 'react'

const Inputbox = ({lable , placeholder }) => {
  return (
    <div>
        <div className='text-sm font-medium text-left py-2'>
            firstname {lable}
        </div>
        <input placeholder={placeholder} className="w-auto px-2 py-1 border rounded border-slate-200" />
        
    </div>
  )
}

export default Inputbox