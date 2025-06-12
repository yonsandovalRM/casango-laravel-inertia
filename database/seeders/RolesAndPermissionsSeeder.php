<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['name' => 'edit plans']);
        Permission::create(['name' => 'delete plans']);
        Permission::create(['name' => 'create plans']);
        Permission::create(['name' => 'view plans']);

        Permission::create(['name' => 'view tenants']);
        Permission::create(['name' => 'edit tenants']);
        Permission::create(['name' => 'delete tenants']);

        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


 
        // or may be done by chaining
        $role = Role::create(['name' => 'owner'])
            ->givePermissionTo(['create plans', 'edit plans', 'delete plans', 'view plans', 'edit tenants', 'delete tenants', 'view tenants']);

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());
    }
}