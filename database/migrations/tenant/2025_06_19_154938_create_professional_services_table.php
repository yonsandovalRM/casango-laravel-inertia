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
        Schema::create('professional_services', function (Blueprint $table) {
            $table->uuid('professional_id');
            $table->uuid('service_id');
            $table->decimal('price', 10, 2)->nullable();
            $table->integer('duration')->nullable();
            $table->foreign('professional_id')->references('id')->on('professionals')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->primary(['professional_id', 'service_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professional_services');
    }
};
