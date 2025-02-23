import { CallList } from "@/components/call-list"

export default function CallsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400/25 via-pink-500/25 to-red-500/25 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Recent Calls</h1>
        <CallList />
      </div>
    </main>
  )
}

