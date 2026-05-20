import { Link } from "react-router-dom";
import { Card, SectionTitle } from "@/components/ui/Card";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-16">
      <Card>
        <SectionTitle
          eyebrow="404"
          title="That concept is not on the map yet."
          description="Pick something from the curriculum on the left, or head back to the overview."
        />
        <div className="mt-5">
          <Link to="/" className="text-sm text-pattern-300 underline-offset-4 hover:underline">
            ← Back to overview
          </Link>
        </div>
      </Card>
    </div>
  );
}
