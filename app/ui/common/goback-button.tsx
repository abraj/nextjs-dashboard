'use client';

// import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

export default function GoBackButton() {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const previousUrl = searchParams.get('prevUrl');

  const handleGoBack = () => {
    if (previousUrl) {
      window.location.href = previousUrl;
    } else {
      // router.back();
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
    >
      Go Back
    </button>
  );
}
