<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id, 'code' => $this->code, 'slug' => $this->slug,
            'titleBn' => $this->title_bn, 'titleEn' => $this->title_en ?? '', 'category' => $this->category ?? '',
            'shortDescBn' => $this->short_desc_bn ?? '', 'shortDescEn' => $this->short_desc_en ?? '',
            'fullDescBn' => $this->full_desc_bn ?? '', 'fullDescEn' => $this->full_desc_en ?? '',
            'featuredImage' => $this->mediaUrl('featured') ?: $this->assetPath($this->featured_image),
            'galleryImages' => $this->mediaGallery(),
            'videoUrl' => $this->video_url, 'startDate' => $this->start_date?->toDateString(),
            'expectedEndDate' => $this->estimated_end_date?->toDateString(), 'actualEndDate' => $this->actual_end_date?->toDateString(),
            'estimatedBudget' => (float) $this->estimated_budget, 'collectedAmount' => (float) ($this->collected_amount ?? 0),
            'expenseAmount' => (float) ($this->expense_amount ?? 0), 'status' => $this->status, 'location' => $this->location ?? '',
            'responsibleMembers' => $this->responsible_members ?? [], 'beneficiariesCount' => $this->beneficiaries_count,
            'beneficiaryInfoBn' => $this->beneficiary_info_bn, 'beneficiaryInfoEn' => $this->beneficiary_info_en,
            'isPublished' => $this->is_published, 'isFeatured' => $this->is_featured,
            'completionOutcomeBn' => $this->completion_outcome_bn, 'completionOutcomeEn' => $this->completion_outcome_en,
            'createdAt' => $this->created_at?->toIso8601String(), 'isDemo' => $this->is_demo,
            'transactions' => $this->whenLoaded('transactions', fn () => $this->transactions->map(fn ($transaction): array => [
                'id' => (string) $transaction->id, 'voucherNo' => $transaction->voucher_no, 'type' => $transaction->type,
                'fundType' => $transaction->fund_type, 'categoryId' => $transaction->category_id, 'categoryName' => $transaction->category_name ?? '',
                'amount' => (float) $transaction->amount, 'date' => $transaction->occurred_at?->toDateString(), 'description' => $transaction->description ?? '',
                'status' => $transaction->status, 'createdAt' => $transaction->created_at?->toIso8601String(),
            ])->values()),
        ];
    }

    private function assetPath(?string $path): ?string
    {
        return $path ? preg_replace('#^/src/assets/images/#', '/images/', $path) : null;
    }

    private function mediaUrl(string $collection): ?string
    {
        return $this->relationLoaded('media') ? ($this->getFirstMediaUrl($collection) ?: null) : null;
    }

    private function mediaGallery(): array
    {
        $media = $this->relationLoaded('media')
            ? $this->getMedia('gallery')->map(fn ($item): string => $item->getUrl())->all()
            : [];

        return $media ?: collect($this->gallery_images ?? [])->map(fn (?string $path): ?string => $this->assetPath($path))->all();
    }
}
