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
        Schema::create('form_entry_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('form_entry_id');
            $table->string('field_label');
            $table->text('value');
            $table->foreign('form_entry_id')->references('id')->on('form_entries')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_entry_fields');
    }
};
