<?php

namespace App\Modules\Transaction\Request;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize():bool
    {
        return true;
    }

    public function rules():array
    {
        return [
            'category_id' => ['sometimes', 'integer', 'exist:category,id'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'description' => ['nullable', 'string', 'max:255'],
            'date' => ['sometimes', 'date']
        ];
    }   
}