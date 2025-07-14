<?php

namespace App\Jobs;

use App\Models\Subscription;
use App\Mail\TrialExpiringMail;
use App\Mail\GracePeriodExpiringMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class ProcessSubscriptionExpiration implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Subscription $subscription,
        public string $type
    ) {}

    public function handle(): void
    {
        switch ($this->type) {
            case 'trial_expiring':
                Mail::to($this->subscription->tenant->email)
                    ->send(new TrialExpiringMail($this->subscription));
                break;

            case 'grace_period_expiring':
                Mail::to($this->subscription->tenant->email)
                    ->send(new GracePeriodExpiringMail($this->subscription));
                break;

            case 'trial_expired':
                if (!$this->subscription->plan->is_free) {
                    $this->subscription->update(['status' => \App\Enums\SubscriptionStatus::TRIAL_EXPIRED]);
                }
                break;

            case 'grace_period_expired':
                $this->subscription->suspend();
                break;
        }
    }
}
