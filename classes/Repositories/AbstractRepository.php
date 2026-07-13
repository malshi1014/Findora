<?php

abstract class AbstractRepository
{
    protected mysqli $connection;

    public function __construct(mysqli $connection)
    {
        $this->connection = $connection;
    }
}

