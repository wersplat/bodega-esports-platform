"use client"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-[#1e293b] rounded-lg shadow-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-[#e11d48]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h2 className="mt-6 text-2xl font-bold">Check your email</h2>
          <p className="mt-2 text-[#94a3b8]">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify
            your account.
          </p>
          <div className="mt-6">
            <p className="text-sm text-[#94a3b8]">
              If you don&apos;t receive an email within a few minutes, check your spam folder or request a new verification
              link.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 