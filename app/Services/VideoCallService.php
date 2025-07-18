<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Str;

class VideoCallService
{
    /**
     * Generar link de videollamada para una reserva
     */
    public function generateVideoCallLink(Booking $booking): string
    {
        // Generar un token único para la sala
        $roomToken = $this->generateRoomToken($booking);

        // TODO: Implementar integración con plataforma de videollamadas
        // Opciones populares:
        // - Jitsi Meet (gratuito, open source)
        // - Zoom API
        // - Google Meet API
        // - Microsoft Teams
        // - Daily.co
        // - Whereby API

        return $this->createJitsiMeetLink($roomToken);

        // Alternativas comentadas:
        // return $this->createZoomMeeting($booking);
        // return $this->createGoogleMeetLink($booking);
        // return $this->createDailyCoLink($booking);
    }

    /**
     * Crear link de Jitsi Meet (ejemplo gratuito)
     */
    private function createJitsiMeetLink(string $roomToken): string
    {
        $baseUrl = config('services.jitsi.base_url', 'https://meet.jit.si');
        $roomName = config('app.name') . '-' . $roomToken;

        return "{$baseUrl}/{$roomName}";
    }

    /**
     * Generar token único para la sala
     */
    private function generateRoomToken(Booking $booking): string
    {
        return Str::slug(config('app.name')) . '-' .
            $booking->id . '-' .
            $booking->date . '-' .
            Str::random(8);
    }

    /**
     * Validar que el link de videollamada sea válido
     */
    public function validateVideoCallLink(string $link): bool
    {
        return filter_var($link, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Obtener información de la videollamada
     */
    public function getVideoCallInfo(Booking $booking): array
    {
        return [
            'link' => $booking->video_call_link,
            'platform' => $this->detectPlatform($booking->video_call_link),
            'room_id' => $this->extractRoomId($booking->video_call_link),
            'instructions' => $this->getJoinInstructions($booking->video_call_link),
        ];
    }

    /**
     * Detectar plataforma de videollamada
     */
    private function detectPlatform(?string $link): string
    {
        if (!$link) return 'unknown';

        if (str_contains($link, 'meet.jit.si')) return 'jitsi';
        if (str_contains($link, 'zoom.us')) return 'zoom';
        if (str_contains($link, 'meet.google.com')) return 'google_meet';
        if (str_contains($link, 'teams.microsoft.com')) return 'teams';
        if (str_contains($link, 'daily.co')) return 'daily';
        if (str_contains($link, 'whereby.com')) return 'whereby';

        return 'other';
    }

    /**
     * Extraer ID de sala del link
     */
    private function extractRoomId(?string $link): ?string
    {
        if (!$link) return null;

        $platform = $this->detectPlatform($link);

        return match ($platform) {
            'jitsi' => basename(parse_url($link, PHP_URL_PATH)),
            'zoom' => $this->extractZoomRoomId($link),
            'google_meet' => $this->extractGoogleMeetRoomId($link),
            default => null,
        };
    }

    /**
     * Obtener instrucciones para unirse
     */
    private function getJoinInstructions(string $link): string
    {
        $platform = $this->detectPlatform($link);

        return match ($platform) {
            'jitsi' => 'Haz clic en el enlace para unirte. No necesitas descargar ninguna aplicación.',
            'zoom' => 'Haz clic en el enlace. Si es tu primera vez, se descargará la aplicación de Zoom.',
            'google_meet' => 'Haz clic en el enlace. Funciona en tu navegador o en la app de Google Meet.',
            'teams' => 'Haz clic en el enlace. Puedes unirte desde el navegador o la app de Teams.',
            default => 'Haz clic en el enlace para unirte a la videollamada.',
        };
    }

    // Métodos helper para extraer IDs específicos de cada plataforma
    private function extractZoomRoomId(string $link): ?string
    {
        if (preg_match('/\/j\/(\d+)/', $link, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function extractGoogleMeetRoomId(string $link): ?string
    {
        if (preg_match('/\/([a-z-]+)$/', $link, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /*
    // TODO: Implementaciones específicas para otras plataformas
    
    private function createZoomMeeting(Booking $booking): string
    {
        // Implementar con Zoom API
        // Requiere JWT Token o OAuth
        
        $zoomApi = new ZoomApi(config('services.zoom.api_key'));
        $meeting = $zoomApi->createMeeting([
            'topic' => "Cita: {$booking->service->name}",
            'start_time' => $booking->date . 'T' . $booking->time,
            'duration' => $booking->service->duration,
            'type' => 2, // Scheduled meeting
        ]);
        
        return $meeting->join_url;
    }

    private function createGoogleMeetLink(Booking $booking): string
    {
        // Implementar con Google Calendar API
        // Crear evento y obtener Meet link
        
        $calendarService = new Google_Service_Calendar($this->getGoogleClient());
        $event = new Google_Service_Calendar_Event([
            'summary' => "Cita: {$booking->service->name}",
            'start' => ['dateTime' => $booking->date . 'T' . $booking->time],
            'conferenceData' => [
                'createRequest' => ['requestId' => Str::uuid()]
            ]
        ]);
        
        $createdEvent = $calendarService->events->insert('primary', $event, [
            'conferenceDataVersion' => 1
        ]);
        
        return $createdEvent->conferenceData->entryPoints[0]->uri;
    }

    private function createDailyCoLink(Booking $booking): string
    {
        // Implementar con Daily.co API
        
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.daily.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.daily.co/v1/rooms', [
            'name' => $this->generateRoomToken($booking),
            'properties' => [
                'start_audio_off' => true,
                'start_video_off' => true,
                'exp' => now()->addHours(2)->timestamp,
            ]
        ]);
        
        return $response->json()['url'];
    }
    */
}
