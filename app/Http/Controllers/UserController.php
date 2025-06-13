<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Mail\UserCreated;
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

    public function store(Request $request)
    {
        // TODO: Validate request
        // TODO: Check if user already exists
        // TODO: Create user with password temporary
        // TODO: Send email to user with password temporary
        // TODO: Return success message

        $password = Str::random(10);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($password),
        ]);

        $user->assignRole($request->role);


        return redirect()->route('users.index')->with('success', __('user.created'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }
}
