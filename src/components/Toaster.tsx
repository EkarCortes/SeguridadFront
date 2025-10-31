import { Toaster as HotToaster } from 'react-hot-toast';

export default function Toaster() {
  return (
    <HotToaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        success: {
          style: { border: '1px solid #6fbf73', background: '#ffff', color: 'black' },
        },
        error: {
          style: { border: '1px solid #b85c5c', background: '#ffff', color: 'black' },
        },
        
      }}
    />
  );
}