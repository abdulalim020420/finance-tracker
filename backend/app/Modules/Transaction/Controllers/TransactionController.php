<?php

namespace App\Modules\Transaction\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shared\Responses\ApiResponse;
use App\Modules\Transaction\Requests\StoreTransactionRequest;
use App\Modules\Transaction\Request\UpdateTransactionRequest;
use App\Modules\Transaction\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(
        public readonly TransactionService $transactionService
    )
    {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category_id', 'type', 'date_from', 'date_to']);
        $transactions = $this->transactionService->getAll($request->user()->id, $filters);
        
        return ApiResponse::success([
            'transactions' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total()
            ],    
        ], 'Transaction retrieved');
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $transaction = $this->transactionService->create(
            $request->validated(),
            $request->user()->id);

        return ApiResponse::success($transaction, 'Transaction Created', 201);
    }

    public function Update(UpdateTransactionRequest $request, int $id): JsonResponse
    {
        $transaction = $this->transactionService->update(
            $id,
            $request->validated(),
            $request->user()->id
        );

        return ApiResponse::success($transaction, 'Transaction Updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->transactionService->delete(
            $id,
            $request->user()->id
        );

        return ApiResponse::success(null, 'Transaction Deleted');
    }
}