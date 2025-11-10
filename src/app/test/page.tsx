import FeatureGate from "@/components/FeatureGate";

export default function Page() {
  return (
    <main className="min-h-screen p-6">
      <h2 className="text-xl font-semibold mb-4">Test (Demo)</h2>
      <FeatureGate feature="test">
        <div className="border rounded p-4">Placeholder – Test UI kommt später.</div>
      </FeatureGate>
    </main>
  );
}

