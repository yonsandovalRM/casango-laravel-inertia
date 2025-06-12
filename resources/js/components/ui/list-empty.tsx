import React from 'react'

export const ListEmpty = ({title, description, action}: {title: string, description: string, action: React.ReactNode}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg p-4">
        
            <p className="text-center">{title}</p>
            <p className="text-center text-sm">{description}</p>
            {action}
        </div>
  )
}
