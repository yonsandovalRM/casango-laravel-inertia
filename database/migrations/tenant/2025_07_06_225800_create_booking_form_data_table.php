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
        Schema::create('booking_form_data', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('booking_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('form_template_id')->constrained()->onDelete('cascade');
            $table->json('data');
            $table->boolean('is_visible_to_team')->default(false);
            $table->timestamps();

            $table->unique(['booking_id', 'form_template_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_form_data');
    }
};
