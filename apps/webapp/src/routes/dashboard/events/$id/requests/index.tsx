import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/$id/requests/')({
  component: () => <div>Hello /dashboard/events/$id/requests/!</div>
})