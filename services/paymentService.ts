
// Interface for Payment Data
export interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvc: string;
  amount: number;
}

// Simulate an API call to a payment gateway (e.g., Stripe, Mercado Pago)
export const processPayment = async (data: PaymentData): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  console.log("Processing payment for:", data.amount);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Basic validation mock
      if (data.cardNumber.length < 16) {
        resolve({ success: false, error: "Número de cartão inválido." });
        return;
      }

      // Simulate success
      resolve({ 
        success: true, 
        transactionId: `txn_${Math.random().toString(36).substr(2, 9)}` 
      });
    }, 2000); // 2 seconds delay
  });
};
