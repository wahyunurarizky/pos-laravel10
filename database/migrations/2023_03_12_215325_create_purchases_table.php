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
            $table->unsignedDecimal('bottom_unit_qty');
            $table->unsignedDecimal('per_unit_qty');
            $table->unsignedBigInteger('unit_id')->nullable();
            $table->unsignedDecimal('price_per_unit');
            $table->unsignedDecimal('total');
            $table->string('seller')->nullable();
            $table->unsignedDecimal('bottom_unit_qty_left')->default(0);
            $table->timestamps();

            $table->foreign('item_id')->references('id')->on('items')
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
