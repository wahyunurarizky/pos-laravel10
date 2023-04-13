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
            'unit' => $this->whenLoaded('unit'),
            'seller' => $this->whenLoaded('seller'),
            ...parent::toArray($request)
        ];
    }
}
