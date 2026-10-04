<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_contact_message_is_private_until_admin_review(): void
    {
        $this->post(route('contact-messages.store'), [
            'name' => 'Village resident', 'phone' => '01700000000', 'message' => 'Please contact me about membership.',
        ])->assertRedirect();

        $message = ContactMessage::query()->firstOrFail();
        $this->assertSame('pending', $message->status);

        $member = User::factory()->create(['role' => 'member']);
        $this->actingAs($member)->get(route('admin.contact-messages.index'))->assertForbidden();

        $admin = User::factory()->create(['role' => 'super_admin']);
        $this->actingAs($admin)->patch(route('admin.contact-messages.review', $message), ['status' => 'replied'])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', ['id' => $message->id, 'status' => 'replied', 'reviewed_by' => $admin->id]);
        $this->assertDatabaseHas('audit_logs', ['record_type' => ContactMessage::class, 'record_id' => (string) $message->id, 'action' => 'reviewed']);
    }
}
