import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Header, Footer } from "@/components/site-chrome"
import Image from "next/image"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-paper py-16">
        <div className="mx-auto max-w-2xl px-5">
          <div className="rounded-3xl bg-white border border-line p-8 shadow-sm">
            <h1 className="font-serif text-3xl font-medium">Your Profile</h1>
            
            <div className="mt-8 flex items-center gap-4">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-semibold">{session.user.name}</h2>
                <p className="text-muted">{session.user.email}</p>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-sage-soft">
              <h3 className="font-semibold text-sage-dark">User Information</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">User ID:</dt>
                  <dd className="font-mono text-xs">{session.user.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Email:</dt>
                  <dd>{session.user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Account Type:</dt>
                  <dd>Google OAuth</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-sand-soft border border-line">
              <h3 className="font-semibold">What's Next?</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Your profile is connected to your Google account. You can now browse our programs 
                and reserve your founding spot. Your information is private and secure.
              </p>
              <a 
                href="/#reserve" 
                className="mt-4 inline-flex items-center rounded-full bg-sage px-6 py-2 text-sm font-semibold text-white hover:bg-sage-dark transition-colors"
              >
                Reserve your spot
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
