"use client";

import { useAttendanceStore } from "@/store/attendance-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserX, Clock, Percent } from "lucide-react";

export default function DashboardOverview() {
    const { students, attendanceRecords, classes } = useAttendanceStore();

    const totalStudents = students.length;
    const presentRecords = attendanceRecords.filter(r => r.status === 'present').length;
    const absentRecords = attendanceRecords.filter(r => r.status === 'absent').length;

    const pendingClasses = classes.filter(c => c.status !== 'completed').length;

    const totalRecords = presentRecords + absentRecords;
    const overallPercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, Dr. John Doe. Here is today&apos;s overview.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium tracking-tight">Total Present Today</CardTitle>
                        <Users className="w-4 h-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-success">{presentRecords}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium text-success">+14% from yesterday</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium tracking-tight">Total Absent</CardTitle>
                        <UserX className="w-4 h-4 text-danger" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-danger">{absentRecords}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium tracking-tight">Pending Classes</CardTitle>
                        <Clock className="w-4 h-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-warning">{pendingClasses}</div>
                        <p className="text-xs text-muted-foreground mt-1">Classes left today</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium tracking-tight">Overall Session %</CardTitle>
                        <Percent className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{overallPercentage}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Average across all inputs</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold tracking-tight mt-10 mb-4">Recent Activity</h2>
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendanceRecords.slice(-5).reverse().map((record, i) => {
                            const student = students.find(s => s.id === record.studentId);
                            const cls = classes.find(c => c.id === record.classId);

                            if (!student || !cls) return null;

                            const dateObj = record.timestamp ? new Date(record.timestamp) : new Date();
                            return (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{cls.courseCode}</TableCell>
                                    <TableCell>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${record.status === 'present' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                            }`}>
                                            {record.status.toUpperCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {attendanceRecords.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                                    No recent activity found. Start a class to mark attendance!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
