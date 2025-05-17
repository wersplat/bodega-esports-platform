// frontend/pages/_error.jsx

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";

CustomError.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);

  return Error.getInitialProps(contextData);
};

export default function CustomError({ statusCode }) {
  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold text-[#ef4444]">❌ Error</h1>
      <p className="mt-4 text-[#f8fafc]">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </div>
  );
}
