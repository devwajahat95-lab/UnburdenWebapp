import { useParams } from 'react-router-dom';

export default function PodcastEpisode() {
  const { slug } = useParams();
  return <section className="section"><div className="container"><h1>{slug || 'Podcast episode'}</h1><p>This episode is coming soon.</p></div></section>;
}
