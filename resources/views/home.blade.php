@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card bg-dark text-light">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body ">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}
                </div>
            </div>

            @if (session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

            @if (auth()->user()->is_admin)
                <p class="my-4 text-center text-light">Welcome, admin!</p>

                <div class="card container mt-4 bg-dark text-light">                        
                    <form method="POST" action="{{ route('companies.store') }}" enctype="multipart/form-data">
                        @csrf
                        <p class="fw-bold text-center h4 mt-2">Company Form</p>
                        <div class="form-group my-2 ">
                            <label for="name">Name:</label>
                            <input type="text" name="name" id="name" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="email">Email:</label>
                            <input type="email" name="email" id="email" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="logo">Logo:</label>
                            <input type="file" name="logo" id="logo" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="website">Website:</label>
                            <input type="url" name="website" id="website" class="form-control text-light border-dark" required>
                        </div>
                        <button type="submit" class="btn btn-primary my-3 btn-light">Add Company</button>
                    </form>
                </div>

                

                <div class="card container mt-4 bg-dark text-light">                        
                    <form method="POST" action="{{ route('employees.store') }}" enctype="multipart/form-data">
                        @csrf
                        <p class="fw-bold text-center h4 mt-2">Employee Form</p>
                        @if ($errors->employee->any())
                            <div class="alert alert-danger">
                                <ul>
                                    @foreach ($errors->employee->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif
                        <div class="form-group my-2">
                            <label for="first_name">First Name:</label>
                            <input type="text" name="first_name" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="last_name">Last Name:</label>
                            <input type="text" name="last_name" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="email">Email:</label>
                            <input type="email" name="email" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="phone_number">Phone:</label>
                            <input type="text" name="phone_number" class="form-control text-light border-dark" required>
                        </div>
                        <div class="form-group my-2">
                            <label for="company_id">Company:</label>
                            <select name="company_id" class="form-select text-light border-dark" required>
                                @foreach($companies as $company)
                                    <option value="{{ $company->id }}">{{ $company->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary my-3 btn-light">Add Employee</button>
                    </form>
                </div>

                
            @else
                <p>Welcome, user!</p>
            @endif
            
        </div>
    </div>
    @if (auth()->user()->is_admin)
        <div class="row justify-content-center">
            <div class="col-md-12 mt-5 ">
                <div class="heading-wrapper">
                    <h2 class="text-3xl text-center fw-bold text-light">Companies</h2>
                </div>
                <table class="my-2 table table-striped table-bordered table-dark">
                    <thead class="text-center">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Logo</th>
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($companies as $company)
                            <tr>
                                <td>{{ $company->name }}</td>
                                <td>{{ $company->email }}</td>
                                <td><img src="{{ asset('storage/'.$company->logo) }}" alt="{{ $company->name }} logo" width="100"></td>
                                <td>{{ $company->website }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>


                <div class="heading-wrapper">
                    <h2 class="text-3xl text-center fw-bold mt-5 text-light">Employees</h2>
                </div>
                <table class="table table-striped table-bordered table-dark">
                    <thead class="text-center">
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($employees as $employee)
                            <tr>
                                <td>{{ $employee->first_name }}</td>
                                <td>{{ $employee->last_name }}</td>
                                <td>{{ $employee->company->name }}</td>
                                <td>{{ $employee->email }}</td>
                                <td>{{ $employee->phone_number }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                {{ $employees->links('vendor.pagination.bootstrap-5', [
                    'prev' => 'Previous page',
                    'next' => 'Next page',
                    'onEachSide' => 2,
                    'query' => ['sort' => 'name'],
                    'fragment' => 'results'
                ]) }}
            </div>
        </div>
    @endif
</div>
@endsection
