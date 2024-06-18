import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/$id/content/')({
  component: () => <div>Hello /dashboard/events/$id/content/!</div>
})