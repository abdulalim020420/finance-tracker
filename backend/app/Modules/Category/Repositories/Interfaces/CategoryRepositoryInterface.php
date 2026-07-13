<?php

namespace App\Modules\Category\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use App\Modules\Category\Models\Category;

interface CategoryRepositoryInterface
{
    public function getAllByUser(int $userId): Collection;

    public function findByUser(int $id, int $userId): ?Category;

    public function create(array $data): Category;

    public function update(Category $category, array $data): Category;

    public function delete(Category $category): void;
}