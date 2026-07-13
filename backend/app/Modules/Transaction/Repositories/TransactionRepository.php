<?php

namespace App\Modules\Transaction\Repositories;

use App\Modules\Transaction\Repositories\Interfaces\TransactionRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Modules\Transaction\Models\Transaction;


class TransactionRepository implements TransactionRepositoryInterface
{
    public function getAllByUser(int $userId, array $filters) : LengthAwarePaginator
    {
        $query = Transaction::with('category')
            ->where('user_id', $userId);

        if(!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['type'])) {
            $query->whereHas('category', function($q) use ($filters) {
                $q->where('type', $filters['type']);
            });
        }

        if (!empty($filters['date_from'])) {
            $query->where('date', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->where('date', '<=', $filters['date_to']);
        }

        return $query->latest('date')->paginate(15);
    }

    public function findByUser(int $id, int $userId): ?Transaction
    {
        return Transaction::with('category')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function create(array $data) : Transaction
    {
        return Transaction::create($data);
    }

    public function update(Transaction $transaction, array $data) : Transaction
    {
        $transaction->update($data);
        return $transaction->fresh('category');
    }

    public function delete(Transaction $transaction): void
    {
        $transaction->delete();
    }
}