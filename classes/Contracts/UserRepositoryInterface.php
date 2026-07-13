<?php

interface UserRepositoryInterface
{
    public function findByLoginId(string $loginId): ?array;
}

