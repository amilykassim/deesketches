import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "../../../src/lib/admin-auth";
import { LogoutButton } from "../_components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="relative z-20 min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="font-ui text-sm space-y-1">
            <SidebarLink href="/admin/audio">Audio library</SidebarLink>
            <SidebarLink href="/admin/analytics">Analytics</SidebarLink>
          </nav>
          <div className="mt-8 pt-4 border-t border-ink/10">
            <LogoutButton />
          </div>
        </aside>
        <section className="min-w-0 pb-20">{children}</section>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded hover:bg-ink/5 text-ink/80 hover:text-ink"
    >
      {children}
    </Link>
  );
}
