import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { NextPageContext } from 'next';

interface CustomErrorProps {
  statusCode?: number;
}

const CustomError = ({ statusCode }: CustomErrorProps) => {
  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold text-[#ef4444]"> Error</h1>
      <p className="mt-4 text-[#f8fafc]">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </div>
  );
};

CustomError.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return Error.getInitialProps(contextData);
};

export default CustomError;
