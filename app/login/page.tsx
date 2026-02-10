import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <section className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back to Handcrafted Haven. Enter your details to continue.
        </p>

        <form
          className="mt-6 space-y-4"
          method="post"
          action="/api/auth/login"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#7A9B76] focus:outline-none focus:ring-2 focus:ring-[#7A9B76]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#7A9B76] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#688464] focus:outline-none focus:ring-2 focus:ring-[#7A9B76] focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to Handcrafted Haven?{" "}
          <Link
            href="/register"
            className="font-medium text-[#7A9B76] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

