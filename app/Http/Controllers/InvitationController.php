<?php

namespace App\Http\Controllers;

use App\Http\Requests\Invitations\AcceptInvitationRequest;
use App\Http\Requests\Invitations\CreateInvitationRequest;
use App\Mail\UserInvitationMail;
use App\Models\Invitation;
use App\Models\User;
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

    public function store(CreateInvitationRequest $request)
    {
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
            'name' => $invitation->name,
        ]);
    }

    public function accept(AcceptInvitationRequest $request, $token)
    {
        $invitation = Invitation::where('token', $token)->firstOrFail();


        $existing = User::where('email', $invitation->email)->first();
        if ($existing) {
            return redirect()->back()->with('error', __('invitation.user_exists'));
        }

        if ($invitation->expires_at < now()) {
            return redirect()->back()->with('error', __('invitation.expired'));
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $invitation->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        if ($invitation->role === 'professional') {
            $user->professional()->create([
                'bio' => $request->bio ?? null,
                'title' => $request->title ?? 'Sr.',
                'is_company_schedule' => $request->is_company_schedule ?? false,
            ]);
        }

        $user->assignRole($invitation->role);
        $invitation->delete();

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
