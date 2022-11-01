export interface ItemJobCarts {
    createdAt: Date;
    employerId: number;
    id: number;
    jobCreatedAt: Date;
    jobExpiredAt: any;
    jobExpiredDays: number;
    jobId: number;
    jobIsDeleted: number;
    jobSalary: number;
    jobStatus: number;
    jobTitle: string;
    jobUpdatedAt: Date;
    status: number;
    updatedAt: Date;
    isCheckedHotJob: boolean;
    jobSelected: boolean;
    startHotJob: Date;
    endHotJob: Date;
    maxStartHotJob: Date;
    maxEndHotJob: Date;
    warningDate: string;
    isUrgentHiring: number;
    isPrivate: number;
    privateApplicants: number;
}

