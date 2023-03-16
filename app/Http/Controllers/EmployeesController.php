<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Employees;
use App\Models\Company;

class EmployeesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $employees = Employees::all();
        
        return response()->view('employees.index', compact('employees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $employees = Employees::all();

        return response()->view('employees.create', compact('employees'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // $request->validate([
        //     'first_name' => 'required',
        //     'last_name' => 'required',
        //     'email' => 'nullable|email',
        //     'phone' => 'nullable',
        //     'company' => 'required|exists:companies,name'
        // ]);

        // $employee = Employees::create([
        //     'first_name' => $request->input('first_name'),
        //     'last_name' => $request->input('last_name'),
        //     'email' => $request->input('email'),
        //     'phone' => $request->input('phone'),
        //     'company_id' => Company::where('name', $request->input('company'))->firstOrFail()->id
        // ]);

        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:employees|max:255',
            'phone_number' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);
    
        $employee = new Employees($validatedData);
        $employee->first_name = $validatedData['first_name'];
        $employee->last_name = $validatedData['last_name'];
        $employee->email = $validatedData['email'];
        $employee->phone_number = $validatedData['phone_number'];
        $employee->company_id = $validatedData['company_id'];
        $employee->save();

        return redirect()->back()->with('success', 'Employee added successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employees $employees): Response
    {
        return response()->view('employees.show', compact('employee'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employees $employees): Response
    {
        $companies = Company::all();

        return response()->view('employees.edit', compact('employee', 'companies'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employees $employees): RedirectResponse
    {
        $employees->update($request->all());

        return redirect()->route('employees.show', ['employee' => $employees->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employees $employees): RedirectResponse
    {
        $employees->delete();

        return redirect()->route('employees.index')->with('message', 'Employee deleted successfully.');
    }
}
