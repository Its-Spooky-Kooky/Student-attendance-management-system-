import { Student, AttendanceRecord } from "@/store/attendance-store";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

interface StudentCardProps {
    student: Student;
    record?: AttendanceRecord;
    onMark: (studentId: string, status: 'present' | 'absent') => void;
}

export function StudentCard({ student, record, onMark }: StudentCardProps) {
    const status = record?.status || 'pending';

    return (
        <Card className={`relative overflow-hidden transition-all duration-200 border-2 shadow-sm ${status === 'present' ? 'border-success bg-success/5' :
                status === 'absent' ? 'border-danger bg-danger/5' :
                    'border-border hover:border-primary/50'
            }`}>
            <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold bg-muted
          ${status === 'present' ? 'bg-success/20 text-success' :
                        status === 'absent' ? 'bg-danger/20 text-danger' :
                            'text-muted-foreground'}`
                }>
                    {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground tracking-tight truncate">{student.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{student.rollNumber}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onMark(student.id, 'present')}
                        className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${status === 'present' ? 'bg-success text-success-foreground' : 'bg-muted hover:bg-success/20 text-muted-foreground hover:text-success'}`}
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onMark(student.id, 'absent')}
                        className={`p-2.5 rounded-full transition-colors flex items-center justify-center ${status === 'absent' ? 'bg-danger text-destructive-foreground' : 'bg-muted hover:bg-danger/20 text-muted-foreground hover:text-danger'}`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
