"use client";

import { useAttendanceStore } from "@/store/attendance-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Line, LineChart, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const trendData = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 92 },
    { day: 'Thu', attendance: 81 },
    { day: 'Fri', attendance: 95 },
    { day: 'Sat', attendance: 89 },
    { day: 'Sun', attendance: 93 },
];

const deptData = [
    { name: 'CS', rate: 92 },
    { name: 'IT', rate: 85 },
    { name: 'EC', rate: 90 },
    { name: 'ME', rate: 78 },
];

export default function AnalyticsPage() {
    const { students } = useAttendanceStore();

    const atRiskStudents = students.filter(s => s.attendancePercentage < 75);
    const goodStudents = students.filter(s => s.attendancePercentage >= 75);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
                <p className="text-muted-foreground mt-1">Deep dive into attendance metrics and department stats.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>7-Day Attendance Trend</CardTitle>
                        <CardDescription>Overall percentage of students attending across all classes</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                                    <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="attendance"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: 'var(--primary)' }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Department Comparison</CardTitle>
                        <CardDescription>Average attendance percentage by department</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={deptData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                                    <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" domain={[0, 100]} />
                                    <Tooltip
                                        cursor={{ fill: 'var(--muted)' }}
                                        contentStyle={{ borderRadius: '12px', borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                                    />
                                    <Bar dataKey="rate" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-warning" /> At-Risk Students (&lt; 75%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {atRiskStudents.map(student => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border bg-danger/5 border-danger/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center text-danger font-semibold text-xs">
                                            {student.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-danger">{student.attendancePercentage}%</div>
                                </div>
                            ))}
                            {atRiskStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No at-risk students right now.</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" /> Good Standing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {goodStudents.slice(0, 4).map(student => (
                                <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border bg-success/5 border-success/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success font-semibold text-xs">
                                            {student.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-success">{student.attendancePercentage}%</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
