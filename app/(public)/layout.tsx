import { Nav } from "@/components/Nav";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="page-backdrop" aria-hidden>
        <div className="wallpaper-image" />
        <div className="wallpaper-overlay" />
        <div className="grid-overlay" />
      </div>
      <Nav />
      <div id="main" className="min-h-screen text-foreground" tabIndex={-1}>
        {children}
      </div>
    </>
  );
}
