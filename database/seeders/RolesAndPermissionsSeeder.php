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

        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'create users']);

        Permission::create(['name' => 'create invitations']);
        Permission::create(['name' => 'view invitations']);

        Permission::create(['name' => 'view tenant categories']);
        Permission::create(['name' => 'edit tenant categories']);
        Permission::create(['name' => 'delete tenant categories']);
        Permission::create(['name' => 'create tenant categories']);



        // update cache to know about the newly created permissions (required if using WithoutModelEvents in seeders)
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();



        // or may be done by chaining
        $role = Role::create(['name' => 'owner'])
            ->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'user']);
        $role->givePermissionTo(['view plans', 'view tenants', 'view users']);

        $role = Role::create(['name' => 'member']);
        $role->givePermissionTo(['view plans', 'view tenants', 'view users',  'view invitations']);
    }
}
