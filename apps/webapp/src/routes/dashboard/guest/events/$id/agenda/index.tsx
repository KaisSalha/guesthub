import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/guest/events/$id/agenda/')({
  component: () => <div>Hello /dashboard/events/$id/agenda/!</div>
})