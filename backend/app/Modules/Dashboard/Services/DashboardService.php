<?php

namespace App\Modules\Dashboard\Services;

use App\Modules\Transaction\Models\Transaction;
use Illuminate\Support\Facades\Cache;

class DashboardService
{
    private int $cacheTtl = 300;

    public function getSummary(int $userId, String $month): array
    {
        $cacheKey = "dashboard:summary:user_{$userId}:month_{$month}";

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($userId, $month) {
            $startDate = \Carbon\Carbon::parse($month)->startOfMonth();
            $endDate = \Carbon\Carbon::parse($month)->endOfMonth();

            $transactions = Transaction::with('category')
                ->where('user_id', $userId)
                ->whereBetween('date', [$startDate, $endDate])
                ->get();

            $totalIncome = $transactions
                ->filter(fn($t) => $t->category->type === 'income')
                ->sum('amount');

            $totalExpense = $transactions
                ->filter(fn($t) => $t->category->type === 'expense')
                ->sum('amount');

            $balance = $totalIncome - $totalExpense;

            $byCategory = $transactions
                ->groupBy('category_id')
                ->map(function ($group) {
                    $category = $group->first()->category;
                    return [
                        'category_id' => $category->id,
                        'category_name' => $category->name,
                        'type' => $category->type,
                        'icon' => $category->icon,
                        'color' => $category->color,
                        'total' => $group->sum('amount'),
                        'count' => $group->count(),
                    ];
                })->values();

                $dailyTrend = $transactions
                    ->groupBy(fn($t) => $t->date->format('Y-m-d'))
                    ->map(function ($group, $date) {
                        return[
                            'date' => $date,
                            'income' => $group->filter(fn($t) => $t->category->type === 'income')->sum('amount'),
                            'expense' => $group->filter(fn($t) => $t->category->type === 'expense')->sum('amount')
                        ];
                    })->values();

                return [
                    'month' => $month,
                    'total_income' => round($totalIncome,2),
                    'total_expense' => round($totalExpense,2),
                    'balance' => round($balance,2),
                    'by_category' => $byCategory->toArray(),
                    'daily_trend' => $dailyTrend->toArray(),

                ];
        });
    }

    public function clearCache(int $userId, string $month) : void
    {
        $cacheKey = "dashboard:summary:user_{$userId}:month_{$month}";
        Cache::forget($cacheKey);
    }
}