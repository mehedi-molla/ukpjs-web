<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Project;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_uploads_are_validated_and_stored_in_media_library_collections(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'super_admin']);
        $category = ContactCategory::create(['slug' => 'chairman', 'name_bn' => 'সভাপতি', 'name_en' => 'Chairman', 'is_active' => true]);

        $this->actingAs($admin)->post(route('admin.contacts.store'), [
            'category_id' => $category->id, 'name_bn' => 'সভাপতি', 'name_en' => 'Chairman',
            'photo_file' => UploadedFile::fake()->image('portrait.jpg'),
        ])->assertRedirect();

        $contact = Contact::query()->latest('id')->firstOrFail();
        $this->assertDatabaseHas('media', ['model_type' => Contact::class, 'model_id' => $contact->id, 'collection_name' => 'portrait']);

        $this->actingAs($admin)->post(route('admin.projects.store'), [
            'code' => 'MEDIA-001', 'title_bn' => 'মিডিয়া প্রকল্প', 'title_en' => 'Media project', 'category' => 'welfare',
            'estimated_budget' => '1000.00', 'status' => 'upcoming', 'featured_image_file' => UploadedFile::fake()->image('project.png'),
            'gallery_files' => [UploadedFile::fake()->image('gallery.png')],
        ])->assertRedirect();

        $project = Project::query()->where('code', 'MEDIA-001')->firstOrFail();
        $this->assertDatabaseHas('media', ['model_type' => Project::class, 'model_id' => $project->id, 'collection_name' => 'featured']);
        $this->assertDatabaseHas('media', ['model_type' => Project::class, 'model_id' => $project->id, 'collection_name' => 'gallery']);

        $this->actingAs($admin)->post(route('admin.transactions.store'), [
            'type' => 'income', 'fund_type' => 'general_hadiya', 'amount' => '100.00', 'occurred_at' => '2026-09-26',
            'payment_method' => 'cash', 'attachment_file' => UploadedFile::fake()->create('receipt.pdf', 20, 'application/pdf'),
        ])->assertRedirect();

        $transaction = Transaction::query()->latest('id')->firstOrFail();
        $this->assertDatabaseHas('media', ['model_type' => Transaction::class, 'model_id' => $transaction->id, 'collection_name' => 'receipt']);
    }
}
