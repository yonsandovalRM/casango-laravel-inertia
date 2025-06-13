<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Mail\UserCreated;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    public function index()
    {
        $users = UserResource::collection(User::all())->toArray(request());
        return Inertia::render('users/index', ['users' => $users]);
    }

 

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }
}
