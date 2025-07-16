<?php

namespace App\Http\Resources;


use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\RoleMapper;
use App\Traits\TimezoneResourceTrait;

class UserResource extends JsonResource
{
    use TimezoneResourceTrait;

    protected $timezoneFields = [
        'created_at',
        'updated_at',
    ];

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roles->first()?->name,
            'role_display_name' => RoleMapper::getRoleName($this->roles->first()?->name ?? ''),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
