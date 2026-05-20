import { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { conceptBySlug } from "@/content/registry";
import { conceptViews } from "@/content/views";
import { useApp } from "@/lib/store";
import { NotFoundPage } from "@/routes/NotFoundPage";

export function ConceptPage() {
  const { slug } = useParams();
  const markComplete = useApp((s) => s.markComplete);
  const concept = slug ? conceptBySlug[slug] : undefined;

  useEffect(() => {
    if (slug) {
      const t = window.setTimeout(() => markComplete(slug), 8000);
      return () => window.clearTimeout(t);
    }
    return;
  }, [slug, markComplete]);

  if (!slug || !concept) return <NotFoundPage />;
  const View = conceptViews[slug];
  if (!View) return <NotFoundPage />;

  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-pulse_soft rounded-full bg-white/10" />
        </div>
      }
    >
      <View />
    </Suspense>
  );
}
