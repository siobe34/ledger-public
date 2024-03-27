export default function Home() {
  return (
    <section>
      <button className="rounded bg-secondary p-4 text-secondary-foreground">
        Test
      </button>
      <a
        href="/dashboard"
        className="rounded border border-blue-500 bg-blue-500 px-4 py-2 text-white hover:bg-blue-800 hover:text-slate-300"
      >
        Dashboard
      </a>
    </section>
  );
}
