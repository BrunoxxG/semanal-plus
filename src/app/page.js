import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-secondary dark:bg-background">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-white dark:bg-secondary px-6 py-10 md:w-2/5 md:px-20 border">
          <p className={`text-xl md:text-3xl md:leading-normal`}>
            <strong>Bienvenido</strong>, inicie sesion para ingresar al panel de control.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-pink-400 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-200 md:text-base"
          >
            <span>Log in</span>
          </Link>
        </div>
      </div>
    </main>
  );
}