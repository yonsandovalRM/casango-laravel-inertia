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


        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


 
        $role = Role::create(['name' => 'owner'])
            ->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'client']);
        $role->givePermissionTo(['view company']);

        $role = Role::create(['name' => 'employee']);
        $role->givePermissionTo(['view company']);
    }
}