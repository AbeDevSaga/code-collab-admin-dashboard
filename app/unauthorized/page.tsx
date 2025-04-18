function UnauthorizedPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
        <p className="text-lg mb-8">
          You don't have permission to access this page.
        </p>
        <a
          href="/dashboard"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }
  
  export default UnauthorizedPage;