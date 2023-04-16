<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemPurchaseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'purchase' => $this->whenLoaded('purchase'),
            'unit' => $this->whenLoaded('unit'),
            ...parent::toArray($request)
        ];
    }
}
