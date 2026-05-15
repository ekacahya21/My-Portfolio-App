"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { LayoutDashboard, LogOut, ExternalLink } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function AdminBar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading || !user) return null;

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  return (
    <div className="admin-bar bg-[#0f1412] text-[#f8f7f3] text-[13px] h-[36px] flex items-center px-[5vw] sticky top-0 z-[2000] border-b border-[#f8f7f3]/5 font-body">
      <style jsx global>{`
        :root {
          --admin-bar-height: 36px;
        }
        .site-header {
          top: var(--admin-bar-height) !important;
        }
        /* Offset anchors for scroll-to-section */
        section[id] {
          scroll-margin-top: calc(var(--header-height, 80px) + var(--admin-bar-height));
        }
      `}</style>
      
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-8">
          <span className="text-[#f8f7f3]/60">
            Logged in as <strong className="text-[#f8f7f3] font-semibold">{user.email}</strong>
          </span>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-[#f8f7f3] no-underline transition-opacity hover:opacity-80">
            <LayoutDashboard size={14} />
            Dashboard
          </Link>
          {pathname.startsWith("/admin") ? (
            <Link href="/" className="flex items-center gap-2 text-[#f8f7f3] no-underline transition-opacity hover:opacity-80">
              <ExternalLink size={14} />
              View Site
            </Link>
          ) : (
            <span className="bg-[#FF0000] text-white px-2.5 py-1 rounded-md font-extrabold uppercase text-[11px] tracking-wider leading-none">
              ADMIN MODE
            </span>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-transparent border-none text-[#f8f7f3]/60 cursor-pointer flex items-center gap-1.5 text-[12px] p-0 transition-colors hover:text-[#f8f7f3]"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
}
