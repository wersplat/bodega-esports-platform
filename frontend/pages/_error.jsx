// frontend/pages/_error.jsx
export default function Error({ statusCode }) {
  return (
    <div className="main-content">
      <h1 className="text-3xl font-bold text-red-500">❌ Error</h1>
      <p className="mt-4 text-white">
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
