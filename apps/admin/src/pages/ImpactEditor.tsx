import { useParams } from 'react-router-dom'
import FoundationEditor from './FoundationEditor'
import LeadershipEditor from './LeadershipEditor'
import PublicServiceEditor from './PublicServiceEditor'

export default function ImpactEditor() {
  const { slug = 'public-service' } = useParams<{ slug: string }>()
  if (slug === 'foundation') return <FoundationEditor />
  if (slug === 'leadership') return <LeadershipEditor />
  return <PublicServiceEditor />
}