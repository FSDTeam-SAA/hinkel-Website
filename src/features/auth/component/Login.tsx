import Image from 'next/image'
import React from 'react'

const Login = () => {
    return (

        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-6xl bg-white rounded-xl shadow-lg p-10">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-5">
                    <Image src="/images/logo.png" alt="Company Logo" width={120} height={120} />
                </div>

                {/* Title */}
                <h2 className="text-center text-primary text-2xl font-semibold mb-2">
                    Welcome
                </h2>
                <p className="text-center text-sm text-gray-500 mb-8">
                    Manage your orders, track shipments, and configure products easily.
                </p>

                {/* Form */}
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:bg-primary/5 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between text-sm mt-2">
                        <label className="flex items-center gap-2 text-gray-600">
                            <input type="checkbox" className="accent-primary" />
                            Remember me
                        </label>

                        <a href="#" className="text-primary-foreground hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-md transition"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login