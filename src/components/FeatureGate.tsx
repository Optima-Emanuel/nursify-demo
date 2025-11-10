"use client";

import { ReactNode, useEffect, useState } from "react";
import { FeatureKey, isOnSync } from "@/lib/features";

export default function FeatureGate({
  feature,
  children,
  fallback
}: { feature: FeatureKey; children: ReactNode; fallback?: ReactNode }) {
  const [features, setFeatures] = useState<Record<FeatureKey, boolean> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/features')
      .then(res => res.json())
      .then(data => {
        setFeatures(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !features) {
    return null; // or a loading state
  }

  if (!isOnSync(feature, features)) {
    return fallback ?? (
      <div className="p-4 border rounded bg-yellow-50 text-sm">
        Dieses Feature ist in der Demo deaktiviert.
      </div>
    );
  }
  return <>{children}</>;
}
