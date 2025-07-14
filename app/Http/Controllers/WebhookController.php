<?php

namespace App\Http\Controllers;

use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $mercadoPagoService;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        $this->mercadoPagoService = $mercadoPagoService;
    }

    public function handleMercadoPago(Request $request)
    {
        Log::info('MercadoPago webhook received', $request->all());

        try {
            $this->mercadoPagoService->handleWebhook($request->all());

            return response()->json(['status' => 'ok'], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error processing MercadoPago webhook', [
                'data' => $request->all(),
                'exception' => $e->getMessage()
            ]);

            return response()->json(['status' => 'error'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
