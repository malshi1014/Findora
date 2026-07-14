<?php

// OOP: polymorphic repository contract.
interface UserRepositoryInterface
{
    public function findByLoginId(string $loginId): ?array;
}
