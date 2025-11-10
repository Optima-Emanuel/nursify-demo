import { getFeatures } from "@/lib/features";

export default async function Home() {
  const features = await getFeatures();
  
  const items = [
    { key: "lesson" as const, path: "/lesson", label: "Lesson" },
    { key: "dialog" as const, path: "/dialog", label: "Dialog" },
    { key: "test" as const, path: "/test", label: "Test" },
  ] as const;

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Nursify Demo</h1>
      <p className="mt-2 text-sm opacity-80">Infra ready • Features togglebar</p>

      <ul className="mt-4 space-y-2">
        {items.map(it => {
          const isEnabled = features[it.key];
          return (
            <li key={it.key} className="flex items-center gap-3">
              <span className={`inline-block h-2 w-2 rounded-full ${isEnabled ? "bg-green-600" : "bg-gray-300"}`} />
              {isEnabled ? <a className="underline" href={it.path}>{it.label}</a> : <span className="opacity-60">{it.label} (aus)</span>}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-xs opacity-60">
        Schalte Features via Edge Config in Vercel.
      </p>
    </main>
  );
}
