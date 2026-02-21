import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Student = {
    id: string;
    name: string;
    rollNumber: string;
    avatar: string;
    attendancePercentage: number;
};

export type ClassSession = {
    id: string;
    courseName: string;
    courseCode: string;
    time: string;
    totalStudents: number;
    status: 'upcoming' | 'in-progress' | 'completed';
};

export type AttendanceRecord = {
    studentId: string;
    classId: string;
    status: 'present' | 'absent' | 'pending';
    timestamp?: string;
    method?: 'qr' | 'manual';
};

export type SystemNotification = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'alert';
    read: boolean;
    timestamp: string;
};

interface AttendanceState {
    students: Student[];
    classes: ClassSession[];
    attendanceRecords: AttendanceRecord[];
    notifications: SystemNotification[];

    // Actions
    markAttendance: (studentId: string, classId: string, status: 'present' | 'absent', method: 'qr' | 'manual') => void;
    startClass: (classId: string) => void;
    endClass: (classId: string) => void;
    markNotificationRead: (id: string) => void;
}

const MOCK_NOTIFICATIONS: SystemNotification[] = [
    { id: 'N1', title: 'At-Risk Alert: Rahul Kumar', message: 'Attendance dropped to 71%. Automated WhatsApp sent to parent.', type: 'alert', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'N2', title: 'AICTE Compliance Report', message: 'Monthly report generated successfully. No anomalies found.', type: 'info', read: false, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
];

const MOCK_STUDENTS: Student[] = [
    { id: 'S001', name: 'Aarav Patel', rollNumber: 'CS20B101', avatar: 'AP', attendancePercentage: 85 },
    { id: 'S002', name: 'Priya Sharma', rollNumber: 'CS20B102', avatar: 'PS', attendancePercentage: 92 },
    { id: 'S003', name: 'Rahul Kumar', rollNumber: 'CS20B103', avatar: 'RK', attendancePercentage: 71 }, // At risk
    { id: 'S004', name: 'Neha Gupta', rollNumber: 'CS20B104', avatar: 'NG', attendancePercentage: 98 },
    { id: 'S005', name: 'Arjun Singh', rollNumber: 'CS20B105', avatar: 'AS', attendancePercentage: 65 }, // At risk
    { id: 'S006', name: 'Ananya Desai', rollNumber: 'CS20B106', avatar: 'AD', attendancePercentage: 88 },
];

const MOCK_CLASSES: ClassSession[] = [
    { id: 'C001', courseName: 'Data Structures and Algorithms', courseCode: 'CS301', time: '09:00 AM - 10:30 AM', totalStudents: 6, status: 'upcoming' },
    { id: 'C002', courseName: 'Operating Systems', courseCode: 'CS302', time: '11:00 AM - 12:30 PM', totalStudents: 6, status: 'upcoming' },
];

export const useAttendanceStore = create<AttendanceState>()(
    persist(
        (set) => ({
            students: MOCK_STUDENTS,
            classes: MOCK_CLASSES,
            attendanceRecords: [],
            notifications: MOCK_NOTIFICATIONS,

            markNotificationRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),

            markAttendance: (studentId, classId, status, method) => set((state) => {
                const existingRecordIndex = state.attendanceRecords.findIndex(r => r.studentId === studentId && r.classId === classId);

                let newRecords = [...state.attendanceRecords];
                if (existingRecordIndex >= 0) {
                    newRecords[existingRecordIndex] = { ...newRecords[existingRecordIndex], status, method, timestamp: new Date().toISOString() };
                } else {
                    newRecords.push({ studentId, classId, status, method, timestamp: new Date().toISOString() });
                }

                // Mock Policy Engine Logic: if absent, theoretically decrease percentage, if drops below 75%, trigger alert.
                // For visual purely demo, we might push a notification if status === absent but we'll stick to static mocks for simplicity.

                return { attendanceRecords: newRecords };
            }),

            startClass: (classId) => set((state) => ({
                classes: state.classes.map(c => c.id === classId ? { ...c, status: 'in-progress' } : c),
                attendanceRecords: [
                    ...state.attendanceRecords,
                    ...state.students
                        .filter(s => !state.attendanceRecords.some(r => r.studentId === s.id && r.classId === classId))
                        .map(s => ({ studentId: s.id, classId, status: 'pending' as const }))
                ]
            })),

            endClass: (classId) => set((state) => ({
                classes: state.classes.map(c => c.id === classId ? { ...c, status: 'completed' } : c)
            }))
        }),
        {
            name: 'attendance-storage',
        }
    )
);
