import { z } from 'zod';

export const paymentProofSchema = z.object({
  enrollmentId: z.string().uuid('Enrollment is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  accountName: z.string().min(2, 'Account name is required').max(100),
});

export const paymentVerifySchema = z.object({
  paymentId: z.string().uuid('Payment ID is required'),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional().nullable(),
}).refine(
  (data) => data.status !== 'rejected' || (data.rejectionReason && data.rejectionReason.length > 0),
  { message: 'Rejection reason is required when rejecting a payment', path: ['rejectionReason'] }
);

export type PaymentProofInput = z.infer<typeof paymentProofSchema>;
export type PaymentVerifyInput = z.infer<typeof paymentVerifySchema>;
