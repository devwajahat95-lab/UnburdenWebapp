import { useParams } from 'react-router-dom';

export default function BlogPost() {
  const { slug } = useParams();
  return <section className="section"><div className="container"><h1>{slug || 'Journal entry'}</h1><p>This article is coming soon.</p></div></section>;
}
