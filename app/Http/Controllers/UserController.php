<?php

namespace App\Http\Controllers;

use App\Enums\RoleMapper;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\UserCreated;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'display_name' => RoleMapper::getRoleName($role->name),
            ];
        });
        return Inertia::render('users/index', ['users' => UserResource::collection($users)->toArray(request()), 'roles' => $roles]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        $user->syncRoles($request->role);
        return redirect()->route('users.index')->with('success', __('user.updated'));
    }

    public function restore(User $user)
    {
        $user->restore();
        return redirect()->route('users.index')->with('success', __('user.restored'));
    }

    public function forceDelete(User $user)
    {
        $user->forceDelete();
        return redirect()->route('users.index')->with('success', __('user.deleted'));
    }
}
