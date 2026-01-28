import { FeedList } from '@/components/feed/FeedList'

export default function FeedPage() {
  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tight italic">
          Activity Feed
        </h1>
      </div>

      <FeedList />
    </div>
  )
}
