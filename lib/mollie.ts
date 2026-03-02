const MOLLIE_BASE = "https://api.mollie.com/v2";

async function mollieRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${MOLLIE_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.MOLLIE_API_KEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Mollie error ${response.status}: ${JSON.stringify(error)}`);
  }
  return response.json() as Promise<T>;
}

export interface MolliePayment {
  id: string;
  status: string;
  metadata?: { orderId?: string };
  _links: { checkout: { href: string } };
}

export async function createPayment({
  amount,
  description,
  orderId,
  redirectUrl,
  webhookUrl,
}: {
  amount: number;
  description: string;
  orderId: string;
  redirectUrl: string;
  webhookUrl: string;
}): Promise<MolliePayment> {
  return mollieRequest<MolliePayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      amount: { currency: "EUR", value: amount.toFixed(2) },
      description,
      redirectUrl,
      webhookUrl,
      metadata: { orderId },
    }),
  });
}

export async function getPayment(paymentId: string): Promise<MolliePayment> {
  return mollieRequest<MolliePayment>(`/payments/${paymentId}`);
}
