import { Nav } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Nav />
      <div
        id="main"
        className="flex-1 w-full text-foreground page-with-red-sand"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}
