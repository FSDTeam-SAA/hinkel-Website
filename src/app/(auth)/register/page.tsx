import React, { Suspense } from 'react'
import Register from '@/features/auth/component/Register'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Register />
    </Suspense>
  )
}

export default page