"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAttendanceStore } from "@/store/attendance-store";
import { StudentCard } from "@/components/student-card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Maximize, Play, Square, QrCode, LayoutGrid } from "lucide-react";

export default function MarkAttendancePage() {
    const params = useParams();
    const router = useRouter();
    const classId = params.id as string;

    const { classes, students, attendanceRecords, startClass, endClass, markAttendance } = useAttendanceStore();
    const [activeTab, setActiveTab] = useState<'grid' | 'qr'>('grid');

    const currentClass = classes.find(c => c.id === classId);

    // Initialize class
    useEffect(() => {
        if (currentClass?.status === 'upcoming') {
            startClass(classId);
        }
    }, [currentClass, classId, startClass]);

    if (!currentClass) return <div className="p-8">Class not found. Returning...</div>;

    const classRecords = attendanceRecords.filter(r => r.classId === classId);
    const presentCount = classRecords.filter(r => r.status === 'present').length;
    const absentCount = classRecords.filter(r => r.status === 'absent').length;

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] md:h-screen bg-background relative">
            <div className="flex items-center justify-between p-4 border-b bg-card shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/classes')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="font-bold text-lg md:text-xl tracking-tight text-foreground">{currentClass.courseCode} - {currentClass.courseName}</h2>
                        <p className="text-sm font-medium mt-0.5" suppressHydrationWarning>
                            <span className="text-success">{presentCount} Present</span> • <span className="text-danger">{absentCount} Absent</span> • <span className="text-muted-foreground">{students.length - presentCount - absentCount} Pending</span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant={activeTab === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('grid')} className="hidden sm:flex">
                        <LayoutGrid className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Manual Grid</span>
                    </Button>
                    <Button variant={activeTab === 'qr' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('qr')} className="hidden sm:flex">
                        <QrCode className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">QR Display</span>
                    </Button>
                    {currentClass.status === 'in-progress' ? (
                        <Button variant="destructive" size="sm" onClick={() => {
                            endClass(classId);
                            router.push('/dashboard/classes');
                        }} className="ml-2">
                            <Square className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">End Class</span>
                        </Button>
                    ) : (
                        <Button disabled variant="outline" size="sm" className="ml-2">Completed</Button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
                {activeTab === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {students.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                record={classRecords.find(r => r.studentId === student.id)}
                                onMark={(sId, status) => markAttendance(sId, classId, status, 'manual')}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-10">
                        <h3 className="text-3xl font-bold tracking-tight text-center max-w-lg text-foreground">
                            Scan this QR code using the SAMS App to mark your attendance
                        </h3>
                        <div className="p-8 bg-white rounded-3xl shadow-2xl border border-border/50">
                            <QRCodeSVG
                                value={`https://sams.system/mark?class=${classId}&session=${Date.now()}`}
                                size={340}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <p className="text-lg font-medium text-muted-foreground animate-pulse">Waiting for students to scan...</p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16 border-t px-6 flex items-center bg-card shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] justify-between">
                <div className="w-full flex items-center gap-4">
                    <span className="text-sm font-bold text-foreground w-12 text-right">
                        {Math.round((presentCount + absentCount) / students.length * 100)}%
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex shadow-inner">
                        <div className="bg-success h-full transition-all duration-500 ease-in-out" style={{ width: `${(presentCount / students.length) * 100}%` }} />
                        <div className="bg-danger h-full transition-all duration-500 ease-in-out" style={{ width: `${(absentCount / students.length) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
