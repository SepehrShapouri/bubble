import React from 'react'
import AuthForm from '../AuthForm'

function page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex h-full max-h-[40rem] w-full max-w-[390px] sm:max-w-[34rem]  lg:max-w-[64rem] overflow-hidden rounded-2xl bg-card sm:shadow-2xl">
        <AuthForm formType="signup"/>
      </div>
    </main>
  )
}

export default page