// Just the start we can add the dashboard sections later
 
import EmployeeProfileForm from "@/components/EmployeeProfileForm";
 
export default function EmployeeDashboardPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold">Employee Dashboard</h1>
      <EmployeeProfileForm />
    </main>
  );
}
 
