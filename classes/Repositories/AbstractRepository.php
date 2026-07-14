<?php

// OOP: abstract database base class.
abstract class AbstractRepository
{
    protected mysqli $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }
}
