<?php

namespace App\Http\Controllers;

use App\Mail\UserInvitationMail;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

class InvitationController extends Controller
{
    public function index()
    {
        $invitations = Invitation::all();
        return Inertia::render('invitations/index', ['invitations' => $invitations]);
    }

    public function store(Request $request)
    {
        if ($this->userExists($request->email)) {
            return redirect()->route('users.index')->with('error', __('user.already_exists'));
        }

        $invitation = Invitation::updateOrCreate(
            ['email' => $request->email],
            [
                'name' => $request->name,
                'role' => $request->role,
                'token' => Str::uuid(),
                'expires_at' => now()->addDays(7),
            ]
        );

        Mail::to($invitation->email)->queue(new UserInvitationMail($invitation));

        return back()->with('success', __('invitation.sent'));
    
    }


    public function form(string $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        return Inertia::render('invitations/form', [
            'token' => $token,
            'email' => $invitation->email,
            'name' => $invitation->name,
        ]);
    }

    public function accept(Request $request, $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();

        $request->validate([
            'name' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $existing = User::where('email', $invitation->email)->first();
        if ($existing) {
            return redirect()->route('login')->withErrors(['email' => __('user.already_exists')]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $invitation->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($invitation->role);
        $invitation->delete();

        Auth::login($user);

        return redirect()->route('dashboard');
    }


    private function userExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

}
