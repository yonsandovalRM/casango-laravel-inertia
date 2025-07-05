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
        Schema::create('form_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('form_template_id');
            $table->uuid('booking_id');
            $table->uuid('client_id');
            $table->uuid('professional_id');
            $table->foreign('form_template_id')->references('id')->on('form_templates')->onDelete('cascade');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
            $table->foreign('professional_id')->references('id')->on('professionals')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('visibility', ['private', 'team'])->default('private');
            $table->json('data');
            $table->timestamp('filled_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_entries');
    }
};
