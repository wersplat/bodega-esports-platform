// frontend/pages/_error.jsx
export default function Error({ statusCode }) {
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

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 404;
  return { statusCode };
};
