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
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={40}
          height={40}
          className="rounded-full border-2 border-sage/20"
          unoptimized
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sage text-white font-semibold text-sm">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
      <div className="text-left hidden sm:block max-w-[200px]">
        <p className="text-sm font-semibold truncate">{session.user.name}</p>
        <p className="text-xs text-muted truncate">{session.user.email}</p>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="text-sm font-semibold text-sage hover:text-sage-dark transition-colors whitespace-nowrap"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
