<?php

namespace App\Http\Resources;

use App\Models\ContactCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ContactCategory */
class EmergencyServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id, 'slug' => $this->slug, 'url' => route('emergency-services.show', $this->emergencyUrlSlug()),
            'nameBn' => $this->name_bn, 'nameEn' => $this->name_en ?? '', 'descriptionBn' => $this->description_bn ?? '',
            'descriptionEn' => $this->description_en ?? '', 'icon' => $this->icon, 'isHomeFeatured' => $this->is_home_featured,
        ];
    }
}
