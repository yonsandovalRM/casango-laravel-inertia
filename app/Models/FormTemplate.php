<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class FormTemplate extends Model
{
    use HasUuid;
    protected $fillable = [
        'name',
        'description',
        'visibility',
    ];

    protected $casts = [
        'visibility' => 'string',
    ];

    public function fields()
    {
        return $this->hasMany(FormTemplateField::class);
    }
}
