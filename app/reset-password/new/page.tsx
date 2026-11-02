import { NewPasswordForm } from '@/components/NewPasswordForm'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="px-4 pt-12">
      <NewPasswordForm token={token ?? ""} />
    </div>
  )
}
