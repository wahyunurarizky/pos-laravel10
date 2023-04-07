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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('item_id')->nullable();
            $table->unsignedBigInteger('checkout_id')->nullable();
            $table->unsignedDecimal('bottom_unit_qty', 19, 2)->default(0);
            $table->unsignedDecimal('per_unit_qty', 19, 2);
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->unsignedDecimal('price_per_unit', 19, 2);
            $table->unsignedDecimal('total', 19, 2);
            $table->unsignedBigInteger('seller_id')->nullable();
            $table->unsignedDecimal('bottom_unit_qty_left', 19, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->foreign('item_id')->references('id')->on('items')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('checkout_id')->references('id')->on('checkouts')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('seller_id')->references('id')->on('sellers')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->foreign('unit_id')->references('id')->on('units')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
