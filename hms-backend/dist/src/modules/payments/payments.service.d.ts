import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePaymentDto } from './payments.dto';
export declare class PaymentsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    create(dto: CreatePaymentDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        billId: string;
        paymentNumber: string;
        amount: number;
        method: string;
        transactionId: string | null;
        reference: string | null;
        paymentDate: Date;
    }>;
    list(patientId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        bill: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            status: string;
            patientId: string;
            appointmentId: string | null;
            admissionId: string | null;
            prescriptionId: string | null;
            billNumber: string;
            billType: string;
            billDate: Date;
            dueDate: Date;
            subtotal: number;
            tax: number;
            discount: number;
            totalAmount: number;
            paidAmount: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        billId: string;
        paymentNumber: string;
        amount: number;
        method: string;
        transactionId: string | null;
        reference: string | null;
        paymentDate: Date;
    })[]>;
}
