<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\View;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $companies = Company::all();

        return response()->view('companies.index', compact('companies'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return response()->view('companies.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate input
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:companies|max:255',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'required|url|max:255',
        ]);

        // Handle file upload
        if ($request->hasFile('logo')) {
            $filename = $request->file('logo')->store('public');
            $filename = str_replace('public/', '', $filename);
        } else {
            $filename = null;
        }

        // Create new company record
        $company = new Company;
        $company->name = $validatedData['name'];
        $company->email = $validatedData['email'];
        $company->website = $validatedData['website'];
        $company->logo = $filename;
        $company->save();

        // return redirect()->route('companies.index')
        //     ->with('success', 'Company created successfully.');
        return back()->with('success', 'Employee created successfully.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company): Response
    {
        return response()->view('companies.show', compact('company'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id): Response
    {
        return response()->view('companies.edit', compact('company'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        $company->update($request->all());

        return redirect()->route('companies.show', ['company' => $company->id]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): RedirectResponse
    {
        $company->delete();
        
        return redirect()->route('companies.index')->with('message', 'Company deleted successfully.');
    }
}
