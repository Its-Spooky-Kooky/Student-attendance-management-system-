"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAttendanceStore } from "@/store/attendance-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationsToggle() {
    const { notifications, markNotificationRead } = useAttendanceStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative mr-2">
                    <Bell className="h-[1.2rem] w-[1.2rem] text-sidebar-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
                <DropdownMenuLabel className="font-bold">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                    )}
                    {notifications.map((n) => (
                        <DropdownMenuItem
                            key={n.id}
                            className={`flex flex-col items-start p-3 gap-1 mb-1 rounded-lg cursor-pointer transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                            onClick={() => markNotificationRead(n.id)}
                        >
                            <div className="font-semibold text-sm flex items-center gap-2 text-foreground break-all">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'alert' ? 'bg-danger' : 'bg-primary'}`} />
                                {n.title}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
