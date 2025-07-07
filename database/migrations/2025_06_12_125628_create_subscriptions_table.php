<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id');
            $table->foreignUuid('plan_id');
            $table->decimal('price', 10, 2);
            $table->string('currency')->default('CLP');
            $table->timestamp('trial_ends_at')->nullable()->default(null);
            $table->timestamp('ends_at')->nullable()->default(null);
            $table->string('payment_status')->default('pending');

            $table->string('mp_preapproval_id')->nullable()->after('payment_status');
            $table->string('mp_init_point')->nullable()->after('mp_preapproval_id');

            $table->boolean('is_monthly')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamp('payment_setup_reminder_sent_at')->nullable()->after('mp_init_point');
            $table->timestamp('payment_due_reminder_sent_at')->nullable()->after('payment_setup_reminder_sent_at');


            $table->foreign('tenant_id')->references('id')->on('tenants')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('plans')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
            $table->index(['payment_status', 'trial_ends_at']);
            $table->index('mp_preapproval_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
