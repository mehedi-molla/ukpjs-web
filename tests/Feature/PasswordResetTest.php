<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_request_a_password_reset_link_without_email_enumeration(): void
    {
        Notification::fake();
        $user = User::factory()->create(['email' => 'member@example.test']);

        $this->get(route('password.request'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/ForgotPassword'));

        $this->post(route('password.email'), ['email' => $user->email])->assertRedirect();
        Notification::assertSentTo($user, ResetPassword::class);

        $this->post(route('password.email'), ['email' => 'not-a-real-account@example.test'])->assertRedirect();
    }

    public function test_guest_can_reset_password_with_a_valid_token(): void
    {
        $user = User::factory()->create(['email' => 'member@example.test', 'password' => 'old-password-value']);
        $token = Password::broker()->createToken($user);

        $this->get(route('password.reset', ['token' => $token, 'email' => $user->email]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/ResetPassword')->where('email', $user->email));

        $this->post(route('password.update'), [
            'token' => $token,
            'email' => $user->email,
            'password' => 'a-new-password-value',
            'password_confirmation' => 'a-new-password-value',
        ])->assertRedirect(route('login'));

        $this->assertTrue(Hash::check('a-new-password-value', $user->fresh()->password));
    }
}
