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
        Schema::create('item_sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedDecimal('bottom_unit_qty', 19, 2);
            $table->unsignedDecimal('per_unit_qty', 19, 2);
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->unsignedBigInteger('sale_id')->nullable();
            $table->unsignedDecimal('price_per_unit', 19, 2);
            $table->unsignedDecimal('total', 19, 2);
            $table->string('sub_name')->nullable();
            $table->decimal('profit', 19, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('item_id')->references('id')->on('items')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('unit_id')->references('id')->on('units')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('sale_id')->references('id')->on('sales')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_sales');
    }
};
