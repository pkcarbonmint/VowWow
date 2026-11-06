import { auth, signOut } from "@/auth"
import Image from "next/image"

export async function UserMenu() {
  const session = await auth()

  if (!session?.user) {
    return (
      <a
        href="/auth/signin"
        className="inline-flex items-center rounded-full bg-sage px-5 py-2 text-sm font-semibold text-white hover:bg-sage-dark transition-colors"
      >
        Sign in
      </a>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold">{session.user.name}</p>
        <p className="text-xs text-muted">{session.user.email}</p>
      </div>
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="text-sm font-semibold text-sage hover:text-sage-dark transition-colors"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
