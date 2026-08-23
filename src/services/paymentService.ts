// ============================================================
// PAYMENT SERVICE — Profile unlock (129K) + Edit payments (20K)
// ============================================================

import { supabase } from '../lib/supabase';
import type { Payment, PaymentProductType } from '../types/profileTypes';
import { PROFILE_PRICE, PROFILE_EDIT_PRICE } from '../types/constants';
import { updateProfileStatus, incrementRevisionUsed } from './profileService';
import { createRevision } from './profileVersionService';
import { checkRevisionAllowed, consumeFreeEdit } from './quotaService';
import { markAllReportsOutdated } from './careerReportService';

// ---------- PAYMENT CREATION ----------

/**
 * Generate a unique transfer code for a payment.
 */
function generateTransferCode(type: PaymentProductType): string {
  const prefix = type === 'PROFILE_UNLOCK' ? 'PF' : 'PE';
  return `${prefix}${Math.floor(Math.random() * 900000) + 100000}`;
}

/**
 * Create a pending payment record.
 */
export async function createPayment(
  userId: string,
  productType: PaymentProductType,
  referenceId: string,
  amount?: number
): Promise<Payment> {
  const finalAmount = amount ?? (productType === 'PROFILE_UNLOCK' ? PROFILE_PRICE : PROFILE_EDIT_PRICE);

  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      product_type: productType,
      reference_id: referenceId,
      amount: finalAmount,
      status: 'PENDING',
      transfer_code: generateTransferCode(productType),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create payment: ${error.message}`);
  return data as Payment;
}

// ---------- PAYMENT CONFIRMATION ----------

/**
 * Confirm a payment and apply the corresponding business action.
 * - PROFILE_UNLOCK: Mark profile as PAID, create initial version snapshot
 * - PROFILE_EDIT: Apply the edit transaction
 */
export async function confirmPayment(paymentId: string): Promise<Payment> {
  const { data: payment, error: fetchError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (fetchError || !payment) throw new Error('Payment not found');

  // 1. Verify Payment with Gateway (Mock for testing mode)
  const isVerified = await verifyPaymentGateway(payment);
  if (!isVerified) throw new Error('Payment verification failed');

  // 2. Mark Payment as PAID
  const { error: updateError } = await supabase.rpc('update_payment_status', {
    p_payment_id: paymentId,
    p_status: 'PAID',
  });

  if (updateError) throw new Error(`Failed to confirm payment: ${updateError.message}`);

  const confirmedPayment = { ...payment, status: 'PAID' } as Payment;

  // 3. Apply Business Logic
  await applyPaymentBusinessLogic(confirmedPayment);

  return confirmedPayment;
}

/**
 * Mock verification with a payment gateway (e.g. VietQR webhook verifier)
 */
async function verifyPaymentGateway(payment: Payment): Promise<boolean> {
  // Simulate network delay and validation
  await new Promise(resolve => setTimeout(resolve, 500));
  return payment.status === 'PENDING';
}

/**
 * Apply the actual business logic once a payment is successfully PAID.
 */
async function applyPaymentBusinessLogic(payment: Payment): Promise<void> {
  if (payment.product_type === 'PROFILE_UNLOCK') {
    await updateProfileStatus(payment.reference_id, 'PAID');
  } else if (payment.product_type === 'PROFILE_EDIT') {
    // Find pending transaction
    const { data: txs } = await supabase
      .from('profile_edit_transactions')
      .select('*')
      .eq('profile_id', payment.reference_id)
      .eq('payment_status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (txs && txs.length > 0) {
      const tx = txs[0];
      
      // Update transaction
      await supabase.rpc('update_tx_status', {
        p_tx_id: tx.id,
        p_status: 'PAID'
      });
      
      // Create version
      await createRevision(tx.profile_id, tx.assessment_type, tx.target_attempt_id, `Cập nhật (Có phí 20k): ${tx.assessment_type}`);
      
      // Increment counter
      await incrementRevisionUsed(tx.profile_id);
      
      // Mark old reports outdated
      await markAllReportsOutdated(tx.profile_id);
    }
  }
}

/**
 * Confirm profile unlock payment (129K).
 * Convenience wrapper for the checkout flow.
 */
export async function confirmProfileUnlock(
  userId: string,
  profileId: string
): Promise<Payment> {
  // Create and immediately confirm (testing mode)
  const payment = await createPayment(userId, 'PROFILE_UNLOCK', profileId);
  return confirmPayment(payment.id);
}

/**
 * Process a profile edit (paid or free).
 * Handles the full orchestration:
 * 1. Validate quota
 * 2. If free: consume quota, create transaction, create version, increment counter, outdate reports.
 * 3. If paid: create PENDING payment, create PENDING transaction. (Version is created on confirm).
 */
export async function processProfileEdit(
  userId: string,
  profileId: string,
  assessmentType: string,
  newAttemptId: string
): Promise<{ success: boolean; profileId: string; versionId?: string; isFree: boolean; payment?: Payment }> {
  // 1. Validate
  const check = await checkRevisionAllowed(profileId, userId);
  if (!check.allowed) {
    throw new Error(check.reason);
  }

  if (check.isFree) {
    // FREE FLOW
    // 1. Consume Free Edit
    await consumeFreeEdit(userId);
    
    // 2. Create Edit Transaction (FREE)
    await supabase.from('profile_edit_transactions').insert({
      user_id: userId,
      profile_id: profileId,
      edit_type: 'MAJOR_REVISION',
      assessment_type: assessmentType,
      target_attempt_id: newAttemptId,
      price: 0,
      payment_status: 'FREE',
      applied_at: new Date().toISOString(),
    });

    // 3. Create Revision
    const newVersion = await createRevision(profileId, assessmentType, newAttemptId, `Cập nhật miễn phí: ${assessmentType}`);
    
    // 4. Increment Revision Counter
    await incrementRevisionUsed(profileId);
    
    // 5. Outdate Reports
    await markAllReportsOutdated(profileId);

    return { success: true, profileId, versionId: newVersion.id, isFree: true };
  } else {
    // PAID FLOW - Create Pending Payment
    const payment = await createPayment(userId, 'PROFILE_EDIT', profileId, check.price);
    
    // Create pending edit transaction
    await supabase.from('profile_edit_transactions').insert({
      user_id: userId,
      profile_id: profileId,
      edit_type: 'MAJOR_REVISION',
      assessment_type: assessmentType,
      target_attempt_id: newAttemptId,
      price: check.price,
      payment_status: 'PENDING',
    });

    return { success: true, profileId, isFree: false, payment };
  }
}

// ---------- QUERY ----------

export async function getPaymentsByProfile(profileId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('reference_id', profileId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []) as Payment[];
}

export async function getPayment(paymentId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error) return null;
  return data as Payment;
}
