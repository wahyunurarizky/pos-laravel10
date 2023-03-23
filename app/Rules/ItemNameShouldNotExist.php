<?php

namespace App\Rules;

use App\Models\Item;
use App\Repositories\Item\ItemRepositoryImplement;
use App\Services\Item\ItemService;
use App\Services\Item\ItemServiceImplement;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ItemNameShouldNotExist implements ValidationRule
{

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $nameIsExist = (new ItemServiceImplement(new ItemRepositoryImplement(new Item())))->checkNameAlreadyExists($value);
        if ($nameIsExist) {
            $fail('The :attribute already exists');
        }
    }
}
