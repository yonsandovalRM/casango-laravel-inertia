<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Invitation $invitation) {}

    public function build()
    {
        return $this->subject('Invitación a ' . config('app.name'))
            ->view('emails.user-invitation')
            ->with([
                'invitation' => $this->invitation,
                'tenant' => $this->invitation->tenant, // Asumiendo que la invitación tiene relación con tenant
                'acceptUrl' => 'http://' . $this->invitation->tenant->domains->first()->domain . '/invitations/accept/' . $this->invitation->token,
            ]);
    }
}
