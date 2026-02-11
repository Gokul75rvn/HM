export declare class CreateInsurancePolicyDto {
    providerName: string;
    policyNumber: string;
    patientId?: string;
    memberName: string;
    relationWithMember: string;
    coverageType: string;
    sumInsured: number;
    validFrom: string;
    validUpto: string;
    status?: string;
}
export declare class CreateInsuranceClaimDto {
    patientId: string;
    billId: string;
    insuranceId: string;
    claimAmount: number;
    remarks?: string;
}
export declare class UpdateInsuranceClaimStatusDto {
    status: string;
    approvedAmount?: number;
    remarks?: string;
}
