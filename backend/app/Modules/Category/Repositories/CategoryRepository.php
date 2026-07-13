<?php

namespace App\Modules\Category\Repositories;

use App\Modules\Category\Models\Category;
use App\Modules\Category\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function getAllByUser(int $userId): Collection
    {
        return Category::where('user_id', $userId)->latest()->get();
    }

    public function findByUser(int $id, int $userId): ?Category
    {
        return Category::where('id', $id)->where('user_id', $userId)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}