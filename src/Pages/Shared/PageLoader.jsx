const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-lime-500 border-t-transparent"></div>
        
        {/* Optional text */}
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;