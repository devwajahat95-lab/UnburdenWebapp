import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Download() {
  const { tokenId } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Just navigate — the redirect happens server-side
    window.location.href = `${process.env.REACT_APP_API_URL}/api/downloads/${tokenId}`;
  }, [tokenId]);

  return (
    <div style={{ padding:'160px 0', textAlign:'center' }}>
      {status === 'loading' && <p>Preparing your download...</p>}
    </div>
  );
}