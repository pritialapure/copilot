export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-moss/10 mb-4">
          <Spinner className="w-8 h-8 text-moss animate-spin" />
        </div>
        <p className="text-ink font-semibold">{message}</p>
        <p className="text-ink/50 text-sm mt-1">Please wait...</p>
      </div>
    </div>
  );
}

function Spinner({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
