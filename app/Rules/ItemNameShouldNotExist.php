<?php

namespace App\Rules;

use App\Models\Item;
use App\Services\ItemService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ItemNameShouldNotExist implements ValidationRule
{

    function __construct(private ItemService $itemService)
    {
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $nameIsExist = $this->itemService->checkNameAlreadyExists($value);
        if ($nameIsExist) {
            $fail('The :attribute already exists');
        }
    }
}
