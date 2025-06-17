<?php

namespace Database\Seeders\Tenants;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'create users']);

        Permission::create(['name' => 'create invitations']);
        Permission::create(['name' => 'view invitations']);

        Permission::create(['name' => 'view company']);
        Permission::create(['name' => 'edit company']);

        Permission::create(['name' => 'view services']);
        Permission::create(['name' => 'edit services']);
        Permission::create(['name' => 'delete services']);
        Permission::create(['name' => 'create services']);

        Permission::create(['name' => 'view categories']);
        Permission::create(['name' => 'edit categories']);
        Permission::create(['name' => 'delete categories']);
        Permission::create(['name' => 'create categories']);

        Permission::create(['name' => 'view professional profile']);
        Permission::create(['name' => 'edit professional profile']);

        Permission::create(['name' => 'view professionals']);
        Permission::create(['name' => 'edit professionals']);
        Permission::create(['name' => 'delete professionals']);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();



        $role = Role::create(['name' => 'owner'])
            ->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'client']);
        $role->givePermissionTo(['view company']);

        $role = Role::create(['name' => 'professional']);
        $role->givePermissionTo(['view company', 'view services', 'view professional profile', 'edit professional profile']);
    }
}
