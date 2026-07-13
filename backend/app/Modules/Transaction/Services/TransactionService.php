<?php

namespace App\Modules\Transaction\Services;


use App\Modules\Transaction\Repositories\Interfaces\TransactionRepositoryInterface;
use App\Modules\Category\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Modules\Shared\Responses\ApiResponse;
use App\Modules\Transaction\Models\Transaction;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Modules\Dashboard\Services\DashboardService;

class TransactionService
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository,
        private readonly CategoryRepositoryInterface $categoryRepository,
        private readonly DashboardService $dashboardService,
    ){}

    public function getAll (int $userId, array $filters) : LengthAwarePaginator
    {
        return $this->transactionRepository->getAllbyUser($userId, $filters);
    }

    public function create(array $data, int $userId) : Transaction
    {
        $this->validateCategoryOwnership($data['category_id'], $userId);
    
        $transaction = $this->transactionRepository->create([
                ...$data,
                'user_id' => $userId
            ]);

        $this->dashboardService->clearCache($userId, substr($data['date'], 0, 7));

        return $transaction;
    }

    public function update (int $id, array $data, int $userId) : Transaction
    {
        $transaction = $this->findOrFail($id, $userId);

        if (!empty($data['category_id'])) {
            $this->validateCategoryOwnership($data['category_id'], $userId);
        }
        
        $updated = $this->transactionRepository->update($transaction, $data);
    
        $this->dashboardService->clearCache($userId, $transaction->date->format('Y-m'));
    
        return $updated;

    }

    public function delete (int $id, int $userId) : void
    {
        $transaction = $this->findOrFail($id, $userId);
        $this->transactionRepository->delete($transaction);
        $this->dashboardService->clearCache($userId, $transaction->date->format('Y-m'));
    }


    public function findOrFail (int $id, int $userId) : Transaction
    {
        $transaction = $this->transactionRepository->findByUser($id, $userId);
        if (!$transaction) {
            throw new HttpResponseException(
                ApiResponse::error('Transaction not found', 404)
            );
        }
        return $transaction;
    }

    public function validateCategoryOwnership(int $categoryId, int $userId) : void
    {
        $category = $this->categoryRepository->findByUser($categoryId, $userId);

        if (!$category) {
            throw new HttpResponseException(
                ApiResponse::error('Category not found or does not belong to the user', 404)
            );
        }
    }

}