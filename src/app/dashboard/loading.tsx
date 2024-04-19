import { LoadingSpinner } from "@/components/loading-spinner";

export default function DashboardLoadingPage() {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-4 px-2 pt-2 sm:items-start">
      <span className="flex animate-pulse items-center justify-center gap-2">
        <h1 className="text-2xl font-bold underline">Loading</h1>
        <span className="sr-only">Loading page</span>
        <span className="aspect-square h-[6px] -translate-y-[6px] self-end rounded-sm bg-foreground" />
        <span className="aspect-square h-[6px] -translate-y-[6px] self-end rounded-sm bg-foreground" />
        <span className="aspect-square h-[6px] -translate-y-[6px] self-end rounded-sm bg-foreground" />
      </span>
      <LoadingSpinner />
    </section>
  );
}
