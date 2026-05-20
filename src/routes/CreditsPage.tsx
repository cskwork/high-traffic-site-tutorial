import { Card, SectionTitle } from "@/components/ui/Card";

export function CreditsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-12">
      <Card>
        <SectionTitle
          eyebrow="Credits"
          title="Built with"
          description="An interactive tutorial standing on the shoulders of these excellent open-source projects."
        />
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-100">
          <li>React 18</li>
          <li>Vite</li>
          <li>TypeScript (strict)</li>
          <li>Tailwind CSS</li>
          <li>React Three Fiber + drei</li>
          <li>three.js</li>
          <li>Tone.js</li>
          <li>Framer Motion</li>
          <li>Zustand</li>
          <li>React Router</li>
        </ul>
      </Card>
    </div>
  );
}
