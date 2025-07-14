<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('plan_id')->constrained()->onDelete('cascade');
            $table->string('mercadopago_id')->unique()->nullable();
            $table->string('mercadopago_status')->nullable();
            $table->string('status')->default('pending');

            $table->decimal('price', 10, 2)->nullable();
            $table->string('currency', 3)->default('CLP');
            $table->string('billing_cycle')->default('monthly');
            $table->timestamp('next_billing_date')->nullable();
            $table->timestamp('last_payment_date')->nullable();
            $table->integer('failed_payment_attempts')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('grace_period_ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
