<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Employees;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employees>
 */
class EmployeesFactory extends Factory
{
    protected $model = Employees::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'email' => $this->faker->email,
            'phone_number' => $this->faker->phoneNumber,
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (Employees $employees) {
            if (Company::count() > 0) {
                $company = Company::inRandomOrder()->first();
                $employees->company()->associate($company);
                $employees->save();
            }
        });
    }
}
