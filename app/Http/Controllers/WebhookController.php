<?php

namespace App\Http\Controllers;

use App\Services\MercadoPagoService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebhookController extends Controller
{
    protected $mercadoPagoService;

    public function __construct(MercadoPagoService $mercadoPagoService)
    {
        $this->mercadoPagoService = $mercadoPagoService;
    }

    public function handleMercadoPago(Request $request)
    {
        // Aquí deberías validar la firma del webhook si la configuraste en Mercado Pago
        // para asegurar que la petición es legítima.

        $this->mercadoPagoService->handleWebhook($request->all());

        return response()->json(['status' => 'ok'], Response::HTTP_OK);
    }
}
