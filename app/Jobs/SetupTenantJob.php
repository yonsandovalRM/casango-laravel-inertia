<?php

namespace App\Jobs;

use App\Models\Company;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class SetupTenantJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Tenant $tenant,
        public array $ownerData
    ) {}

    public function handle(): void
    {
        $this->tenant->run(function () {
            DB::beginTransaction();

            try {
                $this->createOwner();
                $this->createDefaultProfessional();
                $this->createCompany();

                DB::commit();

                Log::info("Tenant setup completed", [
                    'tenant_id' => $this->tenant->id
                ]);
            } catch (\Exception $e) {
                DB::rollBack();

                Log::error("Failed to setup tenant", [
                    'tenant_id' => $this->tenant->id,
                    'error' => $e->getMessage()
                ]);

                throw $e;
            }
        });
    }

    private function createOwner(): void
    {
        $user = User::create([
            'name' => $this->ownerData['name'],
            'email' => $this->ownerData['email'],
            'password' => bcrypt($this->ownerData['password']),
        ]);

        $owner = Role::findOrCreate('owner');
        $user->assignRole($owner);
    }

    private function createDefaultProfessional(): void
    {
        $user = User::create([
            'name' => 'Luis Jimenez',
            'email' => 'lj@pro.com',
            'password' => bcrypt('password'),
        ]);

        $professional = Role::findOrCreate('professional');
        $user->assignRole($professional);

        $user->professional()->create([
            'title' => 'Dr.',
            'is_company_schedule' => true,
        ]);
    }

    private function createCompany(): void
    {
        $company = Company::create([
            'name' => $this->tenant->name,
            'email' => $this->tenant->email,
        ]);

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        foreach ($days as $day) {
            $company->schedules()->create([
                'day_of_week' => $day,
                'open_time' => '09:00',
                'close_time' => '18:00',
                'is_open' => $day === 'sunday' ? false : true,
                'has_break' => false,
            ]);
        }
    }
}
