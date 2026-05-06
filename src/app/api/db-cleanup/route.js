import { cleanUpNonAdminUsers } from '@/utils/actions/db'

export async function POST(request) {
  const { password } = await request.json()

  if (password !== process.env.ADMIN_CLEANUP_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fd = new FormData()
    fd.append('password', password)
    const res = await cleanUpNonAdminUsers(null, fd)
    if (res.serverError) throw new Error(res.message)

    return Response.json({
      message: res.message
    })
  } catch (e) {
    console.error('Cleanup error:', e)
    return Response.json(
      {
        error: e.message
      },
      { status: 500 }
    )
  }
}
