<?php

// OOP: polymorphic repository contract.
interface UserRepositoryInterface
{
    public function findByLoginId(string $loginId): ?array;
    public function findUsersByNearestTown(string $town, int $excludeUserId): array;
}
