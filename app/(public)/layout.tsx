import { Nav } from "@/components/Nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <div id="main" className="min-h-screen text-foreground" tabIndex={-1}>
        {children}
      </div>
    </>
  );
}
