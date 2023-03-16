<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Employees;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    protected $model = Company::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company,
            'email' => $this->faker->email,
            'logo' => $this->faker->image('storage/app/public', 100, 100, null, false),
            'website' => $this->faker->url,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Company $company) {
            Employees::factory()
                ->count(3)
                ->create([
                    'company_id' => $company->id,
                ]);
        });
    }
    
}
