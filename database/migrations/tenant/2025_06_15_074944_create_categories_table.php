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
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->index();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0)->index();
            $table->string('color', 7)->nullable(); // Para códigos de color hex
            $table->string('icon', 50)->nullable(); // Para iconos
            $table->json('metadata')->nullable(); // Para datos adicionales flexibles
            $table->softDeletes(); // Para borrado suave
            $table->timestamps();

            // Índices para optimización
            $table->index(['is_active', 'sort_order']);
            $table->index(['created_at']);
            $table->unique(['name', 'deleted_at']); // Permitir mismo nombre si está eliminado
        });

        // Crear tabla para estadísticas de categorías (opcional)
        Schema::create('category_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->integer('services_count')->default(0);
            $table->integer('active_services_count')->default(0);
            $table->integer('bookings_count')->default(0);
            $table->decimal('total_revenue', 10, 2)->default(0);
            $table->date('stats_date');
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->unique(['category_id', 'stats_date']);
            $table->index(['stats_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_stats');
        Schema::dropIfExists('categories');
    }
};
