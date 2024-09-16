'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status'),
  // };
  const rawFormData = Object.fromEntries(formData.entries());

  try {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: rawFormData.customerId,
      amount: rawFormData.amount,
      status: rawFormData.status,
    });
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    console.log({
      customer_id: customerId,
      amount: amountInCents,
      status,
      date,
    });

    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch(err) {
    console.error('[ERROR]', err);
    return { message: 'Database Error: Failed to Create Invoice.' };
  }

  // NOTE: `revalidatePath` / `redirect` work internally by an error-throwing mechanism

  // revalidatePath('/dashboard/invoices');
  // revalidatePath('/dashboard');
  revalidatePath('/dashboard', 'layout');

  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch(err) {
    console.error('[ERROR]', err);
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  // revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard', 'layout');

  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch(err) {
    console.error('[ERROR]', err);
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }

  // revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard', 'layout');

  return { message: 'Deleted Invoice.' };
}
