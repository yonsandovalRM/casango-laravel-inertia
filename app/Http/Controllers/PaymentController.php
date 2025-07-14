<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Traits\HandlesMercadoPago;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use HandlesMercadoPago;

    /**
     * Manejar webhook de MercadoPago
     */
    public function webhook(Request $request)
    {
        // Verificar la firma del webhook (opcional pero recomendado)
        if (!$this->verifyWebhookSignature($request)) {
            Log::warning('Invalid webhook signature');
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $data = $request->all();
        Log::info('Webhook received', ['data' => $data]);

        if ($this->processWebhook($data)) {
            return response()->json(['status' => 'success']);
        }

        return response()->json(['error' => 'Failed to process webhook'], 400);
    }

    /**
     * Página de éxito del pago
     */
    public function success(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        // Verificar el estado actual de la preaprobación
        $this->checkPreapprovalStatus($subscription);

        return Inertia::render('payments/success', [
            'subscription' => $subscription,
            'tenant' => $subscription->tenant,
        ]);
    }

    /**
     * Página de pago fallido
     */
    public function failure(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        return Inertia::render('payments/failure', [
            'subscription' => $subscription,
            'tenant' => $subscription->tenant,
            'payment_url' => $this->getPaymentUrl($subscription),
        ]);
    }

    /**
     * Página de pago pendiente
     */
    public function pending(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        return Inertia::render('payments/pending', [
            'subscription' => $subscription,
            'tenant' => $subscription->tenant,
        ]);
    }

    /**
     * Configurar método de pago
     */
    public function setupPayment(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        // Verificar si es el propietario del tenant
        if (!$this->canManageSubscription($subscription)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $paymentUrl = $this->getPaymentUrl($subscription);

        if (!$paymentUrl) {
            return response()->json(['error' => 'Failed to create payment'], 500);
        }

        return response()->json(['payment_url' => $paymentUrl]);
    }

    /**
     * Obtener estado de la suscripción
     */
    public function getSubscriptionStatus(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        if (!$this->canManageSubscription($subscription)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $status = $this->checkPreapprovalStatus($subscription);

        return response()->json([
            'status' => $subscription->payment_status,
            'mp_status' => $status,
            'needs_payment_setup' => $this->needsPaymentSetup($subscription),
            'trial_ends_at' => $subscription->trial_ends_at,
            'ends_at' => $subscription->ends_at,
        ]);
    }

    /**
     * Cancelar suscripción
     */
    public function cancelSubscription(Request $request)
    {
        $subscription = Subscription::findOrFail($request->subscription);

        if (!$this->canManageSubscription($subscription)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($this->cancelPreapproval($subscription)) {
            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Failed to cancel subscription'], 500);
    }

    /**
     * Verificar si el usuario puede manejar la suscripción
     */
    private function canManageSubscription(Subscription $subscription): bool
    {
        // Aquí puedes implementar la lógica para verificar permisos
        // Por ejemplo, verificar si es el propietario del tenant
        return true; // Simplificado por ahora
    }

    /**
     * Verificar la firma del webhook 
     */
    private function verifyWebhookSignature(Request $request): bool
    {
        $signature = $request->header('x-signature');
        $secret = config('mercadopago.webhook_secret');

        $hash = hash_hmac('sha256', $request->getContent(), $secret);

        return hash_equals($signature, "sha256=$hash");
    }
}
