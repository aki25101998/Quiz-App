// ============================================================
// PAYMENT SERVICE — Profile unlock (129K) + Edit payments (20K)
// ============================================================

import { supabase } from '../lib/supabase';
import type { Payment, PaymentProductType } from '../types/profileTypes';
import { PROFILE_PRICE, PROFILE_EDIT_PRICE } from '../types/constants';
import { updateProfileStatus, incrementRevisionUsed } from './profileService';
import { createRevision } from './profileVersionService';
import { consumeFreeEdit } from './quotaService';
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

  const { error: updateError } = await supabase
    .from('payments')
    .update({ status: 'PAID' })
    .eq('id', paymentId);

  if (updateError) throw new Error(`Failed to confirm payment: ${updateError.message}`);

  // Apply business logic based on product type
  if (payment.product_type === 'PROFILE_UNLOCK') {
    await updateProfileStatus(payment.reference_id, 'PAID');
  }

  return { ...payment, status: 'PAID' } as Payment;
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
 * Handles the full flow:
 * 1. Create new assessment attempt (already done before calling this)
 * 2. Check if free or paid
 * 3. Create new profile version
 * 4. Increment revision counter
 * 5. Mark old reports as outdated
 * 6. If free, consume monthly quota
 * 7. If paid, create and confirm payment
 */
export async function processProfileEdit(
  userId: string,
  profileId: string,
  assessmentType: string,
  newAttemptId: string,
  isFree: boolean
): Promise<{ version: any; payment?: Payment }> {
  let payment: Payment | undefined;

  // If paid edit, create and confirm payment
  if (!isFree) {
    payment = await createPayment(userId, 'PROFILE_EDIT', profileId);
    await confirmPayment(payment.id);
  } else {
    // Consume free monthly edit
    await consumeFreeEdit(userId);
  }

  // Record the edit transaction
  await supabase.from('profile_edit_transactions').insert({
    user_id: userId,
    profile_id: profileId,
    edit_type: 'MAJOR_REVISION',
    assessment_type: assessmentType,
    source_attempt_id: null, // Could track old attempt if needed
    target_attempt_id: newAttemptId,
    price: isFree ? 0 : PROFILE_EDIT_PRICE,
    payment_status: isFree ? 'FREE' : 'PAID',
    applied_at: new Date().toISOString(),
  });

  // Create new profile version (immutable — old version preserved)
  const newVersion = await createRevision(profileId, assessmentType, newAttemptId);

  // Increment revision counter
  await incrementRevisionUsed(profileId);

  // Mark old reports as outdated
  await markAllReportsOutdated(profileId);

  return { version: newVersion, payment };
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
