import { FeedList } from '@/components/feed/FeedList'
import { CreatePost } from '@/components/feed/CreatePost'
import { auth } from '@/lib/auth'

export default async function FeedPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null // Or redirect
  }

  return (
    <div className="container max-w-2xl py-6 mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tight italic">
          Activity Feed
        </h1>
      </div>



      <CreatePost userId={userId} />

      <FeedList />
    </div >
  )
}
