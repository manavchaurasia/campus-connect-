import AdminDashboard from "./AdminDashboard";
import ClubDashboard from "./ClubDashboard";
import FacultyDashboard from "./FacultyDashboard";
import PlacementDashboard from "./PlacementDashboard";

export default function RoleDashboard({ role, me, data, persistData, toast, setView, users, deleteUser }) {
  if (role === "faculty") return <FacultyDashboard data={data} setView={setView} />;
  if (role === "club") return <ClubDashboard />;
  if (role === "placement") return <PlacementDashboard data={data} setView={setView} />;
  if (role === "admin") return <AdminDashboard me={me} data={data} persistData={persistData} toast={toast} users={users} deleteUser={deleteUser} />;
  return null;
}
