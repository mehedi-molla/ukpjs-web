<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectFilterRequest;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\AuditLog;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(ProjectFilterRequest $request): Response
    {
        $filters = $request->validated();
        $query = Project::query()->with('media');
        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->where(function ($query) use ($search): void {
                $query->where('code', 'like', "%{$search}%")
                    ->orWhere('title_bn', 'like', "%{$search}%")
                    ->orWhere('title_en', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        });
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['category'] ?? null, fn ($query, string $category) => $query->where('category', $category));

        return Inertia::render('Admin/ProjectManagement', [
            'filters' => $filters,
            'projects' => ProjectResource::collection(
                $query->withSum('validIncomeTransactions as collected_amount', 'amount')
                    ->withSum('validExpenseTransactions as expense_amount', 'amount')
                    ->latest()
                    ->paginate(20)
                    ->withQueryString()
            ),
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $featured = $data['featured_image_file'] ?? null;
        $gallery = $data['gallery_files'] ?? [];
        unset($data['featured_image_file'], $data['gallery_files']);
        $data['slug'] = Str::slug($data['title_en']).'-'.Str::lower(Str::random(5));
        $data['is_demo'] = (bool) ($data['is_demo'] ?? false);
        $project = Project::create($data);
        $this->attachMedia($project, $request, $featured, $gallery);

        return back()->with('success', 'Project created successfully.');
    }

    public function update(StoreProjectRequest $request, Project $project): RedirectResponse
    {
        $data = $request->validated();
        $featured = $data['featured_image_file'] ?? null;
        $gallery = $data['gallery_files'] ?? [];
        unset($data['featured_image_file'], $data['gallery_files']);
        $project->update($data);
        $this->attachMedia($project, $request, $featured, $gallery);

        return back()->with('success', 'Project updated successfully.');
    }

    public function archive(Project $project): RedirectResponse
    {
        $project->update(['is_published' => false]);
        AuditLog::create([
            'user_id' => request()->user()->id, 'action' => 'archived', 'module' => 'projects',
            'record_type' => Project::class, 'record_id' => (string) $project->id,
            'details' => 'Project unpublished without deleting project or ledger history.',
            'new_values' => ['is_published' => false], 'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Project archived from public view.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $title = $project->title_en ?? $project->title_bn ?? $project->code ?? $project->id;
        $project->clearMediaCollection('featured');
        $project->clearMediaCollection('gallery');
        $project->delete();

        AuditLog::create([
            'user_id' => request()->user()->id,
            'action' => 'deleted',
            'module' => 'projects',
            'record_type' => Project::class,
            'record_id' => (string) $project->id,
            'details' => "Project '{$title}' permanently deleted.",
            'ip_address' => request()->ip(),
        ]);

        return back()->with('success', 'Project deleted successfully.');
    }

    private function attachMedia(Project $project, StoreProjectRequest $request, mixed $featured, array $gallery): void
    {
        if ($request->hasFile('featured_image_file')) {
            $project->addMedia($featured)->toMediaCollection('featured');
        }

        foreach ($request->file('gallery_files', []) as $file) {
            $project->addMedia($file)->toMediaCollection('gallery');
        }
    }
}
