<?php

namespace App\Http\Resources;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Contact */
class EmergencyContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Phone numbers are only published for administrator-verified, non-demo records.
        $isPubliclyVerified = $this->is_verified && ! $this->is_demo;

        return [
            'id' => (string) $this->id, 'nameBn' => $this->name_bn, 'nameEn' => $this->name_en ?? '',
            'photoUrl' => $this->getFirstMediaUrl('portrait') ?: $this->assetPath($this->photo_path),
            'phone' => $isPubliclyVerified ? $this->phone : null,
            'designationBn' => $this->designation_bn, 'designationEn' => $this->designation_en,
            'serviceArea' => $this->service_area, 'availability' => $this->availability,
            'addressBn' => $this->address_bn, 'addressEn' => $this->address_en, 'area' => $this->area,
            'isVerified' => $isPubliclyVerified, 'isDemo' => $this->is_demo,
        ];
    }

    private function assetPath(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/src/assets/images/')
            ? '/images/'.basename($path)
            : (str_starts_with($path, '/') ? $path : '/'.$path);
    }
}
