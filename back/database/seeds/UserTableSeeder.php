<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->delete();
 
      User::create(array(
          'email' => 'firstuser',
          'password' => Hash::make('first_password')
      ));
 
      User::create(array(
          'email' => 'seconduser',
          'password' => Hash::make('second_password')
      ));
    }
}
