<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = UserResource::collection(User::all())->toArray(request());
        return Inertia::render('users/index', ['users' => $users]);
    }
}
