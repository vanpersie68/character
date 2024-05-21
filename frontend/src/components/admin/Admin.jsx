import { Link } from "react-router-dom";
import Header from "../header/Header";

export default function Admin() {
  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="flex gap-4 bg-gray-100 p-4">
        <Link
          to="/admin/characters"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Character List
        </Link>
        <Link
          to="/admin/contributions"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Contribution List
        </Link>
        <Link
          to="/admin/admins"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          User/Manager List
        </Link>
        <Link
          to="/"
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return Main Page
        </Link>
      </div>
    </div>
  );
}
