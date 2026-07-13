<?php

namespace App\Modules\Transaction\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shared\Response\ApiResponse;
use App\Modules\Transaction\Request\StoreTransactionRequest;
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
        $filter = $request->only(['category_id', 'type', 'date_from', 'date_to']);
        $transaction = $this->transactionService->getAll($request->user()->id, $filter);
        
        return ApiResponse::success($transaction, 'Transaction Retrieved');
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