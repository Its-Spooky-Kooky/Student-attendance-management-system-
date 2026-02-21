"use client";

import { useAttendanceStore } from "@/store/attendance-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Clock, Users } from "lucide-react";

export default function ClassesPage() {
    const { classes } = useAttendanceStore();

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Today&apos;s Classes</h1>
                <p className="text-muted-foreground mt-1">Manage your schedule and track attendance.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {classes.map((cls) => (
                    <Card key={cls.id} className="relative overflow-hidden">
                        {cls.status === 'in-progress' && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-success animate-pulse" />
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">{cls.courseCode}</CardTitle>
                                    <CardDescription className="mt-1">{cls.courseName}</CardDescription>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls.status === 'completed' ? 'bg-muted text-muted-foreground' :
                                    cls.status === 'in-progress' ? 'bg-success/20 text-success' :
                                        'bg-primary/10 text-primary'
                                    }`}>
                                    {cls.status.toUpperCase()}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                {cls.time}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="w-4 h-4" />
                                {cls.totalStudents} Enrolled
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/classes/${cls.id}/mark`} className="w-full">
                                <Button className="w-full" variant={cls.status === 'completed' ? 'outline' : 'default'}>
                                    {cls.status === 'completed' ? 'View Attendance' :
                                        cls.status === 'in-progress' ? 'Continue Marking' : 'Start Class'}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
