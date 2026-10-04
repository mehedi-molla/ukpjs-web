<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->where('is_published', true)
            ->with('media')
            ->withSum('validIncomeTransactions as collected_amount', 'amount')
            ->withSum('validExpenseTransactions as expense_amount', 'amount')
            ->latest()
            ->get();

        return Inertia::render('Public/Projects', ['projects' => ProjectResource::collection($projects)->resolve()]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        $project->load(['media', 'transactions' => fn ($query) => $query->where('status', 'completed')->where('is_demo', false)->latest('occurred_at')])
            ->loadSum('validIncomeTransactions as collected_amount', 'amount')
            ->loadSum('validExpenseTransactions as expense_amount', 'amount');

        return Inertia::render('Public/ProjectDetail', ['project' => (new ProjectResource($project))->resolve()]);
    }
}
