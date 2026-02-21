import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { NotificationsToggle } from './notifications';

export function Sidebar() {
    return (
        <div className="w-64 border-r bg-sidebar text-sidebar-foreground h-screen flex flex-col shadow-sm hidden md:flex">
            <div className="h-16 flex items-center px-6 border-b text-xl font-bold text-primary tracking-tight">
                AttendoPet
            </div>
            <nav className="flex-1 px-4 py-8 space-y-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link href="/dashboard/classes" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-medium transition-colors">
                    <Users className="w-5 h-5" />
                    Classes
                </Link>
                <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm font-medium transition-colors">
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                </Link>
            </nav>
            <div className="p-4 border-t flex justify-between items-center bg-sidebar">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        JD
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-sidebar-foreground">Dr. John Doe</p>
                        <p className="text-xs text-muted-foreground">Professor</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <NotificationsToggle />
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}
